export const APP_COUNTRY = {
  code: "PK",
  name: "Pakistan",
  dial: "+92",
  flag: "🇵🇰",
} as const;

/** 10 digits, starts with 3 — Jazz/Zong/Ufone/Telenor etc. */
export const PAKISTAN_MOBILE_PATTERN = /^3[0-9]{9}$/;

export const PAKISTAN_MOBILE_HINT = "3XX XXXXXXX (10 digits)";

export function normalizePakistanMobile(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("92")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function isValidPakistanMobile(digits: string) {
  return PAKISTAN_MOBILE_PATTERN.test(digits);
}

export function formatPakistanMobileDisplay(digits: string) {
  const d = normalizePakistanMobile(digits);
  if (d.length <= 3) return d;
  return `${d.slice(0, 3)} ${d.slice(3)}`;
}

export function formatPakistanMobileMasked(digits: string) {
  const d = normalizePakistanMobile(digits);
  if (d.length < 5) return d;
  return `${d.slice(0, 3)} *** ${d.slice(-2)}`;
}
