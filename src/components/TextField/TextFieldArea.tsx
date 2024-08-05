import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

import constants from '@/constants'

interface ITextFieldInput extends TextInputProps {
  onChangeValue?: (value: string) => void
}

const TextFieldArea = forwardRef<TextInput, ITextFieldInput>(
  function TextFieldArea({ className, onChangeValue, ...props }, ref) {
    return (
      <TextInput
        ref={ref}
        cursorColor={constants.colors.primary}
        className={twMerge(
          'flex flex-1 h-60 w-full px-2 py-4 text-sm font-poppins-medium',
          className,
        )}
        onChangeText={onChangeValue}
        style={{ textAlignVertical: 'top' }}
        multiline
        {...props}
      />
    )
  },
)

export default TextFieldArea
