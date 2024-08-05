import clsx from 'clsx'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  StatusBar,
  Linking,
} from 'react-native'
import { SheetProvider } from 'react-native-actions-sheet'

import { ICachedResidence } from '@/@types'
import Avatar from '@/components/Avatar'
import Carousel from '@/components/Carousel'
import Header from '@/components/Header'
import IconButton from '@/components/IconButton'
import PublishedSince from '@/components/PublishedSince'
import constants from '@/constants'
import { formatMoney, formatPhoneNumber } from '@/functions/format'
import { useSupabase } from '@/hooks/useSupabase'
import { LovedResidenceRepository } from '@/repositories/loved.residence.repository'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { UserRepository } from '@/repositories/user.repository'
import { useLovedResidenceStore } from '@/store/LovedResidenceStore'
import { useOpenedResidenceStore } from '@/store/OpenedResidenceStore'

export default function ResidenceDetail() {
  const [refreshing, setRefreshing] = useState(false)
  const openedResidences = useOpenedResidenceStore((state) => state.residences)
  const addOpenedResidence = useOpenedResidenceStore((state) => state.add)

  const lovedResidences = useLovedResidenceStore((state) => state.residences)
  const residenceLovedStatus = useLovedResidenceStore((state) => state.status)

  const userRepository = useMemo(() => new UserRepository(), [])
  const residenceRepository = useMemo(() => new ResidenceRepository(), [])
  const lovedResidenceRepository = useMemo(
    () => new LovedResidenceRepository(),
    [],
  )
  const notificationRepository = useMemo(() => new NotificationRepository(), [])
  const residenceNotificationRepository = useMemo(
    () => new ResidenceNotificationRepository(),
    [],
  )

  const { id } = useLocalSearchParams<{ id: string }>()

  const { loveResidence, user } = useSupabase()
  const [cachedData, setCachedData] = useState<ICachedResidence | undefined>(
    openedResidences.find((r) => r.residence.id === id),
  )

  const [showDescription, setShowDescription] = useState(false)

  const [lovedCount, setLovedCount] = useState(0)
  const [loved, setLoved] = useState(false)

  const getResidence = useCallback(async () => {
    const residenceData = await residenceRepository.findById(id)

    if (residenceData) {
      const userData = await userRepository.findById(residenceData.owner_id)
      if (userData) {
        setCachedData({
          residence: residenceData,
          user: userData,
        })

        addOpenedResidence(residenceData, userData)
      }
    }
  }, [addOpenedResidence, id, residenceRepository, userRepository])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getResidence().finally(() => setRefreshing(false))
  }, [getResidence])

  useEffect(() => {
    async function checkLoved() {
      if (id) {
        const isLoved = await residenceLovedStatus(id, user)
        setLoved(isLoved)
      }
    }

    checkLoved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lovedResidences, user])

  useEffect(() => {
    async function checkLoved() {
      if (id) {
        const counts =
          await lovedResidenceRepository.countLovesByResidenceId(id)

        setLovedCount(counts)
      }
    }

    checkLoved()
  }, [id, lovedResidenceRepository, loved])

  useEffect(() => {
    const checkCachedData = () => {
      const newData = openedResidences.find((r) => r?.residence.id === id)
      if (newData) {
        setCachedData(newData)
      } else {
        onRefresh()
      }
    }

    checkCachedData()
  }, [openedResidences, id, onRefresh])

  async function handleLoveResidence() {
    setLoved(!loved)
    await loveResidence(id, !loved)

    // Create a notification
    if (user.id !== cachedData?.residence.owner_id && !loved) {
      const notification = await notificationRepository.create({
        user_id: user.id,
        title: 'Alguém curtiu sua residência!',
        description:
          'Parabéns! Sua residência recebeu uma curtida de outro usuário.',
        type: 'residence-loved',
        was_readed: false,
      })

      await residenceNotificationRepository.create({
        residence_id: id,
        notification_id: notification.id,
      })
    }
  }

  return (
    <SheetProvider>
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

        <Header.Carousel
          owner_id={cachedData?.residence?.owner_id}
          residence_id={cachedData?.residence?.id}
        />

        <View className="px-4 bg-white flex mt-7">
          <View className="flex flex-row items-center justify-between">
            <View className="flex gap-x-3 flex-row">
              <View>
                {cachedData?.user?.photo_url ? (
                  <Avatar.Image
                    size={50}
                    src={cachedData?.user?.photo_url}
                    updateAt={user.updated_at}
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

            <View className="flex flex-row items-center justify-center">
              <Text className="font-poppins-regular text-base text-gray-400">
                {lovedCount > 1 && lovedCount}
              </Text>

              <IconButton
                name="Heart"
                fill={loved ? '#FF6F6F' : 'transparent'}
                onPress={handleLoveResidence}
                disabled={!cachedData?.residence}
              />
            </View>
          </View>

          <View className="flex gap-1 flex-row items-center mt-7">
            {cachedData?.residence?.price ? (
              <View>
                <Text className="text-2xl font-poppins-semibold">
                  {formatMoney(cachedData?.residence?.price)}
                </Text>
                <Text
                  className={clsx(
                    'text-xs font-poppins-regular text-gray-400',
                    {
                      hidden: cachedData?.residence?.state === 'sell',
                    },
                  )}>
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
            className={clsx('mt-7', {
              hidden: cachedData?.user?.id === user?.id,
            })}
            onPress={() => {
              if (cachedData?.user?.phone) {
                Linking.openURL(
                  `tel:${formatPhoneNumber(cachedData?.user?.phone)}`,
                )
              }
            }}>
            <Text className="font-poppins-regular text-xs text-gray-400">
              Telefone
            </Text>

            <Text className="font-poppins-medium text-gray-600 mt-2 mb-2">
              {cachedData?.user?.phone
                ? formatPhoneNumber(cachedData?.user?.phone)
                : '...'}
            </Text>
          </Pressable>

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
              {showDescription ? 'menos -' : 'mais +'}
            </Text>
          </Pressable>
        </View>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
      </ScrollView>
    </SheetProvider>
  )
}
