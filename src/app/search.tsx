import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';

import { RESIDENCE_DATA } from '../assets/data';
import Header from '../components/Header';
import HomeCard from '../components/HomeCard';

export default function Search() {
  const { back } = useRouter();
  const { location } = useLocalSearchParams<{ location: string }>();

  return (
    <SheetProvider>
      <View className="bg-white">
        <Header.Search goBack={back} value={location} />
        <ScrollView className="bg-white flex flex-col">
          <Text className="p-4 font-poppins-semibold text-lg">
            {RESIDENCE_DATA.length} resultado(s) encontrado(s)
          </Text>
          <>
            {RESIDENCE_DATA.map((residence) => (
              <HomeCard.Search {...residence} />
            ))}
          </>
          <View className="h-44" />
        </ScrollView>
        <StatusBar style="dark" backgroundColor="white" />
      </View>
    </SheetProvider>
  );
}
