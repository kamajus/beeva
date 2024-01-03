import { useRouter } from 'expo-router';

import SignIn from './signin';
import useLoadFonts from '../hooks/useLoadFonts';
import { useSupabase } from '../hooks/useSupabase';

export default function App() {
  const { fontError, fontsLoaded } = useLoadFonts();
  const { session, initialized } = useSupabase();
  const router = useRouter();

  if ((!fontsLoaded && !fontError) || !initialized) {
    return;
  }

  if (session) {
    router.replace('/home');
  }

  return <SignIn />;
}
