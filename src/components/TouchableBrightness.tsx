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

  const buttonStyle = {
    backgroundColor: isPressed ? 'rgba(0, 0, 0, 0.1)' : 'white',
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={() => {
        handlePressOut();
        if (props.href) {
          router.push(props.href);
        }

        if (props.onPress) {
          props.onPress();
        }
      }}>
      <View style={[buttonStyle]}>{props.children}</View>
    </TouchableWithoutFeedback>
  );
}
