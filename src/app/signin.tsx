import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as z from 'zod'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'

interface FormData {
  email: string
  password: string
}

const schema = z.object({
  email: z
    .string({
      required_error: 'O email é obrigatória',
      invalid_type_error: 'Email inválido',
    })
    .email('Email inválido'),
  password: z
    .string({
      required_error: 'A palavra-passe é obrigatória',
      invalid_type_error: 'Palavra-passe inválida',
    })
    .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'A palavra-passe deve conter pelo menos uma letra e um número',
    ),
})

export default function SignIn() {
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  })

  const [passwordVisible, setPasswordVisible] = useState(false)
  const { signInWithPassword } = useSupabase()
  const alert = useAlert()

  function onSubmit({ email, password }: FormData) {
    signInWithPassword(email, password)
      .then(() => router.replace('/(root)/home'))
      .catch((response) => {
        if (response.redirect) router.replace(response.redirect)
        else {
          alert.showAlert('Erro na autenticação', response.message, 'Ok')
        }
      })
  }

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="font-poppins-semibold text-xl mb-5">
          Iniciar sessão
        </Text>

        <View className="w-full" />
        <View className="flex flex-col gap-y-1">
          <View>
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>E-mail</TextField.Label>
                    <TextField.Container
                      error={errors.email?.message !== undefined}>
                      <TextField.Input
                        placeholder="E-mail"
                        onChangeValue={field.onChange}
                        returnKeyType="next"
                        autoFocus
                        {...field}
                      />
                    </TextField.Container>
                  </TextField.Root>
                  <TextField.Helper message={errors.email?.message} />
                </View>
              )}
            />
          </View>

          <View className="mb-4">
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Palavra-passe</TextField.Label>
                    <TextField.Container
                      error={errors.password?.message !== undefined}>
                      <TextField.Input
                        placeholder="Palavra-passe"
                        secureTextEntry={!passwordVisible}
                        onChangeValue={field.onChange}
                        {...field}
                      />
                      <TouchableOpacity
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? (
                          <Eye color="#374151" size={30} />
                        ) : (
                          <EyeOff color="#374151" size={30} />
                        )}
                      </TouchableOpacity>
                    </TextField.Container>
                  </TextField.Root>

                  <TextField.Helper message={errors.password?.message} />
                </View>
              )}
            />
          </View>

          <Link
            href="/forgotPassword"
            className="text-primary font-poppins-medium mb-4">
            Esqueceste a tua palavra-passe?
          </Link>

          <Button
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Entrar"
          />
        </View>

        <View className="flex justify-center items-center flex-row gap-2 w-full mt-5">
          <Text className="font-poppins-medium text-gray-700">
            Ainda não tem uma conta?
          </Text>
          <Link className="text-primary font-poppins-medium" href="/signup">
            Crie uma
          </Link>
        </View>
      </View>

      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </ScrollView>
  )
}
