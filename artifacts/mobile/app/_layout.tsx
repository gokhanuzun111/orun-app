import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "expo-router/head";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

try {
  initializeRevenueCat();
} catch (err: any) {
  if (__DEV__) console.warn("RevenueCat başlatılamadı:", err?.message);
}

function RootLayoutNav() {
  const { isOnboarded, isLoading } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inOnboarding = segments[0] === "onboarding";
    if (!isOnboarded && !inOnboarding) {
      router.replace("/onboarding");
    } else if (isOnboarded && inOnboarding && segments[1] !== "waiting") {
      router.replace("/(tabs)/rooms");
    }
  }, [isOnboarded, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="club/[id]" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="room/[id]" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="profile/index" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="profile/membership" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="profile/settings" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="subscription/index" options={{ headerShown: false, animation: "slide_from_bottom", presentation: "modal" }} />
      <Stack.Screen name="legal/index" options={{ headerShown: false, animation: "slide_from_right" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <Head>
        <meta name="description" content="ORUN — düşünceli insanlar için seçilmiş dijital kulüpler. Ortak ilgi alanları etrafında kurulmuş özel odalara katılın, yapay zekâ destekli sohbetlerin içinde yerinizi alın." />
        <meta name="theme-color" content="#1B3A6B" />
        <meta property="og:title" content="ORUN" />
        <meta property="og:description" content="Düşünceli insanlar için seçilmiş dijital kulüpler." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SubscriptionProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <AppProvider>
                  <RootLayoutNav />
                </AppProvider>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </SubscriptionProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
