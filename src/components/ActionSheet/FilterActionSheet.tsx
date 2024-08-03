import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet'

import RadioButton from '../RadioButton'

import { IResidenceFilterEnum, IResidenceStateEnum } from '@/@types'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import ResidenceFilterButton from '@/components/ResidenceFilterButton'
import TextField from '@/components/TextField'
import { useCache } from '@/hooks/useCache'

export default function FilterActionSheet(props: SheetProps) {
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
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 mb-5 border-b border-b-gray-300">
          <IconButton
            name="X"
            size={20}
            onPress={() => SheetManager.hide('filter-search-sheet')}
          />
          <Text className="font-poppins-semibold text-lg">
            Filtrar pesquisa
          </Text>
        </View>

        <View className="flex gap-y-9">
          <View>
            <TextField.Label className="px-4">
              Tipo de residência
            </TextField.Label>
            <ResidenceFilterButton
              excludedOptions={['all']}
              kind={kind}
              setKind={setKind}
              paddingHorizontal={16}
            />
          </View>

          <View className="px-4">
            <TextField.Label>Tipo de venda</TextField.Label>
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

          <View className="px-4">
            <TextField.Label>Preço minimo</TextField.Label>
            <TextField.Container>
              <TextField.Currency
                value={Number(minPrice) ? Number(minPrice) : null}
                onChange={(value) => {
                  setMinPrice(value || undefined)
                }}
              />
            </TextField.Container>
          </View>

          <View className="px-4">
            <TextField.Label>Preço máximo</TextField.Label>
            <TextField.Container>
              <TextField.Currency
                value={Number(maxPrice) ? Number(maxPrice) : null}
                onChange={(value) => {
                  setMaxPrice(value || undefined)
                }}
              />
            </TextField.Container>
          </View>

          <View className="flex flex-row justify-between items-center gap-x-2 px-4">
            <Button
              onPress={() => {
                setFilter({
                  kind: 'all',
                })
                setMaxPrice(undefined)
                setMinPrice(undefined)
                setState(undefined)
                setKind('all')
                SheetManager.hide('filter-search-sheet')
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
                SheetManager.hide('filter-search-sheet')
              }}
              className="bg-primary flex-1"
              title="Aplicar"
            />
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  )
}
