import clsx from 'clsx'
import { router } from 'expo-router'
import React, { ReactNode, useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacityProps,
} from 'react-native'

interface TouchableBrightnessProps extends TouchableOpacityProps {
  children: ReactNode
  href?: string
  onPress?: () => void
}

export default function TouchableBrightness({
  href,
  onPress,
  children,
  ...props
}: TouchableBrightnessProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        if (href) router.push(href)
        if (onPress) onPress()
      }}
      {...props}>
      <View
        className={clsx('bg-white', {
          'bg-input': isPressed,
        })}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  )
}
