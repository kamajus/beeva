import { LinearGradient } from 'expo-linear-gradient'
import { FC, ReactNode, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  ViewStyle,
  StyleProp,
  ViewProps,
} from 'react-native'

const { width } = Dimensions.get('window')

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient)

interface SkeletonComponentProps extends ViewProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

const SkeletonComponent: FC<SkeletonComponentProps> = ({
  children,
  style,
  ...props
}) => {
  const animatedValue = useMemo(() => new Animated.Value(0), [])

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )

    animation.start()

    return () => animation.stop()
  }, [animatedValue])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 2, width * 2],
  })

  return (
    <View style={[styles.container, style]} {...props}>
      <AnimatedLG
        colors={['#e0e0e0', '#c0c0c0', '#e0e0e0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}
      />
      {children}
    </View>
  )
}

export default SkeletonComponent

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    height: 150,
    width,
    overflow: 'hidden',
    position: 'relative',
  },
})
