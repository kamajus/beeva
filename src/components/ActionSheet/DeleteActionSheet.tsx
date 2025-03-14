import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, View, Text } from 'react-native'
import ActionSheet, { SheetProps } from 'react-native-actions-sheet'
import * as z from 'zod'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'

interface IFormData {
  password: string
}

const schema = z.object({
  password: z
    .string({
      required_error: 'A senha é obrigatória',
      invalid_type_error: 'Senha inválida',
    })
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'A senha deve conter pelo menos uma letra e um número',
    )
    .trim(),
})

export default function DeleteActionSheet(props: SheetProps) {
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(schema),
  })

  const [loading, setLoading] = useState(false)

  const { signOut } = useSupabase()
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
        alert.show({
          title: 'Erro',
          message:
            'Parece que aconteceu algum erro no processo de eliminação da sua conta, tente novamente mais tarde.',
        })
      } else {
        signOut()
      }
      reset()
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
              render={({ field }) => (
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
                        placeholder="*su**a**s3nh*"
                        onChangeValue={field.onChange}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        {...field}
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
