import { Router } from "express";
import { supabase } from "../lib/supabase";
import { createAdminToken, getAdminCredentials, listUsers } from "../lib/adminStore";
import { createOtp, verifyOtp } from "../lib/otpStore";
import { toE164, getPhoneProvider, setPhoneProvider } from "../lib/phoneAuth";
import { parsePakistanMobile } from "../lib/pakistanPhone";
import {
  trySupabasePhoneOtp,
  tryBirdSms,
  tryTwilioSms,
  verifySupabasePhoneOtp,
  isTwilioConfigured,
} from "../lib/sms";
import { isBirdConfigured } from "../lib/bird";

export const authRouter = Router();

function isDevSmsMode() {
  const mode = (process.env.SMS_MODE ?? "dev").toLowerCase();
  return mode === "dev" || mode === "development";
}

function validatePkMobile(phone: string) {
  return parsePakistanMobile(phone);
}

async function dispatchDevOtp(dial: string, digits: string) {
  const fullPhone = toE164(dial, digits);
  const local = createOtp(dial, digits, 4);
  setPhoneProvider(fullPhone, "dev");
  return {
    fullPhone,
    provider: "dev" as const,
    codeLength: 4,
    expiresInSec: local.expiresInSec,
    devCode: local.code,
  };
}

async function dispatchOtp(dial: string, digits: string) {
  const fullPhone = toE164(dial, digits);

  if (isDevSmsMode()) {
    return dispatchDevOtp(dial, digits);
  }

  // Production: Bird → Supabase → Twilio → dev fallback
  const birdOtp = createOtp(dial, digits, 6);
  const birdResult = await tryBirdSms(fullPhone, birdOtp.code);
  if (birdResult.ok) {
    return {
      fullPhone,
      provider: "bird" as const,
      codeLength: 6,
      expiresInSec: birdOtp.expiresInSec,
      devCode: undefined,
    };
  }

  // 2) Supabase Phone Auth + SMS Hook (when Dashboard hook is enabled)
  const supabaseResult = await trySupabasePhoneOtp(fullPhone);
  if (supabaseResult.ok) {
    return {
      fullPhone,
      provider: "supabase" as const,
      codeLength: 6,
      expiresInSec: 60,
      devCode: undefined,
    };
  }

  // 3) Twilio direct
  const local = createOtp(dial, digits, 4);
  const twilioResult = await tryTwilioSms(fullPhone, local.code);
  if (twilioResult.ok) {
    return {
      fullPhone,
      provider: "twilio" as const,
      codeLength: 4,
      expiresInSec: local.expiresInSec,
      devCode: undefined,
    };
  }

  // 4) Dev fallback
  setPhoneProvider(fullPhone, "dev");
  return {
    fullPhone,
    provider: "dev" as const,
    codeLength: 4,
    expiresInSec: local.expiresInSec,
    devCode: local.code,
    setupHint:
      !isBirdConfigured() && !isTwilioConfigured()
        ? "Add BIRD_API_KEY + BIRD_SMS_FROM in backend/.env, or enable Supabase Phone + SMS Hook."
        : birdResult.error ?? twilioResult.error ?? supabaseResult.error,
  };
}

authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) return res.status(400).json({ error: error.message });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, email, name })
      .select("*")
      .single();

    if (profileError) return res.status(500).json({ error: profileError.message });
    res.json({ user: data.user, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Signup failed" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password ?? "");
    if (!email || !password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const adminCreds = getAdminCredentials();
    if (email === adminCreds.email && password === adminCreds.password) {
      const token = createAdminToken(email);
      return res.json({ role: "admin", token, admin: { email, name: "Admin" } });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: "Invalid credentials" });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email, phone")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      console.warn("Could not load profile during login:", profileError.message);
    }

    // Older app versions stored phone details in the local admin store only.
    // Use that as a one-time migration source so existing users do not lose data.
    const legacyProfile = listUsers().find((item) => item.id === data.user.id || item.email === email);
    const resolvedProfile = {
      id: data.user.id,
      name: profile?.name ?? legacyProfile?.name ?? data.user.user_metadata?.name,
      email: profile?.email ?? legacyProfile?.email ?? data.user.email ?? email,
      phone: profile?.phone ?? legacyProfile?.phone,
    };

    if (!profile?.phone && legacyProfile?.phone) {
      const { error: migrationError } = await supabase
        .from("profiles")
        .upsert(resolvedProfile, { onConflict: "id" });
      if (migrationError) console.warn("Could not migrate legacy profile:", migrationError.message);
    }

    res.json({ role: "user", ...data, profile: resolvedProfile });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Login failed" });
  }
});

authRouter.post("/send-otp", async (req, res) => {
  try {
    const { dial = "+92", phone } = req.body;
    const digits = validatePkMobile(phone);
    if (!digits) {
      return res.status(400).json({ error: "Enter a valid Pakistan mobile number (format: 3XX XXXXXXX, e.g. 3001234567)." });
    }

    const result = await dispatchOtp(String(dial), digits);

    res.json({
      message:
        result.provider === "dev"
          ? "Development mode: use the verification code shown on the next screen."
          : "Verification code sent to your mobile number.",
      phone: result.fullPhone,
      provider: result.provider,
      codeLength: result.codeLength,
      expiresInSec: result.expiresInSec,
      ...(result.devCode ? { code: result.devCode } : {}),
      ...("setupHint" in result && result.setupHint ? { setupHint: result.setupHint } : {}),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Failed to send code" });
  }
});

authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { dial = "+92", phone, token, code, provider } = req.body;
    const otp = String(token ?? code ?? "");
    const digits = validatePkMobile(phone);
    if (!digits || !otp) return res.status(400).json({ error: "Phone and code are required." });

    const fullPhone = toE164(String(dial), digits);
    const activeProvider = provider ?? getPhoneProvider(fullPhone) ?? "dev";

    if (activeProvider === "supabase") {
      const result = await verifySupabasePhoneOtp(fullPhone, otp);
      if (!result.ok) return res.status(400).json({ error: result.error });
      return res.json({ verified: true, phone: fullPhone, provider: "supabase" });
    }

    const result = verifyOtp(String(dial), digits, otp);
    if (!result.ok) return res.status(400).json({ error: result.error });

    res.json({ verified: true, phone: result.phone, provider: activeProvider });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "OTP verification failed" });
  }
});

authRouter.post("/resend-otp", async (req, res) => {
  try {
    const { dial = "+92", phone } = req.body;
    const digits = validatePkMobile(phone);
    if (!digits) return res.status(400).json({ error: "Phone is required." });

    const result = await dispatchOtp(String(dial), digits);

    res.json({
      message:
        result.provider === "dev"
          ? "Development mode: use the verification code shown on the next screen."
          : "Verification code resent to your mobile number.",
      phone: result.fullPhone,
      provider: result.provider,
      codeLength: result.codeLength,
      expiresInSec: result.expiresInSec,
      ...(result.devCode ? { code: result.devCode } : {}),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Failed to resend code" });
  }
});

authRouter.get("/sms-status", (_req, res) => {
  res.json({
    mode: isDevSmsMode() ? "dev" : "production",
    birdConfigured: isBirdConfigured(),
    twilioConfigured: isTwilioConfigured(),
    note: isDevSmsMode()
      ? "SMS_MODE=dev — OTP codes are shown in the app. Set SMS_MODE=production and configure Twilio for real SMS."
      : "Enable Twilio in backend/.env for real SMS to +92 numbers.",
  });
});
