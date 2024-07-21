import clsx from 'clsx'
import { router } from 'expo-router'
import { icons } from 'lucide-react-native'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { SheetProvider } from 'react-native-actions-sheet'

import { INotification } from '@/assets/@types'
import PublishedSince from '@/components/PublishedSince'
import TouchableBrightness from '@/components/TouchableBrightness'
import constants from '@/constants'
import { ResidenceNotificationRepository } from '@/repositories/residence.notification.repository'

interface INotificationIcons {
  [key: string]: keyof typeof icons
}

const notificationIcons: INotificationIcons = {
  congratulations: 'PartyPopper',
  'residence-posted': 'Smile',
}

interface INotificationBoxLink {
  children: ReactNode
  notificationId: string
  notificationType: INotification['type']
}

const NotificationBoxLink = ({
  children,
  notificationType,
  notificationId,
}: INotificationBoxLink) => {
  const residenceNotificationRepository = useMemo(
    () => new ResidenceNotificationRepository(),
    [],
  )
  const [residenceId, setResidenceId] = useState<string | null>(null)

  useEffect(() => {
    if (notificationType.includes('residence')) {
      const fetchData = async () => {
        const data =
          await residenceNotificationRepository.findByNotificationId(
            notificationId,
          )
        if (data) {
          setResidenceId(data.residence_id)
        }
      }

      fetchData()
    }
  }, [notificationType, notificationId, residenceNotificationRepository])

  const handlePress = () => {
    if (residenceId) {
      router.push(`/residence/${residenceId}`)
    }
  }

  return (
    <TouchableBrightness onPress={handlePress}>{children}</TouchableBrightness>
  )
}

export default function NotificationBox(props: INotification) {
  const icon = notificationIcons[props.type]
  const LucideIcon = icons[icon]

  if (!LucideIcon) {
    return null
  }

  return (
    <View>
      <SheetProvider>
        <NotificationBoxLink
          notificationId={props.id}
          notificationType={props.type}>
          <View className="w-full px-2 py-2 flex items-center flex-row border-b border-gray-300">
            <View className="relative">
              <LucideIcon color={constants.colors.primary} size={30} />
              <View
                className={clsx(
                  'absolute bottom-7 left-7 bg-[#e83f5b] rounded-full flex justify-center items-center w-2 h-2',
                  {
                    hidden: props.was_readed,
                  },
                )}
              />
            </View>

            <View className="p-4 pr-8">
              <Text className="font-poppins-medium text-sm leading-relaxed text-black">
                {props.description}
              </Text>

              <PublishedSince
                className="mt-1 font-poppins-medium text-xs text-gray-500"
                date={props.created_at}
              />
            </View>
          </View>
        </NotificationBoxLink>
      </SheetProvider>
    </View>
  )
}
