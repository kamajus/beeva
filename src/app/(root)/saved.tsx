import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'

import NoSaved from '@/assets/images/no-saved'
import GaleryItem from '@/components/GaleryItem'
import Header from '@/components/Header'
import LoadScreen from '@/components/LoadScreen'
import Constants from '@/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { SavedResidenceRepository } from '@/repositories/saved.residence.repository'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function Saved() {
  const savedResidences = useResidenceStore((state) => state.savedResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])
  const savedResidenceRepository = useMemo(
    () => new SavedResidenceRepository(),
    [],
  )

  const { user } = useSupabase()
  const { height } = Dimensions.get('screen')
  const [refreshing, setRefreshing] = useState(false)

  const [loadingSaved, setLoadingSaved] = useState(false)

  const getSavedResidences = useCallback(async () => {
    const savedResidencesData = await savedResidenceRepository.findByUserId(
      user.id,
    )

    if (savedResidencesData) {
      for (const item of savedResidencesData) {
        const saved = await residenceRepository.findById(item.residence_id)
        addToResidences(saved, 'saved')
      }
    }
  }, [savedResidenceRepository, user, residenceRepository, addToResidences])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLoadingSaved(true)
      ;(async function () {
        await getSavedResidences().finally(() => {
          setLoadingSaved(false)
        })
      })()
    }, 1000)
  }, [getSavedResidences])

  useEffect(() => {
    setLoadingSaved(true)
    ;(async function () {
      await getSavedResidences().finally(() => {
        setLoadingSaved(false)
      })
    })()
  }, [getSavedResidences])

  return (
    <View className="relative bg-white">
      <View className="absolute">
        <Header.Normal showIcon={false} title="Guardados por mim" />
      </View>

      {!loadingSaved ? (
        <ScrollView
          style={{ padding: 16, marginTop: Constants.customHeaderDistance }}
          className="bg-white h-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="mt-2 flex-1 flex-row flex-wrap">
            {savedResidences.length > 0 ? (
              savedResidences.map(({ id, cover }) => (
                <View key={id} className="mr-3 mt-3">
                  <GaleryItem
                    image={cover}
                    id={id}
                    key={id}
                    activeted={false}
                  />
                </View>
              ))
            ) : (
              <View
                style={{ height: height - 74 - Constants.customHeaderDistance }}
                className="w-full flex-1 flex items-center justify-center">
                <View className="flex items-center justify-center">
                  <NoSaved />
                  <Text className="font-poppins-medium text-gray-400 text-center">
                    Você não tem nehuma guardada.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <LoadScreen />
      )}
    </View>
  )
}
