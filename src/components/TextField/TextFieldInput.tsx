import { TextInput, TextInputProps } from 'react-native';

export default function TextFieldInput(props: TextInputProps) {
  return (
    <TextInput
      cursorColor="#a78bfa"
      className="flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium"
      {...props}
    />
  );
}
