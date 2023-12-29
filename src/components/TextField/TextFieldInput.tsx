import { TextInput, TextInputProps } from 'react-native';

export default function TextFieldInput(props: TextInputProps) {
  return (
    <TextInput
      style={{ fontFamily: 'poppins-medium' }}
      cursorColor="#a78bfa"
      className="flex flex-1 h-14 w-full px-2 text-sm"
      {...props}
    />
  );
}
