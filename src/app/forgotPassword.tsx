import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as yup from 'yup';

import Header from '../components/Header';
import { supabase } from '../config/supabase';
import Constants from '../constants';
import { useAlert } from '../hooks/useAlert';

interface FormData {
  email: string;
}

const schema = yup.object({
  email: yup.string().email('Preencha com um e-mail válido').required('O e-mail é obrigatório'),
});

export default function Confirmation() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const alert = useAlert();

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email);

    if (error) {
      alert.showAlert(
        'Erro na autenticação',
        'Ocorreu um erro ao tentar enviar um email de recuperação da conta, tente novamente mais tarde.',
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

    reset({
      email: '',
    });
  }

  return (
    <View className="bg-white h-full">
      <Header.Normal title="Recuperar minha conta" />
      <ScrollView className="bg-white mt-4 px-6">
        <View>
          <View>
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="E-mail"
                    style={{
                      fontSize: 15,
                      textTransform: 'lowercase',
                    }}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    outlineColor="transparent"
                    inputMode="email"
                    keyboardType="email-address"
                    activeOutlineColor={Constants.colors.primary}
                    autoCapitalize="none"
                    error={errors.email?.message !== undefined}
                  />
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.email?.message === undefined,
                    })}
                    type="error"
                    visible={errors.email?.message !== undefined}>
                    {errors.email?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <Button
            style={{
              height: 58,
              display: 'flex',
              justifyContent: 'center',
              marginTop: 10,
            }}
            mode="contained"
            buttonColor={Constants.colors.primary}
            textColor="white"
            uppercase={false}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}>
            Continuar
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
