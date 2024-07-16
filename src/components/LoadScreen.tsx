import { ActivityIndicator, View } from 'react-native'

import Constants from '../constants'

export default function LoadScreen() {
  return (
    <View className="bg-white w-full h-full flex justify-center items-center">
      <ActivityIndicator animating color={Constants.colors.primary} size={40} />
    </View>
  )
}
