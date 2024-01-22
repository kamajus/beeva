import 'react-native-get-random-values';
import { useRouter } from 'expo-router';

import SignIn from './signin';
import useLoadFonts from '../hooks/useLoadFonts';
import { useSupabase } from '../hooks/useSupabase';

export default function App() {
  const { fontError, fontsLoaded } = useLoadFonts();
  const { session, initialized } = useSupabase();
  const { replace } = useRouter();

  if ((!fontsLoaded && !fontError) || !initialized) {
    return;
  }

  if (session) {
    replace('/(root)/home');
  }

  return <SignIn />;
}
