import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Residence } from '../../assets/@types';
import useMoneyFormat from '../../hooks/useMoneyFormat';
import Carousel from '../Carousel';

export default function HomeSearch(props: Residence) {
  const [saved, setSaved] = useState(false);
  const money = useMoneyFormat();

  return (
    <Pressable style={{ position: 'relative', paddingHorizontal: 16, marginBottom: 30 }}>
      <Carousel style={{ height: 350, borderRadius: 8 }} />
      <View className="w-full gap-1 mt-2">
        <View className="flex flex-row items-center">
          <Icon name="location-pin" color="black" size={19} />
          <Text className="font-poppins-medium text-sm ml-1">{props.location}</Text>
        </View>
        <Text className="font-poppins-semibold text-base">{money.format(props.price)}</Text>
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
