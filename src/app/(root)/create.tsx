import { yupResolver } from '@hookform/resolvers/yup';
import { decode } from 'base64-arraybuffer';
import clsx from 'clsx';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, Text, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { HelperText, RadioButton } from 'react-native-paper';
import * as yup from 'yup';

import { Residence } from '../../assets/@types';
import GaleryGrid from '../../components/GaleryGrid';
import Header from '../../components/Header';
import SearchPlace from '../../components/SearchPlace';
import TextField from '../../components/TextField';
import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import { useSupabase } from '../../hooks/useSupabase';

interface FormData {
  price: number;
  description?: string;
  location?: string;
}

const schema = yup.object({
  price: yup
    .number()
    .typeError('O preço deve ser um número')
    .required('O preço é obrigatório')
    .positive('O preço deve ser um número positivo'),

  description: yup
    .string()
    .required('A descrição é obrigatória')
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(200, 'A descrição não pode ter mais de 200 caracteres'),

  location: yup
    .string()
    .required('A localização é obrigatória')
    .min(3, 'A localização deve ter pelo menos 3 caracteres')
    .max(150, 'A localização não pode ter mais de 150 caracteres'),
});

export default function Editor() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [cover, setCover] = useState<string | null>();
  const [price, setPrice] = useState<number | null>(0);
  const [kind, setKind] = useState('apartment');
  const [state, setState] = useState('rent');
  const { user } = useSupabase();

  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    const photos: string[] = [];

    if (images.length !== 0 && cover) {
      setLoading(true);

      const { data, error } = await supabase
        .from('residences')
        .insert([
          {
            price,
            location: formData.location,
            description: formData.description,
            state,
            kind,
          },
        ])
        .select('*')
        .single<Residence>();

      if (!error) {
        for (const [index, image] of images.entries()) {
          const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });
          const filePath = `${user?.id}/${data?.id}/${new Date().getTime()}`;

          const { data: photo, error: uploadError } = await supabase.storage
            .from('residences')
            .upload(filePath, decode(base64), { contentType: 'image/png' });

          photos.push(
            `https://${process.env.EXPO_PUBLIC_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/${photo?.path}`,
          );

          if (image.uri === cover) {
            await supabase
              .from('residences')
              .update({ cover: photos[index] })
              .eq('id', data?.id);
          }

          if (uploadError) {
            Alert.alert(
              'Erro a realizar postagem',
              'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
            );
          }
        }

        await supabase
          .from('residences')
          .update({ photos })
          .eq('id', data?.id);

        setImages([]);
        reset({});
        setLoading(false);
        router.replace(`/(root)/home`);
      } else {
        Alert.alert(
          'Erro a realizar postagem',
          'Algo deve ter dado errado, reveja a tua conexão a internet ou tente novamente mais tarde.',
        );
      }
    } else {
      if (images.length === 0) {
        Alert.alert('Erro a realizar postagem', 'Não selecionaste nenhuma foto da residência.');
      } else {
        Alert.alert(
          'Erro a realizar postagem',
          'Escolha uma fotografia para ser a foto de capa da sua residência.',
        );
      }
    }
  }

  return (
    <View className="relative bg-white">
      <ScrollView style={{ marginTop: Constants.customHeaderDistance }} className="bg-white">
        <View className="flex gap-y-9 px-4 mt-[2%] bg-white">
          <View>
            <Controller
              control={control}
              name="price"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Preço</TextField.Label>
                    <TextField.Container error={errors.price?.message !== undefined}>
                      <CurrencyInput
                        value={price}
                        onChangeValue={setPrice}
                        delimiter="."
                        separator=","
                        precision={2}
                        minValue={0}
                        cursorColor="#a78bfa"
                        className="flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium"
                        placeholder="Quanto está custando? (em kz)"
                        onChangeText={() => {
                          onChange(String(price));
                        }}
                        onBlur={onBlur}
                        editable={!loading}
                      />
                    </TextField.Container>
                  </TextField.Root>
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.price?.message === undefined,
                    })}
                    type="error"
                    visible={errors.price?.message !== undefined}>
                    {errors.price?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="location"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View>
                    <SearchPlace
                      onBlur={onBlur}
                      onChange={onChange}
                      editable={!loading}
                      value={value}
                      placeholder="Onde está localizada?"
                      error={errors.location?.message !== undefined}
                    />
                  </View>
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.location?.message === undefined,
                    })}
                    type="error"
                    visible={errors.location?.message !== undefined}>
                    {errors.location?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <Controller
              control={control}
              name="description"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextField.Root>
                    <TextField.Label isRequired>Descrição</TextField.Label>
                    <TextField.Container error={errors.description?.message !== undefined}>
                      <TextField.Area
                        placeholder="Quais são as carateristicas dela???"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        editable={!loading}
                      />
                    </TextField.Container>
                  </TextField.Root>
                  <HelperText
                    className={clsx('p-0 m-0 mt-2', {
                      hidden: errors.description?.message === undefined,
                    })}
                    type="error"
                    visible={errors.description?.message !== undefined}>
                    {errors.description?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <View>
            <TextField.Label>Estado</TextField.Label>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-poppins-regular">Arrendamento</Text>
              <RadioButton
                value="rent"
                status={state === 'rent' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setState('rent')}
                disabled={loading}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-poppins-regular">À Venda</Text>
              <RadioButton
                value="sell"
                status={state === 'sell' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setState('sell')}
                disabled={loading}
              />
            </View>
          </View>

          <View>
            <TextField.Label>Tipo</TextField.Label>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-poppins-regular">Apartamento</Text>
              <RadioButton
                value="apartment"
                status={kind === 'apartment' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('apartment')}
                disabled={loading}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-poppins-regular">Vivenda</Text>
              <RadioButton
                value="villa"
                status={kind === 'villa' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('villa')}
                disabled={loading}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-poppins-regular">Terreno</Text>
              <RadioButton
                value="land"
                status={kind === 'land' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('land')}
                disabled={loading}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-poppins-regular">Outros</Text>
              <RadioButton
                value="others"
                status={kind === 'others' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('others')}
                disabled={loading}
              />
            </View>
          </View>

          <View className="mb-6">
            <TextField.Label style={{ display: images.length > 0 ? 'flex' : 'none' }}>
              Galeria
            </TextField.Label>
            <GaleryGrid
              cover={cover}
              images={images}
              setCover={setCover}
              setImages={setImages}
              disabled={loading}
            />
          </View>
        </View>
        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>

      <Header.Action
        title="Criar postagem"
        loading={loading}
        goBack={router.back}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
