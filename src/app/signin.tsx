import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { Link, useRouter } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { HelperText } from 'react-native-paper'
import * as yup from 'yup'

import Button from '../components/Button'
import TextField from '../components/TextField'
import { useAlert } from '../hooks/useAlert'
import { useSupabase } from '../hooks/useSupabase'

interface FormData {
  email: string
  password: string
}

const schema = yup.object({
  email: yup
    .string()
    .email('Preencha com um e-mail válido')
    .required('O e-mail é obrigatório')
    .trim(),
  password: yup
    .string()
    .required('A palavra-passe é obrigatória')
    .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'A palavra-passe deve conter pelo menos uma letra e um número',
    )
    .trim(),
})

export default function SignIn() {
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
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
          alert.showAlert(
            'Erro na autenticação',
            response.message,
            'Ok',
            () => {},
          )
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>E-mail</TextField.Label>
                    <TextField.Container
                      error={errors.email?.message !== undefined}>
                      <TextField.Input
                        placeholder="E-mail"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    </TextField.Container>
                  </TextField.Root>
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: !errors.email?.message,
                    })}
                    type="error"
                    visible={!!errors.email?.message}>
                    {errors.email?.message}
                  </HelperText>
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Palavra-passe</TextField.Label>
                    <TextField.Container
                      error={errors.password?.message !== undefined}>
                      <TextField.Input
                        placeholder="Palavra-passe"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        secureTextEntry={!passwordVisible}
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

                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: !errors.password?.message,
                    })}
                    type="error"
                    visible={!!errors.password?.message}>
                    {errors.password?.message}
                  </HelperText>
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
    </ScrollView>
  )
}
