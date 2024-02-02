import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';
import { placeApi } from '../config/axios';

export default function LocationSearch() {
  const [dataSource, setDataSource] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    function getData() {
      if (searchQuery) {
        placeApi
          .get(`/search?featureType&countrycodes=AO&limit=5&format=json&q=${searchQuery}`)
          .then((res) => {
            const places: string[] = res.data.map((item: any) => item.display_name);
            setDataSource(places);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }

    getData();
  }, [searchQuery, setDataSource]);

  return (
    <View className="w-full h-full bg-white">
      <Header.Location setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
        <ScrollView className="p-1">
          {dataSource.map((item, index) => (
            <View className="flex flex-row items-center gap-2 p-4" key={index}>
              <Icon name="location-pin" color="black" size={25} />
              <Link
                href={{
                  pathname: '/search',
                  params: { location: item },
                }}
                className="font-poppins-medium text-base">
                {item}
              </Link>
            </View>
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}
