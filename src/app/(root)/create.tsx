import { yupResolver } from '@hookform/resolvers/yup';
import ExpoConstants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as yup from 'yup';

import GaleryGrid from '../../components/GaleryGrid';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import Constants from '../../constants';

interface FormData {
  description?: string;
  location?: string;
  status?: string;
  kind?: string;
}

const schema = yup.object({
  description: yup.string().required(),
  location: yup.string().required(),
  status: yup.string().required(),
  kind: yup.string().required(),
});

export default function Post() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const [kind, setKind] = useState('sell');
  const [state, setState] = useState('sell');

  const images = [
    'https://placehold.co/600x400/png',
    'https://placehold.co/600x400/png',
    'https://placehold.co/600x400/png',
  ];

  return (
    <View className="relative bg-white">
      <ScrollView style={{ marginTop: ExpoConstants.statusBarHeight * 2 }} className="bg-white">
        <View className="flex gap-y-9 px-4 mt-[2%] bg-white">
          <View>
            <Controller
              control={control}
              name="location"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField.Root>
                  <TextField.Label isRequired>Preço</TextField.Label>
                  <TextField.Container>
                    <TextField.Input
                      placeholder="Quanto vai custar?"
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
              name="location"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField.Root>
                  <TextField.Label isRequired>Localização</TextField.Label>
                  <TextField.Container>
                    <TextField.Input
                      placeholder="Onde está localizada?"
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
              name="description"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField.Root>
                  <TextField.Label isRequired>Descrição</TextField.Label>
                  <TextField.Container>
                    <TextField.Area
                      placeholder="Quais são as carateristicas dela???"
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
            <TextField.Label>Estado</TextField.Label>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-normal">Arrendamento</Text>
              <RadioButton
                value="rent"
                status={state === 'rent' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setState('rent')}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-normal">À Venda</Text>
              <RadioButton
                value="sell"
                status={state === 'sell' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setState('sell')}
              />
            </View>
          </View>

          <View>
            <TextField.Label>Tipo</TextField.Label>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-normal">Apartamento</Text>
              <RadioButton
                value="apartment"
                status={kind === 'apartment' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('apartment')}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-normal">Vivenda</Text>
              <RadioButton
                value="villa"
                status={kind === 'villa' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('villa')}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-normal">Terreno</Text>
              <RadioButton
                value="land"
                status={kind === 'land' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('land')}
              />
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-normal">Outros</Text>
              <RadioButton
                value="others"
                status={kind === 'others' ? 'checked' : 'unchecked'}
                color={Constants.colors.primary}
                onPress={() => setKind('others')}
              />
            </View>
          </View>

          <View className="mb-6">
            <TextField.Label>Galeria</TextField.Label>
            <GaleryGrid images={images} />
          </View>
        </View>
        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>
      <Header.Action title="Criar postagem" actionTitle="Salvar" goBack={router.back} />
    </View>
  );
}
