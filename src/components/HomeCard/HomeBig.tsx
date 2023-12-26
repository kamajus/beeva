import clsx from 'clsx';
import React, { useState } from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HomeProps {
  id?: number;
  image: ImageSourcePropType;
  location: string;
  price: number;
  status: 'sell' | 'rent';
  type?: string;
  description?: string;
}

export default function HomeBig({ id, image, location, price, status }: HomeProps) {
  const [saved, setSaved] = useState(false);

  const euro = Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <View className="px-2 py-3 rounded-xl mb-2 mr-2 relative">
      <Image source={image} alt="Home" className="w-[272px] h-[220px] rounded-xl mb-2 relative" />
      <IconButton
        icon={saved ? 'heart' : 'cards-heart-outline'}
        mode="outlined"
        iconColor={saved ? '#8b6cef' : '#000'}
        containerColor="#fff"
        className="absolute top-3 right-2"
        onPress={() => setSaved(!saved)}
      />

      <View className="w-full gap-1">
        <View className="flex flex-row items-center">
          <Icon name="room" size={19} color="#fbb13c" />
          <Text className="font-medium text-sm ml-1">{location}</Text>
        </View>
        <Text className="text-base font-semibold">{euro.format(price)}</Text>
      </View>

      <Text
        className={clsx(
          'text-sm font-medium text-white bg-[#6c80efb7] rounded-full px-6 py-2 absolute top-[186px] right-4',
          {
            hidden: status === 'sell',
          },
        )}>
        /mês
      </Text>
    </View>
  );
}
