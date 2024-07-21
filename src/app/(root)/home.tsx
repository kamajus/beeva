import clsx from 'clsx'
import { Link, useRouter } from 'expo-router'
import { SearchIcon } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Text,
  RefreshControl,
  StatusBar,
} from 'react-native'

import { RESIDENCE_DATA } from '@/assets/data'
import Filter from '@/components/ResidenceFilterButton'
import HomeCard from '@/components/HomeCard'
import IconButton from '@/components/IconButton'
import TextField from '@/components/TextField'
import constants from '@/constants'
import { useCache } from '@/hooks/useCache'

export default function House() {
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const { notifications } = useCache()

  return (
    <ScrollView
      className="bg-white"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        style={{ marginTop: constants.customHeaderDistance / 2 }}
        className="mt-[7%] bg-white">
        <View className="p-4">
          <View className="flex flex-row justify-between items-center mb-4">
            <Text className="font-poppins-bold text-2xl">
              Encontre uma acomodação perfeita
            </Text>
            <View className="relative">
              <Link href="/notification" asChild>
                <IconButton name="Bell" color={constants.colors.primary} />
              </Link>
              <View
                className={clsx(
                  'absolute bottom-6 left-6 bg-[#e83f5b] rounded-full flex justify-center items-center w-5 h-5',
                  {
                    hidden:
                      notifications.filter((item) => !item.was_readed)
                        .length === 0,
                  },
                )}>
                <Text
                  className={clsx(
                    'font-poppins-semibold text-[10px] text-center text-white',
                    {
                      hidden:
                        notifications.filter((item) => !item.was_readed)
                          .length >= 10,
                    },
                  )}>
                  {notifications.filter((item) => !item.was_readed).length}
                </Text>
              </View>
            </View>
          </View>

          <TextField.Root>
            <TextField.Container disableFocus>
              <SearchIcon color="#000000" size={25} />
              <TextField.Input
                keyboardType="web-search"
                placeholder="Procurar por casas..."
                onPress={() => {
                  router.navigate('/location')
                }}
              />
            </TextField.Container>
          </TextField.Root>
        </View>

        <HomeCard.Root title="🔥 Em alta">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <HomeCard.Card {...item} cardType="big" />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Talvez você goste">
          <Filter paddingHorizontal={16} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="mt-5 w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <HomeCard.Card {...item} cardType="small" />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Próximas de você">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <HomeCard.Card {...item} cardType="small" />
            )}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Mais visualizadas hoje">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={RESIDENCE_DATA}
            className="w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <HomeCard.Card {...item} cardType="small" />
            )}
          />
        </HomeCard.Root>
      </View>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </ScrollView>
  )
}
