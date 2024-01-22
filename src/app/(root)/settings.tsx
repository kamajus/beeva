import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Dimensions, Pressable } from 'react-native';
import { Avatar, Icon } from 'react-native-paper';

import { User } from '../../assets/@types';
import Header from '../../components/Header';
import { useSupabase } from '../../hooks/useSupabase';

export default function Settings() {
  const { width } = Dimensions.get('screen');
  const { signOut, session, getUserById } = useSupabase();
  const [userData, setUserData] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    getUserById().then((data) => {
      if (data) {
        setUserData(data);
      }
    });
  }, []);

  return (
    <View className="relative bg-white">
      <View>
        <Header.Normal title="Perfil & Configurações" goBack={router.back} />
      </View>

      <ScrollView className="bg-input">
        <Link href="/(settings)/perfil">
          <View style={{ width }} className="px-4 py-6 mb-20 flex-row justify-between items-center">
            <View className="flex gap-x-3 flex-row">
              <>
                {userData?.photo_url ? (
                  <Avatar.Image size={50} source={{ uri: userData.photo_url }} />
                ) : (
                  <Avatar.Text size={50} label={String(userData?.first_name[0])} />
                )}
              </>
              <View>
                <Text className="font-poppins-medium text-base">{`${userData?.first_name} ${userData?.last_name}`}</Text>
                <Text className="font-poppins-regular text-sm text-gray-400">
                  {userData?.email}
                </Text>
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

          <Icon source="exit-to-app" color="#E54D2E" size={30} />
        </Pressable>

        <View className="w-full p-4 pb-8 flex-row gap-x-2 items-center">
          <Text className="text-sm font-poppins-semibold text-[#212121]">Versão</Text>
          <Text className="text-sm font-poppins-regular text-[lightgray]">1.0.0</Text>
        </View>

        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>
    </View>
  );
}
