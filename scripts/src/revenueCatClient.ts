import { createClient, createConfig } from "@replit/revenuecat-sdk/client";

export async function getUncachableRevenueCatClient() {
  const apiKey = process.env["REVENUECAT_API_KEY"] ?? process.env["REVENUECAT_SECRET_KEY"];
  if (!apiKey) {
    throw new Error(
      "REVENUECAT_API_KEY (or REVENUECAT_SECRET_KEY) ortam değişkeni ayarlanmamış",
    );
  }
  return createClient(
    createConfig({
      baseUrl: "https://api.revenuecat.com/v2",
      headers: { Authorization: `Bearer ${apiKey}` },
    }),
  );
}
