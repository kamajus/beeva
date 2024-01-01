import ExpoConstants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import { RESIDENCE_DATA } from '../../assets/data';
import Header from '../../components/Header';

interface GaleryItemProps {
  id: number | undefined;
  image: ImageSourcePropType;
  activeted: boolean;
}

function GaleryItem({ activeted, id, image }: GaleryItemProps) {
  const [selected, setSelected] = useState(false);

  function handlePress() {
    if (activeted) {
      setSelected(!selected);
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} key={id} className="relative mr-3 mt-3 h-28 w-28">
      <Image source={image} className="h-full w-full" />
      <IconButton
        icon={selected ? 'radiobox-marked' : 'radiobox-blank'}
        mode="outlined"
        iconColor={selected ? '#8b6cef' : '#fff'}
        style={{ display: activeted ? 'flex' : 'none' }}
        className="absolute top-[-5px] left-[-5px]"
      />
    </TouchableOpacity>
  );
}

export default function Favorites() {
  const router = useRouter();

  const { height } = Dimensions.get('screen');
  const [activeted, SetActived] = useState(false);

  return (
    <View style={{ height }} className="relative bg-white">
      <ScrollView style={{ padding: 16, marginTop: ExpoConstants.statusBarHeight * 2 + 25 }}>
        <Text className="text-black font-medium">
          Salva as residências que mais curtiste para ver mais tarde ou para partilhar com alguém.{' '}
        </Text>
        <View className="flex-1 flex-row flex-wrap">
          {RESIDENCE_DATA.map(({ image, id }) => (
            <GaleryItem image={image} id={id} key={id} activeted={activeted} />
          ))}
        </View>

        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>
      <View className="absolute">
        <Header.Normal title="Meus favoritos" goBack={router.back} />
      </View>
    </View>
  );
}
