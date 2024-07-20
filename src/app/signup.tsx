import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { Link, useRouter } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, Text, View, Linking, TouchableOpacity } from 'react-native'
import { HelperText } from 'react-native-paper'
import * as yup from 'yup'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
}

const schema = yup.object({
  email: yup
    .string()
    .email('Endereço de e-mail inválido')
    .required('O e-mail é obrigatório'),
  firstName: yup
    .string()
    .required('O campo de nome é obrigatório')
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .matches(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  lastName: yup
    .string()
    .required('O campo de sobrenome é obrigatório')
    .min(2, 'O sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres')
    .matches(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  password: yup
    .string()
    .required('A palavra-passe é obrigatória')
    .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'A palavra-passe deve conter pelo menos uma letra e um número',
    ),
})

export default function SignIn() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    resolver: yupResolver(schema),
  })

  const [passwordVisible, setPasswordVisible] = useState(false)
  const { signUp } = useSupabase()
  const router = useRouter()
  const alert = useAlert()

  function onSubmit(data: FormData) {
    signUp(data.email, data.password)
      .then(async (userData) => {
        if (userData) {
          if (
            userData &&
            userData.identities &&
            userData.identities.length === 0
          ) {
            setError('email', {
              message: 'Já exite um conta castrada com esse e-mail',
            })
          } else {
            const { error } = await supabase.from('users').insert([
              {
                id: userData.id,
                first_name: data.firstName,
                last_name: data.lastName,
              },
            ])

            if (error) {
              alert.showAlert(
                'Erro na autenticação',
                'Algo de errado aconteceu, tente novamente mais tarde.',
                'Ok',
                () => {},
              )
            } else {
              router.replace(`/verification/${data.email}`)
            }
          }
        } else {
          alert.showAlert(
            'Erro na autenticação',
            'Algo de errado aconteceu, tente novamente mais tarde.',
            'Ok',
            () => {},
          )
        }
      })
      .catch((error) => {
        console.log(error)

        alert.showAlert(
          'Erro na autenticação',
          'Algo de errado aconteceu, tente novamente mais tarde.',
          'Ok',
          () => {},
        )
      })
  }

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="text-xl font-poppins-semibold mb-5">Criar conta</Text>

        <View className="flex flex-col gap-y-3">
          <View>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Nome</TextField.Label>
                    <TextField.Container
                      error={errors.firstName?.message !== undefined}>
                      <TextField.Input
                        placeholder="Nome"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.firstName?.message === undefined,
                    })}
                    type="error"
                    visible={errors.firstName?.message !== undefined}>
                    {errors.firstName?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="lastName"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label>Sobrenome</TextField.Label>
                    <TextField.Container
                      error={errors.lastName?.message !== undefined}>
                      <TextField.Input
                        placeholder="Sobrenome"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.lastName?.message === undefined,
                    })}
                    type="error"
                    visible={errors.lastName?.message !== undefined}>
                    {errors.lastName?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

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

          <View>
            <Controller
              control={control}
              name="password"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
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

          <Text className="w-full font-poppins-regular text-gray-500">
            Ao se inscrever, você está concordando com os nossos{' '}
            <Text
              onPress={() =>
                Linking.openURL(
                  process.env.EXPO_PUBLIC_WEBSITE_URL + '/termos-gerais' || '',
                )
              }
              className="text-gray-700 font-poppins-medium">
              Termos, Condições e Políticas de Privacidade.
            </Text>
          </Text>

          <Button
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            title="Continuar"
          />

          <View className="flex justify-center items-center flex-row gap-2 w-full mt-5">
            <Text className="font-poppins-medium text-gray-700">
              Já tem uma conta?
            </Text>
            <Link className="text-primary font-poppins-medium" href="/signin">
              Entrar
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
