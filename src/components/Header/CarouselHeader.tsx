import Constants from 'expo-constants'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'

import IconButton from '@/components/IconButton'
import constants from '@/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

interface ICarouselHeader {
  owner_id: string
  residence_id: string
}

export default function CarouselHeader(props: ICarouselHeader) {
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { residenceIsFavorite, handleFavorite, user } = useSupabase()
  const { width } = Dimensions.get('window')
  const [favorite, setFavorite] = useState(
    cachedResidences.some(({ residence: r }) => r.id === props.residence_id),
  )

  const router = useRouter()

  useEffect(() => {
    residenceIsFavorite(props.residence_id).then((data) => {
      setFavorite(data)
    })
  }, [props.residence_id, residenceIsFavorite])

  return (
    <View
      style={{ width, marginTop: Constants.statusBarHeight + 20 }}
      className="absolute flex px-4 flex-row justify-between items-center">
      <ArrowLeft color="#ffffff" size={25} onPress={() => router.back()} />

      <View className="flex gap-x-2 flex-row items-center">
        <IconButton
          name="Bookmark"
          color={
            props.owner_id !== user?.id
              ? favorite
                ? constants.colors.primary
                : '#ffffff'
              : '#ffffff'
          }
          fill={
            props.owner_id !== user?.id
              ? favorite
                ? constants.colors.primary
                : 'transparent'
              : 'transparent'
          }
          disabled={props.owner_id === user?.id}
          onPress={() => {
            const favoriteResidence = cachedResidences.find(
              ({ residence: r }) => r.id === props.residence_id,
            )?.residence

            if (favoriteResidence && !favorite) {
              setFavorite(!favorite)
              addToResidences(favoriteResidence, 'favorites')
              handleFavorite(props.residence_id, favorite)
            }
          }}
          className="bg-transparent"
        />

        <IconButton name="Share2" color="#ffffff" className="bg-transparent" />
      </View>
    </View>
  )
}
