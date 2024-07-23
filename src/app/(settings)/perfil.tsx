import { yupResolver } from '@hookform/resolvers/yup'
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
import * as yup from 'yup'

import Avatar from '@/components/Avatar'
import Button from '@/components/Button'
import Header from '@/components/Header'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import Constants from '@/constants'
import { formatPhotoUrl } from '@/functions/format'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { UserRepository } from '@/repositories/user.repository'

interface FormData {
  firstName?: string
  lastName: string
  email?: string
  phone?: string
}

const schema = yup.object({
  firstName: yup
    .string()
    .required('O campo de nome é obrigatório')
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .trim()
    .matches(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  lastName: yup
    .string()
    .required('O campo de sobrenome é obrigatório')
    .min(2, 'O sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres')
    .trim()
    .matches(
      /^[a-zA-ZÀ-úÁáÂâÃãÉéÊêÍíÓóÔôÕõÚúÜüÇç]+$/,
      'A expressão introduzida está inválida',
    ),
  email: yup
    .string()
    .email('Preencha com um e-mail válido')
    .required('O e-mail é obrigatório')
    .trim(),
  phone: yup
    .string()
    .required('O número de telefone é obrigatório')
    .matches(/^\d{9}$/, 'O número de telefone está inválido'),
})

export default function Perfil() {
  const { user, setUser, session } = useSupabase()

  const userRepository = useMemo(() => new UserRepository(), [])

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      phone: user?.phone,
      email: session?.user.email,
    },
  })

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
    setAllowExiting(false)

    try {
      userRepository.update(user.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        photo_url: data.photo_url,
      })

      if (session?.user.email !== data.email) {
        alert.showAlert(
          'Alerta',
          'Por favor, confirme o e-mail que foi enviado para você. Após a confirmação, seu endereço de e-mail será atualizado.',
          'Ok',
          () => {},
        )

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
      alert.showAlert(
        'Erro a atualizar informações',
        'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
        'Ok',
        () => {},
      )
    }

    if (setUser && user) {
      setUser({
        ...user,
        first_name: data.first_name || user.first_name,
        last_name: data.last_name || user.last_name,
        phone: data.phone || user.phone,
        photo_url: data.photo_url
          ? formatPhotoUrl(data.photo_url)
          : formatPhotoUrl(user.photo_url),
      })
    }

    reset({
      firstName: data.first_name,
      lastName: data.last_name,
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
          const photoUrl = `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/avatars/${user.id}`

          await updatePerfil({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            photo_url: photoUrl,
          })
        }

        if (error) {
          alert.showAlert(
            'Erro a atualizar informações',
            'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
            'Ok',
            () => {},
          )
        }
      } else {
        await updatePerfil({
          first_name: data.firstName,
          last_name: data.lastName,
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

          alert.showAlert(
            'Descartar alterações?',
            'Você possui alterações não salvas. Tem certeza de que deseja descartá-las e sair da tela?',
            'Descartar',
            () => navigation.dispatch(e.data.action),
            'Não sair',
            () => {},
          )
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
        <ScrollView
          style={{ marginTop: Constants.customHeaderDistance }}
          showsVerticalScrollIndicator={false}
          className="flex gap-y-9 px-4 mt-[2%] bg-white">
          <View className="m-auto flex items-center justify-center">
            {user?.photo_url || photo.length > 0 ? (
              <View>
                <Pressable
                  onPress={pickImage}
                  disabled={isSubmitting}
                  className="rounded-full border-2 border-[#393939]">
                  <Avatar.Image
                    size={150}
                    source={{
                      uri:
                        photo.length === 0
                          ? `${user?.photo_url}`
                          : photo[0].uri,
                    }}
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
                  <Avatar.Text size={150} label={String(user?.first_name[0])} />
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
                        placeholder="Degite o teu nome"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={!isSubmitting}
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Sobrenome</TextField.Label>
                    <TextField.Container
                      error={errors.lastName?.message !== undefined}>
                      <TextField.Input
                        placeholder="Degite o teu sobrenome"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={!isSubmitting}
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
              name="email"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Email</TextField.Label>
                    <TextField.Container
                      error={errors.email?.message !== undefined}>
                      <TextField.Input
                        placeholder="Degite o endereço de email"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={!isSubmitting}
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextField.Root>
                      <TextField.Label isRequired>Telefone</TextField.Label>
                      <TextField.Container
                        error={errors.phone?.message !== undefined}>
                        <TextField.Input
                          placeholder="Degite o número de telefone"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          editable={!isSubmitting}
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
