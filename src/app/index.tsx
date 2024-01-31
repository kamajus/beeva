import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'react-native';

import SignIn from './signin';
import useLoadFonts from '../hooks/useLoadFonts';
import { useSupabase } from '../hooks/useSupabase';

export default function App() {
  const { fontError, fontsLoaded } = useLoadFonts();
  const { session, initialized } = useSupabase();
  const { replace } = useRouter();

  useEffect(() => {
    const handleRedirect = () => {
      if (initialized) {
        if (session) {
          replace('/(root)/home');
        }
      }
    };

    handleRedirect();
  }, [session, initialized, replace]);

  if ((!fontsLoaded && !fontError) || !initialized) {
    return <Text>Carregando</Text>;
  } else {
    return <SignIn />;
  }
}
