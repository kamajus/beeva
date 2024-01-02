import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';

import Header from '../components/Header';
import HomeCard from '../components/HomeCard';

export default function () {
  const router = useRouter();

  return (
    <SheetProvider>
      <View className="bg-white">
        <Header.Search goBack={router.back} />
        <ScrollView className="bg-white flex flex-col">
          <Text className="p-4 font-semibold">Mais de 1000 encontrados</Text>
          <HomeCard.Search />
          <HomeCard.Search />
          <HomeCard.Search />
          <HomeCard.Search />
          <HomeCard.Search />
          <View className="h-44" />
        </ScrollView>
        <StatusBar style="dark" backgroundColor="white" />
      </View>
    </SheetProvider>
  );
}
