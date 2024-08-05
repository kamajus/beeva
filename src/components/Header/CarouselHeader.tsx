import expoConstants from 'expo-constants'
import { useRouter } from 'expo-router'
import { View, Dimensions } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'

import IconButton from '@/components/IconButton'
import { useOpenedResidenceStore } from '@/store/OpenedResidenceStore'

interface ICarouselHeader {
  owner_id: string
  residence_id: string
}

export default function CarouselHeader(props: ICarouselHeader) {
  const openedResidences = useOpenedResidenceStore((state) => state.residences)

  const { width } = Dimensions.get('window')

  const residence = openedResidences.find(
    ({ residence }) => residence.id === props.residence_id,
  )?.residence

  const router = useRouter()

  return (
    <View
      style={{ width, marginTop: expoConstants.statusBarHeight + 20 }}
      className="absolute flex px-4 flex-row justify-between items-center">
      <IconButton
        name="ArrowLeft"
        color="#000000"
        size={25}
        onPress={() => router.back()}
      />

      <View className="flex gap-x-2 flex-row items-center">
        <IconButton
          name="EllipsisVertical"
          color="#000000"
          onPress={() => {
            SheetManager.show('residence-menu-sheet', {
              payload: { residence },
            })
          }}
        />
      </View>
    </View>
  )
}
