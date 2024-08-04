import clsx from 'clsx'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View, Image } from 'react-native'

import { IResidence } from '@/@types'
import IconButton from '@/components/IconButton'
import Skeleton from '@/components/Skeleton'
import { formatMoney } from '@/functions/format'
import { useSupabase } from '@/hooks/useSupabase'
import { useSavedResidenceStore } from '@/store/SavedResidenceStore'

interface IHomeCard extends IResidence {
  type: 'search' | 'big' | 'small'
}

export default function HomeCard(residence: IHomeCard) {
  const savedResidences = useSavedResidenceStore((state) => state.residences)
  const residenceSavedStatus = useSavedResidenceStore((state) => state.status)

  const { saveResidence, user } = useSupabase()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function checkSaved() {
      const isSaved = await residenceSavedStatus(residence.id, user)
      setSaved(isSaved)
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residence.id, savedResidences, user])

  return (
    <View className="mb-2">
      <Pressable onPress={() => router.push(`/residence/${residence.id}`)}>
        {residence.cover ? (
          <Image
            source={{ uri: String(residence.cover) }}
            alt={residence.description || ''}
            className={clsx('mt-5 w-full h-[300px] rounded-2xl mb-2 relative', {
              'mt-0 w-[272px] h-[220px] mr-2': residence.type === 'big',
              'mt-0 w-[172px] h-[190px] mr-2': residence.type === 'small',
            })}
          />
        ) : (
          <Skeleton
            className={clsx('mt-5 w-full h-[300px] rounded-2xl mb-2 relative', {
              'mt-0 w-[272px] h-[220px] mr-2': residence.type === 'big',
              'mt-0 w-[172px] h-[190px] mr-2': residence.type === 'small',
            })}
          />
        )}
      </Pressable>

      <View className="w-full gap-1 mt-2">
        <Text className="font-poppins-semibold text-base">
          {residence.location.length > 70
            ? `${residence.location.slice(0, 60)}...`
            : residence.location}
        </Text>
        <View className="flex flex-row gap-x-1">
          <Text className="text-base font-poppins-medium">
            {formatMoney(residence.price)}
          </Text>
          <Text
            className={clsx('text-base font-poppins-regular text-gray-400', {
              hidden: residence.state === 'sell',
            })}>
            /mês
          </Text>
        </View>
      </View>

      <IconButton
        name="Bookmark"
        color="#000000"
        fill={
          residence.owner_id !== user?.id
            ? saved
              ? '#000000'
              : 'transparent'
            : 'transparent'
        }
        disabled={
          residence.owner_id === user?.id || residence.owner_id === undefined
        }
        className={clsx('absolute top-[4px] right-3', {
          'absolute top-6 right-1': residence.type === 'search',
        })}
        onPress={() => {
          async function handleSaveResidence() {
            setSaved(!saved)
            await saveResidence(residence, !saved)
          }

          handleSaveResidence()
        }}
      />
    </View>
  )
}
