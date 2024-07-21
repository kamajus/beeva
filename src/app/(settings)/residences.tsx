import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'

import NoData from '@/assets/images/no-data'
import GaleryItem from '@/components/GaleryItem'
import Header from '@/components/Header'
import LoadScreen from '@/components/LoadScreen'
import Constants from '@/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function Residences() {
  const userResidences = useResidenceStore((state) => state.userResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { user } = useSupabase()
  const { height } = Dimensions.get('screen')
  const [refreshing, setRefreshing] = useState(false)

  const [loadingResidences, setLoadingResidences] = useState(false)

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])

  const getResidences = useCallback(async () => {
    const residencesData = await residenceRepository.findByOwnerId(user.id)

    if (residencesData) {
      for (const residence of residencesData) {
        addToResidences(residence, 'user')
      }
    }
  }, [residenceRepository, user, addToResidences])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLoadingResidences(true)
      ;(async function () {
        await getResidences()
        setLoadingResidences(false)
      })()
    }, 1000)
  }, [getResidences])

  useEffect(() => {
    if (userResidences.length < 0) {
      setLoadingResidences(true)
      ;(async function () {
        await getResidences()
        setLoadingResidences(false)
      })()
    }
  }, [getResidences, userResidences.length])

  return (
    <View style={{ height }} className="relative bg-white">
      {!loadingResidences ? (
        <ScrollView
          style={{ padding: 16, marginTop: Constants.customHeaderDistance }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="mt-2 flex-1 flex-row flex-wrap">
            {userResidences.length > 0 ? (
              userResidences.map(({ id, cover }) => (
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
                  <NoData />
                  <Text className="font-poppins-medium text-gray-400 text-center">
                    Você não tem nehuma residência.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <LoadScreen />
      )}

      <View className="absolute">
        <Header.Normal title="Minhas residências" />
      </View>
    </View>
  )
}
