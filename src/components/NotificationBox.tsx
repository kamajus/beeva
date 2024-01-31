import clsx from 'clsx';
import { Pressable, Text, View } from 'react-native';
import { SheetProvider } from 'react-native-actions-sheet';
import { Icon } from 'react-native-paper';

import PublishedSince from './PublishedSince';
import { Notification } from '../assets/@types';

interface NotificationIcons {
  [key: string]: string;
}

const notificationIcons: NotificationIcons = {
  congratulation: 'party-popper',
};

export default function NotificationBox(props: Notification) {
  return (
    <View>
      <SheetProvider>
        <Pressable className="w-full px-2 py-2 flex items-center flex-row bg-[#fff] border-b border-gray-300">
          <View className="relative">
            <Icon source={`${notificationIcons[props.type]}`} color="#8b6cef" size={30} />
            <View
              className={clsx(
                'absolute bottom-7 left-7 bg-[#e83f5b] rounded-full flex justify-center items-center w-2 h-2',
                {
                  hidden: props.was_readed,
                },
              )}
            />
          </View>

          {/* !item.was_reade*/}
          <View className="p-4 pr-8">
            <Text className="font-poppins-medium text-sm leading-relaxed text-black">
              {props.description}
            </Text>

            <PublishedSince
              className="mt-1 font-poppins-medium text-xs text-gray-500"
              date={props.created_at}
            />
          </View>
        </Pressable>
      </SheetProvider>
    </View>
  );
}