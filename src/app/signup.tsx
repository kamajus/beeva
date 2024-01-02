import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Text, View, StatusBar } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as yup from 'yup';

import Constants from '../constants';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const schema = yup.object({
  email: yup.string().required().email(),
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

  function onSubmit(data: FormData) {
    console.log('onSubmit: ', data);

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
        <Text className="text-xl font-semibold mb-5">Registrar-se</Text>

        <View className="flex flex-col gap-y-3">
          <View>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur } }) => (
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
                <TextInput
                  mode="outlined"
                  label="Email"
                  style={{
                    fontSize: 15,
                  }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  inputMode="email"
                  outlineColor="transparent"
                  activeOutlineColor={Constants.colors.primary}
                  error={errors.email?.message !== undefined}
                />
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
                  error={errors.password?.message !== undefined}
                  right={
                    <TextInput.Icon
                      color="#667085"
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      icon={passwordVisible ? 'eye' : 'eye-off'}
                    />
                  }
                />
              )}
            />
          </View>

          <Text className="w-full font-normal text-gray-500">
            Ao se inscrever, você está concordando com os nossos{' '}
            <Text className="text-gray-700 font-medium">
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
            <Text className="font-medium text-gray-700">Já tem uma conta?</Text>
            <Link className="text-primary font-medium" href="/signin">
              Entrar
            </Link>
          </View>
        </View>
      </View>

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  );
}
