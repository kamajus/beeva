import clsx from 'clsx'
import { ReactNode } from 'react'
import { ViewStyle, StyleProp, View } from 'react-native'

interface TextFieldContainerProps {
  children: ReactNode
  error?: boolean
  style?: StyleProp<ViewStyle>
  disableFocus?: boolean
}

export default function TextFieldContainer(props: TextFieldContainerProps) {
  return (
    <View
      className={clsx(
        'w-full px-2 flex-row items-center bg-input border-2 border-input rounded',
        {
          'focus:border-[#BA1A1A]': props.error && !props.disableFocus,
          'focus:border-primary': !props.error && !props.disableFocus,
        },
      )}
      style={props.style}>
      {props.children}
    </View>
  )
}
