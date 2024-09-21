import clsx from 'clsx'
import { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet'

import IconButton from '@/components/IconButton'
import { useToast } from '@/hooks/useToast'
import { NotificationRepository } from '@/repositories/notification.repository'
import { useNotificationStore } from '@/store/NotificationStore'

export default function NotificationMenuSheet(
  props: SheetProps<'notification-menu-sheet'>,
) {
  const toast = useToast()

  const notificationRepository = useMemo(() => new NotificationRepository(), [])
  const addNotification = useNotificationStore((state) => state.add)
  const removeNotification = useNotificationStore((state) => state.remove)

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 mb-5 border-b border-b-gray-300">
          <IconButton
            name="X"
            size={20}
            onPress={() => SheetManager.hide('notification-menu-sheet')}
          />
          <Text className="font-poppins-semibold text-sm">Opções</Text>
        </View>

        <View className="flex gap-y-6 px-2 py-4">
          <Pressable
            disabled={!props.payload.notification.was_readed}
            onPress={async () => {
              SheetManager.hide('notification-menu-sheet')

              await notificationRepository.update(
                props.payload.notification.id,
                {
                  was_readed: false,
                },
              )
              addNotification({
                ...props.payload.notification,
                was_readed: false,
              })

              toast.show({
                description: 'Notificação foi marcada como não lida',
              })
            }}
            className="px-4">
            <Text
              className={clsx('font-poppins-semibold text-lg', {
                'text-gray-400': !props.payload.notification.was_readed,
              })}>
              Marcar como não lida
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              SheetManager.hide('notification-menu-sheet')

              await notificationRepository.deleteById(
                props.payload.notification.id,
              )
              removeNotification(props.payload.notification.id)

              toast.show({
                description: 'Notificação foi apagada',
              })
            }}
            className="px-4">
            <Text className="font-poppins-semibold text-lg">
              Apagar notificação
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ActionSheet>
  )
}
