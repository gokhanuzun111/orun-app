import React, { createContext, useContext } from "react";
import Purchases from "react-native-purchases";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ENTITLEMENT_TO_LEVEL,
  initRevenueCat,
  isRevenueCatSupported,
} from "@/services/revenuecat";

export const REVENUECAT_ENTITLEMENTS = Object.keys(ENTITLEMENT_TO_LEVEL);

export function initializeRevenueCat() {
  if (!isRevenueCatSupported()) return;
  initRevenueCat().catch(err => {
    if (__DEV__) console.warn("RevenueCat init failed:", err?.message);
  });
}

function useSubscriptionContext() {
  const enabled = isRevenueCatSupported();

  const customerInfoQuery = useQuery({
    queryKey: ["revenuecat", "customer-info"],
    queryFn: () => Purchases.getCustomerInfo(),
    staleTime: 60_000,
    enabled,
  });

  const offeringsQuery = useQuery({
    queryKey: ["revenuecat", "offerings"],
    queryFn: () => Purchases.getOfferings(),
    staleTime: 300_000,
    enabled,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: any) => {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const restoreMutation = useMutation({
    mutationFn: () => Purchases.restorePurchases(),
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const active = customerInfoQuery.data?.entitlements.active ?? {};
  const isSubscribed = REVENUECAT_ENTITLEMENTS.some(k => active[k] !== undefined);

  return {
    customerInfo: customerInfoQuery.data,
    offerings: offeringsQuery.data,
    isSubscribed,
    isLoading: customerInfoQuery.isLoading || offeringsQuery.isLoading,
    purchase: purchaseMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
  };
}

type SubscriptionContextValue = ReturnType<typeof useSubscriptionContext>;
const Context = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useSubscriptionContext();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSubscription() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
