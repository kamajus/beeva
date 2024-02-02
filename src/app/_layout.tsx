import { Stack } from 'expo-router';
import { PaperProvider, MD2LightTheme, configureFonts } from 'react-native-paper';

import Header from '../components/Header';
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
    <CacheProvider>
      <SupabaseProvider>
        <PaperProvider theme={theme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="index" />

            <Stack.Screen
              name="notification"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <Header.Normal title="Notificações" goBack={navigation.goBack} />
                ),
              }}
            />
            <Stack.Screen name="verification/[email]" />
            <Stack.Screen name="residence/[id]" />
            <Stack.Screen name="(settings)" />
            <Stack.Screen name="location" />
            <Stack.Screen name="search" />
          </Stack>
        </PaperProvider>
      </SupabaseProvider>
    </CacheProvider>
  );
}
