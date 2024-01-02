import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Avatar, IconButton } from 'react-native-paper';

import { RESIDENCE_DATA } from '../../assets/data';
import MapPin from '../../assets/images/map-pin';
import Carousel from '../../components/Carousel';
import Header from '../../components/Header';
import HomeCard from '../../components/HomeCard';
import useMoneyFormat from '../../hooks/useMoneyFormat';

function Galery() {
  return (
    <FlatList
      data={RESIDENCE_DATA}
      horizontal
      renderItem={({ item }) => (
        <TouchableOpacity>
          <Image
            key={item.id}
            source={item.image}
            style={{
              height: 140,
              width: 140,
              borderRadius: 8,
              marginRight: 8,
            }}
          />
        </TouchableOpacity>
      )}
    />
  );
}

export default function ResidenceDetail() {
  const router = useRouter();
  const money = useMoneyFormat();

  return (
    <ScrollView className="bg-white relative w-full">
      <Carousel autoplay loop style={{ height: 460 }} />

      <View className="px-4 bg-white flex mt-7">
        <View className="flex flex-row items-center justify-between">
          <View className="flex gap-x-3 flex-row">
            <Avatar.Image size={50} source={require('../../assets/images/avatar.png')} />
            <View className="">
              <Text className="font-poppins-medium text-base">Roberto Carlos</Text>
              <Text className="font-poppins-regular text-sm text-gray-400">Dono</Text>
            </View>
          </View>

          <View className="flex flex-row">
            <IconButton icon="message-processing-outline" mode="outlined" iconColor="#000" />
            <IconButton icon="phone" mode="outlined" iconColor="#000" />
          </View>
        </View>

        <View className="flex gap-1 flex-row items-center mt-4">
          <Text className="text-2xl font-poppins-semibold">{money.format(300)}</Text>
          <Text className="text-xs font-poppins-regular text-gray-400">/mês</Text>
        </View>

        <View className="mt-4">
          <Text className="font-poppins-regular text-xs text-gray-400">Tipo</Text>
          <Text className="font-poppins-medium">Apartamento</Text>
        </View>

        <View className="mt-4">
          <Text className="font-poppins-regular text-xs text-gray-400">Data da postagem</Text>
          <Text className="font-poppins-medium">Há 2 dia</Text>
        </View>

        <View className="mt-4">
          <Text className="font-poppins-semibold text-lg">Descrição</Text>
          <Text className="font-poppins-regular text-gray-600">
            Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua{'\n'}
            <Text className="font-poppins-regular text-[#8b6cef]">Ver mais...</Text>
          </Text>
        </View>

        <View className="mt-4">
          <Text className="font-poppins-semibold text-lg mb-2">Galeria</Text>
          <Galery />
        </View>

        <View className="mt-4">
          <Text className="font-poppins-semibold text-lg">Localização</Text>

          <View className="flex flex-row items-center">
            <MapPin size={20} />
            <Text className="font-poppins-medium text-xs ml-1 text-gray-600 mt-2 mb-2">
              Grand City St.100, New York, United States
            </Text>
          </View>

          <View className="h-[330px] mt-2 rounded-md overflow-hidden justify-center items-center -z-[1]">
            <MapView
              className="flex-1 h-full w-full rounded-xl"
              rotateEnabled={false}
              loadingEnabled
            />
          </View>
        </View>

        <HomeCard.Root title="Talvez goste">
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

      <Header.Carousel goBack={router.back} />
      <StatusBar style="light" backgroundColor="black" />
    </ScrollView>
  );
}
