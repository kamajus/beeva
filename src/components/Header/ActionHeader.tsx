import ExpoConstants from 'expo-constants';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import Constants from '../../constants';

interface ActionHeaderProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
}

export default function ActionHeader({ title, onPress, loading }: ActionHeaderProps) {
  return (
    <View
      style={{ top: ExpoConstants.statusBarHeight }}
      className="w-screen absolute top-8 py-4 px-4 flex gap-x-4 flex-row items-center justify-between bg-white border-b-[.5px] border-b-gray-300">
      <Icon name="arrow-left" color="#000" size={25} onPress={router.back} />
      <Text className="font-poppins-medium text-base">{title}</Text>

      <IconButton
        loading={loading}
        mode="outlined"
        icon="check"
        iconColor={Constants.colors.primary}
        size={20}
        onPress={onPress}
      />
    </View>
  );
}
