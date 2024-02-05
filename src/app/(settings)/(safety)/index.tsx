import { useRouter } from 'expo-router';
import { ScrollView, Text, View, Dimensions } from 'react-native';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import { Icon } from 'react-native-paper';

import Header from '../../../components/Header';
import TouchableBrightness from '../../../components/TouchableBrightness';
import { supabase } from '../../../config/supabase';
import { useAlert } from '../../../hooks/useAlert';
import { useSupabase } from '../../../hooks/useSupabase';

export default function Settings() {
  const { width } = Dimensions.get('screen');

  const router = useRouter();
  const { user } = useSupabase();
  const alert = useAlert();

  async function sendRecoveryEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      alert.showAlert(
        'Erro na autenticação',
        'Ocorreu algum erro ao tentar enviar o email de confirmação. Verifique o seu enderço de email e tente novamente mais tarde',
        'Ok',
        () => {},
      );
    } else {
      alert.showAlert(
        'Sucesso',
        'Foi enviando um email para você conseguir alterar a sua senha.',
        'Ok',
        () => {},
      );
    }
  }

  return (
    <SheetProvider>
      <View className="relative bg-white">
        <View>
          <Header.Normal title="Segurança" goBack={router.back} />
        </View>

        <ScrollView className="bg-white h-full">
          <TouchableBrightness
            onPress={() => {
              alert.showAlert(
                'Alerta',
                'Você quer enviemos para você um email de alteração de senha?',
                'Sim',
                () => {
                  sendRecoveryEmail(`${user?.email}`);
                },
                'Cancelar',
                () => {},
              );
            }}>
            <View style={{ width }} className="px-4 py-6 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Alterar a sua palavra-passe</Text>
              <Icon source="key-change" size={30} />
            </View>
          </TouchableBrightness>

          <TouchableBrightness
            onPress={() => {
              SheetManager.show('account-delete-sheet');
            }}>
            <View style={{ width }} className="px-4 py-6 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Eliminar sua conta</Text>
              <Icon source="close" size={30} color="#E54D2E" />
            </View>
          </TouchableBrightness>
        </ScrollView>
      </View>
    </SheetProvider>
  );
}
