import AsyncStorage from '@react-native-async-storage/async-storage'
import debounce from 'lodash.debounce'
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = useCallback(
    debounce(async (query: string) => {
      if (query.length > 0) {
        try {
          const response = await placeApi.get(
            `/search?featureType&countrycodes=AO&limit=15&format=json&q=${query}`,
          )
          const results = response.data.map(
            (item: { display_name: string }) => ({
              origin: 'search',
              value: item.display_name,
            }),
          )
          setDataSource(results)
        } catch {
          setDataSource([])
        }
      } else {
        setDataSource([])
      }
    }, 300), // Ajuste o tempo de debounce conforme necessário
    [],
  )

  async function getHistoric() {
    const history = await AsyncStorage.getItem('history')
    if (history) {
      const data: {
        origin: 'history'
        value: string
      }[] = JSON.parse(history)
        .flat()
        .map((item: string) => ({
          origin: 'history',
          value: item,
        }))
      setHistoricSearch(data)
    }
  }

  useEffect(() => {
    getHistoric()
  }, [])

  useEffect(() => {
    fetchData(searchQuery)
  }, [fetchData, searchQuery])

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
