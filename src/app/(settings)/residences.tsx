import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { IResidence } from '@/assets/@types'
import NoData from '@/assets/images/no-data'
import GaleryItem from '@/components/GaleryItem'
import Header from '@/components/Header'
import LoadScreen from '@/components/LoadScreen'
import { supabase } from '@/config/supabase'
import Constants from '@/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function Residences() {
  const userResidences = useResidenceStore((state) => state.userResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { user } = useSupabase()
  const { height } = Dimensions.get('screen')
  const [refreshing, setRefreshing] = useState(false)

  const [loadingResidences, setLoadingResidences] = useState(false)

  const getResidences = useCallback(async () => {
    const { data: residencesData } = await supabase
      .from('residences')
      .select('*')
      .eq('owner_id', user?.id)
      .returns<IResidence[]>()

    if (residencesData) {
      residencesData.map((residence) => {
        addToResidences(residence, 'user')
        return residence
      })
    }
  }, [user, addToResidences])

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
    setLoadingResidences(true)
    ;(async function () {
      await getResidences()
      setLoadingResidences(false)
    })()
  }, [getResidences])

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
