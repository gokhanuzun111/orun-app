import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" options={{ animation: "fade" }} />
      <Stack.Screen name="auth" />
      <Stack.Screen name="consent" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="interview" />
      <Stack.Screen name="waiting" options={{ animation: "fade", gestureEnabled: false }} />
    </Stack>
  );
}
