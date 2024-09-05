import clsx from 'clsx'
import { router } from 'expo-router'
import { icons } from 'lucide-react-native'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'

import { INotification } from '@/@types'
import PublishedSince from '@/components/PublishedSince'
import TouchableBrightness from '@/components/TouchableBrightness'
import constants from '@/constants'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'
import { useNotificationStore } from '@/store/NotificationStore'
import { useResidenceNotificationStore } from '@/store/ResidenceNotificationStore'

interface INotificationIcons {
  [key: string]: keyof typeof icons
}

const notificationIcons: INotificationIcons = {
  'new-user-account': 'PartyPopper',
  'residence-posted': 'Smile',
  'residence-loved': 'Heart',
  'wishe-found': 'Sparkles',
}

interface INotificationBoxLink {
  children: ReactNode
  notification: INotification
}

const NotificationBoxLink = ({
  children,
  notification,
}: INotificationBoxLink) => {
  const getByNotificationId = useResidenceNotificationStore(
    (state) => state.getByNotificationId,
  )
  const addNotification = useNotificationStore((state) => state.add)
  const addResidenceNotification = useResidenceNotificationStore(
    (state) => state.add,
  )
  const notificationRepository = useMemo(() => new NotificationRepository(), [])
  const residenceNotificationRepository = useMemo(
    () => new ResidenceNotificationRepository(),
    [],
  )
  const [residenceId, setResidenceId] = useState<string | null>(null)

  useEffect(() => {
    if (
      notification.type === 'residence-posted' ||
      notification.type === 'wishe-found'
    ) {
      const fetchData = async () => {
        const residenceNotification = getByNotificationId(notification.id)

        if (!residenceNotification) {
          const data = await residenceNotificationRepository.find({
            notification_id: notification.id,
          })

          if (data.length !== 0) {
            setResidenceId(data[0].residence_id)
            addResidenceNotification(data[0])
          }
        }

        if (residenceNotification) {
          setResidenceId(residenceNotification.residence_id)
        }
      }

      fetchData()
    }
  }, [
    notification,
    residenceNotificationRepository,
    getByNotificationId,
    addResidenceNotification,
  ])

  async function handlePress(notification: INotification) {
    await notificationRepository.update(notification.id, {
      was_readed: true,
    })

    addNotification({
      ...notification,
      was_readed: true,
    })

    if (residenceId) {
      router.push(`/residence/${residenceId}`)
    }
  }

  return (
    <TouchableBrightness
      onPress={() => handlePress(notification)}
      onLongPress={() => {
        SheetManager.show('notification-menu-sheet', {
          payload: { notification },
        })
      }}>
      {children}
    </TouchableBrightness>
  )
}

export default function NotificationBox(notification: INotification) {
  const icon = notificationIcons[notification.type]
  const LucideIcon = icons[icon]

  if (!LucideIcon) {
    return null
  }

  return (
    <View>
      <NotificationBoxLink notification={notification}>
        <View className="w-full px-2 py-2 flex items-center flex-row border-b border-gray-300">
          <View className="relative">
            <LucideIcon color={constants.colors.primary} size={30} />
            <View
              className={clsx(
                'absolute bottom-7 left-7 bg-[#e83f5b] rounded-full flex justify-center items-center w-2 h-2',
                {
                  hidden: notification.was_readed,
                },
              )}
            />
          </View>

          <View className="p-4 pr-8">
            <Text className="font-poppins-medium text-sm leading-relaxed text-black">
              {notification.description}
            </Text>

            <PublishedSince
              className="mt-1 font-poppins-medium text-xs text-gray-500"
              date={notification.created_at}
            />
          </View>
        </View>
      </NotificationBoxLink>
    </View>
  )
}
