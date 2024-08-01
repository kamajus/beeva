import { Stack } from 'expo-router'

import { AlertProvider } from '@/contexts/AlertProvider'
import CacheProvider from '@/contexts/CacheProvider'
import { SupabaseProvider } from '@/contexts/SupabaseProvider'

export default function RootLayout() {
  return (
    <AlertProvider>
      <CacheProvider>
        <SupabaseProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="forgotPassword" />
            <Stack.Screen name="search/[location]" />
            <Stack.Screen name="residence/[id]" />
            <Stack.Screen name="notification" />
            <Stack.Screen name="(settings)" />
            <Stack.Screen name="verification/[email]" />
            <Stack.Screen name="editor/[id]" />
            <Stack.Screen name="location" />
          </Stack>
        </SupabaseProvider>
      </CacheProvider>
    </AlertProvider>
  )
}
