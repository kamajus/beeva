import { yupResolver } from '@hookform/resolvers/yup';
import ExpoConstants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import * as yup from 'yup';

import Header from '../../components/Header';
import TextField from '../../components/TextField';
import Constants from '../../constants';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().required(),
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
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets);
    }
  };

  return (
    <View style={{ height }} className="bg-white">
      <ScrollView
        style={{ marginTop: ExpoConstants.statusBarHeight * 2 }}
        className="flex gap-y-9 px-4 mt-[2%] bg-white">
        <Pressable
          onPress={pickImage}
          className="m-auto flex items-center justify-center rounded-full border-2 border-black">
          {photo.length > 0 ? (
            <Avatar.Image size={150} source={{ uri: photo[0].uri }} />
          ) : (
            <Avatar.Text
              size={150}
              label="CA"
              color="#fff"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Constants.colors.primary,
              }}
            />
          )}
        </Pressable>
        <View>
          <Controller
            control={control}
            name="firstName"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField.Root>
                <TextField.Label isRequired>Primeiro nome</TextField.Label>
                <TextField.Container>
                  <TextField.Input
                    placeholder="João Felix"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                </TextField.Container>
              </TextField.Root>
            )}
          />
        </View>

        <View>
          <Controller
            control={control}
            name="firstName"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField.Root>
                <TextField.Label isRequired>Último nome</TextField.Label>
                <TextField.Container>
                  <TextField.Input
                    placeholder="De Almeida"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                </TextField.Container>
              </TextField.Root>
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
              <TextField.Root>
                <TextField.Label isRequired>Email</TextField.Label>
                <TextField.Container>
                  <TextField.Input
                    placeholder="joaofelix006@gmail.com"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                </TextField.Container>
              </TextField.Root>
            )}
          />
        </View>

        <View>
          <Text className="font-medium text-xs text-red-500">
            Esse número vai estar visível para todos.
          </Text>
          <View>
            <Controller
              control={control}
              name="email"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField.Root>
                  <TextField.Label isRequired>Número de telefone</TextField.Label>
                  <TextField.Container>
                    <TextField.Input
                      placeholder="+244 935 555 600"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  </TextField.Container>
                </TextField.Root>
              )}
            />
          </View>
        </View>
        <View style={{ height: ExpoConstants.statusBarHeight }} />
      </ScrollView>
      <Header.Action title="Editar perfil" actionTitle="Salvar" goBack={router.back} />
    </View>
  );
}
