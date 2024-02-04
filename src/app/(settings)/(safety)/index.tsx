import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Dimensions, Pressable } from 'react-native';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import { Icon } from 'react-native-paper';

import Header from '../../../components/Header';

export default function Settings() {
  const { width } = Dimensions.get('screen');

  const router = useRouter();

  return (
    <SheetProvider>
      <View className="relative bg-white">
        <View>
          <Header.Normal title="Segurança" goBack={router.back} />
        </View>

        <ScrollView className="bg-white h-full">
          <Link href="/(settings)/(safety)/password">
            <View className="mb-4">
              <View
                style={{ width }}
                className="bg-white px-4 py-6 flex-row justify-between items-center">
                <Text className="text-base font-poppins-medium">Alterar a sua palavra-passe</Text>
                <Icon source="chevron-right" size={30} />
              </View>
            </View>
          </Link>

          <Pressable
            className="mb-4"
            onPress={() => {
              SheetManager.show('account-delete-sheet');
            }}>
            <View
              style={{ width }}
              className="bg-white px-4 py-6 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Eliminar sua conta</Text>
              <Icon source="close" size={30} color="#E54D2E" />
            </View>
          </Pressable>

          <StatusBar style="dark" backgroundColor="#fff" />
        </ScrollView>
      </View>
    </SheetProvider>
  );
}
