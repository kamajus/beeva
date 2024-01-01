import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';

export default function () {
  return (
    <ActionSheetProvider>
      <ScrollView>
        <StatusBar style="dark" backgroundColor="white" />
      </ScrollView>
    </ActionSheetProvider>
  );
}
