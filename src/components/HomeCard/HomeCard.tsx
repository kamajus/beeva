import clsx from 'clsx'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View, Image } from 'react-native'
import { IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Residence } from '../../assets/@types'
import useMoneyFormat from '../../hooks/useMoneyFormat'
import { useSupabase } from '../../hooks/useSupabase'
import { useResidenceStore } from '../../store/ResidenceStore'

interface HomeCardProps extends Residence {
  cardType: 'search' | 'big' | 'small'
}

export default function HomeCard(props: HomeCardProps) {
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)

  const { residenceIsFavorite, handleFavorite, user } = useSupabase()
  const [favorite, setFavorite] = useState(
    cachedResidences.some(({ residence: r }) => r.id === props.id),
  )
  const money = useMoneyFormat()

  useEffect(() => {
    residenceIsFavorite(props.id).then((data) => {
      setFavorite(data)
    })
  }, [])

  return (
    <View className="mb-2">
      <Pressable onPress={() => router.push(`/residence/${props.id}`)}>
        <Image
          source={{ uri: String(props.cover) }}
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
          {money.format(props.price)}
        </Text>
      </View>

      <IconButton
        icon={favorite ? 'bookmark' : 'bookmark-outline'}
        mode="outlined"
        iconColor={favorite ? '#fd6963' : '#000'}
        disabled={props.owner_id === user?.id}
        containerColor="#fff"
        className={clsx('absolute top-0.5 right-2.5', {
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
