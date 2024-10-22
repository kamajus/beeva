import { Stack } from 'expo-router'
import { SheetProvider } from 'react-native-actions-sheet'

import { AlertProvider } from '@/contexts/AlertProvider'
import { SupabaseProvider } from '@/contexts/SupabaseProvider'
import { ToastProvider } from '@/contexts/ToastProvider'

export default function RootLayout() {
  return (
    <AlertProvider>
      <ToastProvider>
        <SupabaseProvider>
          <SheetProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="search/[location]" />
              <Stack.Screen name="residence/[id]" />
              <Stack.Screen name="notification" />
              <Stack.Screen name="(settings)" />
              <Stack.Screen name="verification/[email]" />
              <Stack.Screen name="recovery" />
              <Stack.Screen name="editor/[id]" />
              <Stack.Screen name="location" />
            </Stack>
          </SheetProvider>
        </SupabaseProvider>
      </ToastProvider>
    </AlertProvider>
  )
}
