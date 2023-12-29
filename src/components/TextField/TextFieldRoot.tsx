import { ReactNode } from 'react';
import { View } from 'react-native';

interface TextFieldRootProps {
  children: ReactNode;
}

export default function TextFieldRoot({ children }: TextFieldRootProps) {
  return <View className="flex-1">{children}</View>;
}
