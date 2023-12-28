import Constants from 'expo-constants';
import { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import IconFeather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

interface CarouselHeaderProps {
  goBack: () => void;
}

export default function CarouselHeader({ goBack }: CarouselHeaderProps) {
  const { width } = Dimensions.get('window');
  const [saved, setSaved] = useState(false);

  return (
    <View
      style={{ width, marginTop: Constants.statusBarHeight + 20 }}
      className="absolute flex px-4 flex-row justify-between items-center">
      <IconFeather name="arrow-left" color="#000" size={25} onPress={goBack} />
      <View className="flex gap-x-2 flex-row items-center">
        <IconButton
          icon={saved ? 'heart' : 'cards-heart-outline'}
          mode="outlined"
          iconColor={saved ? '#8b6cef' : '#000'}
          containerColor={saved ? '#fff' : 'transparent'}
          onPress={() => setSaved(!saved)}
        />
        <Icon name="share-social-outline" size={24} />
      </View>
    </View>
  );
}
