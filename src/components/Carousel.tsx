import Carousel from 'pinar';
import React from 'react';
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a3c9a8',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#84b59f',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#69a297',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b6cef',
  },
  text: {
    color: '#1f2d3d',
    opacity: 0.7,
    fontSize: 48,
    fontWeight: 'bold',
  },
});

interface CarouselProps {
  autoplay?: boolean;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function CustomCarousel({ style, autoplay, loop }: CarouselProps) {
  return (
    <Carousel
      style={style}
      autoplay={autoplay}
      loop={loop}
      controlsButtonStyle={{ display: 'none' }}>
      <View style={styles.slide1}>
        <Text style={styles.text}>1</Text>
      </View>
      <View style={styles.slide2}>
        <Text style={styles.text}>2</Text>
      </View>
      <View style={styles.slide3}>
        <Text style={styles.text}>3</Text>
      </View>
      <View style={styles.slide4}>
        <Text style={styles.text}>4</Text>
      </View>
    </Carousel>
  );
}
