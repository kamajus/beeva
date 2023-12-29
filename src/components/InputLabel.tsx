import { View, Text } from 'react-native';

interface InputLabelProps {
  children: string;
  isRequired?: boolean;
}

export default function InputLabel(props: InputLabelProps) {
  return (
    <View className="flex-row mb-4 items-center gap-1">
      <Text className="text-sm font-body">{props.children}</Text>
      <Text className="text-red-500 font-body">{props.isRequired && '*'}</Text>
    </View>
  );
}
