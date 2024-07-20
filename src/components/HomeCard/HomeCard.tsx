import clsx from 'clsx'
import { router } from 'expo-router'
import { MapPinned } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View, Image } from 'react-native'

import SkeletonComponent from '../Skeleton'

import { IResidence } from '@/assets/@types'
import IconButton from '@/components/IconButton'
import constants from '@/constants'
import { formatMoney } from '@/functions/format'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

interface IHomeCard extends IResidence {
  cardType: 'search' | 'big' | 'small'
}

export default function HomeCard(residence: IHomeCard) {
  const residenceSavedStatus = useResidenceStore(
    (state) => state.residenceSavedStatus,
  )
  const { handleSaveResidence, user } = useSupabase()
  const [savedResidence, setSavedResidence] = useState(false)

  useEffect(() => {
    async function checkSaved() {
      const isSaved = await residenceSavedStatus(residence.id, user)
      setSavedResidence(isSaved)
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residence.id, user])

  useEffect(() => {
    async function checkSaved() {
      console.log('user!!!!')
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <View className="mb-2">
      <Pressable onPress={() => router.push(`/residence/${residence.id}`)}>
        {residence.cover ? (
          <Image
            source={{ uri: String(residence.cover) }}
            alt={residence.description || ''}
            className={clsx('mt-5 w-full h-[300px] rounded-2xl mb-2 relative', {
              'mt-0 w-[272px] h-[220px] mr-2': residence.cardType === 'big',
              'mt-0 w-[172px] h-[190px] mr-2': residence.cardType === 'small',
            })}
          />
        ) : (
          <SkeletonComponent
            className={clsx('mt-5 w-full h-[300px] rounded-2xl mb-2 relative', {
              'mt-0 w-[272px] h-[220px] mr-2': residence.cardType === 'big',
              'mt-0 w-[172px] h-[190px] mr-2': residence.cardType === 'small',
            })}
          />
        )}
      </Pressable>

      <View className="w-full gap-1 mt-2">
        <View className="flex flex-row items-center">
          <MapPinned color="black" size={19} />
          <Text className="font-poppins-medium text-sm ml-1">
            {residence.location.length > 70
              ? `${residence.location.slice(0, 60)}...`
              : residence.location}
          </Text>
        </View>
        <Text
          className={clsx('font-poppins-semibold text-sm', {
            'text-base': residence.cardType === 'search',
          })}>
          {formatMoney(residence.price)}
        </Text>
      </View>

      <IconButton
        name="Bookmark"
        color={savedResidence ? constants.colors.primary : '#000000'}
        fill={
          residence.owner_id !== user?.id
            ? savedResidence
              ? constants.colors.primary
              : 'transparent'
            : 'transparent'
        }
        disabled={
          residence.owner_id === user?.id || residence.owner_id === undefined
        }
        className={clsx('absolute top-[4px] right-3', {
          'absolute top-6 right-1': residence.cardType === 'search',
        })}
        onPress={() => {
          async function handleSavingResidence() {
            setSavedResidence(!savedResidence)
            await handleSaveResidence(residence, !savedResidence)
          }

          handleSavingResidence()
        }}
      />
    </View>
  )
}
