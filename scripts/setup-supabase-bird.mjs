/**
 * One-time setup: Supabase Edge Function secrets + Auth hook + Phone provider
 *
 * Usage:
 *   1. Run: npx supabase login
 *   2. Run: node scripts/setup-supabase-bird.mjs
 *
 * Requires SUPABASE_ACCESS_TOKEN (from `supabase login`) or env var.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = "itongowuivcufubjqkyd";
const HOOK_URL = `https://${PROJECT_REF}.supabase.co/functions/v1/send-sms`;
const HOOK_SECRET = "v1,whsec_In6ZA8QXr6LKbWBvG/HClSav/gRTsrIIku1zDPvUOxg=";

function loadBackendEnv() {
  const envPath = resolve(__dirname, "../backend/.env");
  const lines = readFileSync(envPath, "utf8").split("\n");
  const env = {};
  for (const line of lines) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function api(method, path, body, token) {
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return data;
}

async function setSecrets(token, secrets) {
  // Management API for secrets may vary; try CLI-compatible bulk endpoint
  for (const [name, value] of Object.entries(secrets)) {
    console.log(`Setting secret: ${name}`);
    try {
      await api(
        "POST",
        `/projects/${PROJECT_REF}/secrets`,
        { name, value },
        token
      );
    } catch {
      // Fallback: secrets API shape differs by Supabase version
      console.warn(`  Could not set ${name} via API — set manually in Dashboard → Edge Functions → Secrets`);
    }
  }
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    console.error("Missing SUPABASE_ACCESS_TOKEN. Run: npx supabase login");
    console.error("Then: $env:SUPABASE_ACCESS_TOKEN = (supabase projects list shows you're logged in)");
    process.exit(1);
  }

  const backendEnv = loadBackendEnv();
  const birdKey = backendEnv.BIRD_API_KEY;
  const birdFrom = backendEnv.BIRD_SMS_FROM || "Nectar";

  if (!birdKey) {
    console.error("BIRD_API_KEY missing in backend/.env");
    process.exit(1);
  }

  console.log("Configuring Auth (phone + SMS hook)...");
  await api(
    "PATCH",
    `/projects/${PROJECT_REF}/config/auth`,
    {
      external_phone_enabled: true,
      hook_send_sms_enabled: true,
      hook_send_sms_uri: HOOK_URL,
      hook_send_sms_secrets: HOOK_SECRET,
      // Dummy Twilio values required by dashboard validation when enabling phone
      sms_provider: "twilio",
      sms_twilio_account_sid: "AC00000000000000000000000000000000",
      sms_twilio_auth_token: "00000000000000000000000000000000",
      sms_twilio_message_service_sid: "MG00000000000000000000000000000000",
    },
    token
  );
  console.log("Auth config updated.");

  await setSecrets(token, {
    BIRD_API_KEY: birdKey,
    BIRD_SMS_FROM: birdFrom,
    SEND_SMS_HOOK_SECRET: HOOK_SECRET,
  });

  console.log("\nDone! Test with:");
  console.log(`  curl -X POST http://localhost:4000/auth/send-otp -H "Content-Type: application/json" -d "{\\"dial\\":\\"+92\\",\\"phone\\":\\"3001234567\\"}"`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
