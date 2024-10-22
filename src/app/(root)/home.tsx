import clsx from 'clsx'
import { Link, useRouter } from 'expo-router'
import _ from 'lodash'
import { SearchIcon } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Text,
  RefreshControl,
  StatusBar,
} from 'react-native'

import { IResidence } from '@/@types'
import HomeCard from '@/components/HomeCard'
import IconButton from '@/components/IconButton'
import Filter from '@/components/ResidenceFilterButton'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useNotificationStore } from '@/store/NotificationStore'

export default function House() {
  const [refreshing, setRefreshing] = useState(false)

  const [topResidences, setTopResidences] = useState<IResidence[]>()
  const [recentResidences, setRecentResidences] = useState<IResidence[]>()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const { data: top, error } = await supabase.rpc('get_popular_residences')
      if (error) console.error('Error fetching data:', error)

      setTopResidences(top)

      const recent = await residenceRepository.findRecent()
      setRecentResidences(recent)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [residenceRepository])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchData() // Fetch data on refresh
    setRefreshing(false)
  }, [fetchData])

  useEffect(() => {
    fetchData() // Fetch data on component mount
  }, [fetchData])

  const notifications = useNotificationStore((state) => state.notifications)

  return (
    <ScrollView
      className="bg-white h-full"
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
            data={topResidences} // Use fetched residences here
            className="w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <HomeCard.Card {...item} type="big" />}
            keyExtractor={(item) => item.id} // Use unique id as key
          />
        </HomeCard.Root>

        <HomeCard.Root title="Próximas de mim">
          <Filter paddingHorizontal={16} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={_.shuffle(recentResidences)}
            className="mt-5 w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <HomeCard.Card {...item} type="small" />}
            keyExtractor={(item) => item.id}
          />
        </HomeCard.Root>

        <HomeCard.Root title="Postadas recentemente">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recentResidences}
            className="w-full flex flex-row"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <HomeCard.Card {...item} type="small" />}
            keyExtractor={(item) => item.id}
          />
        </HomeCard.Root>
      </View>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </ScrollView>
  )
}
