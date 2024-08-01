import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StatusBar, View, BackHandler } from 'react-native'

import { IResidenceKindEnum, IResidenceStateEnum } from '@/@types'
import Form from '@/components/Form'
import Header from '@/components/Header'
import ResidenceForm, {
  IFormData,
  residenceSchema,
} from '@/components/ResidenceForm'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function Editor() {
  const navigation = useNavigation()
  const { id } = useLocalSearchParams<{ id?: string }>()

  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const [forceExiting, setForceExiting] = useState(false)

  const [defaultData, setDefaultData] = useState(
    cachedResidences.find(({ residence: r }) => r.id === id),
  )

  const formHandler = useForm({
    resolver: zodResolver(residenceSchema),
    defaultValues: {
      description: defaultData?.residence.description || '',
      location: defaultData?.residence.location || '',
      price: defaultData?.residence.price || 0,
      kind: defaultData?.residence.kind
        ? String(defaultData?.residence.kind)
        : 'apartment',
      state: defaultData?.residence.state
        ? String(defaultData?.residence.state)
        : 'rent',
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = formHandler

  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>(
    defaultData?.residence.photos
      ? defaultData.residence.photos.map((uri) => ({
          uri,
          width: 300,
          height: 300,
          assetId: uri,
        }))
      : [],
  )

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [cover, setCover] = useState<string | null | undefined>(
    defaultData?.residence.cover || undefined,
  )
  const { uploadResidencesImage, handleCallNotification } = useSupabase()

  const [isPhotoChaged, setPhotoChanged] = useState(false)
  const alert = useAlert()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])

  function handleGoBack() {
    setForceExiting(true)
    navigation.goBack()
    handleCallNotification(
      'Residência respostado',
      'A residência foi respostada com sucesso.',
    )
  }

  async function onSubmit(formData: IFormData) {
    const hasSelectedImages = images.length > 0
    const isCoverChanged = defaultData?.residence.cover !== cover
    const hasDeletedImages = imagesToDelete.length > 0

    if (
      hasSelectedImages &&
      cover !== undefined &&
      (isCoverChanged || isDirty || hasDeletedImages || isPhotoChaged)
    ) {
      if (isDirty || isCoverChanged) {
        await updateResidenceData(formData)
      }

      if (hasDeletedImages) {
        await removeDeletedImages()
      }

      if (isPhotoChaged && id && cover) {
        await uploadResidencesImage(id, cover, images)
      }

      handleGoBack()
    } else {
      if (!hasSelectedImages) {
        alert.showAlert(
          'Erro a realizar postagem',
          'Não selecionaste nenhuma foto da residência.',
          'Ok',
        )
      } else if (!cover) {
        alert.showAlert(
          'Erro a realizar postagem',
          'Escolha uma fotografia para ser a foto de capa da sua residência.',
          'Ok',
        )
      }
    }
  }

  async function updateResidenceData(data: IFormData) {
    try {
      await residenceRepository.update(id, {
        price: data.price,
        location: data.location,
        description: data.description,
        state: data.state as IResidenceStateEnum,
        kind: data.kind as IResidenceKindEnum,
        cover,
      })

      setDefaultData({
        residence: {
          ...defaultData?.residence,
          price: data.price || defaultData?.residence.price,
          location: data.location || defaultData?.residence.location,
          description: data.description || defaultData?.residence.description,
          state:
            (data.state as IResidenceStateEnum) || defaultData?.residence.state,
          kind:
            (data.kind as IResidenceKindEnum) || defaultData?.residence.kind,
          cover: cover || defaultData?.residence.cover,
        },
      })

      reset({
        description: '',
        location: '',
        state: 'rent',
        kind: 'apartment',
        price: 0,
      })
    } catch {
      alert.showAlert(
        'Erro a realizar postagem',
        'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
        'Ok',
      )
    }
  }

  async function removeDeletedImages() {
    const filesToRemove = imagesToDelete.map((image) =>
      image.replace(
        `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/`,
        '',
      ),
    )

    setImages(images.filter((image) => !imagesToDelete.includes(image.uri)))

    const residences = cachedResidences.map(({ residence }) => {
      if (residence.id === id && residence.photos) {
        const photos = residence.photos.filter(
          (image) => !imagesToDelete.includes(image),
        )
        return { ...residence, photos }
      }
      return residence
    })

    await supabase.storage.from('residences').remove(filesToRemove)

    await residenceRepository.update(id, {
      photos: residences.find((r) => r.id === id)?.photos,
    })

    setImagesToDelete([])
  }

  const handleBackPress = useCallback(() => {
    const hasSelectedImages =
      defaultData?.residence.photos &&
      defaultData?.residence.photos?.length > images.length

    const isCoverChanged = defaultData?.residence.cover !== cover
    const hasDeletedImages = imagesToDelete.length > 0

    if (
      (!isSubmitting &&
        !isDirty &&
        !isCoverChanged &&
        !hasDeletedImages &&
        !hasSelectedImages) ||
      forceExiting
    ) {
      router.back()
      return true
    } else {
      alert.showAlert(
        'Descartar alterações?',
        'Você possui alterações não salvas, tem certeza de que deseja descartá-las?',
        'Sim',
        () => {
          router.back()
        },
        'Não',
      )
      return true
    }
  }, [
    defaultData,
    images,
    cover,
    imagesToDelete,
    isSubmitting,
    isDirty,
    forceExiting,
    alert,
  ])

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
          imagesToDelete={imagesToDelete}
          changeImages={(images) => {
            setImages(images)
          }}
          changeCoverImage={(cover) => {
            setCover(cover)
          }}
          deleteImages={(images) => {
            setImagesToDelete(images)
          }}
          handlePhotoChanged={(value) => {
            setPhotoChanged(value)
          }}
        />
      </Form>

      <Header.Action
        title="Editando a residência"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        onBackPress={handleBackPress}
      />

      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </View>
  )
}
