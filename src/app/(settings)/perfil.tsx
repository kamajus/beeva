import { zodResolver } from '@hookform/resolvers/zod'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Dimensions,
  Pressable,
  ScrollView,
  View,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native'
import * as z from 'zod'

import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Form from '@/components/Form'
import Header from '@/components/Header'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { UserRepository } from '@/repositories/user.repository'

interface FormData {
  first_name?: string
  last_name: string
  email?: string
  phone?: string
}

const schema = z.object({
  first_name: z
    .string({
      required_error: 'O campo de nome é obrigatório',
      invalid_type_error: 'Nome inválido',
    })
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .trim()
    .regex(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  last_name: z
    .string({
      required_error: 'O campo de sobrenome é obrigatório',
      invalid_type_error: 'Sobrenome inválido',
    })
    .min(2, 'O sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres')
    .trim()
    .regex(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  email: z
    .string({
      required_error: 'O campo de e-mail é obrigatório',
      invalid_type_error: 'E-mail inválido',
    })
    .email('Preencha com um e-mail válido')
    .trim(),
  phone: z
    .string({
      required_error: 'O campo de telefone é obrigatório',
      invalid_type_error: 'Número de telefone inválido',
    })
    .regex(/^\d{9}$/, 'O número de telefone está inválido'),
})

export default function Perfil() {
  const { user, setUser, session } = useSupabase()

  const userRepository = useMemo(() => new UserRepository(), [])

  const formHandler = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      phone: user?.phone,
      email: session?.user.email,
    },
  })

  const {
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors, isDirty, isSubmitting },
  } = formHandler

  const navigation = useNavigation()

  const { height } = Dimensions.get('screen')
  const [forceExiting, setForceExiting] = useState(false)
  const [allowExiting, setAllowExiting] = useState(true)

  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset[]>([])
  const [isPhotoChanged, setPhotoChanged] = useState(false)

  const alert = useAlert()

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setPhoto(result.assets)
      setPhotoChanged(true)
    }
  }

  async function updatePerfil(data: {
    first_name: string | undefined
    last_name: string | undefined
    email: string | undefined
    phone: string | undefined
    photo_url?: string
  }) {
    try {
      setAllowExiting(false)
      userRepository.update(user.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        photo_url: data.photo_url,
      })

      if (session?.user.email !== data.email) {
        alert.show({
          title: 'Sucesso',
          message:
            'Foi enviando um email com as instruções para conseguir alterar o seu email.',
        })

        supabase.auth.updateUser({
          email: data.email,
        })
      }

      if (session?.user.phone !== data.phone) {
        supabase.auth.updateUser({
          phone: data.phone,
        })
      }
    } catch {
      alert.show({
        title: 'Erro a atualizar informações',
        message:
          'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
      })
    }

    if (setUser && user) {
      setUser({
        ...user,
        first_name: data.first_name || user.first_name,
        last_name: data.last_name || user.last_name,
        phone: data.phone || user.phone,
        photo_url: data.photo_url,
      })
    }

    reset({
      first_name: data.first_name,
      last_name: data.last_name,
      email: session.user.email,
      phone: data.phone,
    })

    setForceExiting(true)
    setAllowExiting(true)
    navigation.goBack()
  }

  const onSubmit = async (data: FormData) => {
    if ((isDirty || isPhotoChanged) && user?.id) {
      if (isPhotoChanged) {
        const base64 = await FileSystem.readAsStringAsync(photo[0].uri, {
          encoding: 'base64',
        })

        const { error } = await supabase.storage
          .from('avatars')
          .upload(user.id, decode(base64), {
            contentType: 'image/png',
            upsert: true,
          })

        if (!error && data) {
          const photoUrl = `${constants.storageUrl}/avatars/${user.id}`

          await updatePerfil({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            photo_url: photoUrl,
          })
        }

        if (error) {
          alert.show({
            title: 'Erro a atualizar informações',
            message:
              'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
          })
        }
      } else {
        await updatePerfil({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
        })
      }
    }
  }

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (allowExiting) {
          if (forceExiting) return

          if (!isSubmitting && !isDirty && !isPhotoChanged) {
            return
          }

          e.preventDefault()

          alert.show({
            title: 'Descartar alterações?',
            message:
              'Você possui alterações não salvas. Tem certeza de que deseja descartá-las e sair da tela?',
            primaryLabel: 'Descartar',
            secondaryLabel: 'Não sair',
            onPressPrimary() {
              navigation.dispatch(e.data.action)
            },
          })
        }
      }),
    [
      navigation,
      isDirty,
      isPhotoChanged,
      isSubmitting,
      forceExiting,
      alert,
      allowExiting,
    ],
  )

  return (
    <View style={{ height }} className="bg-white">
      <KeyboardAvoidingView behavior="padding">
        <ScrollView style={{ marginTop: constants.customHeaderDistance }}>
          <Form
            className="flex gap-y-9 px-4 mt-[2%] mb-12 bg-white"
            handler={formHandler}>
            <View className="m-auto flex items-center justify-center">
              {user?.photo_url || photo.length > 0 ? (
                <View>
                  <Pressable
                    onPress={pickImage}
                    disabled={isSubmitting}
                    className="rounded-full border-2 border-[#393939]">
                    <Avatar.Image
                      size={150}
                      src={photo.length === 0 ? user?.photo_url : photo[0].uri}
                      updateAt={user.updated_at}
                    />
                  </Pressable>

                  <Button
                    disabled={isSubmitting}
                    onPress={pickImage}
                    className="rounded-full"
                    title="Modificar"
                  />
                </View>
              ) : (
                <View>
                  <Pressable
                    onPress={pickImage}
                    className="rounded-full border-2 border-[#393939]">
                    <Avatar.Text
                      size={150}
                      label={String(user?.first_name[0])}
                    />
                  </Pressable>

                  <Button
                    onPress={pickImage}
                    className="rounded-full"
                    title="Modificar"
                  />
                </View>
              )}
            </View>

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
                          placeholder="Degite o teu nome"
                          editable={!isSubmitting}
                          onChangeValue={field.onChange}
                          returnKeyType="next"
                          onSubmitEditing={() => setFocus('last_name')}
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
                          placeholder="Degite o teu sobrenome"
                          editable={!isSubmitting}
                          onChangeValue={field.onChange}
                          returnKeyType="next"
                          onSubmitEditing={() => setFocus('email')}
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
                name="email"
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <View>
                    <TextField.Root>
                      <TextField.Label>Email</TextField.Label>
                      <TextField.Container
                        error={errors.email?.message !== undefined}>
                        <TextField.Input
                          placeholder="Degite o endereço de email"
                          editable={!isSubmitting}
                          onChangeValue={field.onChange}
                          returnKeyType="next"
                          onSubmitEditing={() => setFocus('phone')}
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
              <View>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: false,
                  }}
                  render={({ field }) => (
                    <View>
                      <TextField.Root>
                        <TextField.Label>Telefone</TextField.Label>
                        <TextField.Container
                          error={errors.phone?.message !== undefined}>
                          <TextField.Input
                            placeholder="Degite o número de telefone"
                            keyboardType="numeric"
                            editable={!isSubmitting}
                            onChangeValue={field.onChange}
                            onSubmitEditing={handleSubmit(onSubmit)}
                            {...field}
                          />
                        </TextField.Container>
                      </TextField.Root>
                      <TextField.Helper message={errors.phone?.message} />
                      {/* <TextField.Helper
                      type="info"
                      message="Confirmar o seu número de telefone"
                    /> */}
                    </View>
                  )}
                />
              </View>
            </View>
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>

      <Header.Action
        title="Editar perfil"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />

      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
    </View>
  )
}
