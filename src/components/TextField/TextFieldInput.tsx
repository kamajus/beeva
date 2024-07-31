import { TextInput, TextInputProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

import constants from '@/constants'

export default function TextFieldInput({
  value = '',
  className,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      cursorColor={constants.colors.primary}
      className={twMerge(
        'flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium',
        className,
      )}
      value={value}
      {...props}
    />
  )
}
