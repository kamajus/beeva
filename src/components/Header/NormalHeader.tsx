import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface NormalHeaderProps {
  title: string;
  goBack: () => void;
}

export default function NormalHeader({ title, goBack }: NormalHeaderProps) {
  return (
    <View
      style={{ marginTop: Constants.statusBarHeight }}
      className="py-4 px-4 flex gap-x-4 flex-row items-center border-b-[.5px] border-b-gray-300">
      <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
      <Text className="font-medium text-lg">{title}</Text>
    </View>
  );
}
