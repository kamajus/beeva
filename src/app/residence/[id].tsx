import clsx from 'clsx';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Linking } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';

import { NewFileObject, Residence, User } from '../../assets/@types';
import Carousel from '../../components/Carousel';
import Header from '../../components/Header';
import Prompt from '../../components/Prompt';
import PublishedSince from '../../components/PublishedSince';
import { mapApi } from '../../config/axios';
import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import useMoneyFormat from '../../hooks/useMoneyFormat';
import { useSupabase } from '../../hooks/useSupabase';

export default function ResidenceDetail() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getResidence();
    }, 2000);
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();

  const money = useMoneyFormat();

  const { session, getUserById } = useSupabase();
  const [residence, setResidence] = useState<Residence | undefined>();
  const [user, setUser] = useState<User | undefined>();

  const [galery, setGalery] = useState<NewFileObject[] | undefined>();
  const [kindLabel, setKindLabel] = useState('');

  const [showDescription, setShowDescription] = useState(false);

  const [region, setRegion] = useState({
    latitude: 112027,
    longitude: 178739,
  });

  async function getResidence() {
    setResidence(undefined);
    setGalery(undefined);
    setUser(undefined);

    const { data: residenceData } = await supabase
      .from('residences')
      .select('*')
      .eq('id', id)
      .single<Residence>();

    if (residenceData) {
      setResidence(residenceData);

      Constants.categories.map((categorie) => {
        if (categorie.value === residenceData.kind) {
          setKindLabel(`${categorie.emoji} ${categorie.name}`);
        }
      });

      getUserById(residenceData.owner_id).then(async (userData) => {
        if (userData) {
          setUser(userData);

          const { data } = await supabase.storage
            .from('residences')
            .list(`${residenceData.owner_id}/${residenceData.id}`);

          data?.forEach((file) => {
            const { publicUrl } = supabase.storage
              .from('residences')
              .getPublicUrl(`${residenceData.owner_id}/${residenceData.id}/${file.name}`).data;

            if (publicUrl) {
              const image = {
                public_url: publicUrl,
                ...file,
              };

              setGalery((prevGalery) => [...(prevGalery || []), image]);
            }
          });
        }
      });

      mapApi.get(`/?q=${residenceData?.location}&limit=1`).then(({ data }) => {
        const [latitude, longitude] = data.features[0].geometry.coordinates;
        setRegion({
          latitude,
          longitude,
        });
      });
    }
  }

  async function deleteResidence() {
    return await supabase
      .from('residences')
      .delete()
      .eq('id', residence?.id);
  }

  useEffect(() => {
    getResidence();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white relative w-full"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Carousel galery={galery} style={{ height: 460 }} />

      <View className="px-4 bg-white flex mt-7">
        <View className="flex flex-row items-center justify-between">
          <View className="flex gap-x-3 flex-row">
            <>
              {user?.photo_url ? (
                <Avatar.Image size={50} source={{ uri: user.photo_url }} />
              ) : (
                <Avatar.Text size={50} label={String(user?.first_name[0])} />
              )}
            </>
            <View className="">
              <Text className="font-poppins-medium text-base">
                {user?.first_name ? user?.first_name + user?.last_name : '...'}
              </Text>
              <Text className="font-poppins-regular text-sm text-gray-400">
                {user?.email ? (user?.email === session?.user.email ? 'Eu (:' : 'Dono') : '...'}
              </Text>
            </View>
          </View>

          <View className="flex flex-row">
            {user?.email === session?.user.email ? (
              <>
                <Prompt content="Você deseja eliminar essa postagem?" onPress={deleteResidence}>
                  <IconButton icon="delete" mode="outlined" iconColor="#000" />
                </Prompt>
                <IconButton icon="pencil-outline" mode="outlined" iconColor="#000" />
              </>
            ) : (
              <>
                <IconButton icon="message-processing-outline" mode="outlined" iconColor="#000" />
                <IconButton icon="phone" mode="outlined" iconColor="#000" />
              </>
            )}
          </View>
        </View>

        <View className="flex gap-1 flex-row items-center mt-7">
          <Text className="text-2xl font-poppins-semibold">
            {money.format(residence?.price ? Number(residence?.price) : 0)}
          </Text>
          <Text
            className={clsx('text-xs font-poppins-regular text-gray-400', {
              hidden: residence?.state === 'sell',
            })}>
            /mês
          </Text>
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">Tipo</Text>
          <Text className="font-poppins-medium">{kindLabel ? kindLabel : '....'}</Text>
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">Data da postagem</Text>
          <PublishedSince className="font-poppins-medium" date={String(residence?.created_at)} />
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">Localização</Text>

          <Text
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`,
              )
            }
            className="font-poppins-medium text-gray-600 mt-2 mb-2">
            {residence?.location ? '📍' + residence?.location : '...'}
          </Text>
        </View>

        <Pressable
          className="mt-7 mb-7"
          onPress={() => {
            if (residence?.description && residence?.description.length > 100) {
              setShowDescription(!showDescription);
            }
          }}>
          <Text className="font-poppins-semibold text-lg">Descrição</Text>
          <Text className="font-poppins-regular text-gray-600">
            {residence?.description && residence?.description.length > 100 && !showDescription
              ? `${residence?.description.slice(0, 100)}...`
              : residence?.description}
          </Text>
          <Text
            className={clsx('text-primary text-xs font-poppins-medium', {
              hidden: !(residence?.description && residence?.description.length > 100),
            })}>
            {showDescription ? ' - ver menos' : ' ver mais +'}
          </Text>
        </Pressable>
      </View>

      {residence?.id && <Header.Carousel residence_id={String(residence?.id)} />}

      <StatusBar style="light" backgroundColor="black" />
    </ScrollView>
  );
}
