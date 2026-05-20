import { createClient } from "@replit/revenuecat-sdk";

export async function getUncachableRevenueCatClient() {
  const apiKey = process.env.REVENUECAT_API_KEY;
  if (!apiKey) throw new Error("REVENUECAT_API_KEY ortam değişkeni ayarlanmamış");
  return createClient({ apiKey });
}
