import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'
import { StatusBar, View, BackHandler } from 'react-native'

import { IResidenceKindEnum, IResidenceStateEnum } from '@/@types'
import Form from '@/components/Form'
import Header from '@/components/Header'
import LoadScreen from '@/components/LoadScreen'
import ResidenceForm, {
  IFormData,
  residenceSchema,
} from '@/components/ResidenceForm'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import PlaceInputProvider from '@/contexts/PlaceInputProvider'
import { useAlert } from '@/hooks/useAlert'
import { usePlaceInput } from '@/hooks/usePlaceInput'
import { useSupabase } from '@/hooks/useSupabase'
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
  const navigation = useNavigation()
  const { id } = useLocalSearchParams<{ id?: string }>()

  const openedResidences = useOpenedResidenceStore((state) => state.residences)
  const [forceExiting, setForceExiting] = useState(false)

  const [defaultData, setDefaultData] = useState(
    openedResidences.find(({ residence: r }) => r.id === id),
  )

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
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

  const { setOpen: setOpenLocationField, resetField: resetLocationField } =
    usePlaceInput()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])

  const [loading, setLoading] = useState(true)

  function handleGoBack() {
    setForceExiting(true)
    navigation.goBack()

    handleCallNotification({
      title: 'Residência editada',
      body: 'A residência foi editada com sucesso.',
    })
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
        alert.showAlert({
          title: 'Erro a realizar postagem',
          message: 'Não selecionaste nenhuma foto da residência.',
        })
      } else if (!cover) {
        alert.showAlert({
          title: 'Erro a realizar postagem',
          message:
            'Escolha uma fotografia para ser a foto de capa da sua residência.',
        })
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
      alert.showAlert({
        title: 'Erro ao editar residência',
        message: 'Não foi possível editar a residência.',
      })
    }
  }

  async function removeDeletedImages() {
    const filesToRemove = imagesToDelete.map((image) =>
      image.replace(`${constants.storageUrl}/residences/`, ''),
    )

    setImages(images.filter((image) => !imagesToDelete.includes(image.uri)))

    const residences = openedResidences.map(({ residence }) => {
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

    setOpenLocationField(false)

    if (
      (!isSubmitting &&
        !isDirty &&
        !isCoverChanged &&
        !hasDeletedImages &&
        !hasSelectedImages) ||
      forceExiting
    ) {
      router.back()
      resetLocationField()
      return true
    } else {
      alert.showAlert({
        title: 'Descartar alterações?',
        message:
          'Você possui alterações não salvas, tem certeza de que deseja descartá-las?',
        primaryLabel: 'Sim',
        secondaryLabel: 'Não',
        onPressPrimary() {
          router.back()
          resetLocationField()
        },
      })
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
    resetLocationField,
    setOpenLocationField,
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

  useEffect(() => {
    navigation.addListener('focus', () => {
      reset({
        description: defaultData?.residence.description || '',
        location: defaultData?.residence.location || '',
        price: defaultData?.residence.price || 0,
        kind: defaultData?.residence.kind
          ? String(defaultData?.residence.kind)
          : 'apartment',
        state: defaultData?.residence.state
          ? String(defaultData?.residence.state)
          : 'rent',
      })

      setLoading(false)
    })
  }, [defaultData, navigation, reset])

  return (
    <View className="relative bg-white">
      {!loading ? (
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
      ) : (
        <LoadScreen />
      )}

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
