import { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface NotificationRootProps {
  title: string;
  children: ReactNode;
}

export default function NotificationRoot({ title, children }: NotificationRootProps) {
  return (
    <View>
      <Text className="px-2 py-4 font-medium text-base">{title}</Text>
      {children}
    </View>
  );
}
