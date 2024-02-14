import ExpoContants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View, Dimensions, ActivityIndicator, Linking } from 'react-native';
import { Avatar, Icon } from 'react-native-paper';

import Header from '../../components/Header';
import TouchableBrightness from '../../components/TouchableBrightness';
import Constants from '../../constants';
import { useAlert } from '../../hooks/useAlert';
import { useCache } from '../../hooks/useCache';
import { useSupabase } from '../../hooks/useSupabase';
import { useResidenceStore } from '../../store/ResidenceStore';

export default function Settings() {
  const { width } = Dimensions.get('screen');
  const resetResidenceCache = useResidenceStore((state) => state.resetResidenceCache);
  const { signOut, session, user } = useSupabase();
  const [exiting, setExiting] = useState(false);
  const { resetCache } = useCache();
  const router = useRouter();
  const alert = useAlert();

  return (
    <View className="relative bg-white">
      <View>
        <Header.Normal title="Perfil & Configurações" />
      </View>

      <ScrollView className="bg-white h-full">
        <TouchableBrightness href="/(settings)/perfil">
          <View style={{ width }} className="px-4 py-6 flex-row justify-between items-center">
            <View className="flex gap-x-3 flex-row">
              <View>
                {user?.photo_url ? (
                  <Avatar.Image size={50} source={{ uri: user.photo_url }} />
                ) : (
                  <Avatar.Text size={50} label={String(user?.first_name[0])} />
                )}
              </View>
              <View>
                <Text className="font-poppins-medium text-base">{`${user?.first_name} ${user?.last_name}`}</Text>
                <Text className="font-poppins-medium text-sm text-gray-400">{user?.email}</Text>
              </View>
            </View>
            <Icon source="chevron-right" size={30} />
          </View>
        </TouchableBrightness>

        <TouchableBrightness href="/residences">
          <View style={{ width }} className="px-4 py-6 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">Residências</Text>
            <Icon source="chevron-right" size={30} />
          </View>
        </TouchableBrightness>

        <TouchableBrightness href="/(settings)/secure">
          <View style={{ width }} className="px-4 py-6 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">Segurança</Text>
            <Icon source="chevron-right" size={30} />
          </View>
        </TouchableBrightness>

        <TouchableBrightness
          onPress={() =>
            Linking.openURL(process.env.EXPO_PUBLIC_WEBSITE_URL + '/termos-gerais' || '')
          }>
          <View className="w-full px-4 py-6 mb-4 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">Termos e privacidade</Text>
            <Icon source="open-in-new" size={30} />
          </View>
        </TouchableBrightness>

        {session && (
          <TouchableBrightness
            onPress={() => {
              alert.showAlert(
                'Alerta',
                'Você tem certeza que deseja terminar sessão?',
                'Sim',
                () => {
                  setExiting(true);
                  signOut().then(() => {
                    resetCache();
                    resetResidenceCache();
                    router.replace('/signin');
                  });
                },
                'Cancelar',
                () => {},
              );
            }}>
            <View className="w-full px-4 py-6 mb-4 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Terminar sessão</Text>
              {!exiting ? (
                <Icon source="logout" color="#E54D2E" size={30} />
              ) : (
                <ActivityIndicator animating color={Constants.colors.primary} size={30} />
              )}
            </View>
          </TouchableBrightness>
        )}

        <View className="w-full p-4 pb-8 flex-row gap-x-2 items-center">
          <Text className="text-sm font-poppins-semibold text-[#212121]">Versão</Text>
          <Text className="text-sm font-poppins-regular text-[lightgray]">
            {ExpoContants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
