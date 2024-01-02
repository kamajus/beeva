import Constants from 'expo-constants';
import { Dimensions, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface NormalHeaderProps {
  title: string;
  goBack: () => void;
  styles?: string;
}

export default function NormalHeader({ title, styles, goBack }: NormalHeaderProps) {
  const { width } = Dimensions.get('screen');

  return (
    <View
      style={{ marginTop: Constants.statusBarHeight, width }}
      className={
        'bg-white py-4 px-4 flex gap-x-4 flex-row items-center border-b-[.5px] border-b-gray-300 ' +
        styles
      }>
      <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
      <Text className="font-poppins-medium text-lg">{title}</Text>
    </View>
  );
}
