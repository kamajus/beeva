import React, { forwardRef, Ref } from 'react'
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ReturnKeyTypeOptions,
} from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import { twMerge } from 'tailwind-merge'

import constants from '@/constants'

interface TextFieldCurrencyProps {
  className?: string
  value: number
  onChange: (value: number) => void
  returnKeyType?: ReturnKeyTypeOptions
  editable?: boolean
  autoFocus?: boolean
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
}

const TextFieldCurrency = forwardRef<CurrencyInput, TextFieldCurrencyProps>(
  function TextFieldCurrency(
    {
      className,
      value,
      returnKeyType,
      autoFocus,
      editable,
      onChange,
      ...props
    },
    ref: Ref<CurrencyInput>,
  ) {
    return (
      <CurrencyInput
        ref={ref}
        onChangeValue={(value) => onChange(value)}
        returnKeyType={returnKeyType}
        autoFocus={autoFocus}
        editable={editable}
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        placeholder="0.00 kz"
        cursorColor={constants.colors.primary}
        className={twMerge(
          'flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium',
          className,
        )}
        value={value}
        {...props}
      />
    )
  },
)

export default TextFieldCurrency
