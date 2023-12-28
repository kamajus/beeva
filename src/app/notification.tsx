import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';

import Notification from '../components/Notification';

export default function () {
  return (
    <ActionSheetProvider>
      <ScrollView>
        <Notification.Root title="Recentes">
          <Notification.Box />
          <Notification.Box />
        </Notification.Root>

        <Notification.Root title="Antigas">
          <Notification.Box />
          <Notification.Box />
          <Notification.Box />
          <Notification.Box />
          <Notification.Box />
          <Notification.Box />
        </Notification.Root>
        <StatusBar style="dark" backgroundColor="white" />
      </ScrollView>
    </ActionSheetProvider>
  );
}
