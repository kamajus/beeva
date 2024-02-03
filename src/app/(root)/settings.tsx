import ExpoContants from 'expo-constants';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Dimensions, Pressable } from 'react-native';
import { Avatar, Icon } from 'react-native-paper';

import Header from '../../components/Header';
import { useSupabase } from '../../hooks/useSupabase';

export default function Settings() {
  const { width } = Dimensions.get('screen');
  const { signOut, session, user } = useSupabase();
  const router = useRouter();

  return (
    <View className="relative bg-white">
      <View>
        <Header.Normal title="Perfil & Configurações" goBack={router.back} />
      </View>

      <ScrollView className="bg-white h-full">
        <Link href="/(settings)/perfil">
          <View style={{ width }} className="px-4 py-6 mb-20 flex-row justify-between items-center">
            <View className="flex gap-x-3 flex-row">
              <>
                {user?.photo_url ? (
                  <Avatar.Image size={50} source={{ uri: user.photo_url }} />
                ) : (
                  <Avatar.Text size={50} label={String(user?.first_name[0])} />
                )}
              </>
              <View>
                <Text className="font-poppins-medium text-base">{`${user?.first_name} ${user?.last_name}`}</Text>
                <Text className="font-poppins-medium text-sm text-gray-400">{user?.email}</Text>
              </View>
            </View>
            <Icon source="chevron-right" size={30} />
          </View>
        </Link>

        <View className="mb-4">
          <Link href="/(settings)/residences">
            <View
              style={{ width }}
              className="bg-white px-4 py-6 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Residências</Text>
              <Icon source="chevron-right" size={30} />
            </View>
          </Link>
        </View>

        <View className="bg-white w-full px-4 py-6 mb-4 flex-row justify-between items-center">
          <Text className="text-base font-poppins-medium">Termos e privacidade</Text>

          <Icon source="chevron-right" size={30} />
        </View>

        <Pressable
          onPress={() => {
            signOut().then(() => {
              router.replace('/signin');
            });
          }}
          style={{ display: session ? 'flex' : 'none' }}
          className="bg-white w-full px-4 py-6 mb-4 flex-row justify-between items-center">
          <Text className="text-base font-poppins-medium">Terminar sessão</Text>

          <Icon source="logout" color="#E54D2E" size={30} />
        </Pressable>

        <View className="w-full p-4 pb-8 flex-row gap-x-2 items-center">
          <Text className="text-sm font-poppins-semibold text-[#212121]">Versão</Text>
          <Text className="text-sm font-poppins-regular text-[lightgray]">
            {ExpoContants.expoConfig?.version}
          </Text>
        </View>

        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>
    </View>
  );
}
