import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet'
import * as z from 'zod'

import RadioButton from '../RadioButton'

import { IResidenceKindEnum, IResidenceStateEnum } from '@/@types'
import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import ResidenceFilterButton from '@/components/ResidenceFilterButton'
import SearchPlace from '@/components/SearchPlace'
import TextField from '@/components/TextField'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { WisheRepository } from '@/repositories/wishe.repository'
import { useWisheStore } from '@/store/WisheStore'

const schema = z
  .object({
    location: z
      .string({
        required_error: 'A localização é obrigatória',
        invalid_type_error: 'Localização inválida',
      })
      .min(3, 'A localização deve ter pelo menos 3 caracteres')
      .max(150, 'A localização não pode ter mais de 150 caracteres'),

    kind: z.enum(['apartment', 'villa', 'land', 'others'], {
      invalid_type_error: 'Tipo de residência é obrigatório',
      required_error: 'Tipo de residência é obrigatório',
    }),

    state: z.enum(['sell', 'rent'], {
      invalid_type_error: 'Tipo de venda é obrigatório',
      required_error: 'Tipo de venda é obrigatório',
    }),

    minPrice: z.number({
      required_error: 'O preço minimo é obrigatório',
    }),
    maxPrice: z.number({
      required_error: 'O preço máximo é obrigatório',
    }),
  })
  .refine(
    (data) => data.maxPrice && data.minPrice && data.maxPrice > data.minPrice,
    {
      message: 'Preço máximo deve ser maior que o preço mínimo',
      path: ['maxPrice'],
    },
  )

export default function AddWisheActionSheet(props: SheetProps) {
  interface IFormData {
    kind: IResidenceKindEnum
    state: IResidenceStateEnum
    location: string
    minPrice: number
    maxPrice: number
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
    },
  })

  const wisheRepository = useMemo(() => new WisheRepository(), [])
  const addToWishList = useWisheStore((state) => state.addToWishList)

  const { handleCallNotification } = useSupabase()

  const alert = useAlert()

  async function onSubmit(data: IFormData) {
    try {
      const wisheData = await wisheRepository.create(data)
      addToWishList(wisheData)

      handleCallNotification('Desejo criado', 'O desejo foi criado com sucesso')
    } catch {
      alert.showAlert(
        'Erro a realizar postagem',
        'Occoreu um erro ao adicionar o item na lista de desejos.',
        'Ok',
      )
    }

    reset()
    SheetManager.hide('create-wishe-sheet')
  }

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 mb-5 border-b border-b-gray-300">
          <IconButton
            name="X"
            size={20}
            onPress={() => SheetManager.hide('create-wishe-sheet')}
          />
          <Text className="font-poppins-semibold text-lg">Criar desejo</Text>
        </View>

        <View className="flex gap-y-9 px-4">
          <View>
            <Controller
              control={control}
              name="location"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View>
                    <SearchPlace
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Onde está localizada?"
                      error={errors.location?.message !== undefined}
                    />
                  </View>

                  <TextField.Helper message={errors.location?.message} />
                </View>
              )}
            />
          </View>

          <View>
            <TextField.Label isRequired>Tipo de residência</TextField.Label>
            <Controller
              control={control}
              name="kind"
              render={({ field: { value, onChange } }) => (
                <ResidenceFilterButton
                  excludeAllOption
                  kind={value}
                  setKind={(kind) => onChange(kind)}
                />
              )}
            />
            <TextField.Helper message={errors.kind?.message} />
          </View>

          <View>
            <TextField.Label isRequired>Tipo de venda</TextField.Label>
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
              <Text className="text-sm font-poppins-regular">À venda</Text>
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

          <View>
            <TextField.Label isRequired>Preço mínimo</TextField.Label>
            <Controller
              control={control}
              name="minPrice"
              render={({ field: { value, onChange } }) => (
                <TextField.Container error={errors.minPrice !== undefined}>
                  <TextField.Currency value={value} onChange={onChange} />
                </TextField.Container>
              )}
            />
            <TextField.Helper message={errors.minPrice?.message} />
          </View>

          <View>
            <TextField.Label isRequired>Preço máximo</TextField.Label>
            <Controller
              control={control}
              name="maxPrice"
              render={({ field: { value, onChange } }) => (
                <TextField.Container error={errors.maxPrice !== undefined}>
                  <TextField.Currency value={value} onChange={onChange} />
                </TextField.Container>
              )}
            />
            <TextField.Helper message={errors.maxPrice?.message} />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Button
              onPress={handleSubmit(onSubmit)}
              className="bg-primary flex-1"
              title="Adicionar na lista de desejos"
            />
          </View>
        </View>
      </ScrollView>
    </ActionSheet>
  )
}
