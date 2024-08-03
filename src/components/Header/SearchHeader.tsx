import clsx from 'clsx'
import constants from 'expo-constants'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { View } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'

import IconButton from '../IconButton'
import TextField from '../TextField'

import { IResidenceFilterEnum, IResidenceStateEnum } from '@/@types'

interface ISearchHeader {
  value: string
  filter: {
    kind?: IResidenceFilterEnum
    state?: IResidenceStateEnum
    minPrice?: number
    maxPrice?: number
  }
}

export default function SearchHeader({ value, filter }: ISearchHeader) {
  const isFilterDefault =
    JSON.stringify(filter) === JSON.stringify({ kind: 'all' })

  return (
    <View className="border-b-[.5px] border-b-gray-300">
      <View
        style={{ marginTop: constants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container disableFocus>
            <ArrowLeft color="#000000" size={25} onPress={router.back} />
            <TextField.Input
              value={value}
              keyboardType="web-search"
              onFocus={() => router.push('/location')}
            />
          </TextField.Container>
        </TextField.Root>

        <View className="relative">
          <IconButton
            name="SlidersHorizontal"
            size={20}
            onPress={() => SheetManager.show('filter-search-sheet')}
          />
          <View
            className={clsx(
              'absolute bottom-6 left-6 bg-[#e83f5b] rounded-full flex justify-center items-center w-3 h-3',
              {
                hidden: isFilterDefault,
              },
            )}
          />
        </View>
      </View>
    </View>
  )
}
