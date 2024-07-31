import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet'
import CurrencyInput from 'react-native-currency-input'
import * as z from 'zod'

import RadioButton from '../RadioButton'

import { IResidenceKindEnum, IResidenceStateEnum } from '@/assets/@types'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import ResidenceFilterButton from '@/components/ResidenceFilterButton'
import TextField from '@/components/TextField'
import constants from '@/constants'

const schema = z
  .object({
    kind: z.enum(['apartment', 'house', 'villa'], {
      invalid_type_error: 'Tipo de residência é obrigatório',
      required_error: 'Tipo de residência é obrigatório',
    }),

    state: z.enum(['sale', 'rent'], {
      invalid_type_error: 'Tipo de venda é obrigatório',
      required_error: 'Tipo de venda é obrigatório',
    }),

    minPrice: z
      .number()
      .min(0, 'Preço mínimo deve ser maior ou igual a 0')
      .nullable(),

    maxPrice: z.number().nullable(),
  })
  .refine((data) => data.maxPrice > data.minPrice, {
    message: 'Preço máximo deve ser maior que o preço mínimo',
    path: ['maxPrice'],
  })

export default function AddWisheActionSheet(props: SheetProps) {
  interface IFormData {
    kind: IResidenceKindEnum
    state: IResidenceStateEnum
    minPrice?: number
    maxPrice?: number
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: 'apartment',
      state: 'rent',
      minPrice: 0,
      maxPrice: 0,
    },
  })

  const onSubmit = (data: IFormData) => {
    reset()
    SheetManager.hide('create-wishe-sheet')
  }

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 border-b border-b-gray-300">
          <IconButton
            name="X"
            size={20}
            onPress={() => SheetManager.hide('search-sheet')}
          />
          <Text className="font-poppins-semibold text-lg">Criar desejo</Text>
        </View>

        <View>
          <Text className="font-poppins-medium text-base mb-3 pt-4 pl-4">
            Tipo de residência
          </Text>
          <Controller
            control={control}
            name="kind"
            render={({ field: { value, onChange } }) => (
              <ResidenceFilterButton
                excludeAllOption
                paddingHorizontal={16}
                kind={value}
                setKind={(kind) => onChange(kind)}
              />
            )}
          />
          <TextField.Helper message={errors.kind?.message} />
        </View>

        <View className="p-4">
          <Text className="font-poppins-medium text-base mb-3">
            Tipo de venda
          </Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Arrendamento</Text>
            <Controller
              control={control}
              name="state"
              render={({ field: { value, onChange } }) => (
                <RadioButton
                  value="rent"
                  isChecked={value === 'rent'}
                  onPress={() => onChange('rent')}
                />
              )}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">À Venda</Text>
            <Controller
              control={control}
              name="state"
              render={({ field: { value, onChange } }) => (
                <RadioButton
                  value="sell"
                  isChecked={value === 'sell'}
                  onPress={() => onChange('sell')}
                />
              )}
            />
          </View>
          <TextField.Helper message={errors.state?.message} />
        </View>

        <View className="p-4">
          <TextField.Label>Preço mínimo</TextField.Label>
          <Controller
            control={control}
            name="minPrice"
            render={({ field: { value, onChange } }) => (
              <CurrencyInput
                value={value}
                onChangeValue={(value) => onChange(value || 0)}
                delimiter="."
                separator=","
                precision={2}
                minValue={0}
                cursorColor={constants.colors.primary}
                placeholder="0.00 kz"
                className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
              />
            )}
          />
          <TextField.Helper message={errors.minPrice?.message} />
        </View>

        <View className="p-4">
          <TextField.Label>Preço máximo</TextField.Label>
          <Controller
            control={control}
            name="maxPrice"
            render={({ field: { value, onChange } }) => (
              <CurrencyInput
                value={value}
                onChangeValue={(value) => onChange(value || 0)}
                delimiter="."
                separator=","
                precision={2}
                minValue={0}
                cursorColor={constants.colors.primary}
                placeholder="0.00 kz"
                className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
              />
            )}
          />
          <TextField.Helper message={errors.maxPrice?.message} />
        </View>

        <View className="flex flex-row justify-between items-center px-4 gap-x-2">
          <Button
            onPress={handleSubmit(onSubmit)}
            className="bg-primary flex-1"
            title="Adicionar na lista de desejos"
          />
        </View>
      </ScrollView>
    </ActionSheet>
  )
}
