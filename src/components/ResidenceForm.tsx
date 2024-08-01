import * as ImagePicker from 'expo-image-picker'
import { Controller } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { View, ScrollView, Text } from 'react-native'
import * as z from 'zod'

import ResidenceFilterButton from './ResidenceFilterButton'

import { IResidenceKindEnum } from '@/@types'
import GaleryGrid from '@/components/GaleryGrid'
import RadioButton from '@/components/RadioButton'
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

  state: z.enum(['sell', 'rent'], {
    invalid_type_error: 'Tipo de venda é obrigatório',
    required_error: 'Tipo de venda é obrigatório',
  }),
})

interface IResidenceForm {
  handler: UseFormReturn<
    {
      description: string
      location: string
      state: string
      kind: string
      price: number
    },
    unknown,
    undefined
  >
  cover: string
  images: ImagePicker.ImagePickerAsset[]
  imagesToDelete?: string[]
  changeImages: (images: ImagePicker.ImagePickerAsset[]) => void
  changeCoverImage: (value: string) => void
  deleteImages?: (value: string[]) => void
  handlePhotoChanged?: (value: boolean) => void
}
export default function ResidenceForm({
  handler,
  images,
  cover,
  imagesToDelete,
  changeImages,
  changeCoverImage,
  deleteImages,
  handlePhotoChanged,
}: IResidenceForm) {
  const {
    formState: { isSubmitting, errors },
    control,
    setValue,
    clearErrors,
  } = handler

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginTop: constants.customHeaderDistance }}
      className="bg-white">
      <View className="flex gap-y-9 mt-[2%] bg-white">
        <View className="px-4">
          <Controller
            control={control}
            name="price"
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <View>
                <TextField.Root>
                  <TextField.Label isRequired>Preço</TextField.Label>
                  <TextField.Container error={errors.price !== undefined}>
                    <TextField.Currency {...field} autoFocus />
                  </TextField.Container>
                </TextField.Root>

                <TextField.Helper message={errors.price?.message} />
              </View>
            )}
          />
        </View>

        <View className="px-4">
          <Controller
            control={control}
            name="location"
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <View>
                <TextField.Place
                  editable={!isSubmitting}
                  error={errors.location?.message !== undefined}
                  placeholder="Onde está localizada?"
                  onChangeLocation={(value: string) => {
                    setValue('location', value)
                    clearErrors('location')
                  }}
                  {...field}
                />

                <TextField.Helper message={errors.location?.message} />
              </View>
            )}
          />
        </View>

        <View className="px-4">
          <Controller
            control={control}
            name="description"
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <View>
                <TextField.Root>
                  <TextField.Label isRequired>Descrição</TextField.Label>
                  <TextField.Container
                    error={errors.description?.message !== undefined}>
                    <TextField.Area
                      placeholder="Quais são as carateristicas dela???"
                      editable={!isSubmitting}
                      onChangeValue={field.onChange}
                      {...field}
                    />
                  </TextField.Container>
                </TextField.Root>

                <TextField.Helper message={errors.description?.message} />
              </View>
            )}
          />
        </View>

        <View className="px-4">
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
          <TextField.Label className="pl-4" isRequired>
            Tipo de residência
          </TextField.Label>
          <Controller
            control={control}
            name="kind"
            render={({ field: { value, onChange } }) => (
              <ResidenceFilterButton
                excludedOptions={['all']}
                paddingHorizontal={16}
                kind={value as IResidenceKindEnum}
                setKind={(kind) => onChange(kind)}
              />
            )}
          />
          <TextField.Helper message={errors.kind?.message} />
        </View>

        <View className="mb-6 px-4">
          <TextField.Label
            style={{ display: images.length > 0 ? 'flex' : 'none' }}>
            Galeria
          </TextField.Label>
          <GaleryGrid
            cover={cover}
            images={images}
            changeCoverImage={changeCoverImage}
            changeImages={changeImages}
            disabled={isSubmitting}
            deleteImages={deleteImages}
            imagesToDelete={imagesToDelete}
            handlePhotoChanged={handlePhotoChanged}
          />
        </View>
      </View>
    </ScrollView>
  )
}
