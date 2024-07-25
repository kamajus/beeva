import * as ImagePicker from 'expo-image-picker'
import { Dispatch, SetStateAction } from 'react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { View, ScrollView, Text } from 'react-native'
import CurrencyInput from 'react-native-currency-input'

import { IResidenceKindEnum, IResidenceStateEnum } from '@/assets/@types'
import GaleryGrid from '@/components/GaleryGrid'
import RadioButton from '@/components/RadioButton'
import SearchPlace from '@/components/SearchPlace'
import TextField from '@/components/TextField'
import constants from '@/constants'

interface IResidenceForm {
  control: Control<
    {
      price?: number
      location?: string
      description?: string
    },
    unknown
  >
  isSubmitting: boolean
  errors: FieldErrors<{
    price?: number
    location?: string
    description?: string
  }>
  price: number
  setPrice: (value: number) => void
  state: string
  setState: Dispatch<SetStateAction<IResidenceStateEnum>>
  kind: string
  setKind: Dispatch<SetStateAction<IResidenceKindEnum>>
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
  price,
  setPrice,
  state,
  setState,
  kind,
  setKind,
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
            render={({ field: { onChange, onBlur } }) => (
              <View>
                <TextField.Root>
                  <TextField.Label isRequired>Preço</TextField.Label>
                  <TextField.Container
                    error={errors.price?.message !== undefined}>
                    <CurrencyInput
                      value={price}
                      onChangeValue={setPrice}
                      delimiter="."
                      separator=","
                      precision={2}
                      minValue={0}
                      cursorColor={constants.colors.primary}
                      className="flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium"
                      placeholder="Quanto está custando? (em kz)"
                      onChangeText={() => {
                        onChange(String(price))
                      }}
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

        <View>
          <TextField.Label>Estado</TextField.Label>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Arrendamento</Text>
            <RadioButton
              value="rent"
              isChecked={state === 'rent'}
              onPress={() => setState('rent')}
              disabled={isSubmitting}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">À Venda</Text>
            <RadioButton
              value="sell"
              isChecked={state === 'sell'}
              onPress={() => setState('sell')}
              disabled={isSubmitting}
            />
          </View>
        </View>

        <View>
          <TextField.Label>Tipo</TextField.Label>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Apartamento</Text>
            <RadioButton
              value="apartment"
              isChecked={kind === 'apartment'}
              onPress={() => setKind('apartment')}
              disabled={isSubmitting}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Vivenda</Text>
            <RadioButton
              value="villa"
              isChecked={kind === 'villa'}
              onPress={() => setKind('villa')}
              disabled={isSubmitting}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Terreno</Text>
            <RadioButton
              value="land"
              isChecked={kind === 'land'}
              onPress={() => setKind('land')}
              disabled={isSubmitting}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Outros</Text>
            <RadioButton
              value="others"
              isChecked={kind === 'others'}
              onPress={() => setKind('others')}
              disabled={isSubmitting}
            />
          </View>
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
