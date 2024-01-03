import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Text, View, StatusBar, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import * as yup from 'yup';

import Constants from '../constants';
import { useSupabase } from '../hooks/useSupabase';

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignIn() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signInWithPassword } = useSupabase();

  function onSubmit(data: FormData) {
    signInWithPassword(data.email, data.password)
      .then(() => {
        reset({
          email: '',
          password: '',
        });

        router.replace('/(root)/home');
      })
      .catch((response) => {
        Alert.alert('Erro na autenticação', response);
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

          <View>
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
                    label="Senha"
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

          <Text className="text-[#8b6cef] font-poppins-medium">Algo deu errado?</Text>

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

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  );
}
