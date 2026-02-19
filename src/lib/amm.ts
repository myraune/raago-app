/**
 * Automated Market Maker (AMM) using a simplified LMSR-style model.
 *
 * The market has a "yesPrice" (probability) between 0 and 1.
 * Buying YES shares pushes the price up; buying NO shares pushes it down.
 * The liquidity parameter controls how much the price moves per trade.
 */

export interface TradeResult {
  newYesPrice: number;
  cost: number;
  shares: number;
  avgPrice: number;
}

/**
 * Calculate the cost of buying shares on a given side.
 * Uses constant-product-like pricing for simplicity.
 */
export function calculateBuyCost(
  currentYesPrice: number,
  side: "yes" | "no",
  shares: number,
  liquidity: number
): TradeResult {
  const b = liquidity;
  const p = side === "yes" ? currentYesPrice : 1 - currentYesPrice;

  // LMSR-inspired cost: cost = b * ln(exp(shares/b) * p + (1-p)) - b * ln(1)
  // Simplified: we use a linear-quadratic approximation for tractability
  const priceImpact = shares / (2 * b);
  const avgPrice = Math.min(0.99, Math.max(0.01, p + priceImpact));
  const cost = shares * avgPrice;

  // New price after trade
  let newP = Math.min(0.99, Math.max(0.01, p + (shares / b) * (1 - p) * p));
  const newYesPrice = side === "yes" ? newP : 1 - newP;

  return {
    newYesPrice: Math.round(newYesPrice * 1000) / 1000,
    cost: Math.round(cost * 100) / 100,
    shares,
    avgPrice: Math.round(avgPrice * 100) / 100,
  };
}

/**
 * Calculate the return from selling shares.
 */
export function calculateSellReturn(
  currentYesPrice: number,
  side: "yes" | "no",
  shares: number,
  liquidity: number
): TradeResult {
  const b = liquidity;
  const p = side === "yes" ? currentYesPrice : 1 - currentYesPrice;

  const priceImpact = shares / (2 * b);
  const avgPrice = Math.max(0.01, Math.min(0.99, p - priceImpact));
  const cost = shares * avgPrice; // This is the return

  let newP = Math.max(0.01, Math.min(0.99, p - (shares / b) * (1 - p) * p));
  const newYesPrice = side === "yes" ? newP : 1 - newP;

  return {
    newYesPrice: Math.round(newYesPrice * 1000) / 1000,
    cost: Math.round(cost * 100) / 100,
    shares,
    avgPrice: Math.round(avgPrice * 100) / 100,
  };
}

/**
 * Format price as percentage
 */
export function formatPercent(price: number): string {
  return `${Math.round(price * 100)}%`;
}

/**
 * Format NOK currency
 */
export function formatNOK(amount: number): string {
  return `${amount.toLocaleString("nb-NO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} kr`;
}
