import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Dimensions, Pressable } from 'react-native';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import { Icon } from 'react-native-paper';

import Header from '../../../components/Header';
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
          <Pressable
            className="mb-4"
            onPress={() => {
              alert.showAlert(
                'Alerta',
                'Você deseja que nós enviemos para você um email de alteração de senha?',
                'Sim',
                () => {
                  sendRecoveryEmail(`${user?.email}`);
                },
                'Cancelar',
                () => {},
              );
            }}>
            <View
              style={{ width }}
              className="bg-white px-4 py-6 flex-row justify-between items-center">
              <Text className="text-base font-poppins-medium">Alterar a sua palavra-passe</Text>
              <Icon source="chevron-right" size={30} />
            </View>
          </Pressable>

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
