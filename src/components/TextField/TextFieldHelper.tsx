import clsx from 'clsx'
import { View, Text, TextProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

type TextFieldHelperTypes = 'error'

interface ITextFieldHelper extends TextProps {
  type?: TextFieldHelperTypes
  message?: string
}

export default function TextFieldHelper({
  type = 'error',
  message,
  className,
  ...props
}: ITextFieldHelper) {
  if (!message) {
    return null
  }

  return (
    <View className="mt-2">
      <Text
        className={twMerge(
          clsx('font-poppins-regular text-xs mb-1', {
            'text-alert': type === 'error',
          }),
          className,
        )}
        {...props}>
        {message}
      </Text>
    </View>
  )
}
