import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BackHandler, View } from 'react-native'

import { IResidenceKindEnum, IResidenceStateEnum } from '@/@types'
import Form from '@/components/Form'
import Header from '@/components/Header'
import ResidenceForm, {
  IFormData,
  residenceSchema,
} from '@/components/ResidenceForm'
import PlaceInputProvider from '@/contexts/PlaceInputProvider'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useResidenceStore } from '@/store/ResidenceStore'

function EditorWithoutPlaceProvider() {
  const formHandler = useForm({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      description: '',
      location: '',
      state: 'rent',
      kind: 'apartment',
      price: 0,
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = formHandler

  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])
  const resetResidenceCache = useResidenceStore(
    (state) => state.resetResidenceCache,
  )

  const [cover, setCover] = useState<string | null>(null)

  const { uploadResidencesImage } = useSupabase()
  const alert = useAlert()
  const { session } = useSupabase()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])
  const notificationRepository = useMemo(() => new NotificationRepository(), [])
  const residenceNotificationRepository = useMemo(
    () => new ResidenceNotificationRepository(),
    [],
  )

  const resetFields = useCallback(() => {
    reset({
      description: '',
      location: '',
      state: 'rent',
      kind: 'apartment',
      price: 0,
    })

    setCover(null)
    setImages([])
  }, [reset])

  async function onSubmit(formData: IFormData) {
    if (images.length !== 0 && cover && session) {
      try {
        const data = await residenceRepository.create({
          price: formData.price,
          location: formData.location,
          description: formData.description,
          approval_status: false,
          state: formData.state as IResidenceStateEnum,
          kind: formData.kind as IResidenceKindEnum,
          cover: null,
          photos: null,
        })

        await uploadResidencesImage(data.id, cover, images)

        const notification = await notificationRepository.create({
          user_id: session.user.id,
          title: 'Residência postada',
          description: 'A residência foi postada com sucesso.',
          type: 'residence-posted',
          was_readed: false,
        })

        await residenceNotificationRepository.create({
          residence_id: data.id,
          notification_id: notification.id,
        })

        resetFields()
        resetResidenceCache()
        router.replace(`/(root)/home`)
      } catch {
        alert.showAlert(
          'Erro a realizar postagem',
          'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
          'Ok',
        )
      }
    } else {
      if (images.length === 0) {
        alert.showAlert(
          'Erro a realizar postagem',
          'Não selecionaste nenhuma foto da residência.',
          'Ok',
        )
      } else {
        alert.showAlert(
          'Erro a realizar postagem',
          'Escolha uma fotografia para ser a foto de capa da sua residência.',
          'Ok',
        )
      }
    }
  }

  const handleBackPress = useCallback(() => {
    const hasSelectedImages = images.length > 0

    if (
      !isSubmitting &&
      !isDirty &&
      !hasSelectedImages &&
      images.length === 0
    ) {
      resetFields()
      router.back()
      return true
    } else {
      alert.showAlert(
        'Descartar alterações?',
        'Você possui alterações não salvas, tem certeza de que deseja descartá-las?',
        'Sim',
        () => {
          resetFields()
          router.back()
        },
        'Não',
      )
      return true
    }
  }, [images, isDirty, isSubmitting, resetFields, alert])

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      )

      return () => subscription.remove()
    }, [handleBackPress]),
  )

  return (
    <View className="relative bg-white">
      <Form handler={formHandler}>
        <ResidenceForm
          handler={formHandler}
          images={images}
          cover={cover}
          changeImages={(images) => {
            setImages(images)
          }}
          changeCoverImage={(cover) => {
            setCover(cover)
          }}
        />
      </Form>

      <Header.Action
        title="Postar residência"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        onBackPress={handleBackPress}
      />
    </View>
  )
}

export default function Editor() {
  return (
    <PlaceInputProvider>
      <EditorWithoutPlaceProvider />
    </PlaceInputProvider>
  )
}
