import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useState } from 'react';
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
  email: yup.string().email('Endereço de e-mail inválido').required('O e-mail é obrigatório'),
});

export default function Confirmation() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  async function onSubmit(data: FormData) {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.EXPO_PUBLIC_WEBSITE_URL}/reset`,
    });

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

    setLoading(false);
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
                    label="Email"
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
            loading={loading}
            onPress={handleSubmit(onSubmit)}>
            Continuar
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
