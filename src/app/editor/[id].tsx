import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import * as yup from 'yup'

import { beforeRemoveEventType } from '@/assets/@types'
import Header from '@/components/Header'
import ResidenceForm from '@/components/ResidenceForm'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useResidenceStore } from '@/store/ResidenceStore'

interface IFormData {
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
  const navigation = useNavigation()
  const { id } = useLocalSearchParams<{ id?: string }>()

  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const [forceExiting, setForceExiting] = useState(false)

  const [defaultData, setDefaultData] = useState(
    cachedResidences.find(({ residence: r }) => r.id === id),
  )

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: defaultData?.residence.description || '',
      location: defaultData?.residence.location || '',
      price: defaultData?.residence.price || 0,
    },
  })

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
  const [price, setPrice] = useState<number | null>(
    defaultData?.residence.price || 0,
  )
  const [kind, setKind] = useState(defaultData?.residence.kind || 'apartment')
  const [state, setState] = useState(defaultData?.residence.state || 'rent')
  const { uploadResidencesImage, handleCallNotification } = useSupabase()

  const [isPhotoChaged, setPhotoChanged] = useState(false)
  const alert = useAlert()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])

  async function onSubmit(formData: IFormData) {
    const hasSelectedImages = images.length > 0
    const isCoverChanged = defaultData?.residence.cover !== cover
    const isStateDifferent = defaultData?.residence.state !== state
    const isKindDifferent = defaultData?.residence.kind !== kind
    const hasDeletedImages = imagesToDelete.length > 0

    if (
      hasSelectedImages &&
      cover !== undefined &&
      (isCoverChanged ||
        isDirty ||
        isKindDifferent ||
        isStateDifferent ||
        hasDeletedImages ||
        isPhotoChaged)
    ) {
      if (isDirty || isKindDifferent || isStateDifferent || isCoverChanged) {
        await updateResidenceData(formData)
      }

      if (hasDeletedImages) {
        await removeDeletedImages()
      }

      if (isPhotoChaged && id && cover) {
        await uploadResidencesImage(id, cover, images)
      }

      setForceExiting(true)
      navigation.goBack()
      handleCallNotification(
        'Residência respostado',
        'A residência foi respostada com sucesso.',
      )
    } else {
      if (!hasSelectedImages) {
        alert.showAlert(
          'Erro a realizar postagem',
          'Não selecionaste nenhuma foto da residência.',
          'Ok',
          () => {},
        )
      } else if (!cover) {
        alert.showAlert(
          'Erro a realizar postagem',
          'Escolha uma fotografia para ser a foto de capa da sua residência.',
          'Ok',
          () => {},
        )
      }
    }
  }

  async function updateResidenceData({ location, description }: IFormData) {
    try {
      await residenceRepository.update(id, {
        price,
        location,
        description,
        cover,
        state,
        kind,
      })

      setDefaultData({
        residence: {
          ...defaultData?.residence,
          price: price || defaultData?.residence.price,
          location: location || defaultData?.residence.location,
          description: description || defaultData?.residence.description,
          cover: cover || defaultData?.residence.cover,
          state,
          kind,
        },
      })

      reset({
        description,
        location,
        price: price || undefined,
      })
    } catch {
      alert.showAlert(
        'Erro a realizar postagem',
        'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
        'Ok',
        () => {},
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

  useEffect(() => {
    function handleBeforeRemove(e: beforeRemoveEventType) {
      e.preventDefault()

      const hasSelectedImages =
        defaultData?.residence.photos &&
        defaultData?.residence.photos?.length > images.length
      const isCoverChanged = defaultData?.residence.cover !== cover
      const isStateDifferent = defaultData?.residence.state !== state
      const isKindDifferent = defaultData?.residence.kind !== kind
      const hasDeletedImages = imagesToDelete.length > 0

      if (forceExiting) return

      if (
        !isSubmitting &&
        !isDirty &&
        !isCoverChanged &&
        !isStateDifferent &&
        !isKindDifferent &&
        !hasDeletedImages &&
        !hasSelectedImages
      ) {
        navigation.dispatch(e.data.action)
        return
      }

      alert.showAlert(
        'Descartar alterações?',
        'Você possui alterações não salvas, tens certeza de que deseja descartá-las?',
        'Sim',
        () => navigation.dispatch(e.data.action),
        'Não',
        () => {},
      )
    }

    navigation.addListener('beforeRemove', handleBeforeRemove)
    return () => {
      navigation.removeListener('beforeRemove', handleBeforeRemove)
    }
  }, [
    isDirty,
    defaultData,
    isSubmitting,
    forceExiting,
    navigation,
    images,
    cover,
    state,
    kind,
    imagesToDelete,
    alert,
  ])

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
        imagesToDelete={imagesToDelete}
        setImagesToDelete={setImagesToDelete}
        setPhotoChanged={setPhotoChanged}
      />

      <Header.Action
        title="Editando a residência"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}
