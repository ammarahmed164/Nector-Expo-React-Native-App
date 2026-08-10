type OtpEntry = { code: string; expiresAt: number };

const store = new Map<string, OtpEntry>();
const OTP_TTL_MS = 5 * 60 * 1000;

function normalizePhone(dial: string, phone: string) {
  return `${dial}${phone.replace(/\D/g, "")}`;
}

export function createOtp(dial: string, phone: string, length: 4 | 6 = 4) {
  const key = normalizePhone(dial, phone);
  const code =
    length === 6
      ? String(Math.floor(100000 + Math.random() * 900000))
      : String(Math.floor(1000 + Math.random() * 9000));
  store.set(key, { code, expiresAt: Date.now() + OTP_TTL_MS });
  return { phone: key, code, expiresInSec: OTP_TTL_MS / 1000, codeLength: length };
}

export function verifyOtp(dial: string, phone: string, code: string) {
  const key = normalizePhone(dial, phone);
  const entry = store.get(key);
  if (!entry) return { ok: false, error: "No code found. Please resend." };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { ok: false, error: "Code expired. Please resend." };
  }
  if (entry.code !== code) return { ok: false, error: "Invalid verification code." };
  store.delete(key);
  return { ok: true, phone: key };
}

export function resendOtp(dial: string, phone: string) {
  return createOtp(dial, phone);
}
