import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import * as yup from 'yup'

import { IResidenceEnum } from '@/assets/@types'
import Header from '@/components/Header'
import ResidenceForm from '@/components/ResidenceForm'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useResidenceStore } from '@/store/ResidenceStore'

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

  const resetResidenceCache = useResidenceStore(
    (state) => state.resetResidenceCache,
  )

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

        resetResidenceCache()

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
      <ResidenceForm
        control={control}
        isSubmitting={isSubmitting}
        price={price}
        setPrice={setPrice}
        state={state}
        setState={setState}
        kind={kind}
        setKind={setKind}
        errors={errors}
        images={images}
        setImages={setImages}
        cover={cover}
        setCover={setCover}
      />

      <Header.Action
        title="Postar residência"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}
