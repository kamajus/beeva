import Constants from 'expo-constants'
import { router } from 'expo-router'
import { View } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import Icon from 'react-native-vector-icons/Feather'

import '../ActionSheet'
import IconButton from '../IconButton'
import TextField from '../TextField'

interface SearchHeaderProps {
  value: string
}

export default function SearchHeader({ value }: SearchHeaderProps) {
  return (
    <View className="border-b-[.5px] border-b-gray-300">
      <View
        style={{ marginTop: Constants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container disableFocus>
            <Icon
              name="arrow-left"
              color="#000"
              size={25}
              onPress={router.back}
            />
            <TextField.Input
              value={value}
              keyboardType="web-search"
              onFocus={() => router.push('/location')}
              placeholder="Diga a localização"
            />
          </TextField.Container>
        </TextField.Root>

        <IconButton
          name="SlidersHorizontal"
          size={20}
          onPress={() => SheetManager.show('search-sheet')}
        />
      </View>
    </View>
  )
}
