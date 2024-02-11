import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as yup from 'yup';

import Header from '../components/Header';
import { supabase } from '../config/supabase';
import Constants from '../constants';
import { useAlert } from '../hooks/useAlert';
import { useSupabase } from '../hooks/useSupabase';

interface FormData {
  password: string;
  confirm: string;
}

const schema = yup.object({
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'A senha deve conter pelo menos uma letra e um número'),
  confirm: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'A senha deve conter pelo menos uma letra e um número'),
});

export default function Confirmation() {
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { handleCallNotification, user } = useSupabase();

  const alert = useAlert();

  async function onSubmit(data: FormData) {
    if (data.password === data.confirm) {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: data.password });
      setLoading(false);
      reset({
        password: '',
      });

      if (!error) {
        handleCallNotification(
          'Palavra atualizada',
          'A tua palavra-passe foi alterada com sucesso.',
        );
      } else {
        alert.showAlert(
          'Alerta',
          'Houve algum erro ao tentar alterar a sua palavra-passe',
          'Ok',
          () => {},
        );
      }

      if (user) {
        router.replace('/(root)/home');
      } else {
        router.replace('/signin');
      }
    } else {
      setError(
        'confirm',
        { type: 'focus', message: 'As palavra-passes não são iguais.' },
        { shouldFocus: true },
      );
    }
  }

  return (
    <View className="bg-white h-full">
      <Header.Normal title="Alterar palavra-passe" />
      <ScrollView className="bg-white mt-4 px-6">
        <View>
          <View className="mb-1">
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
                    label="Nova palavra-passe"
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

          <View>
            <Controller
              control={control}
              name="confirm"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Confirmar palavra-passe"
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
                    error={errors.confirm?.message !== undefined}
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
                      hidden: errors.confirm?.message === undefined,
                    })}
                    type="error"
                    visible={errors.confirm?.message !== undefined}>
                    {errors.confirm?.message}
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
