/** Display prices in Pakistani Rupees (converted from USD base prices in mock data). */
const USD_TO_PKR = 280;

export function toPkr(amountUsd: number) {
  return Math.round(amountUsd * USD_TO_PKR);
}

export function formatPrice(amountUsd: number) {
  return `Rs. ${toPkr(amountUsd).toLocaleString("en-PK")}`;
}

export function formatPriceValue(amountUsd: number) {
  return toPkr(amountUsd).toLocaleString("en-PK");
}
