import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Residence } from '../../assets/@types';
import useMoneyFormat from '../../hooks/useMoneyFormat';

export default function HomeSmall(props: Residence) {
  const [saved, setSaved] = useState(false);
  const money = useMoneyFormat();

  return (
    <Link
      href={{
        pathname: '/residence/[id]',
        params: { id: '6998358e-23cd-4c08-9276-2bec1c240030' },
      }}>
      <View className="px-2 py-3 rounded-xl mb-2 mr-2 relative">
        <Image
          source={{ uri: String(props.cover) }}
          alt="Home"
          className="w-[172px] h-[190px] rounded-xl mb-2 relative"
        />
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          mode="outlined"
          iconColor={saved ? '#fd6963' : '#000'}
          containerColor="#fff"
          className="absolute top-3 right-2"
          onPress={() => setSaved(!saved)}
        />

        <View className="w-full gap-1">
          <View className="flex flex-row items-center">
            <Icon name="location-pin" color="black" size={18} />
            <Text className="font-poppins-medium text-xs ml-1">{props.location}</Text>
          </View>
          <Text className="font-poppins-semibold text-sm">{money.format(props.price)}</Text>
        </View>
      </View>
    </Link>
  );
}
