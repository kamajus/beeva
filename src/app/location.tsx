import AsyncStorage from '@react-native-async-storage/async-storage'
import { History, MapPin } from 'lucide-react-native'
import { useEffect, useState, useCallback } from 'react'
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native'

import Header from '@/components/Header'
import TouchableBrightness from '@/components/TouchableBrightness'
import { placeApi } from '@/config/axios'

export default function LocationSearch() {
  const [dataSource, setDataSource] = useState<
    {
      origin: 'history' | 'search'
      value: string
    }[]
  >([])

  const [searchQuery, setSearchQuery] = useState('')
  const [historicSearch, setHistoricSearch] = useState<
    {
      origin: 'history'
      value: string
    }[]
  >([])

  const getData = useCallback(async () => {
    await placeApi
      .get(
        `/search?featureType&countrycodes=AO&limit=15&format=json&q=${searchQuery}`,
      )
      .then((res) => {
        const history: {
          origin: 'search'
          value: string
        }[] = []

        for (const value of res.data) {
          history.push({
            origin: 'search',
            value: value.display_name,
          })
        }

        setDataSource(history)
      })
  }, [searchQuery])

  async function getHistoric() {
    const history = await AsyncStorage.getItem('history')

    if (history) {
      const data: {
        origin: 'history'
        value: string
      }[] = []

      for (const value of Array(JSON.parse(history))) {
        for (const i of value) {
          data.push({
            origin: 'history',
            value: i,
          })
        }
      }

      setHistoricSearch(data)
    }
  }

  useEffect(() => {
    getHistoric()
  }, [])

  useEffect(() => {
    if (searchQuery.length > 0) {
      getData()
    }
  }, [getData, searchQuery])

  return (
    <View className="w-full bg-white">
      <Header.Location
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="py-1 h-full">
          {searchQuery.length > 0 &&
            dataSource.map((item, index) => (
              <TouchableBrightness href={`/search/${item.value}`} key={index}>
                <View className="flex flex-row items-center gap-2 py-8 px-4">
                  {item.origin === 'search' ? (
                    <MapPin color="#000000" size={25} />
                  ) : (
                    <History color="#000000" size={25} />
                  )}
                  <Text className="font-poppins-medium text-sm w-[90%]">
                    {item.value.length > 80
                      ? `${item.value.slice(0, 80)}...`
                      : item.value}
                  </Text>
                </View>
              </TouchableBrightness>
            ))}

          {searchQuery.length === 0 &&
            historicSearch.map((item, index) => (
              <TouchableBrightness href={`/search/${item.value}`} key={index}>
                <View className="flex flex-row items-center gap-2 py-8 px-4">
                  <History color="#000000" size={25} />
                  <Text className="font-poppins-medium text-sm w-[90%]">
                    {item.value.length > 80
                      ? `${item.value.slice(0, 80)}...`
                      : item.value}
                  </Text>
                </View>
              </TouchableBrightness>
            ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
