import Constants from 'expo-constants';
import { Text, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ActionHeaderProps {
  title: string;
  actionTitle: string;
  goBack: () => void;
  onPress?: () => void;
}

export default function ActionHeader({ title, actionTitle, goBack, onPress }: ActionHeaderProps) {
  const { width } = Dimensions.get('screen');

  return (
    <View
      style={{ top: Constants.statusBarHeight, width }}
      className="absolute top-8 py-4 px-4 flex gap-x-4 flex-row items-center justify-between bg-white border-b-[.5px] border-b-gray-300">
      <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
      <Text className="font-poppins-medium text-base">{title}</Text>
      <Text className="font-poppins-medium text-[#8b6cef]" onPress={onPress}>
        {actionTitle}
      </Text>
    </View>
  );
}
