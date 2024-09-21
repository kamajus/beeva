import { Text, Dimensions, Pressable } from 'react-native'

import constants from '@/constants'

interface IToast {
  description: string
}

export default function Toast({ description }: IToast) {
  const { width } = Dimensions.get('window')
  const finalWidth = width - width * 0.06

  return (
    <Pressable
      style={{
        width: finalWidth,
        top: constants.customHeaderDistance - 50,
        left: '50%', // Centraliza horizontalmente
        transform: [{ translateX: -(finalWidth / 2) }],
      }}
      className="absolute bg-black flex px-2 justify-center min-h-[60px] rounded-xl">
      <Text className="text-white font-poppins-medium">{description}</Text>
    </Pressable>
  )
}
