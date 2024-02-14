import { yupResolver } from '@hookform/resolvers/yup';
import { decode } from 'base64-arraybuffer';
import clsx from 'clsx';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dimensions, Pressable, ScrollView, Text, View, KeyboardAvoidingView } from 'react-native';
import { Avatar, Button, HelperText } from 'react-native-paper';
import * as yup from 'yup';

import Header from '../../components/Header';
import TextField from '../../components/TextField';
import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import { useAlert } from '../../hooks/useAlert';
import { useSupabase } from '../../hooks/useSupabase';

interface FormData {
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: number;
}

const schema = yup.object({
  firstName: yup
    .string()
    .required('O campo de nome é obrigatório')
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .trim()
    .matches(/^[a-zA-Z]+$/, 'A expressão introduzida está invalida'),
  lastName: yup
    .string()
    .required('O campo de sobrenome é obrigatório')
    .min(2, 'O sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres')
    .trim()
    .matches(/^[a-zA-Z]+$/, 'A expressão introduzida está invalida'),
  email: yup
    .string()
    .email('Endereço de e-mail inválido')
    .required('O e-mail é obrigatório')
    .trim(),
  phone: yup.number(),
});

export default function Perfil() {
  const { user, setUser, session } = useSupabase();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.first_name ? user?.first_name : '',
      lastName: user?.last_name ? user?.last_name : '',
      email: user?.email ? user?.email : '',
      phone: user?.phone ? Number(user?.phone) : undefined,
    },
  });

  const navigation = useNavigation();

  const { height } = Dimensions.get('screen');

  const [loading, setLoading] = useState(false);
  const [forceExiting, setForceExiting] = useState(false);

  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isPhotoChanged, setPhotoChanged] = useState(false);

  const alert = useAlert();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets);
      setPhotoChanged(true);
    }
  };

  async function updatePerfil(data: {
    first_name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    phone: number | undefined;
    photo_url?: string;
  }) {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', user?.id);

    if (user?.email !== data.email) {
      alert.showAlert(
        'Alerta',
        'Por favor, confirme o e-mail que foi enviado para você. Após a confirmação, seu endereço de e-mail será atualizado.',
        'Ok',
        () => {},
      );

      supabase.auth.updateUser({
        email: data.email,
      });
    }

    if (error) {
      alert.showAlert(
        'Erro a atualizar informações',
        'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
        'Ok',
        () => {},
      );
    }

    if (setUser && user) {
      setUser({
        ...user,
        first_name: data.first_name ? data.first_name : user.first_name,
        last_name: data.last_name ? data.last_name : user.last_name,
        email: data.email ? data.email : user.email,
        phone: data.phone ? Number(data.phone) : user.phone,
        photo_url: data.photo_url
          ? data.photo_url + '?timestamp=' + new Date().getTime()
          : user.photo_url + '?timestamp=' + new Date().getTime(),
      });
    }

    reset({
      firstName: data.first_name ? data.first_name : user?.first_name,
      lastName: data.last_name ? data.last_name : user?.last_name,
      email: data.email ? `${data.email}` : user?.email,
      phone: data.phone,
    });

    setLoading(false);
    setForceExiting(true);
    navigation.goBack();
  }

  const onSubmit = async (data: FormData) => {
    if (isDirty || isPhotoChanged) {
      setLoading(true);

      if (isPhotoChanged) {
        const base64 = await FileSystem.readAsStringAsync(photo[0].uri, {
          encoding: 'base64',
        });

        await supabase.storage
          .from('avatars')
          .upload(`${user?.id}`, decode(base64), { contentType: 'image/png', upsert: true })
          .then(async () => {
            setPhotoChanged(false);
            const photo_url = `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/avatars/${user?.id}`;

            await updatePerfil({
              first_name: data.firstName,
              last_name: data.lastName,
              email: data.email,
              phone: data.phone,
              photo_url,
            });
          })
          .catch(() => {
            alert.showAlert(
              'Erro a atualizar informações',
              'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
              'Ok',
              () => {},
            );
          });
      } else {
        await updatePerfil({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
        });
      }
    }
  };

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (forceExiting) return;
        if (!loading && !isDirty && !isPhotoChanged) {
          return;
        }

        e.preventDefault();

        alert.showAlert(
          'Descartar alterações?',
          'Você possui alterações não salvas. Tem certeza de que deseja descartá-las e sair da tela?',
          'Descartar',
          () => navigation.dispatch(e.data.action),
          'Não sair',
          () => {},
        );
      }),
    [navigation, isDirty, isPhotoChanged, loading],
  );

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
                <Pressable onPress={pickImage} className="rounded-full border-2 border-[#393939]">
                  <Avatar.Image
                    size={150}
                    source={{
                      uri: photo.length === 0 ? `${user?.photo_url}` : photo[0].uri,
                      cache: 'reload',
                    }}
                  />
                </Pressable>
                <Button
                  style={{
                    height: 56,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: Constants.colors.primary,
                    borderRadius: 28,
                    marginTop: 10,
                  }}
                  onPress={pickImage}
                  mode="contained"
                  textColor="white"
                  uppercase={false}>
                  Modificar
                </Button>
              </View>
            ) : (
              <View>
                <Pressable onPress={pickImage} className="rounded-full border-2 border-[#393939]">
                  <Avatar.Text
                    size={150}
                    label={String(user?.first_name[0])}
                    color="#fff"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#212121',
                    }}
                  />
                </Pressable>

                <Button
                  style={{
                    height: 56,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#212121',
                    borderRadius: 28,
                    marginTop: 10,
                  }}
                  onPress={pickImage}
                  mode="contained"
                  textColor="white"
                  uppercase={false}>
                  Modificar
                </Button>
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
                    <TextField.Container error={errors.firstName?.message !== undefined}>
                      <TextField.Input
                        placeholder="Degite o teu nome"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Sobrenome</TextField.Label>
                    <TextField.Container error={errors.lastName?.message !== undefined}>
                      <TextField.Input
                        placeholder="Degite o teu sobrenome"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
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
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Email</TextField.Label>
                    <TextField.Container error={errors.email?.message !== undefined}>
                      <TextField.Input
                        placeholder="Degite o endereço de email"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
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

                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: session?.user.email === user?.email,
                    })}
                    type="error">
                    <Text
                      className="text-primary font-poppins-medium"
                      onPress={async () => {
                        await supabase.auth.resend({
                          type: 'email_change',
                          email: `${user?.email}`,
                          options: {
                            emailRedirectTo: 'https://example.com/welcome',
                          },
                        });
                      }}>
                      Enviar código para cofirmar email
                    </Text>
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <Text className="font-poppins-medium text-xs text-gray-500">
              OBS: Esse número vai estar visível para todos 🌐
            </Text>
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
                      <TextField.Label>Contacto</TextField.Label>
                      <TextField.Container error={errors.phone?.message !== undefined}>
                        <TextField.Input
                          placeholder="Degite o número de telefone"
                          value={value ? String(value) : ''}
                          onBlur={onBlur}
                          onChangeText={onChange}
                          keyboardType="numeric"
                        />
                      </TextField.Container>
                    </TextField.Root>
                    <HelperText
                      className="p-0 m-0 mt-2"
                      type="error"
                      visible={errors.phone?.message !== undefined}>
                      {errors.phone?.message}
                    </HelperText>

                    <HelperText
                      className="p-0 m-0 mt-2"
                      type="info"
                      visible={
                        false
                        // session?.user.phone_confirmed_at === undefined && user?.phone !== null
                      }>
                      <Text className="text-primary font-poppins-medium">
                        Confirmar o seu número de telefone
                      </Text>
                    </HelperText>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Header.Action title="Editar perfil" onPress={handleSubmit(onSubmit)} loading={loading} />
    </View>
  );
}
