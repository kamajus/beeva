import { ActivityIndicator, View } from 'react-native'

import constants from '@/constants'

export default function LoadScreen() {
  return (
    <View className="bg-white w-full h-full flex justify-center items-center">
      <ActivityIndicator animating color={constants.colors.primary} size={40} />
    </View>
  )
}
