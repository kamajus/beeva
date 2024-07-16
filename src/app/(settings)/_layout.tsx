import { Stack } from 'expo-router'

export default function () {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="residences" />
      <Stack.Screen name="secure" />
      <Stack.Screen name="perfil" />
    </Stack>
  )
}
