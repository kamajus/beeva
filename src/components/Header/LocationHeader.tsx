import expoConstants from 'expo-constants'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'

import TextField from '../TextField'

import '@/components/ActionSheet'

interface ILocationHeader {
  setSearchQuery: Dispatch<SetStateAction<string>>
  searchQuery: string
}

export default function LocationHeader({
  setSearchQuery,
  searchQuery,
}: ILocationHeader) {
  return (
    <View>
      <View
        style={{ marginTop: expoConstants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container
            style={{
              borderColor: 'transparent',
            }}
            disableFocus>
            <ArrowLeft color="#000000" size={25} onPress={router.back} />
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
