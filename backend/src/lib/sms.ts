import twilio from "twilio";
import { supabase } from "./supabase";
import { setPhoneProvider, type SmsProvider } from "./phoneAuth";
import { sendBirdSms, isBirdConfigured } from "./bird";

export function isTwilioConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

async function sendTwilioSms(to: string, code: string) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  await client.messages.create({
    body: `Your Nectar verification code is: ${code}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  });
}

/** Send OTP via Bird (direct from backend) */
export async function tryBirdSms(fullPhone: string, code: string): Promise<{ ok: boolean; error?: string }> {
  if (!isBirdConfigured()) {
    return { ok: false, error: "Bird SMS is not configured." };
  }
  try {
    await sendBirdSms(
      fullPhone,
      `Your Nectar verification code is: ${code}. Valid for 5 minutes.`
    );
    setPhoneProvider(fullPhone, "bird");
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message ?? "Bird SMS failed." };
  }
}

/** Try Supabase Phone OTP (real SMS via dashboard-configured provider) */
export async function trySupabasePhoneOtp(fullPhone: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
  if (error) return { ok: false, error: error.message };
  setPhoneProvider(fullPhone, "supabase");
  return { ok: true };
}

/** Send OTP via Twilio directly */
export async function tryTwilioSms(fullPhone: string, code: string): Promise<{ ok: boolean; error?: string }> {
  if (!isTwilioConfigured()) {
    return { ok: false, error: "Twilio is not configured." };
  }
  try {
    await sendTwilioSms(fullPhone, code);
    setPhoneProvider(fullPhone, "twilio");
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message ?? "Twilio SMS failed." };
  }
}

export async function verifySupabasePhoneOtp(fullPhone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: fullPhone,
    token,
    type: "sms",
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, session: data.session };
}

export function getCodeLength(provider: SmsProvider) {
  return provider === "supabase" || provider === "bird" ? 6 : 4;
}

export function getProviderLabel(provider: SmsProvider) {
  switch (provider) {
    case "supabase":
    case "bird":
      return "SMS";
    case "twilio":
      return "SMS";
    default:
      return "dev";
  }
}
