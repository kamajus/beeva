import { Stack } from 'expo-router';
import { PaperProvider, MD2LightTheme, configureFonts } from 'react-native-paper';

export default function StackLayout() {
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
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index" options={{ headerTitle: 'index', headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerTitle: 'signin', headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
