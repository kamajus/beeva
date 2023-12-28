import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';

export default function useLoadFonts() {
  const [fontsLoaded, fontError] = useFonts({
    'poppins-regular': Poppins_400Regular,
    'poppins-medium': Poppins_500Medium,
    'poppins-semibold': Poppins_600SemiBold,
    'poppins-bold': Poppins_700Bold,
    'inter-regular': Inter_400Regular,
    'inter-medium': Inter_500Medium,
  });

  return { fontsLoaded, fontError };
}
