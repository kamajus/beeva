import { View, Text } from 'react-native';

interface TextFieldLabelProps {
  children: string;
  isRequired?: boolean;
}

export default function TextFieldLabel(props: TextFieldLabelProps) {
  return (
    <View className="flex-row mb-1 items-center gap-1">
      <Text className="text-base mb-1 font-medium">{props.children}</Text>
      <Text className="text-base mb-1 font-medium text-red-500">{props.isRequired && '*'}</Text>
    </View>
  );
}
