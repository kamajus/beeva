import { View } from 'react-native'

import Header from '@/components/Header'

export default function Wishes() {
  return (
    <View className="relative bg-white">
      <View className="absolute">
        <Header.Normal showIcon={false} title="Lista de dejesos" />
      </View>
    </View>
  )
}
