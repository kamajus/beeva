import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, Text, View, StatusBar } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as yup from 'yup';

import Constants from '../constants';

interface FormData {
  email?: string;
  password?: string;
}

const schema = yup.object({
  email: yup.string().required().email(),
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

  function onSubmit(data: FormData) {
    console.log('onSubmit: ', data);

    reset({
      email: '',
      password: '',
    });

    router.replace('/(root)/home');
  }

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="font-semibold text-xl mb-5">Iniciar sessão</Text>
        <View className="flex flex-col gap-y-3">
          <View>
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Email"
                  style={{
                    fontSize: 15,
                  }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
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
              render={({ field: { onChange, onBlur, value } }) => (
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

          <Text className="text-[#8b6cef] font-medium">Algo deu errado?</Text>

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
          <Text className="font-medium text-gray-700">Ainda não tem uma conta?</Text>
          <Link className="text-[#8b6cef] font-medium" href="/signup">
            Crie uma
          </Link>
        </View>
      </View>

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  );
}
