import ExpoContants from 'expo-constants'
import { useRouter } from 'expo-router'
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
import Constants from '@/constants'
import { useAlert } from '@/hooks/useAlert'
import { useCache } from '@/hooks/useCache'
import { useSupabase } from '@/hooks/useSupabase'
import { useResidenceStore } from '@/store/ResidenceStore'

export default function Settings() {
  const { width } = Dimensions.get('screen')
  const resetResidenceCache = useResidenceStore(
    (state) => state.resetResidenceCache,
  )
  const { signOut, session, user } = useSupabase()
  const [exiting, setExiting] = useState(false)
  const { resetCache } = useCache()
  const router = useRouter()
  const alert = useAlert()

  return (
    <View className="relative bg-white">
      <View>
        <Header.Normal showIcon={false} title="Definições" />
      </View>

      <ScrollView className="bg-white h-full">
        <TouchableBrightness href="/(settings)/perfil">
          <View
            style={{ width }}
            className="px-4 py-6 flex-row justify-between items-center">
            <View className="flex gap-x-3 flex-row">
              <View>
                {user?.photo_url ? (
                  <Avatar.Image size={50} source={{ uri: user.photo_url }} />
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

        <TouchableBrightness href="/(settings)/secure">
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
              alert.showAlert(
                'Alerta',
                'Você tem certeza que deseja terminar sessão?',
                'Sim',
                () => {
                  setExiting(true)
                  signOut().then(() => {
                    resetCache()
                    resetResidenceCache()
                    router.replace('/signin')
                  })
                },
                'Cancelar',
                () => {},
              )
            }}>
            <View className="w-full px-4 py-6 mb-4 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">
                Terminar sessão
              </Text>
              {!exiting ? (
                <LogOut color="#E54D2E" size={30} />
              ) : (
                <ActivityIndicator
                  animating
                  color={Constants.colors.primary}
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
            {ExpoContants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
