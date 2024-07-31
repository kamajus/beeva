import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SheetManager, SheetProvider } from 'react-native-actions-sheet'

import NoWishe from '@/assets/images/no-wishe'
import Button from '@/components/Button'
import Header from '@/components/Header'
import LoadScreen from '@/components/LoadScreen'
import constants from '@/constants'
import { useSupabase } from '@/hooks/useSupabase'
import { WisheRepository } from '@/repositories/wishe.repository'
import { useWisheStore } from '@/store/WisheStore'

export default function Wishes() {
  const wishlist = useWisheStore((state) => state.wishlist)
  const addToWishList = useWisheStore((state) => state.addToWishList)

  const wisheRepository = useMemo(() => new WisheRepository(), [])

  const { user } = useSupabase()
  const { height } = Dimensions.get('screen')
  const [refreshing, setRefreshing] = useState(false)

  const [loading, setLoading] = useState(false)

  const getWishList = useCallback(async () => {
    const data = await wisheRepository.findByUserId(user.id)

    if (data) {
      for (const item of data) {
        addToWishList(item)
      }
    }
  }, [addToWishList, user, wisheRepository])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLoading(true)
      ;(async function () {
        await getWishList().finally(() => {
          setLoading(false)
        })
      })()
    }, 1000)
  }, [getWishList])

  useEffect(() => {
    setLoading(true)
    ;(async function () {
      await getWishList().finally(() => {
        setLoading(false)
      })
    })()
  }, [getWishList])

  return (
    <SheetProvider>
      <View className="relative bg-white">
        <View className="absolute">
          <Header.Normal showIcon={false} title="Lista de desejos" />
        </View>

        {!loading ? (
          <ScrollView
            style={{ padding: 16, marginTop: constants.customHeaderDistance }}
            className="bg-white h-full"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Button
              className="absolute right-2 top-[75%] rounded-full h-14 w-14"
              labelStyle={{
                fontSize: 20,
              }}
              onPress={() => {
                SheetManager.show('create-wishe-sheet')
              }}
              title="+"
            />
            <View className="mt-2 flex-1 flex-row flex-wrap">
              {wishlist.length > 0 ? (
                wishlist.map(({ id }) => (
                  <View key={id} className="mr-3 mt-3" />
                ))
              ) : (
                <View
                  style={{
                    height: height - 74 - constants.customHeaderDistance,
                  }}
                  className="w-full flex-1 flex items-center justify-center">
                  <View className="flex items-center justify-center">
                    <NoWishe />
                    <Text className="font-poppins-medium text-gray-400 text-center">
                      Nenhum item na lista de desejos.
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
    </SheetProvider>
  )
}
