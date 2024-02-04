import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dimensions, ScrollView, View, Alert, KeyboardAvoidingView } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import * as yup from 'yup';

import Header from '../../../components/Header';
import { supabase } from '../../../config/supabase';
import Constants from '../../../constants';
import { useAlert } from '../../../hooks/useAlert';

interface FormData {
  password?: string;
  newPassword: string;
}

const schema = yup.object({
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'A senha deve conter pelo menos uma letra e um número'),
  newPassword: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'A senha deve conter pelo menos uma letra e um número'),
});

export default function Perfil() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const alert = useAlert();

  const { height } = Dimensions.get('screen');
  const [loading, setLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (isDirty) {
      setLoading(true);

      if (data.password === data.newPassword) {
        Alert.alert('Erro', 'A palavra antiga não pode ser a mesma que a actual!!!');
        setLoading(false);
      } else {
        const verifyResponse = await supabase.rpc('verify_user_password', {
          password: data.password,
        });

        if (verifyResponse.error) {
          console.error(verifyResponse.error);
          return false;
        }

        if (verifyResponse.data === true) {
          const { error, data: ResData } = await supabase.auth.updateUser({
            password: data.newPassword,
          });

          console.log(error);
          console.log(ResData);

          if (error) {
            alert.showAlert(
              'Sucesso',
              'Ouve algum erro ao tentar alterar a palavra-passe.',
              'Ok',
              () => {},
            );
          } else {
            alert.showAlert('Sucesso', 'A palavra-passe foi alterada com sucesso!', 'Ok', () => {});

            router.back();
          }
        } else {
          alert.showAlert('Alerta', 'A sua palavra-passe está incorrecta.', 'Ok', () => {});
        }
      }
    }

    reset({
      newPassword: '',
      password: '',
    });
    setLoading(false);
  };

  return (
    <View style={{ height }} className="bg-white">
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          style={{ marginTop: Constants.customHeaderDistance }}
          className="flex gap-y-9 px-4 mt-[2%] bg-white">
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
                    label="Actual senha"
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
              name="newPassword"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    label="Nova senha"
                    style={{
                      fontSize: 15,
                    }}
                    outlineColor="transparent"
                    activeOutlineColor={Constants.colors.primary}
                    secureTextEntry={!newPasswordVisible}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="none"
                    error={errors.newPassword?.message !== undefined}
                    right={
                      <TextInput.Icon
                        color="#667085"
                        onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                        icon={newPasswordVisible ? 'eye' : 'eye-off'}
                      />
                    }
                  />
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.newPassword?.message === undefined,
                    })}
                    type="error"
                    visible={errors.newPassword?.message !== undefined}>
                    {errors.newPassword?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Header.Action
        title="Alterar palavra-passe"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        goBack={router.back}
      />
    </View>
  );
}
