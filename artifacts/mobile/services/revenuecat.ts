import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  LOG_LEVEL,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import type { MembershipLevel } from "@/constants/data";

const IOS_API_KEY = process.env.EXPO_PUBLIC_RC_API_KEY_IOS ?? "";

export const ENTITLEMENT_TO_LEVEL: Record<string, MembershipLevel> = {
  ORUN_UYE: 1,
  ORUN_MUDAVIM: 2,
  ORUN_SECKIN: 3,
};

export const LEVEL_TO_OFFERING: Record<Exclude<MembershipLevel, 0>, string> = {
  1: "default",
  2: "mudavim",
  3: "seckin",
};

let initialized = false;

export function isRevenueCatSupported(): boolean {
  return Platform.OS === "ios" && !!IOS_API_KEY;
}

export async function initRevenueCat(userId?: string): Promise<void> {
  if (initialized || !isRevenueCatSupported()) return;
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.WARN : LOG_LEVEL.ERROR);
  await Purchases.configure({
    apiKey: IOS_API_KEY,
    appUserID: userId ?? null,
  });
  initialized = true;
}

export async function identifyRevenueCat(userId: string): Promise<CustomerInfo | null> {
  if (!isRevenueCatSupported()) return null;
  if (!initialized) await initRevenueCat(userId);
  const { customerInfo } = await Purchases.logIn(userId);
  return customerInfo;
}

export async function logoutRevenueCat(): Promise<void> {
  if (!isRevenueCatSupported() || !initialized) return;
  try {
    await Purchases.logOut();
  } catch {
  }
}

export function entitlementsToLevel(customerInfo: CustomerInfo | null): MembershipLevel {
  if (!customerInfo) return 0;
  const active = customerInfo.entitlements.active;
  let best: MembershipLevel = 0;
  for (const key of Object.keys(active)) {
    const lvl = ENTITLEMENT_TO_LEVEL[key];
    if (lvl && lvl > best) best = lvl;
  }
  return best;
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isRevenueCatSupported()) return null;
  return Purchases.getCustomerInfo();
}

export async function getOfferingForLevel(
  level: Exclude<MembershipLevel, 0>,
): Promise<PurchasesOffering | null> {
  if (!isRevenueCatSupported()) return null;
  const offerings = await Purchases.getOfferings();
  const key = LEVEL_TO_OFFERING[level];
  return offerings.all[key] ?? offerings.current ?? null;
}

export type PaywallOutcome = "purchased" | "restored" | "cancelled" | "error" | "unsupported";

export async function presentPaywallForLevel(
  level: Exclude<MembershipLevel, 0>,
): Promise<PaywallOutcome> {
  if (!isRevenueCatSupported()) return "unsupported";
  const offering = await getOfferingForLevel(level);
  if (!offering) return "error";
  const result = await RevenueCatUI.presentPaywall({ offering });
  switch (result) {
    case PAYWALL_RESULT.PURCHASED:
      return "purchased";
    case PAYWALL_RESULT.RESTORED:
      return "restored";
    case PAYWALL_RESULT.CANCELLED:
      return "cancelled";
    default:
      return "error";
  }
}

export async function presentCustomerCenter(): Promise<void> {
  if (!isRevenueCatSupported()) return;
  await RevenueCatUI.presentCustomerCenter();
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (!isRevenueCatSupported()) return null;
  return Purchases.restorePurchases();
}

export function addCustomerInfoListener(
  cb: (info: CustomerInfo) => void,
): () => void {
  if (!isRevenueCatSupported()) return () => {};
  Purchases.addCustomerInfoUpdateListener(cb);
  return () => Purchases.removeCustomerInfoUpdateListener(cb);
}
