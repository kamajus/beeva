/* eslint-disable jsx-a11y/alt-text */
import Carousel from 'pinar'
import React from 'react'
import { Image, StyleProp, View, ViewStyle } from 'react-native'

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
      controlsButtonStyle={{ display: 'none' }}>
      {photos ? (
        photos?.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={{ flex: 1 }} />
        ))
      ) : (
        <View />
      )}
    </Carousel>
  )
}
