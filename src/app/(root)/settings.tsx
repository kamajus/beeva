import expoConstants from 'expo-constants'
import { ChevronRight, ExternalLink, LogOut } from 'lucide-react-native'
import { useState } from 'react'
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native'

import Avatar from '@/components/Avatar'
import Header from '@/components/Header'
import TouchableBrightness from '@/components/TouchableBrightness'
import constants from '@/constants'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'

export default function Settings() {
  const { width } = Dimensions.get('screen')
  const { signOut, session, user } = useSupabase()
  const [exiting, setExiting] = useState(false)

  const alert = useAlert()

  return (
    <View className="relative bg-white">
      <View>
        <Header.Normal showIcon={false} title="Definições" />
      </View>
      <ScrollView className="h-full">
        <TouchableBrightness href="/perfil">
          <View
            style={{ width }}
            className="px-4 py-6 flex-row justify-between items-center">
            <View className="flex gap-x-3 flex-row">
              <View>
                {user?.photo_url ? (
                  <Avatar.Image
                    size={50}
                    src={user.photo_url}
                    updateAt={user.updated_at}
                  />
                ) : (
                  <Avatar.Text size={50} label={user?.first_name[0] || 'U'} />
                )}
              </View>
              <View>
                <Text className="font-poppins-medium text-base">{`${user?.first_name} ${user?.last_name}`}</Text>
                <Text className="font-poppins-medium text-sm text-gray-400">
                  {session?.user.email}
                </Text>
              </View>
            </View>
            <ChevronRight color="#000000" size={30} />
          </View>
        </TouchableBrightness>

        <TouchableBrightness href="/residences">
          <View
            style={{ width }}
            className="px-4 py-6 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">
              Minhas residências
            </Text>
            <ChevronRight color="#000000" size={30} />
          </View>
        </TouchableBrightness>

        <TouchableBrightness href="/secure">
          <View
            style={{ width }}
            className="px-4 py-6 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">Segurança</Text>
            <ChevronRight color="#000000" size={30} />
          </View>
        </TouchableBrightness>

        <TouchableBrightness
          onPress={() =>
            Linking.openURL(
              process.env.EXPO_PUBLIC_WEBSITE_URL + '/termos-gerais' || '',
            )
          }>
          <View className="w-full px-4 py-6 mb-4 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">
              Termos e privacidade
            </Text>
            <ExternalLink color="#000000" size={30} />
          </View>
        </TouchableBrightness>

        {session && (
          <TouchableBrightness
            onPress={() => {
              alert.showAlert({
                title: 'Atenção',
                message: 'Você tem certeza que deseja terminar sessão?',
                primaryLabel: 'Sim',
                secondaryLabel: 'Cancelar',
                onPressPrimary() {
                  setExiting(true)
                  signOut()
                },
              })
            }}>
            <View className="w-full px-4 py-6 mb-5 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">
                Terminar sessão
              </Text>
              {!exiting ? (
                <LogOut color="#E54D2E" size={30} />
              ) : (
                <ActivityIndicator
                  animating
                  color={constants.colors.primary}
                  size={30}
                />
              )}
            </View>
          </TouchableBrightness>
        )}

        <View className="w-full p-4 pb-8 flex-row gap-x-2 items-center">
          <Text className="text-sm font-poppins-semibold text-[#212121]">
            Versão
          </Text>
          <Text className="text-sm font-poppins-regular text-[#d3d3d3]">
            {expoConstants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
