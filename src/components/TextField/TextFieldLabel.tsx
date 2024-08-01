import { StyleProp, View, Text, TextStyle, TextProps } from 'react-native'

interface ITextFieldLabel extends TextProps {
  isRequired?: boolean
  textStyle?: StyleProp<TextStyle>
}

export default function TextFieldLabel(props: ITextFieldLabel) {
  return (
    <View className="flex-row mb-1 items-center gap-1" style={props.style}>
      <Text
        className="font-poppins-medium text-base mb-1"
        style={props.textStyle}>
        {props.children}
      </Text>
      <Text className="font-poppins-medium text-base mb-1 text-red-500">
        {props.isRequired && '*'}
      </Text>
    </View>
  )
}
