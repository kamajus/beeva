import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import IconFeather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

import { useCache } from '../../hooks/useCache';
import { useSupabase } from '../../hooks/useSupabase';

interface CarouselHeaderProps {
  residence_id: string;
}

export default function CarouselHeader(props: CarouselHeaderProps) {
  const { setFavoritesResidences, openedResidences, favoritesResidences } = useCache();
  const { residenceIsFavorite, handleFavorite } = useSupabase();
  const { width } = Dimensions.get('window');
  const [favorite, setFavorite] = useState(
    favoritesResidences.some((r) => r.id === props.residence_id),
  );

  const router = useRouter();

  useEffect(() => {
    residenceIsFavorite(props.residence_id).then((data) => {
      setFavorite(data);
    });
  }, []);

  return (
    <View
      style={{ width, marginTop: Constants.statusBarHeight + 20 }}
      className="absolute flex px-4 flex-row justify-between items-center">
      <IconFeather name="arrow-left" color="#fff" size={25} onPress={() => router.back()} />
      <View className="flex gap-x-2 flex-row items-center">
        <IconButton
          icon={favorite ? 'heart' : 'cards-heart-outline'}
          mode="outlined"
          iconColor={favorite ? '#fd6963' : '#fff'}
          containerColor={favorite ? '#fff' : 'transparent'}
          onPress={() => {
            setFavorite(!favorite);
            setFavoritesResidences(
              openedResidences.filter((r) => r.id === props.residence_id && !favorite),
            );
            handleFavorite(props.residence_id, favorite);
          }}
        />
        <Icon name="share-social-outline" size={24} color="#fff" />
      </View>
    </View>
  );
}
