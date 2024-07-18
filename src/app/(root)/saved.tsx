import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { IFavorite } from '@/assets/@types'
import NoFavorite from '@/assets/images/no-favorite'
import GaleryItem from '@/components/GaleryItem'
import Header from '@/components/Header'
import LoadScreen from '@/components/LoadScreen'
import { supabase } from '@/config/supabase'
import Constants from '@/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function Saved() {
  const favoritesResidences = useResidenceStore(
    (state) => state.favoritesResidences,
  )
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { user } = useSupabase()
  const { height } = Dimensions.get('screen')
  const [refreshing, setRefreshing] = useState(false)

  const [loadingFavorites, setLoadingFavorites] = useState(false)

  const getFavorites = useCallback(async () => {
    const { data: favoritesData } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user?.id)
      .returns<IFavorite[]>()

    if (favoritesData) {
      favoritesData.map(async (item) => {
        const { data: favorite } = await supabase
          .from('residences')
          .select('*')
          .eq('id', item.residence_id)
          .single()

        addToResidences(favorite, 'favorites')
      })
    }
  }, [user?.id, addToResidences])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLoadingFavorites(true)
      ;(async function () {
        await getFavorites()
        setLoadingFavorites(false)
      })()
    }, 1000)
  }, [getFavorites])

  useEffect(() => {
    setLoadingFavorites(true)
    ;(async function () {
      await getFavorites()
      setLoadingFavorites(false)
    })()
  }, [getFavorites])

  return (
    <View className="relative bg-white">
      <View className="absolute">
        <Header.Normal showIcon={false} title="Guardados por mim" />
      </View>

      {!loadingFavorites ? (
        <ScrollView
          style={{ padding: 16, marginTop: Constants.customHeaderDistance }}
          className="bg-white h-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="mt-2 flex-1 flex-row flex-wrap">
            {favoritesResidences.length > 0 ? (
              favoritesResidences.map(({ id, cover }) => (
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
                  <NoFavorite />
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
