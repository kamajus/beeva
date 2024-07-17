import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { IResidence, IFavorite } from '../../assets/@types'
import NoData from '../../assets/images/no-data'
import NoFavorite from '../../assets/images/no-favorite'
import GaleryItem from '../../components/GaleryItem'
import Header from '../../components/Header'
import LoadScreen from '../../components/LoadScreen'
import { supabase } from '../../config/supabase'
import Constants from '../../constants'
import { useSupabase } from '../../hooks/useSupabase'
import { useResidenceStore } from '../../store/ResidenceStore'

export default function Favorites() {
  const userResidences = useResidenceStore((state) => state.userResidences)
  const favoritesResidences = useResidenceStore(
    (state) => state.favoritesResidences,
  )
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { user } = useSupabase()
  const { height } = Dimensions.get('screen')
  const [refreshing, setRefreshing] = useState(false)

  const [loadingResidences, setLoadingResidences] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(false)

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
  }, [user?.id, addToResidences])

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
      setLoadingResidences(true)
      ;(async function () {
        await getResidences()
        await getFavorites()
        setLoadingFavorites(false)
        setLoadingResidences(false)
      })()
    }, 1000)
  }, [getFavorites, getResidences])

  useEffect(() => {
    setLoadingFavorites(true)
    setLoadingResidences(true)
    ;(async function () {
      await getResidences()
      await getFavorites()
      setLoadingFavorites(false)
      setLoadingResidences(false)
    })()
  }, [getFavorites, getResidences])

  return (
    <View style={{ height }} className="relative bg-white">
      {!loadingFavorites || !loadingResidences ? (
        <ScrollView
          style={{ padding: 16, marginTop: Constants.customHeaderDistance }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text className="text-black text-lg font-poppins-semibold">
            Postadas por mim
          </Text>
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
              <View className="w-full flex justify-center items-center">
                <NoData />
                <Text className="font-poppins-medium text-gray-400 text-center">
                  Você não tem nehuma residência!
                </Text>
              </View>
            )}
          </View>
          <Text className="mt-4 text-[#212121] text-lg font-poppins-semibold">
            Guardados por mim
          </Text>
          <View className={clsx('mt-2 flex-1 flex-row flex-wrap')}>
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
              <View className="w-full flex justify-center items-center">
                <NoFavorite />
                <Text className="font-poppins-medium text-gray-400 text-center">
                  Você não tem nehuma guardada.
                </Text>
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
