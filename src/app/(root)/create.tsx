import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import * as yup from 'yup'

import { IResidenceEnum } from '@/assets/@types'
import GaleryGrid from '@/components/GaleryGrid'
import Header from '@/components/Header'
import RadioButton from '@/components/RadioButton'
import SearchPlace from '@/components/SearchPlace'
import TextField from '@/components/TextField'
import constants from '@/constants'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'
import { ResidenceRepository } from '@/repositories/residence.repository'

interface FormData {
  price: number
  description?: string
  location?: string
}

const schema = yup.object({
  price: yup
    .number()
    .typeError('O preço deve ser um número')
    .required('O preço é obrigatório')
    .positive('O preço deve ser um número positivo'),

  description: yup
    .string()
    .required('A descrição é obrigatória')
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(200, 'A descrição não pode ter mais de 200 caracteres'),

  location: yup
    .string()
    .required('A localização é obrigatória')
    .min(3, 'A localização deve ter pelo menos 3 caracteres')
    .max(150, 'A localização não pode ter mais de 150 caracteres'),
})

export default function Editor() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])

  const [cover, setCover] = useState<string | null>()
  const [price, setPrice] = useState<number | null>(0)
  const [kind, setKind] = useState<IResidenceEnum>('apartment')
  const [state, setState] = useState<'rent' | 'sell'>('rent')
  const { uploadResidencesImage } = useSupabase()
  const alert = useAlert()

  const { session } = useSupabase()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])
  const notificationRepository = useMemo(() => new NotificationRepository(), [])
  const residenceNotificationRepository = useMemo(
    () => new ResidenceNotificationRepository(),
    [],
  )

  async function onSubmit(formData: FormData) {
    if (images.length !== 0 && cover && session) {
      try {
        const data = await residenceRepository.create({
          price,
          location: formData.location,
          description: formData.description,
          approval_status: false,
          cover: null,
          photos: null,
          state,
          kind,
        })

        await uploadResidencesImage(data.id, cover, images)

        const notification = await notificationRepository.create({
          user_id: session.user.id,
          title: 'Residência postada',
          description: 'A sua residência foi postada com sucesso.',
          type: 'residence-posted',
          was_readed: false,
        })

        await residenceNotificationRepository.create({
          residence_id: data.id,
          notification_id: notification.id,
        })

        setImages([])
        reset()
        router.replace(`/(root)/home`)
      } catch {
        alert.showAlert(
          'Erro a realizar postagem',
          'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
          'Ok',
          () => {},
        )
      }
    } else {
      if (images.length === 0) {
        alert.showAlert(
          'Erro a realizar postagem',
          'Não selecionaste nenhuma foto da residência.',
          'Ok',
          () => {},
        )
      } else {
        alert.showAlert(
          'Erro a realizar postagem',
          'Escolha uma fotografia para ser a foto de capa da sua residência.',
          'Ok',
          () => {},
        )
      }
    }
  }

  return (
    <View className="relative bg-white">
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
            />
          </View>
        </View>
      </ScrollView>

      <Header.Action
        title="Postar residência"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}
