export function isBirdConfigured() {
  const key = process.env.BIRD_API_KEY;
  const from = process.env.BIRD_SMS_FROM;
  if (!key) return false;
  if (key.startsWith("bk_us1_") || key.startsWith("bk_eu1_")) return !!from;
  return !!(process.env.BIRD_WORKSPACE_ID && process.env.BIRD_CHANNEL_ID);
}

function getBirdHost(apiKey: string) {
  if (apiKey.startsWith("bk_us1_")) return "https://us1.platform.bird.com";
  if (apiKey.startsWith("bk_eu1_")) return "https://eu1.platform.bird.com";
  return process.env.BIRD_API_HOST ?? "https://us1.platform.bird.com";
}

async function sendPlatformSms(apiKey: string, to: string, text: string) {
  const from = process.env.BIRD_SMS_FROM;
  if (!from) throw new Error("BIRD_SMS_FROM is not configured.");

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
    throw new Error(`Bird SMS failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

async function sendLegacyChannelSms(apiKey: string, to: string, text: string) {
  const workspaceId = process.env.BIRD_WORKSPACE_ID;
  const channelId = process.env.BIRD_CHANNEL_ID;
  if (!workspaceId || !channelId) {
    throw new Error("BIRD_WORKSPACE_ID and BIRD_CHANNEL_ID required.");
  }

  const authHeader = apiKey.startsWith("bk_") ? `Bearer ${apiKey}` : `AccessKey ${apiKey}`;
  const host = process.env.BIRD_CHANNELS_HOST ?? "https://api.bird.com";

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

export async function sendBirdSms(to: string, text: string) {
  const apiKey = process.env.BIRD_API_KEY;
  if (!apiKey) throw new Error("BIRD_API_KEY is not configured.");

  if (apiKey.startsWith("bk_us1_") || apiKey.startsWith("bk_eu1_")) {
    return sendPlatformSms(apiKey, to, text);
  }

  return sendLegacyChannelSms(apiKey, to, text);
}
