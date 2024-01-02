import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, Text, View, Dimensions } from 'react-native';
import { Avatar, Icon, Switch } from 'react-native-paper';

import Header from '../../components/Header';
import Constants from '../../constants';

export default function Settings() {
  const [isNotificationOn, SetNotificationOn] = useState(false);
  const { width } = Dimensions.get('screen');
  const router = useRouter();

  return (
    <View className="bg-white relative">
      <View className="absolute top-0">
        <Header.Normal title="Perfil & Configurações" goBack={router.back} />
      </View>
      <View>
        <Header.Normal title="Perfil & Configurações" goBack={router.back} />
      </View>
      <ScrollView className="bg-input">
        <Link href="/(settings)/perfil">
          <View style={{ width }} className="px-4 py-6 flex-row justify-between items-center">
            <View className="flex gap-x-3 flex-row">
              <Avatar.Image size={50} source={require('../../assets/images/avatar.png')} />
              <View>
                <Text className="font-medium text-base">Roberto Carlos</Text>
                <Text className="font-normal text-sm text-gray-400">zizo.hamdy016@gmail.com</Text>
              </View>
            </View>
            <Icon source="chevron-right" size={30} />
          </View>
        </Link>

        <View className="mb-4">
          <Link href="/(settings)/favorites">
            <View
              style={{ width }}
              className="bg-white px-4 py-6 flex-row justify-between items-center">
              <Text className="text-base font-medium">Meus favoritos</Text>
              <Icon source="chevron-right" size={30} />
            </View>
          </Link>
        </View>

        <View className="bg-white w-full px-4 py-6 mb-4 flex-row justify-between items-center">
          <Text className="text-base font-medium">Notificações</Text>
          <Switch
            value={isNotificationOn}
            color={Constants.colors.primary}
            onValueChange={() => {
              SetNotificationOn(!isNotificationOn);
            }}
          />
        </View>

        <View className="bg-white w-full px-4 py-6 mb-4 flex-row justify-between items-center">
          <Text className="text-base font-medium">Termos e privacidade</Text>

          <Icon source="chevron-right" size={30} />
        </View>

        <View className="bg-white w-full px-4 py-6 mb-4 flex-row justify-between items-center">
          <Text className="text-base font-medium">Terminar sessão</Text>

          <Icon source="exit-to-app" color="#E54D2E" size={30} />
        </View>

        <View className="w-full px-4 mb-4 flex-row gap-x-2 items-center">
          <Text className="text-sm font-semibold text-violet-500">Versão</Text>
          <Text className="text-sm font-normal text-violet-500">1.0.0</Text>
        </View>

        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>
    </View>
  );
}
