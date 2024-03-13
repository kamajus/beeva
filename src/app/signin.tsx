import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import * as yup from 'yup';

import Constants from '../constants';
import { useAlert } from '../hooks/useAlert';
import { useSupabase } from '../hooks/useSupabase';

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Preencha com um e-mail válido')
    .required('O e-mail é obrigatório')
    .trim(),
  password: yup
    .string()
    .required('A palavra-passe é obrigatória')
    .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'A palavra-passe deve conter pelo menos uma letra e um número',
    )
    .trim(),
});

export default function SignIn() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signInWithPassword } = useSupabase();
  const alert = useAlert();

  function onSubmit({ email, password }: FormData) {
    signInWithPassword(email, password)
      .then(() => router.replace('/(root)/home'))
      .catch((response) => {
        if (response.redirect) router.replace(response.redirect);
        else {
          alert.showAlert('Erro na autenticação', response.message, 'Ok', () => {});
          reset();
        }
      });
  }

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="font-poppins-semibold text-xl mb-5">Iniciar sessão</Text>

        <View className="w-full" />
        <View className="flex flex-col gap-y-1">
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

          <View className="mb-4">
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Palavra-passe"
                    style={{
                      fontSize: 15,
                    }}
                    outlineColor="transparent"
                    activeOutlineColor={Constants.colors.primary}
                    secureTextEntry={!passwordVisible}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="none"
                    error={errors.password?.message !== undefined}
                    right={
                      <TextInput.Icon
                        color="#667085"
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        icon={passwordVisible ? 'eye' : 'eye-off'}
                      />
                    }
                  />
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.password?.message === undefined,
                    })}
                    type="error"
                    visible={errors.password?.message !== undefined}>
                    {errors.password?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <Link href="/forgotPassword" className="text-[#8b6cef] font-poppins-medium mb-4">
            Esqueceste a tua palavra-passe?
          </Link>

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
            Entrar
          </Button>
        </View>

        <View className="flex justify-center items-center flex-row gap-2 w-full mt-5">
          <Text className="font-poppins-medium text-gray-700">Ainda não tem uma conta?</Text>
          <Link className="text-[#8b6cef] font-poppins-medium" href="/signup">
            Crie uma
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
