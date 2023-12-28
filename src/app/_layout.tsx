import { Stack } from 'expo-router';
import { PaperProvider, MD2LightTheme, configureFonts } from 'react-native-paper';

import Header from '../components/Header';

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
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="residence/[id]"
          options={{
            headerShown: false,
            title: 'Propriedade',
          }}
        />
        <Stack.Screen
          name="notification"
          options={{
            headerShown: true,
            title: 'Notificações',
            header: ({ navigation }) => (
              <Header.NormalHeader title="Notificações" goBack={navigation.goBack} />
            ),
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
