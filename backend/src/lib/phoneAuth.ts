export type SmsProvider = "supabase" | "bird" | "twilio" | "dev";

const providerStore = new Map<string, SmsProvider>();

export function setPhoneProvider(fullPhone: string, provider: SmsProvider) {
  providerStore.set(fullPhone, provider);
}

export function getPhoneProvider(fullPhone: string): SmsProvider | undefined {
  return providerStore.get(fullPhone);
}

export function toE164(dial: string, phone: string) {
  const digits = phone.replace(/\D/g, "");
  const dialDigits = dial.replace(/\D/g, "");
  return `+${dialDigits}${digits}`;
}
