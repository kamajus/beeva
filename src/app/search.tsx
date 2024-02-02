import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';

import { Residence } from '../assets/@types';
import NoData from '../assets/images/no-data';
import Header from '../components/Header';
import HomeCard from '../components/HomeCard';
import { supabase } from '../config/supabase';

export default function Search() {
  const { back } = useRouter();
  const { location } = useLocalSearchParams<{ location: string }>();
  const [residences, setResidences] = useState<Residence[]>();

  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase.rpc('get_residences_by_location', {
        place: location,
      });

      if (data) {
        setResidences(data);
      } else {
        console.log(error);
      }
    }

    getData();
  }, [location]);

  return (
    <SheetProvider>
      <View className="w-full h-full bg-white">
        <Header.Search goBack={back} value={location} />

        {residences && residences.length > 0 ? (
          <ScrollView className="bg-white flex flex-col p-4">
            <Text className="font-poppins-semibold text-lg">
              {residences?.length} resultado(s) encontrado(s)
            </Text>
            <>
              {residences?.map((residence) => (
                <HomeCard.Search key={residence.id} {...residence} />
              ))}
            </>
            <View className="mt-8" />
          </ScrollView>
        ) : (
          <View className="w-full h-2/4 flex justify-center items-center">
            <NoData />
            <Text className="font-poppins-medium text-gray-400 text-center">
              Você não tem nehuma residência!
            </Text>
          </View>
        )}

        <StatusBar style="dark" backgroundColor="white" />
      </View>
    </SheetProvider>
  );
}
