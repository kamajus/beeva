import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import MapPin from '../../assets/images/map-pin';
import useMoneyFormat from '../../hooks/useMoneyFormat';
import Carousel from '../Carousel';

export default function HomeSearch() {
  const [saved, setSaved] = useState(false);
  const money = useMoneyFormat();

  return (
    <Pressable style={{ position: 'relative', paddingHorizontal: 16, marginBottom: 30 }}>
      <Carousel style={{ height: 350, borderRadius: 8 }} />
      <View className="w-full gap-1 mt-2">
        <View className="flex flex-row items-center">
          <MapPin size={19} />
          <Text className="font-poppins-medium text-sm ml-1">Angola, Luanda</Text>
        </View>
        <Text className="font-poppins-semibold text-base">{money.format(39546)}</Text>
      </View>

      <IconButton
        icon={saved ? 'heart' : 'cards-heart-outline'}
        mode="outlined"
        iconColor={saved ? '#fd6963' : '#000'}
        containerColor="#fff"
        className="absolute top-2 right-6"
        onPress={() => setSaved(!saved)}
      />
    </Pressable>
  );
}
