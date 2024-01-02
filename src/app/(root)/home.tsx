import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, FlatList, Text, Dimensions } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

import { RESIDENCE_DATA } from '../../assets/data';
import Filter from '../../components/Filter';
import HomeCard from '../../components/HomeCard';
import Constants from '../../constants';
import useMoneyFormat from '../../hooks/useMoneyFormat';

export default function House() {
  const { width } = Dimensions.get('window');
  const money = useMoneyFormat();

  return (
    <ScrollView className="bg-white">
      <View className="px-4 mt-[15%] bg-white">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="font-bold text-2xl">Encontre uma acomodação perfeita</Text>
          <Link href="/notification">
            <IconButton icon="bell" iconColor="#8b6cef" />
          </Link>
        </View>

        <Link href="/search">
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
            renderItem={({ item }) => (
              <HomeCard.Big
                key={item.id}
                image={item.image}
                location={item.location}
                price={money.format(item.price)}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Recomendações">
          <Filter />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={money.format(item.price)}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Próximas de você">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={money.format(item.price)}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Mais baratas hoje">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={money.format(item.price)}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Talvez você goste">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={money.format(item.price)}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>
      </View>
      <StatusBar style="light" backgroundColor="black" />
    </ScrollView>
  );
}
