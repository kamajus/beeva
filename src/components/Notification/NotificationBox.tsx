import { useActionSheet } from '@expo/react-native-action-sheet';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

interface NotificationBoxProps {
  onLongPress: () => void;
}

export default function NotificationBox() {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = ['Apagar', 'Marcar como lida', 'Cancelar'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        textStyle: {
          fontFamily: 'poppins-medium',
          fontSize: 15,
        },
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 1:
            // Save
            break;

          case destructiveButtonIndex:
            // Delete
            break;

          case cancelButtonIndex:
          // Canceled
        }
      },
    );
  };

  return <Box onLongPress={onPress} />;
}

function Box({ onLongPress }: NotificationBoxProps) {
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress()}
      className="px-2 py-2 flex items-center flex-row bg-[#fff] border-t border-t-slate-200">
      <Icon source="camera" color="#8b6cef" size={30} />

      <View className="p-4 pr-8">
        <Text className="font-medium text-sm leading-relaxed text-black">
          Você recebeu um convite para fazer parte da empresa Rocketseat
        </Text>
        <Text className="font-medium text-xs text-gray-500">Há 3 minutos</Text>
      </View>
    </TouchableOpacity>
  );
}
