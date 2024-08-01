import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

import constants from '@/constants'

interface ITextFieldInput extends TextInputProps {
  onChangeValue?: (value: string) => void
}

const TextFieldInput = forwardRef<TextInput, ITextFieldInput>(
  function TextFieldInput({ className, onChangeValue, ...props }, ref) {
    return (
      <TextInput
        ref={ref}
        cursorColor={constants.colors.primary}
        className={twMerge(
          'flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium',
          className,
        )}
        onChangeText={onChangeValue}
        {...props}
      />
    )
  },
)

export default TextFieldInput
