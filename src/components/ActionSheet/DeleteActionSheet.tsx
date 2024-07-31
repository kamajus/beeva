import { yupResolver } from '@hookform/resolvers/yup'
import { router } from 'expo-router'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, View, Text } from 'react-native'
import ActionSheet, { SheetProps } from 'react-native-actions-sheet'
import * as yup from 'yup'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'
import { useCache } from '@/hooks/useCache'
import { useResidenceStore } from '@/store/ResidenceStore'

interface IFormData {
  password: string
}

const schema = yup.object({
  password: yup
    .string()
    .required('A senha é obrigatória')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'A senha deve conter pelo menos uma letra e um número',
    )
    .trim(),
})

export default function DeleteActionSheet(props: SheetProps) {
  const resetResidenceCache = useResidenceStore(
    (state) => state.resetResidenceCache,
  )
  const { resetCache } = useCache()
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [loading, setLoading] = useState(false)
  const alert = useAlert()

  async function onSubmit({ password }: IFormData) {
    setLoading(true)

    const verifyResponse = await supabase.rpc('verify_user_password', {
      password,
    })

    if (verifyResponse.error) {
      return false
    }

    if (verifyResponse.data === true) {
      const { error } = await supabase.rpc('deleteUser')
      if (error) {
        alert.showAlert(
          'Erro',
          'Parece que aconteceu algum erro no processo de eliminação da sua conta, tente novamente mais tarde.',
          'Ok',
          () => {},
        )
      } else {
        supabase.auth.signOut()
        resetCache()
        resetResidenceCache()
        router.replace('/signin')
      }
      reset({
        password: '',
      })
    } else {
      setError(
        'password',
        { type: 'focus', message: 'A palavra-passe está incorrecta.' },
        { shouldFocus: true },
      )
    }
    setLoading(false)
  }

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView>
        <View className="px-7 py-4 flex flex-col gap-y-2">
          <Text className="font-poppins-semibold text-xl">Eliminar Conta</Text>
          <Text className="font-poppins-regular text-sm">
            Se você{' '}
            <Text className="font-poppins-medium text-red-500">
              eliminar a sua conta
            </Text>
            , não poderá desfrutar de todos os serviços que esta plataforma tem
            a oferecer.
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
                    <TextField.Container
                      error={errors.password?.message !== undefined}>
                      <TextField.Input
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="*su**a**s3nh*"
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <TextField.Helper message={errors.password?.message} />
                </View>
              )}
            />
          </View>

          <Button
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            className="bg-alert"
            title="Continuar"
          />
        </View>
      </ScrollView>
    </ActionSheet>
  )
}
