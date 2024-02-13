import { Stack } from 'expo-router';
import { PaperProvider, MD2LightTheme, configureFonts } from 'react-native-paper';

import { AlertProvider } from '../contexts/AlertProvider';
import CacheProvider from '../contexts/CacheProvider';
import { SupabaseProvider } from '../contexts/SupabaseProvider';

export default function () {
  const fontConfig = {
    android: {
      regular: {
        fontFamily: 'poppins-regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'poppins-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'poppins-regular',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'poppins-thin',
        fontWeight: 'normal',
      },
    },
  };

  const theme = {
    ...MD2LightTheme,
    fonts: configureFonts({ config: fontConfig, isV3: false }),
  };

  return (
    <PaperProvider theme={theme}>
      <AlertProvider>
        <CacheProvider>
          <SupabaseProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="verification/[email]" />
              <Stack.Screen name="residence/[id]" />
              <Stack.Screen name="forgotPassword" />
              <Stack.Screen name="notification" />
              <Stack.Screen name="(settings)" />
              <Stack.Screen name="location" />
              <Stack.Screen name="search" />
            </Stack>
          </SupabaseProvider>
        </CacheProvider>
      </AlertProvider>
    </PaperProvider>
  );
}
