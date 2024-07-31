import { ArrowRight } from 'lucide-react-native'
import { ReactNode } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import constants from '@/constants'

interface HomeRootProps {
  children: ReactNode
  title: string
  withoutPlus?: boolean
}

export default function HomeRoot({
  children,
  title,
  withoutPlus,
}: HomeRootProps) {
  return (
    <View className="mt-4">
      <View className="px-4 flex flex-row justify-between mb-4">
        <View className="flex flex-row items-center gap-2">
          <Text className="font-poppins-bold text-lg">{title}</Text>
        </View>
        {!withoutPlus && (
          <TouchableOpacity className="flex flex-row justify-center items-center gap-2">
            <Text className="font-poppins-medium text-primary">Ver mais</Text>
            <ArrowRight color={constants.colors.primary} size={20} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  )
}
