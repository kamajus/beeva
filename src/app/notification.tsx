import clsx from 'clsx'
import { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, View, Text } from 'react-native'

import { INotification } from '@/assets/@types'
import NoNotification from '@/assets/images/no-notification'
import Header from '@/components/Header'
import NotificationBox from '@/components/NotificationBox'
import { supabase } from '@/config/supabase'
import { useCache } from '@/hooks/useCache'
import { useSupabase } from '@/hooks/useSupabase'

export default function Notification() {
  const { user } = useSupabase()
  const { notifications, setNotifications } = useCache()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      async function getData() {
        const { data } = await supabase
          .from('notifications')
          .select()
          .order('created_at', { ascending: false })
          .eq('user_id', user?.id)
          .returns<INotification[]>()

        if (data) {
          setNotifications(data)
        }
      }

      getData()
      setRefreshing(false)
    }, 2000)
  }, [setNotifications, user?.id])

  return (
    <View
      className={clsx('bg-white w-full h-full', {
        relative: notifications.length === 0,
      })}>
      <View>
        <Header.Normal title="Notificações" />
      </View>

      {notifications.length > 0 ? (
        <ScrollView
          className="w-full h-full"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {notifications.map((notification) => (
            <NotificationBox key={notification.id} {...notification} />
          ))}
        </ScrollView>
      ) : (
        <View className="w-full h-3/4 flex justify-center items-center">
          <NoNotification />
          <Text className="font-poppins-medium text-gray-400 text-center">
            Você não tem nehuma notificação.
          </Text>
        </View>
      )}
    </View>
  )
}
