import { Lock, X } from 'lucide-react-native'
import { ScrollView, Text, View, Dimensions } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'

import Header from '@/components/Header'
import TouchableBrightness from '@/components/TouchableBrightness'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'

export default function Settings() {
  const { width } = Dimensions.get('screen')
  const { session } = useSupabase()
  const alert = useAlert()

  async function sendRecoveryEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      alert.showAlert({
        title: 'Erro na autenticação',
        message:
          'Ocorreu um erro ao tentar enviar o email para a alteração da palavra-passe, tente novamente mais tarde.',
      })
    } else {
      alert.showAlert({
        title: 'Sucesso',
        message:
          'Foi enviando um email com intruções para alterar a sua palavra-passe.',
      })
    }
  }

  return (
    <View className="relative bg-white">
      <View>
        <Header.Normal title="Segurança" />
      </View>

      <ScrollView className="bg-white h-full">
        <TouchableBrightness
          onPress={() => {
            alert.showAlert({
              title: 'Atenção',
              message: 'Você tem certeza que quer alterar a sua palavra-passe?',
              primaryLabel: 'Sim',
              secondaryLabel: 'Cancelar',
              onPressPrimary() {
                if (session?.user.email) {
                  sendRecoveryEmail(session?.user.email)
                }
              },
            })
          }}>
          <View
            style={{ width }}
            className="px-4 py-6 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">
              Alterar a sua palavra-passe
            </Text>
            <Lock size={30} color="#000000" />
          </View>
        </TouchableBrightness>

        <TouchableBrightness
          onPress={() => {
            SheetManager.show('account-delete-sheet')
          }}>
          <View
            style={{ width }}
            className="px-4 py-6 flex-row justify-between items-center">
            <Text className="text-base font-poppins-medium">
              Eliminar sua conta
            </Text>
            <X size={30} color={constants.colors.alert} />
          </View>
        </TouchableBrightness>
      </ScrollView>
    </View>
  )
}
