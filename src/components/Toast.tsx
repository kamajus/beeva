import { Text, Dimensions, TouchableOpacity } from 'react-native'

interface IToast {
  description: string
}

export default function Toast({ description }: IToast) {
  const { width } = Dimensions.get('window')
  const finalWidth = width - width * 0.06

  return (
    <TouchableOpacity
      style={{ width: finalWidth }}
      className="bg-black flex items-center justify-center min-h-[60px] rounded-xl">
      <Text className="text-white font-poppins-regular">{description}</Text>
    </TouchableOpacity>
  )
}
