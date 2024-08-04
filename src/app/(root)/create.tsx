import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
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
import { usePlaceInput } from '@/hooks/usePlaceInput'
import { useSupabase } from '@/hooks/useSupabase'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useOpenedResidenceStore } from '@/store/OpenedResidenceStore'

interface IEditorWithouPlaceProvider {
  formHandler: UseFormReturn<
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
}
function EditorWithoutPlaceProvider({
  formHandler,
}: IEditorWithouPlaceProvider) {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([])

  const resetOpenedResidences = useOpenedResidenceStore((state) => state.reset)

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = formHandler

  const { setOpen: setOpenLocationField, resetField: resetLocationField } =
    usePlaceInput()

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
    resetLocationField()
    reset()

    setCover(null)
    setImages([])
  }, [reset, resetLocationField])

  async function onSubmit(formData: IFormData) {
    setOpenLocationField(false)

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
        resetOpenedResidences()
        router.replace('/home')
      } catch {
        alert.showAlert({
          title: 'Erro a realizar postagem',
          message:
            'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
        })
      }
    } else {
      if (images.length === 0) {
        alert.showAlert({
          title: 'Erro a realizar postagem',
          message: 'Não selecionaste nenhuma foto da residência.',
        })
      } else {
        alert.showAlert({
          title: 'Erro a realizar postagem',
          message:
            'Escolha uma fotografia para ser a foto de capa da sua residência.',
        })
      }
    }
  }

  const handleBackPress = useCallback(() => {
    const hasSelectedImages = images.length > 0

    setOpenLocationField(false)

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
      alert.showAlert({
        title: 'Descartar alterações?',
        message:
          'Você possui alterações não salvas, tem certeza de que deseja descartá-las?',
        primaryLabel: 'Sim',
        secondaryLabel: 'Não',
        onPressPrimary() {
          resetFields()
          router.back()
        },
      })
      return true
    }
  }, [images, isDirty, isSubmitting, resetFields, alert, setOpenLocationField])

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

  const { setValue } = formHandler

  return (
    <PlaceInputProvider
      onChangeText={(value) => {
        setValue('location', value)
      }}>
      <EditorWithoutPlaceProvider formHandler={formHandler} />
    </PlaceInputProvider>
  )
}
