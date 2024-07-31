/* eslint-disable jsx-a11y/alt-text */
import Carousel from 'pinar'
import React from 'react'
import { Image, StyleProp, ViewStyle } from 'react-native'

import Skeleton from './Skeleton'

import constants from '@/constants'
import { hexToRGBA } from '@/functions'

interface CarouselProps {
  autoplay?: boolean
  loop?: boolean
  style?: StyleProp<ViewStyle>
  photos?: string[] | null
}

export default function CustomCarousel({
  photos,
  style,
  autoplay,
  loop,
}: CarouselProps) {
  return (
    <Carousel
      style={style}
      autoplay={autoplay}
      loop={loop}
      controlsButtonStyle={{ display: 'none' }}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: hexToRGBA(constants.colors.primary, 0.5),
        display: photos && photos.length > 1 ? 'flex' : 'none',
      }}
      activeDotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: constants.colors.primary,
        display: photos && photos.length > 1 ? 'flex' : 'none',
      }}>
      {photos ? (
        photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={{ flex: 1 }} />
        ))
      ) : (
        <Skeleton style={{ flex: 1 }} />
      )}
    </Carousel>
  )
}
