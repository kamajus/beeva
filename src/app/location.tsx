import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';
import { placeApi } from '../config/axios';

export default function LocationSearch() {
  const [dataSource, setDataSource] = useState<
    {
      origin: 'history' | 'search';
      value: string;
    }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function getHistory() {
      const history = await AsyncStorage.getItem('history');

      if (history) {
        const data: {
          origin: 'history' | 'search';
          value: string;
        }[] = [];
        Array(JSON.parse(history)).map((value) => {
          value.map((i: string) => {
            data.push({
              origin: 'history',
              value: i,
            });
          });
        });

        setDataSource(data);
      }
    }

    getHistory();
  }, []);

  useEffect(() => {
    function getData() {
      if (searchQuery) {
        placeApi
          .get(`/search?featureType&countrycodes=AO&limit=5&format=json&q=${searchQuery}`)
          .then((res) => {
            const searchArray: {
              origin: 'search';
              value: string;
            }[] = [];

            res.data.map((value: any) => {
              searchArray.push({
                origin: 'search',
                value: value.display_name,
              });
            });

            setDataSource(searchArray);
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
              <Icon
                name={item.origin === 'search' ? 'location-pin' : 'history'}
                color="black"
                size={25}
              />
              <Link
                href={{
                  pathname: '/search',
                  params: { location: item.value },
                }}
                className="font-poppins-medium text-base">
                {item.value}
              </Link>
            </View>
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}
