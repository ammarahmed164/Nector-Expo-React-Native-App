import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

interface SmsWebhookPayload {
  user: { phone: string };
  sms: { otp: string };
}

function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `+${digits}` : trimmed;
}

function getBirdHost(apiKey: string) {
  if (apiKey.startsWith("bk_us1_")) return "https://us1.platform.bird.com";
  if (apiKey.startsWith("bk_eu1_")) return "https://eu1.platform.bird.com";
  return Deno.env.get("BIRD_API_HOST") ?? "https://us1.platform.bird.com";
}

/** New Bird Platform API (bk_us1_/bk_eu1_ keys) */
async function sendPlatformSms(apiKey: string, to: string, text: string) {
  const from = Deno.env.get("BIRD_SMS_FROM") ?? Deno.env.get("SUPABASE_BIRD_SMS_FROM") ?? "Nectar";
  if (!from) throw new Error("BIRD_SMS_FROM is not configured (sender ID or phone number).");

  const host = getBirdHost(apiKey);
  const response = await fetch(`${host}/v1/sms/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      from,
      text,
      category: "authentication",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bird platform SMS failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

/** Legacy Bird Channels API (AccessKey + workspace + channel) */
async function sendLegacyChannelSms(apiKey: string, to: string, text: string) {
  const workspaceId = Deno.env.get("BIRD_WORKSPACE_ID") ?? Deno.env.get("SMS_WORKSPACE_ID");
  const channelId = Deno.env.get("BIRD_CHANNEL_ID") ?? Deno.env.get("SMS_CHANNEL_ID");
  if (!workspaceId || !channelId) {
    throw new Error("BIRD_WORKSPACE_ID and BIRD_CHANNEL_ID required for legacy Bird API.");
  }

  const authHeader = apiKey.startsWith("bk_") ? `Bearer ${apiKey}` : `AccessKey ${apiKey}`;
  const host = Deno.env.get("BIRD_CHANNELS_HOST") ?? "https://api.bird.com";

  const response = await fetch(`${host}/workspaces/${workspaceId}/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receiver: {
        contacts: [{ identifierValue: to, identifierKey: "phonenumber" }],
      },
      body: { type: "text", text: { text } },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bird channels SMS failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

async function sendBirdSms(to: string, text: string) {
  const apiKey =
    Deno.env.get("BIRD_API_KEY") ??
    Deno.env.get("SMS_ACCESS_KEY") ??
    Deno.env.get("SUPABASE_BIRD_API_KEY");
  if (!apiKey) throw new Error("BIRD_API_KEY is not configured.");

  if (apiKey.startsWith("bk_us1_") || apiKey.startsWith("bk_eu1_")) {
    return sendPlatformSms(apiKey, to, text);
  }

  return sendLegacyChannelSms(apiKey, to, text);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.text();
    const hookSecret =
      Deno.env.get("SEND_SMS_HOOK_SECRET") ??
      Deno.env.get("SEND_SMS_HOOK_SECRETS") ??
      "v1,whsec_In6ZA8QXr6LKbWBvG/HClSav/gRTsrIIku1zDPvUOxg=";

    const secretKey = hookSecret.replace(/^v1,whsec_/, "");
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(secretKey);
    const { user, sms } = wh.verify(payload, headers) as SmsWebhookPayload;

    const phone = normalizePhone(user.phone);
    const message = `Your Nectar verification code is: ${sms.otp}. Valid for 5 minutes.`;

    await sendBirdSms(phone, message);

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("send-sms hook error:", message);
    return new Response(JSON.stringify({ error: { message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
