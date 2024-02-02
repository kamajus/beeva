import ExpoConstants from 'expo-constants';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { View, ScrollView, FlatList, Text, Dimensions, RefreshControl } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

import { RESIDENCE_DATA } from '../../assets/data';
import Filter from '../../components/Filter';
import HomeCard from '../../components/HomeCard';
import Constants from '../../constants';
import { useCache } from '../../hooks/useCache';

export default function House() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const { width } = Dimensions.get('window');
  const { notifications } = useCache();

  return (
    <ScrollView
      className="bg-white"
      style={{ marginTop: ExpoConstants.statusBarHeight }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="px-4 mt-[7%] bg-white">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="font-poppins-bold text-2xl">Encontre uma acomodação perfeita</Text>
          <View className="relative">
            <Link href="/notification">
              <IconButton icon="bell" iconColor={Constants.colors.primary} />
            </Link>
            <View className="absolute bottom-6 left-6 bg-[#e83f5b] rounded-full flex justify-center items-center w-5 h-5">
              <Text className="font-poppins-semibold text-[10px] text-center text-white">
                {notifications.filter((item) => !item.was_readed).length}
              </Text>
            </View>
          </View>
        </View>

        <Link href="/location">
          <Searchbar
            style={{
              shadowColor: 'transparent',
              backgroundColor: Constants.colors.input,
              flex: 1,
              width: width - 32, // Total screen width minus horizontal margin
            }}
            inputStyle={{
              height: 58,
              fontSize: 15,
              alignSelf: 'stretch',
              fontFamily: 'poppins-medium',
            }}
            placeholder="Procurar por ..."
            value=""
            editable={false}
          />
        </Link>

        <HomeCard.Root title="Em alta" icon="fire" iconColor="#E25822">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => <HomeCard.Big {...item} />}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Recomendações">
          <Filter />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => <HomeCard.Small {...item} />}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Próximas de você">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => <HomeCard.Small {...item} />}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Mais baratas hoje">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => <HomeCard.Small {...item} />}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Talvez você goste">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => <HomeCard.Small {...item} />}
          />
        </HomeCard.Root>
      </View>
      <StatusBar style="light" backgroundColor="#000" />
    </ScrollView>
  );
}
