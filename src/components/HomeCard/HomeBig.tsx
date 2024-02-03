import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Residence } from '../../assets/@types';
import useMoneyFormat from '../../hooks/useMoneyFormat';

export default function HomeBig(props: Residence) {
  const [saved, setSaved] = useState(false);
  const money = useMoneyFormat();
  return (
    <Link href={`/residence/${props.id}`}>
      <View className="px-2 py-3 rounded-xl mb-2 mr-2 relative">
        <Image
          source={{ uri: String(props.cover) }}
          alt="Home"
          className="w-[272px] h-[220px] rounded-xl mb-2 relative"
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
            <Icon name="location-pin" color="black" size={19} />
            <Text className="font-poppins-medium text-sm ml-1">{props.location}</Text>
          </View>
          <Text className="font-poppins-semibold text-base">{money.format(props.price)}</Text>
        </View>
      </View>
    </Link>
  );
}
