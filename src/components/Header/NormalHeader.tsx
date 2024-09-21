import expoConstants from 'expo-constants'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Dimensions, Text, View } from 'react-native'

interface INormalHeader {
  title: string
  showIcon?: boolean
}

export default function NormalHeader({
  title,
  showIcon = true,
}: INormalHeader) {
  const { width } = Dimensions.get('screen')
  const { back } = useRouter()

  return (
    <View
      style={{ marginTop: expoConstants.statusBarHeight, width }}
      className="bg-white py-4 px-4 flex gap-x-4 flex-row items-center border-b-[.5px] border-b-gray-300">
      {showIcon && <ArrowLeft color="#000000" size={25} onPress={back} />}
      <Text className="font-poppins-semibold text-xl">{title}</Text>
    </View>
  )
}
