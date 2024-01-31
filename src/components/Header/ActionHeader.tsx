import Constants from 'expo-constants';
import { Text, View, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import constants from '../../constants';

interface ActionHeaderProps {
  title: string;
  actionTitle: string;
  goBack: () => void;
  onPress?: () => void;
  loading?: boolean;
}

export default function ActionHeader({
  title,
  actionTitle,
  goBack,
  onPress,
  loading,
}: ActionHeaderProps) {
  return (
    <View
      style={{ top: Constants.statusBarHeight }}
      className="w-full absolute top-8 py-4 px-4 flex gap-x-4 flex-row items-center justify-between bg-white border-b-[.5px] border-b-gray-300">
      <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
      <Text className="font-poppins-medium text-base">{title}</Text>
      {!loading ? (
        <Pressable onPress={onPress}>
          <Text className="font-poppins-medium text-[#8b6cef]">{actionTitle}</Text>
        </Pressable>
      ) : (
        <ActivityIndicator animating color={constants.colors.primary} size={20} />
      )}
    </View>
  );
}
