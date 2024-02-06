import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import LoadScreen from '../components/LoadScreen';
import useLoadFonts from '../hooks/useLoadFonts';
import { useSupabase } from '../hooks/useSupabase';

export default function App() {
  const { fontError, fontsLoaded } = useLoadFonts();
  const { session, initialized } = useSupabase();
  const { replace } = useRouter();

  useEffect(() => {
    const handleRedirect = () => {
      if (fontsLoaded && !fontError && initialized) {
        if (session) {
          replace('/(root)/home');
        } else {
          replace('/signin');
        }
      }
    };

    handleRedirect();
  }, [session, initialized, replace, fontsLoaded, fontError]);

  return <LoadScreen />;
}
