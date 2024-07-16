import Constants from 'expo-constants'
import { router } from 'expo-router'
import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import TextField from '../TextField'

import '../ActionSheet'

interface LocationHeaderProps {
  setSearchQuery: Dispatch<SetStateAction<string>>
  searchQuery: string
}

export default function LocationHeader({
  setSearchQuery,
  searchQuery,
}: LocationHeaderProps) {
  return (
    <View>
      <View
        style={{ marginTop: Constants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container
            style={{
              borderColor: 'transparent',
            }}
            disableFocus>
            <Icon
              name="arrow-left"
              color="#000"
              size={25}
              onPress={router.back}
            />
            <TextField.Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Qual é a localização?"
              keyboardType="web-search"
              returnKeyType="search"
              autoFocus
            />
          </TextField.Container>
        </TextField.Root>
      </View>
    </View>
  )
}
