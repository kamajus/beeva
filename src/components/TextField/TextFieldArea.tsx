import { TextInputProps } from 'react-native'

import TextFieldInput from './TextFieldInput'

export default function TextFieldArea(props: TextInputProps) {
  return (
    <TextFieldInput
      multiline
      style={{
        height: 260,
        paddingVertical: 16,
        textAlignVertical: 'top',
        fontFamily: 'poppins-medium',
      }}
      {...props}
    />
  )
}
