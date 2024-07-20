import clsx from 'clsx'
import { useLocalSearchParams, Link, router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native'

import { ICachedResidence } from '@/assets/@types'
import Avatar from '@/components/Avatar'
import Carousel from '@/components/Carousel'
import Header from '@/components/Header'
import IconButton from '@/components/IconButton'
import PublishedSince from '@/components/PublishedSince'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import { formatMoney } from '@/functions/format'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function ResidenceDetail() {
  const [refreshing, setRefreshing] = useState(false)
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const pushResidence = useResidenceStore((state) => state.pushResidence)
  const removeResidence = useResidenceStore((state) => state.removeResidence)

  const { id } = useLocalSearchParams<{ id: string }>()

  const { handleCallNotification, getUserById, getResidenceById, user } =
    useSupabase()
  const [cachedData, setCachedData] = useState<ICachedResidence | undefined>(
    cachedResidences.find((r) => r.residence.id === id),
  )

  const alert = useAlert()
  const [showDescription, setShowDescription] = useState(false)

  const getResidence = useCallback(async () => {
    const residenceData = await getResidenceById(id)

    if (residenceData) {
      const userData = await getUserById(residenceData.owner_id)
      if (userData) {
        setCachedData({
          residence: residenceData,
          user: userData,
        })

        pushResidence(residenceData, userData)
      }
    }
  }, [id, getResidenceById, getUserById, pushResidence])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getResidence().finally(() => setRefreshing(false))
  }, [getResidence])

  const deleteResidence = useCallback(async () => {
    if (cachedData?.residence?.photos) {
      const { error } = await supabase.from('residences').delete().eq('id', id)
      await supabase.storage
        .from('residences')
        .remove(
          cachedData.residence.photos.map(
            (image) => `${user?.id}/${id}/${image}`,
          ),
        )

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
  }, [cachedData, id, user, removeResidence, handleCallNotification, alert])

  useEffect(() => {
    const checkCachedData = () => {
      const newData = cachedResidences.find((r) => r?.residence.id === id)
      if (newData) {
        setCachedData(newData)
      } else {
        onRefresh()
      }
    }

    checkCachedData()
  }, [cachedResidences, id, onRefresh])

  return (
    <ScrollView
      className="flex-1 bg-white relative w-full"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Carousel
        photos={cachedData?.residence?.photos}
        style={{ height: 640 }}
      />
      <View className="px-4 bg-white flex mt-7">
        <View className="flex flex-row items-center justify-between">
          <View className="flex gap-x-3 flex-row">
            <View>
              {cachedData?.user?.photo_url ? (
                <Avatar.Image
                  size={50}
                  source={{ uri: cachedData?.user?.photo_url }}
                />
              ) : (
                <Avatar.Text
                  size={50}
                  label={cachedData?.user?.first_name?.[0]}
                />
              )}
            </View>
            <View>
              <Text className="font-poppins-medium text-base">
                {cachedData?.user
                  ? `${cachedData.user?.first_name} ${cachedData.user?.last_name}`
                  : '...'}
              </Text>
              <Text className="font-poppins-regular text-sm text-gray-400">
                {cachedData?.user && cachedData?.user?.id
                  ? cachedData.user?.id === user?.id
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
                      'Você tem certeza que quer apagar essa residência?',
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
                <IconButton
                  name="MessageSquare"
                  disabled={!cachedData?.residence}
                />
                <IconButton name="Phone" disabled={!cachedData?.residence} />
              </>
            )}
          </View>
        </View>

        <View className="flex gap-1 flex-row items-center mt-7">
          {cachedData?.residence?.price ? (
            <View>
              <Text className="text-2xl font-poppins-semibold">
                {formatMoney(cachedData?.residence?.price)}
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
              ? constants.categories
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
            date={cachedData?.residence?.created_at}
          />
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">
            Localização
          </Text>

          <Text className="font-poppins-medium text-gray-600 mt-2 mb-2">
            {cachedData?.residence?.location
              ? cachedData.residence.location
              : '...'}
          </Text>
        </View>

        <Pressable
          className="mt-7 mb-7"
          onPress={() => {
            if (
              cachedData?.residence?.description &&
              cachedData.residence.description.length > 100
            ) {
              setShowDescription(!showDescription)
            }
          }}>
          <Text className="font-poppins-semibold text-lg">Descrição</Text>
          <Text className="font-poppins-regular text-gray-600">
            {cachedData?.residence?.description
              ? cachedData.residence.description.length > 100 &&
                !showDescription
                ? `${cachedData.residence.description.slice(0, 100)}...`
                : cachedData.residence.description
              : '...'}
          </Text>
          <Text
            className={clsx('text-primary text-xs font-poppins-medium', {
              hidden: !(
                cachedData?.residence?.description &&
                cachedData.residence.description.length > 100
              ),
            })}>
            {showDescription ? ' - ver menos' : ' ver mais +'}
          </Text>
        </Pressable>
      </View>

      <Header.Carousel
        owner_id={cachedData?.residence?.owner_id}
        residence_id={cachedData?.residence?.id}
      />
    </ScrollView>
  )
}
