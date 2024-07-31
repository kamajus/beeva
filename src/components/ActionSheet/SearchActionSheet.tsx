import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet'
import CurrencyInput from 'react-native-currency-input'

import RadioButton from '../RadioButton'

import { IResidenceFilterEnum, IResidenceStateEnum } from '@/assets/@types'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import ResidenceFilterButton from '@/components/ResidenceFilterButton'
import TextField from '@/components/TextField'
import Constants from '@/constants'
import { useCache } from '@/hooks/useCache'

export default function SearchActionSheet(props: SheetProps) {
  const { filter, setFilter } = useCache()

  const [kind, setKind] = useState<IResidenceFilterEnum>(
    filter.kind ? filter.kind : 'all',
  )
  const [state, setState] = useState<IResidenceStateEnum | undefined>(
    filter.state,
  )
  const [minPrice, setMinPrice] = useState<number | undefined>(
    filter.minPrice ? filter.minPrice : undefined,
  )
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    filter.maxPrice ? filter.maxPrice : undefined,
  )

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 border-b border-b-gray-300">
          <IconButton
            name="X"
            size={20}
            onPress={() => SheetManager.hide('search-sheet')}
          />
          <Text className="font-poppins-semibold text-lg">Filtros</Text>
        </View>

        <View>
          <Text className="font-poppins-medium text-base mb-3 pt-4 pl-4">
            Tipo de residência
          </Text>
          <ResidenceFilterButton
            paddingHorizontal={16}
            kind={kind}
            setKind={setKind}
          />
        </View>

        <View className="p-4">
          <Text className="font-poppins-medium text-base mb-3">
            Tipo de venda
          </Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Arrendamento</Text>
            <RadioButton
              value="rent"
              isChecked={state === 'rent'}
              onPress={() => setState('rent')}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">À Venda</Text>
            <RadioButton
              value="sell"
              isChecked={state === 'sell'}
              onPress={() => setState('sell')}
            />
          </View>
        </View>

        <View className="p-4">
          <TextField.Label>Preço minimo</TextField.Label>
          <CurrencyInput
            value={Number(minPrice) ? Number(minPrice) : null}
            onChangeValue={(value) => {
              setMinPrice(value || undefined)
            }}
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            cursorColor={Constants.colors.primary}
            placeholder="0.00 kz"
            className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
          />
        </View>

        <View className="p-4">
          <TextField.Label>Preço máximo</TextField.Label>
          <CurrencyInput
            value={Number(maxPrice) ? Number(maxPrice) : null}
            onChangeValue={(value) => {
              setMaxPrice(value || undefined)
            }}
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            cursorColor={Constants.colors.primary}
            placeholder="0.00 kz"
            className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
          />
        </View>

        <View className="flex flex-row justify-between items-center px-4 gap-x-2">
          <Button
            onPress={() => {
              setFilter({
                kind: 'all',
              })
              setMaxPrice(undefined)
              setMinPrice(undefined)
              setState(undefined)
              setKind('all')
              SheetManager.hide('search-sheet')
            }}
            className="bg-alert flex-1"
            title="Remover filtros"
          />

          <Button
            onPress={() => {
              setFilter({
                kind,
                maxPrice,
                minPrice,
                state,
              })
              SheetManager.hide('search-sheet')
            }}
            className="bg-primary flex-1"
            title="Aplicar"
          />
        </View>
      </ScrollView>
    </ActionSheet>
  )
}
