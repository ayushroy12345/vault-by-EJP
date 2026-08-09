import { Cashfree, CFEnvironment } from "cashfree-pg";

export const ORDER_AMOUNT = 149;
export const ORDER_CURRENCY = "INR";

export type CashfreeClientMode = "sandbox" | "production";

export function isCashfreeProduction() {
  return process.env.CASHFREE_ENV === "production";
}

/** Server-injected client mode for the Cashfree.js widget. */
export function getCashfreeClientMode(): CashfreeClientMode {
  return isCashfreeProduction() ? "production" : "sandbox";
}

export function getCashfree() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) {
    throw new Error(
      "CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be set in your environment."
    );
  }
  const client = new Cashfree(
    isCashfreeProduction() ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    appId,
    secretKey
  );
  client.XApiVersion = "2025-01-01";
  return client;
}
