import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Text, View, StatusBar, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import * as yup from 'yup';

import { supabase } from '../config/supabase';
import Constants from '../constants';
import { useSupabase } from '../hooks/useSupabase';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  password: yup.string().required(),
});

export default function SignIn() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(schema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signUp } = useSupabase();
  const router = useRouter();

  function onSubmit(data: FormData) {
    signUp(data.email, data.password)
      .then(async () => {
        const { error } = await supabase
          .from('users')
          .upsert({ first_name: data.firstName, last_name: data.lastName });

        if (error?.code && error?.code !== '42501') {
          Alert.alert(
            'Erro na autenticação',
            'Algo de errado aconteceu, tente novamente mais tarde.',
          );
        }

        if (error?.code === '42501') {
          router.replace(`/verification/${data.email}`);
        }
      })
      .catch((response) => {
        Alert.alert('Erro na autenticação', response);
      });

    reset({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    });
  }

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="text-xl font-poppins-semibold mb-5">Registrar-se</Text>

        <View className="flex flex-col gap-y-3">
          <View>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Primeiro nome"
                    style={{
                      fontSize: 15,
                    }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    outlineColor="transparent"
                    activeOutlineColor={Constants.colors.primary}
                    error={errors.firstName?.message !== undefined}
                  />

                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.firstName?.message === undefined,
                    })}
                    type="error"
                    visible={errors.firstName?.message !== undefined}>
                    {errors.firstName?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="lastName"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Último nome"
                    style={{
                      fontSize: 15,
                    }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    outlineColor="transparent"
                    activeOutlineColor={Constants.colors.primary}
                    error={errors.lastName?.message !== undefined}
                  />
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.lastName?.message === undefined,
                    })}
                    type="error"
                    visible={errors.lastName?.message !== undefined}>
                    {errors.lastName?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Email"
                    style={{
                      fontSize: 15,
                    }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    outlineColor="transparent"
                    inputMode="email"
                    activeOutlineColor={Constants.colors.primary}
                    autoCapitalize="none"
                    error={errors.email?.message !== undefined}
                    keyboardType="email-address"
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
              render={({ field: { onChange, onBlur } }) => (
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
                    onBlur={onBlur}
                    onChangeText={onChange}
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

          <Text className="w-full font-poppins-regular text-gray-500">
            Ao se inscrever, você está concordando com os nossos{' '}
            <Text className="text-gray-700 font-poppins-medium">
              Termos, Condições e Políticas de Privacidade.
            </Text>
          </Text>

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
            Continuar
          </Button>

          <View className="flex justify-center items-center flex-row gap-2 w-full mt-5">
            <Text className="font-poppins-medium text-gray-700">Já tem uma conta?</Text>
            <Link className="text-primary font-poppins-medium" href="/signin">
              Entrar
            </Link>
          </View>
        </View>
      </View>

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  );
}
