import {
  TouchableOpacityProps,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native'
import { twMerge } from 'tailwind-merge'

interface IButton extends TouchableOpacityProps {
  title: string
  loading?: boolean
  onPress: () => void
}

export default function Button({
  title,
  onPress,
  loading,
  className,
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
        <ActivityIndicator size={25} color="#fff" />
      ) : (
        <Text className="text-white font-poppins-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  )
}
