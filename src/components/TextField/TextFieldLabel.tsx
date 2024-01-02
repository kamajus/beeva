import { StyleProp, ViewStyle, View, Text } from 'react-native';

interface TextFieldLabelProps {
  children: string;
  isRequired?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function TextFieldLabel(props: TextFieldLabelProps) {
  return (
    <View className="flex-row mb-1 items-center gap-1" style={props.style}>
      <Text className="font-poppins-medium text-base mb-1">{props.children}</Text>
      <Text className="font-poppins-medium text-base mb-1 text-red-500">
        {props.isRequired && '*'}
      </Text>
    </View>
  );
}
