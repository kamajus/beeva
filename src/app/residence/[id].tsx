import clsx from 'clsx'
import { useLocalSearchParams, Link, router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native'

import { ICachedResidence, IResidence } from '../../assets/@types'
import Avatar from '../../components/Avatar'
import Carousel from '../../components/Carousel'
import Header from '../../components/Header'
import IconButton from '../../components/IconButton'
import PublishedSince from '../../components/PublishedSince'
import { supabase } from '../../config/supabase'
import Constants from '../../constants'
import { formatMoney } from '../../functions/format'
import { useAlert } from '../../hooks/useAlert'
import { useSupabase } from '../../hooks/useSupabase'
import { useResidenceStore } from '../../store/ResidenceStore'

export default function ResidenceDetail() {
  const [refreshing, setRefreshing] = useState(false)
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const pushResidence = useResidenceStore((state) => state.pushResidence)
  const removeResidence = useResidenceStore((state) => state.removeResidence)

  const { id } = useLocalSearchParams<{ id: string }>()

  const { handleCallNotification, getUserById, user } = useSupabase()
  const [cachedData, setCachedData] = useState<ICachedResidence | undefined>(
    cachedResidences.find((r) => r.residence.id === id),
  )

  const alert = useAlert()
  const [showDescription, setShowDescription] = useState(false)

  const getResidence = useCallback(async () => {
    const { data: residenceData } = await supabase
      .from('residences')
      .select('*')
      .eq('id', id)
      .single<IResidence>()

    if (residenceData) {
      if (residenceData.owner_id === user?.id) {
        setCachedData({
          residence: residenceData,
          user,
        })

        pushResidence(residenceData, user)
      } else {
        await getUserById(residenceData.owner_id).then(async (userData) => {
          if (userData) {
            setCachedData({
              residence: residenceData,
              user: userData,
            })

            pushResidence(residenceData, userData)
          }
        })
      }
    }
  }, [id, pushResidence, getUserById, user])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      getResidence()
    }, 2000)
  }, [getResidence])

  async function deleteResidence() {
    if (cachedData?.residence?.photos) {
      const { error } = await supabase.from('residences').delete().eq('id', id)

      const filesToRemove = cachedData.residence?.photos.map(
        (image) => `${user?.id}/${id}/${image}`,
      )

      if (filesToRemove) {
        await supabase.storage.from('residences').remove(filesToRemove)
      }

      if (!error && id) {
        router.replace('/home')
        removeResidence(id)
        handleCallNotification(
          'Residência eliminada',
          'A residência foi eliminada com sucesso',
        )
      } else {
        alert.showAlert(
          'Erro na postagem',
          'Não foi possível eliminar a residência, tente mais tarde.',
          'Ok',
          () => {},
        )
      }
    }
  }

  useEffect(() => {
    getResidence()
  }, [getResidence])

  useEffect(() => {
    setCachedData(cachedResidences.find((r) => r.residence.id === id))
  }, [cachedResidences, id])

  return (
    <ScrollView
      className="flex-1 bg-white relative w-full"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Carousel photos={cachedData?.residence.photos} style={{ height: 640 }} />
      <View className="px-4 bg-white flex mt-7">
        <View className="flex flex-row items-center justify-between">
          <View className="flex gap-x-3 flex-row">
            <>
              {cachedData?.user?.photo_url ? (
                <Avatar.Image
                  size={50}
                  source={{ uri: cachedData?.user.photo_url }}
                />
              ) : (
                <Avatar.Text
                  size={50}
                  label={String(cachedData?.user?.first_name[0] || '...')}
                />
              )}
            </>
            <View className="">
              <Text className="font-poppins-medium text-base">
                {cachedData?.user
                  ? `${cachedData.user.first_name} ${cachedData.user.last_name}`
                  : '...'}
              </Text>
              <Text className="font-poppins-regular text-sm text-gray-400">
                {cachedData?.user && cachedData?.user.id
                  ? cachedData.user.id === user?.id
                    ? 'Eu (:'
                    : 'Dono'
                  : '...'}
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center">
            {cachedData?.user?.id === user?.id ? (
              <>
                <IconButton
                  name="Trash"
                  onPress={() => {
                    alert.showAlert(
                      'Alerta',
                      'Você tem ceteza que quer apagar essa residência?',
                      'Sim',
                      () => deleteResidence(),
                      'Cancelar',
                      () => {},
                    )
                  }}
                />
                {cachedData?.residence && (
                  <Link href={`/editor/${cachedData?.residence.id}`} asChild>
                    <IconButton name="Pencil" />
                  </Link>
                )}
              </>
            ) : (
              <>
                <IconButton name="MessageSquare" />
                <IconButton name="Phone" />
              </>
            )}
          </View>
        </View>

        <View className="flex gap-1 flex-row items-center mt-7">
          {cachedData?.residence?.price ? (
            <View>
              <Text className="text-2xl font-poppins-semibold">
                {formatMoney(Number(cachedData?.residence?.price))}
              </Text>
              <Text
                className={clsx('text-xs font-poppins-regular text-gray-400', {
                  hidden: cachedData?.residence?.state === 'sell',
                })}>
                /mês
              </Text>
            </View>
          ) : (
            <Text className="text-xs font-poppins-regular">...</Text>
          )}
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">
            Tipo
          </Text>
          <Text className="font-poppins-medium">
            {cachedData?.residence
              ? Constants.categories
                  .filter(
                    (categorie) =>
                      categorie.value === cachedData.residence.kind,
                  )
                  .map((categorie) => `${categorie.emoji} ${categorie.name}`)
              : '...'}
          </Text>
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">
            Data da postagem
          </Text>
          <PublishedSince
            className="font-poppins-medium"
            date={String(cachedData?.residence?.created_at)}
          />
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">
            Localização
          </Text>

          <Text className="font-poppins-medium text-gray-600 mt-2 mb-2">
            {cachedData?.residence?.location
              ? cachedData.residence?.location
              : '...'}
          </Text>
        </View>

        <Pressable
          className="mt-7 mb-7"
          onPress={() => {
            if (
              cachedData?.residence?.description &&
              cachedData.residence?.description.length > 100
            ) {
              setShowDescription(!showDescription)
            }
          }}>
          <Text className="font-poppins-semibold text-lg">Descrição</Text>
          <Text className="font-poppins-regular text-gray-600">
            {cachedData?.residence?.description &&
            cachedData.residence?.description.length > 100 &&
            !showDescription
              ? `${cachedData.residence?.description.slice(0, 100)}...`
              : cachedData?.residence?.description}
          </Text>
          <Text
            className={clsx('text-primary text-xs font-poppins-medium', {
              hidden: !(
                cachedData?.residence?.description &&
                cachedData.residence?.description.length > 100
              ),
            })}>
            {showDescription ? ' - ver menos' : ' ver mais +'}
          </Text>
        </Pressable>
      </View>

      {cachedData?.residence?.id && (
        <Header.Carousel
          owner_id={String(cachedData?.residence?.owner_id)}
          residence_id={String(cachedData?.residence?.id)}
        />
      )}
    </ScrollView>
  )
}
