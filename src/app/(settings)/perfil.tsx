import { yupResolver } from '@hookform/resolvers/yup';
import { decode } from 'base64-arraybuffer';
import clsx from 'clsx';
import ExpoConstants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dimensions, Pressable, ScrollView, Text, View, RefreshControl, Alert } from 'react-native';
import { Avatar, Button, HelperText } from 'react-native-paper';
import * as yup from 'yup';

import { User } from '../../assets/@types';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import { supabase } from '../../config/supabase';
import { useSupabase } from '../../hooks/useSupabase';

interface FormData {
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: number;
}

const schema = yup.object({
  firstName: yup.string().required('O nome é obrigatório'),
  lastName: yup.string().required('O sobrenome é obrigatório'),
  email: yup.string().email().required('O e-mail é obrigatório'),
  phone: yup.number().required('O telefone é obrigatório'),
});

export default function Perfil() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const { height } = Dimensions.get('screen');
  const [loading, setLoading] = useState(false);
  const { user, getUserById } = useSupabase();
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [wasPhotoChaged, setPhotoChanged] = useState(false);

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

  const getPerfil = async () => {
    getUserById().then((data) => {
      if (data) {
        setUserData(data);

        reset({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone ? Number(data.phone) : undefined,
        });
      }
    });
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

    if (error) {
      Alert.alert(
        'Erro a atualizar informações',
        'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
      );
    }

    setLoading(false);
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    if (wasPhotoChaged) {
      const base64 = await FileSystem.readAsStringAsync(photo[0].uri, {
        encoding: 'base64',
      });

      await supabase.storage
        .from('avatars')
        .upload(`${user?.id}`, decode(base64), { contentType: 'image/png', upsert: true })
        .then(async () => {
          const photo_url = `https://${process.env.EXPO_PUBLIC_PROJECT_ID}.supabase.co/storage/v1/object/public/avatars/${user?.id}`;

          await updatePerfil({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            photo_url,
          });
        })
        .catch(() => {
          Alert.alert(
            'Erro a atualizar informações',
            'Houve algum problema ao tentar atualizar as informações, verifica a tua conexão a internet ou tente denovo mais tarde.',
          );
        });
    }

    await updatePerfil({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getPerfil();
    }, 2000);
  }, []);

  useEffect(() => {
    getPerfil();
  }, []);

  return (
    <View style={{ height }} className="bg-white">
      <ScrollView
        style={{ marginTop: ExpoConstants.statusBarHeight * 2 }}
        className="flex gap-y-9 px-4 mt-[2%] bg-white"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="m-auto flex items-center justify-center">
          {userData?.photo_url || photo.length > 0 ? (
            <View>
              <Pressable onPress={pickImage} className="rounded-full border-2 border-[#393939]">
                <Avatar.Image
                  size={150}
                  source={{ uri: photo.length === 0 ? String(userData?.photo_url) : photo[0].uri }}
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
          ) : (
            <View>
              <Pressable onPress={pickImage} className="rounded-full border-2 border-[#393939]">
                <Avatar.Text
                  size={150}
                  label={String(userData?.first_name[0])}
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
                  <TextField.Label isRequired>Primeiro nome</TextField.Label>
                  <TextField.Container error={errors.firstName?.message !== undefined}>
                    <TextField.Input
                      placeholder="Degite o teu primeiro nome"
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
                  <TextField.Label isRequired>Último nome</TextField.Label>
                  <TextField.Container error={errors.lastName?.message !== undefined}>
                    <TextField.Input
                      placeholder="Degite o teu último nome"
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
              </View>
            )}
          />
        </View>

        <View>
          <Text className="font-poppins-medium text-xs text-gray-500">
            OBS: Esse número vai estar visível para todo o mundo.
          </Text>
          <View>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Telefone</TextField.Label>
                    <TextField.Container error={errors.phone?.message !== undefined}>
                      <TextField.Input
                        placeholder="Degite o número de telefone"
                        value={String(value)}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="numeric"
                      />
                    </TextField.Container>
                  </TextField.Root>
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.phone?.message === undefined,
                    })}
                    type="error"
                    visible={errors.phone?.message !== undefined}>
                    {errors.phone?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>
        </View>
        <View style={{ height: ExpoConstants.statusBarHeight }} />
      </ScrollView>
      <Header.Action
        title="Editar perfil"
        actionTitle="Salvar"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        goBack={router.back}
      />
    </View>
  );
}
