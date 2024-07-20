import expoConstants from 'expo-constants'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'

import IconButton from '@/components/IconButton'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

interface ICarouselHeader {
  owner_id: string
  residence_id: string
}

export default function CarouselHeader(props: ICarouselHeader) {
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const savedResidences = useResidenceStore((state) => state.savedResidences)
  const residenceSavedStatus = useResidenceStore(
    (state) => state.residenceSavedStatus,
  )

  const { saveResidence, user } = useSupabase()
  const [saved, setSaved] = useState(false)

  const { width } = Dimensions.get('window')

  const residence = cachedResidences.find(
    ({ residence }) => residence.id === props.residence_id,
  )?.residence

  const router = useRouter()

  useEffect(() => {
    async function checkSaved() {
      if (residence) {
        const isSaved = await residenceSavedStatus(residence.id, user)
        setSaved(isSaved)
      }
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residence, savedResidences, user])

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
          name="Bookmark"
          color="#000000"
          fill={
            props.owner_id !== user.id
              ? saved
                ? '#000000'
                : 'transparent'
              : 'transparent'
          }
          disabled={props.owner_id === user.id}
          onPress={() => {
            async function handleSaveResidence() {
              setSaved(!saved)
              await saveResidence(residence, !saved)
            }

            handleSaveResidence()
          }}
        />

        <IconButton name="Share" color="#000000" />
      </View>
    </View>
  )
}
