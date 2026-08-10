/** Pakistan mobile: 10 digits, starts with 3 (e.g. 3001234567). Accepts 03XX, +92, 92 prefixes. */
export const PAKISTAN_MOBILE_PATTERN = /^3[0-9]{9}$/;

export function normalizePakistanMobile(input: string) {
  let digits = String(input).replace(/\D/g, "");
  if (digits.startsWith("92")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function isValidPakistanMobile(digits: string) {
  return PAKISTAN_MOBILE_PATTERN.test(digits);
}

/** Normalize + validate; returns 10-digit mobile or null. */
export function parsePakistanMobile(input: string) {
  const digits = normalizePakistanMobile(input);
  return isValidPakistanMobile(digits) ? digits : null;
}

export function formatPakistanMobileDisplay(digits: string) {
  const d = normalizePakistanMobile(digits);
  if (d.length <= 3) return d;
  return `${d.slice(0, 3)} ${d.slice(3)}`;
}

export function toPakistanE164(dial: string, digits: string) {
  const dialDigits = dial.replace(/\D/g, "");
  return `+${dialDigits}${digits}`;
}
