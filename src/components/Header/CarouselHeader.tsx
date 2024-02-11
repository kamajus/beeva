import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import IconFeather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

import { useSupabase } from '../../hooks/useSupabase';
import { useResidenceStore } from '../../store/ResidenceStore';

interface CarouselHeaderProps {
  owner_id: string;
  residence_id: string;
}

export default function CarouselHeader(props: CarouselHeaderProps) {
  const cachedResidences = useResidenceStore((state) => state.cachedResidences);
  const addToResidences = useResidenceStore((state) => state.addToResidences);

  const { residenceIsFavorite, handleFavorite, user } = useSupabase();
  const { width } = Dimensions.get('window');
  const [favorite, setFavorite] = useState(
    cachedResidences.some(({ residence: r }) => r.id === props.residence_id),
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
          icon={
            props.owner_id !== user?.id
              ? favorite
                ? 'bookmark'
                : 'bookmark-outline'
              : 'bookmark-outline'
          }
          mode="outlined"
          iconColor={props.owner_id !== user?.id ? (favorite ? '#fd6963' : '#fff') : '#fff'}
          containerColor={
            props.owner_id !== user?.id ? (favorite ? '#fff' : 'transparent') : 'transparent'
          }
          disabled={props.owner_id === user?.id}
          onPress={() => {
            const favoriteResidence = cachedResidences.find(
              ({ residence: r }) => r.id === props.residence_id,
            )?.residence;

            if (favoriteResidence && !favorite) {
              setFavorite(!favorite);
              addToResidences(favoriteResidence, 'favorites');
              handleFavorite(props.residence_id, favorite);
            }
          }}
        />
        <Icon name="share-social-outline" size={24} color="#fff" />
      </View>
    </View>
  );
}
