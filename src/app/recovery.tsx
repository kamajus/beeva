import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, View } from 'react-native'
import * as z from 'zod'

import Button from '@/components/Button'
import Header from '@/components/Header'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'

interface FormData {
  email: string
}

const schema = z.object({
  email: z
    .string({
      required_error: 'O campo de email é obrigatório',
      invalid_type_error: 'Email inválido',
    })
    .email('Preencha com um e-mail válido'),
})

export default function Confirmation() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(schema),
  })
  const alert = useAlert()

  async function onSubmit(data: FormData) {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email)

    if (error) {
      alert.show({
        title: 'Erro na autenticação',
        message:
          'Ocorreu um erro ao tentar enviar um email de recuperação da conta, tente novamente mais tarde.',
      })
    } else {
      alert.show({
        title: 'Sucesso',
        message:
          'Foi enviando um email com as instruções para conseguir alterar a sua senha.',
        onPressPrimary() {
          router.back()
          reset()
        },
      })
    }
  }

  return (
    <View className="bg-white h-full">
      <Header.Normal title="Recuperar minha conta" />
      <ScrollView className="bg-white mt-[5%] px-6">
        <View>
          <View className="mb-5">
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label>E-mail</TextField.Label>
                    <TextField.Container
                      error={errors.email?.message !== undefined}>
                      <TextField.Input
                        placeholder="E-mail"
                        inputMode="email"
                        keyboardType="email-address"
                        autoFocus
                        onChangeValue={field.onChange}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        editable={!isSubmitting}
                        {...field}
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <TextField.Helper message={errors.email?.message} />
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
