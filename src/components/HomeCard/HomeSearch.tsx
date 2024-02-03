import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Residence } from '../../assets/@types';
import { useCache } from '../../hooks/useCache';
import useMoneyFormat from '../../hooks/useMoneyFormat';
import { useSupabase } from '../../hooks/useSupabase';

export default function HomeSearch(props: Residence) {
  const { setFavoritesResidences, openedResidences, favoritesResidences } = useCache();
  const { residenceIsFavorite, handleFavorite, user } = useSupabase();
  const [favorite, setFavorite] = useState(favoritesResidences.some((r) => r.id === props.id));
  const money = useMoneyFormat();

  useEffect(() => {
    residenceIsFavorite(props.id).then((data) => {
      setFavorite(data);
    });
  }, []);

  return (
    <View className="mt-5">
      <Pressable onPress={() => router.push(`/residence/${props.id}`)}>
        <Image
          source={{ uri: String(props.cover) }}
          alt="Home"
          className="w-full h-[300px] rounded-xl mb-2 relative"
        />
      </Pressable>

      <View className="w-full gap-1 mt-2">
        <View className="flex flex-row items-center">
          <Icon name="location-pin" color="black" size={19} />
          <Text className="font-poppins-medium text-sm ml-1">{props.location}</Text>
        </View>
        <Text className="font-poppins-semibold text-base">{money.format(props.price)}</Text>
      </View>

      <IconButton
        icon={favorite ? 'bookmark' : 'bookmark-outline'}
        mode="outlined"
        iconColor={favorite ? '#fd6963' : '#000'}
        disabled={props.owner_id === user?.id}
        containerColor="#fff"
        className="absolute top-2 right-2"
        onPress={() => {
          setFavorite(!favorite);
          setFavoritesResidences(openedResidences.filter((r) => r.id === props.id && !favorite));
          handleFavorite(props.id, favorite);
        }}
      />
    </View>
  );
}
