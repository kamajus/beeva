import clsx from 'clsx'
import { Link } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  View,
  ScrollView,
  FlatList,
  Text,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native'
import { Searchbar } from 'react-native-paper'

import { RESIDENCE_DATA } from '../../assets/data'
import Filter from '../../components/Filter'
import HomeCard from '../../components/HomeCard'
import IconButton from '../../components/IconButton'
import constants from '../../constants'
import { useCache } from '../../hooks/useCache'

export default function House() {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const { width } = Dimensions.get('window')
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

          <Link href="/location">
            <Searchbar
              style={{
                shadowColor: 'transparent',
                backgroundColor: constants.colors.input,
                flex: 1,
                width: width - 32, // Total screen width minus horizontal margin
              }}
              inputStyle={{
                height: 58,
                fontSize: 15,
                alignSelf: 'stretch',
                fontFamily: 'poppins-medium',
              }}
              placeholder="Procurar por casas..."
              value=""
              editable={false}
            />
          </Link>
        </View>

        <HomeCard.Root title="Em alta" icon="fire" iconColor="#E25822">
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
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  )
}
