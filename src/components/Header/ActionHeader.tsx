import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import constants from '../../constants';

interface ActionHeaderProps {
  title: string;
  goBack: () => void;
  onPress?: () => void;
  loading?: boolean;
}

export default function ActionHeader({ title, goBack, onPress, loading }: ActionHeaderProps) {
  return (
    <View
      style={{ top: Constants.statusBarHeight }}
      className="w-screen absolute top-8 py-4 px-4 flex gap-x-4 flex-row items-center justify-between bg-white border-b-[.5px] border-b-gray-300">
      <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
      <Text className="font-poppins-medium text-base">{title}</Text>
      {!loading ? (
        <IconButton mode="outlined" icon="check" iconColor="#000" size={20} onPress={onPress} />
      ) : (
        <ActivityIndicator animating color={constants.colors.primary} size={20} />
      )}
    </View>
  );
}
