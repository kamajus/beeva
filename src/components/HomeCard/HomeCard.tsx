import clsx from 'clsx'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { IResidence } from '../@/assets/@types'
import constants from '@/constants'
import { formatMoney } from '@/functions/format'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'
import IconButton from '../IconButton'

interface HomeCardProps extends IResidence {
  cardType: 'search' | 'big' | 'small'
}

export default function HomeCard(props: HomeCardProps) {
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { residenceIsFavorite, handleFavorite, user } = useSupabase()
  const [favorite, setFavorite] = useState(
    cachedResidences.some(({ residence: r }) => r.id === props.id),
  )

  useEffect(() => {
    residenceIsFavorite(props.id).then((data) => {
      setFavorite(data)
    })
  }, [props.id, residenceIsFavorite])

  return (
    <View className="mb-2">
      <Pressable onPress={() => router.push(`/residence/${props.id}`)}>
        <Image
          source={{ uri: String(props.cover) }}
          alt={props.description || ''}
          className={clsx('mt-5 w-full h-[300px] rounded-2xl mb-2 relative', {
            'mt-0 w-[272px] h-[220px] mr-2': props.cardType === 'big',
            'mt-0 w-[172px] h-[190px] mr-2': props.cardType === 'small',
          })}
        />
      </Pressable>

      <View className="w-full gap-1 mt-2">
        <View className="flex flex-row items-center">
          <Icon name="location-pin" color="black" size={19} />
          <Text className="font-poppins-medium text-sm ml-1">
            {props.location.length > 70
              ? `${props.location.slice(0, 60)}...`
              : props.location}
          </Text>
        </View>
        <Text
          className={clsx('font-poppins-semibold text-sm', {
            'text-base': props.cardType === 'search',
          })}>
          {formatMoney(props.price)}
        </Text>
      </View>

      <IconButton
        name="Bookmark"
        color={favorite ? constants.colors.primary : '#000'}
        fill={
          props.owner_id !== user?.id
            ? favorite
              ? constants.colors.primary
              : 'transparent'
            : 'transparent'
        }
        disabled={props.owner_id === user?.id}
        containerColor="#fff"
        className={clsx('absolute top-[4px] right-3', {
          'absolute top-6 right-1': props.cardType === 'search',
        })}
        onPress={() => {
          setFavorite(!favorite)
          handleFavorite(props.id, favorite)
          if (!favorite) addToResidences(props, 'favorites')
        }}
      />
    </View>
  )
}
