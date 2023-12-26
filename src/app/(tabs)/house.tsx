import { useState } from 'react';
import { View, ScrollView, StatusBar, FlatList, Text } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

import { HOMEDATA } from '../../assets/data';
import Filter from '../../components/Filter';
import HomeCard from '../../components/HomeCard';

export default function House() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView className="bg-white">
      <View className="px-4 mt-[15%] bg-white">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="font-bold text-2xl">Encontre uma acomodação perfeita</Text>
          <IconButton icon="bell" iconColor="#8b6cef" />
        </View>

        <Searchbar
          style={{
            shadowColor: 'transparent',
            backgroundColor: '#f5f5f5',
          }}
          inputStyle={{
            height: 58,
            fontSize: 15,
            fontFamily: 'poppins-medium',
          }}
          placeholder="Procurar por ..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        <Filter />

        <HomeCard.Root title="Em alta" icon="fire" iconColor="#E25822">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={HOMEDATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Big
                key={item.id}
                image={item.image}
                location={item.location}
                price={item.price}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="O seu histórico">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={HOMEDATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={item.price}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Próximas de você">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={HOMEDATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={item.price}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Mais baratas hoje">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={HOMEDATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={item.price}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Talvez você goste">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={HOMEDATA}
            className="w-full flex flex-row"
            renderItem={({ item }) => (
              <HomeCard.Small
                key={item.id}
                image={item.image}
                location={item.location}
                price={item.price}
                status={item.status}
              />
            )}
          />
        </HomeCard.Root>
      </View>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  );
}
