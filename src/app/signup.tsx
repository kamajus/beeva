import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useRouter } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  ScrollView,
  Text,
  View,
  Linking,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import * as yup from 'yup'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { UserRepository } from '@/repositories/user.repository'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

const schema = yup.object({
  email: yup
    .string()
    .email('Endereço de e-mail inválido')
    .required('O e-mail é obrigatório'),
  firstName: yup
    .string()
    .required('O nome é obrigatório')
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .matches(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  lastName: yup
    .string()
    .required('O sobrenome é obrigatório')
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
  phone: yup
    .string()
    .required('O número de telefone é obrigatório')
    .matches(/^\d{9}$/, 'O número de telefone está inválido'),
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
      phone: '',
    },
    resolver: yupResolver(schema),
  })

  const router = useRouter()
  const alert = useAlert()
  const { signUp } = useSupabase()

  const [passwordVisible, setPasswordVisible] = useState(false)

  const userRepository = useMemo(() => new UserRepository(), [])

  function onSubmit(data: FormData) {
    signUp(data.email, data.phone, data.password)
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
            try {
              await userRepository.create({
                id: userData.id,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                photo_url: null,
              })

              router.replace(`/verification/${data.email}`)
            } catch {
              alert.showAlert(
                'Erro na criação da conta',
                'Algo de errado aconteceu, tente novamente mais tarde.',
                'Ok',
              )
            }
          }
        } else {
          alert.showAlert(
            'Erro na autenticação',
            'Algo de errado aconteceu, tente novamente mais tarde.',
            'Ok',
          )
        }
      })
      .catch(() => {
        alert.showAlert(
          'Erro na autenticação',
          'Algo de errado aconteceu, tente novamente mais tarde.',
          'Ok',
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

                  <TextField.Helper message={errors.firstName?.message} />
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

                  <TextField.Helper message={errors.lastName?.message} />
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Telefone</TextField.Label>
                    <TextField.Container
                      error={errors.phone?.message !== undefined}>
                      <TextField.Input
                        placeholder="Telefone"
                        value={value}
                        onChangeText={onChange}
                        inputMode="tel"
                        keyboardType="phone-pad"
                        onBlur={onBlur}
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <TextField.Helper message={errors.phone?.message} />
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

                  <TextField.Helper message={errors.email?.message} />
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

                  <TextField.Helper message={errors.password?.message} />
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

          <View className="flex justify-center items-center flex-row gap-2 w-full mt-5 mb-5">
            <Text className="font-poppins-medium text-gray-700">
              Já tem uma conta?
            </Text>
            <Link className="text-primary font-poppins-medium" href="/signin">
              Entrar
            </Link>
          </View>
        </View>
      </View>

      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </ScrollView>
  )
}
