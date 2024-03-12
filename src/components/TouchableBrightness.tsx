import clsx from 'clsx';
import { router } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

interface TouchableBrightnessProps {
  children: ReactNode;
  href?: string;
  onPress?: () => void;
}

export default function TouchableBrightness(props: TouchableBrightnessProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        if (props.href) {
          router.push(props.href);
        }

        if (props.onPress) {
          props.onPress();
        }
      }}>
      <View
        className={clsx('bg-white', {
          'bg-input': isPressed,
        })}>
        {props.children}
      </View>
    </TouchableWithoutFeedback>
  );
}
