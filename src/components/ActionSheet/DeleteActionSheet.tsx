import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, View, Text } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { Button, HelperText } from 'react-native-paper';
import * as yup from 'yup';

import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import { useAlert } from '../../hooks/useAlert';
import { useCache } from '../../hooks/useCache';
import { useResidenceStore } from '../../store/ResidenceStore';
import TextField from '../TextField';

interface FormData {
  password: string;
}

const schema = yup.object({
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'A senha deve conter pelo menos uma letra e um número'),
});

export default function DeleteActionSheet(props: SheetProps) {
  const resetResidenceCache = useResidenceStore((state) => state.resetResidenceCache);
  const { resetCache } = useCache();
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
  const alert = useAlert();

  async function onSubmit({ password }: FormData) {
    setLoading(true);

    const verifyResponse = await supabase.rpc('verify_user_password', {
      password,
    });

    if (verifyResponse.error) {
      return false;
    }

    if (verifyResponse.data === true) {
      const { error } = await supabase.rpc('deleteUser');
      if (error) {
        alert.showAlert(
          'Erro',
          'Parece que aconteceu algum erro no processo de eliminação da sua conta, tente novamente mais tarde.',
          'Ok',
          () => {},
        );
      } else {
        supabase.auth.signOut();
        resetCache();
        resetResidenceCache();
        router.replace('/signin');
      }

      reset({
        password: '',
      });
    } else {
      setError(
        'password',
        { type: 'focus', message: 'A palavra-passe está incorrecta.' },
        { shouldFocus: true },
      );
    }
    setLoading(false);
  }

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView>
        <View className="px-7 py-4 flex flex-col gap-y-2">
          <Text className="font-poppins-semibold text-xl">Eliminar Conta</Text>
          <Text className="font-poppins-regular text-sm">
            Se você <Text className="font-poppins-medium text-red-500">eliminar a sua conta</Text>,
            não poderá desfrutar de todos os serviços que esta plataforma tem a oferecer.
          </Text>

          <View>
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label
                      textStyle={{
                        fontSize: 14,
                      }}>
                      Degite a sua senha para continuar
                    </TextField.Label>
                    <TextField.Container error={errors.password?.message !== undefined}>
                      <TextField.Input
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="*su**a**s3nh*"
                      />
                    </TextField.Container>
                  </TextField.Root>
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

          <Button
            style={{
              height: 58,
              display: 'flex',
              justifyContent: 'center',
              marginTop: 10,
            }}
            mode="contained"
            buttonColor={Constants.colors.alert}
            textColor="white"
            uppercase={false}
            loading={loading}
            onPress={handleSubmit(onSubmit)}>
            Continuar
          </Button>
        </View>
      </ScrollView>
    </ActionSheet>
  );
}
