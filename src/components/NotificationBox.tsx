import clsx from 'clsx'
import { icons } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { SheetProvider } from 'react-native-actions-sheet'

import { INotification } from '@/assets/@types'
import PublishedSince from '@/components/PublishedSince'
import TouchableBrightness from '@/components/TouchableBrightness'
import contants from '@/constants'

interface NotificationIcons {
  [key: string]: keyof typeof icons
}

const notificationIcons: NotificationIcons = {
  congratulations: 'PartyPopper',
  successful: 'Smile',
}

export default function NotificationBox(props: INotification) {
  const icon = notificationIcons[props.type]
  const LucideIcon = icons[icon]

  return (
    <View>
      <SheetProvider>
        <TouchableBrightness onPress={() => {}}>
          <View className="w-full px-2 py-2 flex items-center flex-row  border-b border-gray-300">
            <View className="relative">
              <LucideIcon color={contants.colors.primary} size={30} />
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
        </TouchableBrightness>
      </SheetProvider>
    </View>
  )
}
