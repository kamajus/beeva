import {
  TouchableOpacityProps,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextStyle,
} from 'react-native'
import { twMerge } from 'tailwind-merge'

interface IButton extends TouchableOpacityProps {
  title: string
  loading?: boolean
  onPress: () => void
  labelStyle?: TextStyle
}

export default function Button({
  title,
  onPress,
  loading,
  className,
  labelStyle,
  ...props
}: IButton) {
  return (
    <TouchableOpacity
      className={twMerge(
        'h-14 flex justify-center items-center mt-2 bg-primary rounded',
        className,
      )}
      onPress={onPress}
      {...props}>
      {loading ? (
        <ActivityIndicator size={25} color="#ffffff" />
      ) : (
        <Text
          className={twMerge('text-white font-poppins-semibold')}
          style={labelStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}
