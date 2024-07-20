import ExpoConstants from 'expo-constants'
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
  const residenceSavedStatus = useResidenceStore(
    (state) => state.residenceSavedStatus,
  )

  const { handleSaveResidence, user } = useSupabase()
  const { width } = Dimensions.get('window')

  const residence = cachedResidences.find(
    ({ residence }) => residence.id === props.residence_id,
  )
    ? cachedResidences.find(
        ({ residence }) => residence.id === props.residence_id,
      ).residence
    : null
  const [savedResidence, setSavedResidence] = useState(false)

  const router = useRouter()

  useEffect(() => {
    async function checkSaved() {
      if (residence?.id) {
        const isSaved = await residenceSavedStatus(residence.id, user)
        setSavedResidence(isSaved)
      }
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residence, user])

  return (
    <View
      style={{ width, marginTop: ExpoConstants.statusBarHeight + 20 }}
      className="absolute flex px-4 flex-row justify-between items-center">
      <ArrowLeft color="#ffffff" size={25} onPress={() => router.back()} />

      <View className="flex gap-x-2 flex-row items-center">
        <IconButton
          name="Bookmark"
          color={
            props.owner_id !== user?.id
              ? savedResidence
                ? constants.colors.primary
                : '#ffffff'
              : '#ffffff'
          }
          fill={
            props.owner_id !== user?.id
              ? savedResidence
                ? constants.colors.primary
                : 'transparent'
              : 'transparent'
          }
          disabled={props.owner_id === user.id}
          onPress={() => {
            async function handleSavingResidence() {
              setSavedResidence(!savedResidence)
              await handleSaveResidence(residence, !savedResidence)
            }

            handleSavingResidence()
          }}
          className="bg-transparent"
        />

        <IconButton name="Share2" color="#ffffff" className="bg-transparent" />
      </View>
    </View>
  )
}
