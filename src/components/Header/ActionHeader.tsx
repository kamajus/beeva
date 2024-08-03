import expoConstants from 'expo-constants'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Text, View } from 'react-native'

import IconButton from '@/components/IconButton'
import constants from '@/constants'

interface IActionHeader {
  title: string
  onPress?: () => void
  onBackPress?: () => void
  loading?: boolean
}

export default function ActionHeader({
  title,
  onPress,
  onBackPress,
  loading,
}: IActionHeader) {
  return (
    <View
      style={{ top: expoConstants.statusBarHeight }}
      className="w-screen absolute top-8 py-4 px-4 flex gap-x-4 flex-row items-center justify-between bg-white border-b-[.5px] border-b-gray-300">
      <ArrowLeft
        color="#000000"
        size={25}
        onPress={!onBackPress ? router.back : onBackPress}
      />
      <Text className="font-poppins-medium text-base">{title}</Text>
      <IconButton
        name="Check"
        size={20}
        onPress={onPress}
        color={constants.colors.primary}
        loading={loading}
      />
    </View>
  )
}
