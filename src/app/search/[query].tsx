import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { SheetProvider } from 'react-native-actions-sheet'

import { IResidence, IResidenceEnum } from '../../assets/@types'
import NoData from '../../assets/images/no-data'
import Header from '../../components/Header'
import HomeCard from '../../components/HomeCard'
import { supabase } from '../../config/supabase'
import Constants from '../../constants'
import { useCache } from '../../hooks/useCache'

export default function Search() {
  const navigation = useNavigation()
  const { query } = useLocalSearchParams<{ query: string }>()
  const [residences, setResidences] = useState<IResidence[]>()
  const [loading, setLoading] = useState(false)
  const { filter, setFilter } = useCache()

  const addItemToHistory = async (newItem: string) => {
    try {
      // Get the 'history' array from AsyncStorage
      const history = await AsyncStorage.getItem('history')

      // Initialize a new array or use an empty array if 'history' doesn't exist yet
      const historyArray = history ? JSON.parse(history) : []

      // Check if the newItem already exists in the array
      const indexOfItem = historyArray.indexOf(newItem)

      if (indexOfItem === -1) {
        // If the item doesn't exist in the array, add it to the first position
        historyArray.unshift(newItem)

        // Limit the size of the array and remove the last item if necessary
        const maxSize = 10 // Set the desired maximum size
        if (historyArray.length > maxSize) {
          historyArray.pop() // Remove the last item
        }

        // Save the updated array back to AsyncStorage
        await AsyncStorage.setItem('history', JSON.stringify(historyArray))
      } else {
        // If the item already exists, move it to the first position
        historyArray.splice(indexOfItem, 1)
        historyArray.unshift(newItem)

        // Save the updated array back to AsyncStorage
        await AsyncStorage.setItem('history', JSON.stringify(historyArray))
      }
    } catch (error) {
      console.error('Error adding item to history:', error)
    }
  }

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      setFilter({
        kind: 'all',
      })

      navigation.navigate('home') // Error in argument but still working (under review)
    })

    async function fetchData() {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_residences_by_location', {
        place: query,
      })

      if (data) {
        setResidences(filterResidences({ ...filter, residences: data }))
      } else {
        console.log(error)
      }
      setLoading(false)
    }

    fetchData()
    if (query) addItemToHistory(query)
  }, [query, filter, navigation, setFilter])

  function filterResidences({
    kind,
    maxPrice,
    state,
    minPrice,
    residences,
  }: {
    kind?: IResidenceEnum | undefined
    state?: 'sell' | 'rent' | undefined
    minPrice?: number | undefined
    maxPrice?: number | undefined
    residences: IResidence[]
  }) {
    return residences?.filter((residence) => {
      const meetsResidenceType =
        kind && kind !== 'all' ? residence.kind === kind : true
      const meetsSaleType = state ? residence.state === state : true
      const meetsMinPrice = minPrice ? residence.price >= minPrice : true
      const meetsMaxPrice = maxPrice ? residence.price <= maxPrice : true

      return (
        meetsResidenceType && meetsSaleType && meetsMinPrice && meetsMaxPrice
      )
    })
  }

  return (
    <SheetProvider>
      <View className="w-full h-full bg-white ">
        <Header.Search value={query || ''} />

        <View>
          {!loading ? (
            <View>
              {residences && residences.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="bg-white flex flex-col px-4 pt-4">
                  <Text className="font-poppins-semibold text-lg">
                    {residences?.length} resultado(s) encontrado(s)
                  </Text>
                  <View>
                    {residences?.map((residence) => (
                      <HomeCard.Card
                        key={residence.id}
                        {...residence}
                        cardType="search"
                      />
                    ))}
                  </View>

                  <View style={{ marginBottom: 190 }} />
                </ScrollView>
              ) : (
                <View className="w-full h-3/4 flex justify-center items-center">
                  <NoData />
                  <Text className="font-poppins-medium text-gray-400 text-center">
                    Nenhum resultado encontrado!
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View className="h-2/3 flex items-center justify-center">
              <ActivityIndicator
                animating
                color={Constants.colors.primary}
                size={40}
              />
            </View>
          )}
        </View>
      </View>
    </SheetProvider>
  )
}
