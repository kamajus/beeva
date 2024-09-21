import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
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
import * as z from 'zod'

import Button from '@/components/Button'
import ButtonLink from '@/components/ButtonLink'
import TextField from '@/components/TextField'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { UserRepository } from '@/repositories/user.repository'

interface FormData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone: string
}

const schema = z.object({
  email: z
    .string({
      required_error: 'O email é obrigatória',
      invalid_type_error: 'Email inválido',
    })
    .email('Email inválido'),
  first_name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'Nome inválido',
    })
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  last_name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'Nome inválido',
    })
    .min(2, 'O sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres')
    .regex(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
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
  phone: z
    .string({
      required_error: 'O número de telefone é obrigatório',
      invalid_type_error: 'Número de telefone inválido',
    })
    .regex(/^\d{9}$/, 'O número de telefone está inválido'),
})

export default function SignIn() {
  const {
    handleSubmit,
    control,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
    },
    resolver: zodResolver(schema),
  })

  const router = useRouter()
  const alert = useAlert()
  const { signUp } = useSupabase()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const userRepository = useMemo(() => new UserRepository(), [])

  function onSubmit(data: FormData) {
    setLoading(true)
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
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                photo_url: null,
              })
              router.replace(`/verification/${data.email}`)
            } catch {
              alert.show({
                title: 'Erro na criação da conta',
                message:
                  'Algo de errado aconteceu, tente novamente mais tarde.',
              })
            }
          }
        } else {
          alert.show({
            title: 'Erro na autenticação',
            message: 'Algo de errado aconteceu, tente novamente mais tarde.',
          })
        }
      })
      .catch(() => {
        alert.show({
          title: 'Erro na autenticação',
          message: 'Algo de errado aconteceu, tente novamente mais tarde.',
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="text-xl font-poppins-semibold mb-5">Criar conta</Text>

        <View className="flex flex-col gap-y-5">
          <View>
            <Controller
              control={control}
              name="first_name"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label>Nome</TextField.Label>
                    <TextField.Container
                      error={errors.first_name?.message !== undefined}>
                      <TextField.Input
                        placeholder="Nome"
                        onChangeValue={field.onChange}
                        returnKeyType="next"
                        autoCapitalize="characters"
                        editable={!loading}
                        onSubmitEditing={() => setFocus('last_name')}
                        autoFocus
                        {...field}
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <TextField.Helper message={errors.first_name?.message} />
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="last_name"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label>Sobrenome</TextField.Label>
                    <TextField.Container
                      error={errors.last_name?.message !== undefined}>
                      <TextField.Input
                        placeholder="Sobrenome"
                        onChangeValue={field.onChange}
                        returnKeyType="next"
                        autoCapitalize="characters"
                        editable={!loading}
                        onSubmitEditing={() => setFocus('phone')}
                        {...field}
                      />
                    </TextField.Container>
                  </TextField.Root>

                  <TextField.Helper message={errors.last_name?.message} />
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
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label>Telefone</TextField.Label>
                    <TextField.Container
                      error={errors.phone?.message !== undefined}>
                      <TextField.Input
                        placeholder="Telefone"
                        inputMode="tel"
                        keyboardType="phone-pad"
                        onChangeValue={field.onChange}
                        returnKeyType="next"
                        onSubmitEditing={() => setFocus('email')}
                        editable={!loading}
                        {...field}
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
                        onChangeValue={field.onChange}
                        returnKeyType="next"
                        onSubmitEditing={() => setFocus('password')}
                        editable={!loading}
                        {...field}
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
              render={({ field }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label>Palavra-passe</TextField.Label>
                    <TextField.Container
                      error={errors.password?.message !== undefined}>
                      <TextField.Input
                        placeholder="Palavra-passe"
                        secureTextEntry={!passwordVisible}
                        onChangeValue={field.onChange}
                        editable={!loading}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        {...field}
                      />
                      <TouchableOpacity
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() =>
                          !loading && setPasswordVisible(!passwordVisible)
                        }>
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
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            title="Continuar"
          />

          <View className="flex justify-center items-center flex-row gap-2 w-full mt-5 mb-8">
            <ButtonLink href="/signin" disabled={loading}>
              <Text className="font-poppins-medium text-gray-700">
                Já tem uma conta?
              </Text>
              <Text className="text-primary font-poppins-medium">Entrar</Text>
            </ButtonLink>
          </View>
        </View>
      </View>

      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </ScrollView>
  )
}
