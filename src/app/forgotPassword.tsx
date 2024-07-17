import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import { HelperText } from 'react-native-paper'
import * as yup from 'yup'

import Button from '../components/Button'
import Header from '../components/Header'
import TextField from '../components/TextField'
import { supabase } from '../config/supabase'
import { useAlert } from '../hooks/useAlert'

interface FormData {
  email: string
}

const schema = yup.object({
  email: yup
    .string()
    .email('Preencha com um e-mail válido')
    .required('O e-mail é obrigatório'),
})

export default function Confirmation() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const alert = useAlert()

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email)

    if (error) {
      alert.showAlert(
        'Erro na autenticação',
        'Ocorreu um erro ao tentar enviar um email de recuperação da conta, tente novamente mais tarde.',
        'Ok',
        () => {},
      )
    } else {
      alert.showAlert(
        'Sucesso',
        'Foi enviando um email para você conseguir alterar a sua senha.',
        'Ok',
        () => {},
      )
    }

    reset({
      email: '',
    })
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
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>E-mail</TextField.Label>
                    <TextField.Container
                      error={errors.email?.message !== undefined}>
                      <TextField.Input
                        placeholder="E-mail"
                        value={value}
                        onChangeText={onChange}
                        inputMode="email"
                        keyboardType="email-address"
                        onBlur={onBlur}
                      />
                    </TextField.Container>
                  </TextField.Root>

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
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Continuar"
          />
        </View>
      </ScrollView>
    </View>
  )
}
