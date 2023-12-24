import React from 'react';

import SignIn from './signin';
import useLoadFonts from '../hooks/useLoadFonts';

export default function App() {
  const { fontError, fontsLoaded } = useLoadFonts();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <SignIn />;
}
