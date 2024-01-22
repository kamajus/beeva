import Carousel from 'pinar';
import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';

import { NewFileObject } from '../assets/@types';

interface CarouselProps {
  autoplay?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
  galery?: NewFileObject[] | undefined;
}

export default function CustomCarousel({ galery, style, autoplay, loop }: CarouselProps) {
  return (
    <Carousel
      style={style}
      autoplay={autoplay}
      loop={loop}
      controlsButtonStyle={{ display: 'none' }}>
      {galery ? (
        galery?.map((item, index) => (
          <Image key={index} source={{ uri: item.public_url }} style={{ flex: 1 }} />
        ))
      ) : (
        <View />
      )}
    </Carousel>
  );
}
