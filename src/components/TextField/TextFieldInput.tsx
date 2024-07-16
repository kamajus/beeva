import { TextInput, TextInputProps } from 'react-native'

import Constants from '../../constants'

export default function TextFieldInput(props: TextInputProps) {
  return (
    <TextInput
      cursorColor={Constants.colors.primary}
      className="flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium"
      {...props}
    />
  )
}
