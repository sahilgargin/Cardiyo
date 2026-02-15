import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/welcome" />
      <Stack.Screen name="auth/verify-phone" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-card/select-bank" />
      <Stack.Screen name="add-card/select-card" />
    </Stack>
  );
}
