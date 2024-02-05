import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View, Text } from 'react-native';

import { Notification as NotificationType } from '../assets/@types';
import NoNotification from '../assets/images/no-notification';
import NotificationBox from '../components/NotificationBox';
import { supabase } from '../config/supabase';
import { useCache } from '../hooks/useCache';
import { useSupabase } from '../hooks/useSupabase';

export default function () {
  const { user } = useSupabase();
  const { notifications, setNotifications } = useCache();

  async function getData() {
    const { data } = await supabase
      .from('notifications')
      .select()
      .eq('user_id', user?.id)
      .returns<NotificationType[]>();

    if (data) {
      setNotifications(data);
    }
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getData();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ActionSheetProvider>
      <View
        className={clsx('bg-white w-full h-full', {
          'flex items-center justify-center': notifications.length === 0,
        })}>
        {notifications.length > 0 ? (
          <ScrollView
            className="w-full h-full"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {notifications.map((notification) => (
              <NotificationBox key={notification.id} {...notification} />
            ))}
          </ScrollView>
        ) : (
          <View className="w-full flex justify-center items-center">
            <NoNotification />
            <Text className="font-poppins-medium text-gray-400 text-center">
              Você não tem nehuma notificação.
            </Text>
          </View>
        )}
      </View>
    </ActionSheetProvider>
  );
}
