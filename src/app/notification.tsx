import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';

import Notification from '../components/Notification';
import { supabase } from '../config/supabase';
import { useSupabase } from '../hooks/useSupabase';

export default function () {
  const { user } = useSupabase();

  async function getData() {
    supabase
      .from('notifications')
      .select()
      .eq('user_id', user?.id);
  }

  useEffect(() => {
    getData();
  });

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
