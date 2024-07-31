import * as ImagePicker from 'expo-image-picker'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { View, ScrollView, Text } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import * as z from 'zod'

import ResidenceFilterButton from './ResidenceFilterButton'

import { IResidenceKindEnum } from '@/assets/@types'
import GaleryGrid from '@/components/GaleryGrid'
import RadioButton from '@/components/RadioButton'
import SearchPlace from '@/components/SearchPlace'
import TextField from '@/components/TextField'
import constants from '@/constants'

export interface IFormData {
  price: number
  description: string
  location: string
  kind: string
  state: string
}

export const residenceSchema = z.object({
  price: z
    .number({
      required_error: 'O preço deve ser um número positivo',
      invalid_type_error: 'Preço invalido',
    })
    .positive({
      message: 'Preço invalido',
    }),

  description: z
    .string({
      required_error: 'A descrição é obrigatória',
      invalid_type_error: 'Descrição inválida',
    })
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(200, 'A descrição não pode ter mais de 200 caracteres'),

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

  state: z.enum(['sale', 'rent'], {
    invalid_type_error: 'Tipo de venda é obrigatório',
    required_error: 'Tipo de venda é obrigatório',
  }),
})

interface IResidenceForm {
  control: Control<
    {
      description: string
      location: string
      price: number
      kind: string
      state: string
    },
    unknown
  >
  isSubmitting: boolean
  errors: FieldErrors<{
    description: string
    location: string
    state: string
    kind: string
    price: number
  }>
  cover: string
  setCover: (value: string) => void
  images: ImagePicker.ImagePickerAsset[]
  setImages: (value: ImagePicker.ImagePickerAsset[]) => void
  imagesToDelete?: string[]
  setImagesToDelete?: (value: string[]) => void
  setPhotoChanged?: (value: boolean) => void
}
export default function ResidenceForm({
  control,
  isSubmitting,
  errors,
  images,
  setImages,
  cover,
  setCover,
  imagesToDelete,
  setImagesToDelete,
  setPhotoChanged,
}: IResidenceForm) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginTop: constants.customHeaderDistance }}
      className="bg-white">
      <View className="flex gap-y-9 px-4 mt-[2%] bg-white">
        <View>
          <Controller
            control={control}
            name="price"
            rules={{
              required: true,
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <View>
                <TextField.Root>
                  <TextField.Label isRequired>Preço</TextField.Label>
                  <TextField.Container
                    error={errors.price?.message !== undefined}>
                    <CurrencyInput
                      value={value}
                      onChangeValue={(value) => onChange(value || 0)}
                      delimiter="."
                      separator=","
                      precision={2}
                      minValue={0}
                      cursorColor={constants.colors.primary}
                      className="flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium"
                      placeholder="Quanto está custando? (em kz)"
                      onBlur={onBlur}
                      editable={!isSubmitting}
                    />
                  </TextField.Container>
                </TextField.Root>

                <TextField.Helper message={errors.price?.message} />
              </View>
            )}
          />
        </View>

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
                    editable={!isSubmitting}
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
          <Controller
            control={control}
            name="description"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextField.Root>
                  <TextField.Label isRequired>Descrição</TextField.Label>
                  <TextField.Container
                    error={errors.description?.message !== undefined}>
                    <TextField.Area
                      placeholder="Quais são as carateristicas dela???"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      editable={!isSubmitting}
                    />
                  </TextField.Container>
                </TextField.Root>

                <TextField.Helper message={errors.description?.message} />
              </View>
            )}
          />
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

        <View>
          <TextField.Label>Tipo de residência</TextField.Label>

          <Controller
            control={control}
            name="kind"
            render={({ field: { value, onChange } }) => (
              <ResidenceFilterButton
                excludeAllOption
                paddingHorizontal={0}
                kind={value as IResidenceKindEnum}
                setKind={(kind) => onChange(kind)}
              />
            )}
          />
          <TextField.Helper message={errors.kind?.message} />
        </View>

        <View className="mb-6">
          <TextField.Label
            style={{ display: images.length > 0 ? 'flex' : 'none' }}>
            Galeria
          </TextField.Label>
          <GaleryGrid
            cover={cover}
            images={images}
            setCover={setCover}
            setImages={setImages}
            disabled={isSubmitting}
            setImagesToDelete={setImagesToDelete}
            imagesToDelete={imagesToDelete}
            setPhotoChanged={setPhotoChanged}
          />
        </View>
      </View>
    </ScrollView>
  )
}
