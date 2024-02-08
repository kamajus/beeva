import clsx from 'clsx';
import { useLocalSearchParams, useFocusEffect, Link, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';

import { Residence, User } from '../../assets/@types';
import Carousel from '../../components/Carousel';
import Header from '../../components/Header';
import PublishedSince from '../../components/PublishedSince';
import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import { useAlert } from '../../hooks/useAlert';
import { useCache } from '../../hooks/useCache';
import useMoneyFormat from '../../hooks/useMoneyFormat';
import { useSupabase } from '../../hooks/useSupabase';

export default function ResidenceDetail() {
  const [refreshing, setRefreshing] = useState(false);
  const { setOpenedResidences, openedResidences, setUserResidences } = useCache();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getResidence();
    }, 2000);
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();
  const money = useMoneyFormat();

  const { handleCallNotification, getUserById, user } = useSupabase();
  const [residence, setResidence] = useState<Residence>();

  const alert = useAlert();
  const [residenceOwner, setResidenceOwner] = useState<User>();

  const [showDescription, setShowDescription] = useState(false);

  async function getResidence() {
    setResidence(openedResidences.find((r) => r.id === id));

    const { data: residenceData } = await supabase
      .from('residences')
      .select('*')
      .eq('id', id)
      .single<Residence>();

    if (residenceData) {
      setResidence(residenceData);
      const newResidence = openedResidences.findIndex((r) => r.id === id);

      if (residenceData.owner_id === user?.id) {
        console.log('IAMHERE');
        setResidenceOwner(user);

        setUserResidences((prevResidences) => [
          ...prevResidences.slice(0, newResidence),
          residenceData,
          ...prevResidences.slice(newResidence + 1),
        ]);
      } else {
        console.log('IAMHERENOW');
        await getUserById(residenceData.owner_id).then(async (userData) => {
          if (userData) {
            setResidenceOwner(userData);
          }
        });
      }

      setOpenedResidences((prevResidences) => [
        ...prevResidences.slice(0, newResidence),
        residenceData,
        ...prevResidences.slice(newResidence + 1),
      ]);
    }
  }

  async function deleteResidence() {
    if (residence?.photos) {
      const residenceIndex = openedResidences.findIndex((r) => r.id === id);

      const { error } = await supabase.from('residences').delete().eq('id', id);

      const filesToRemove = residence?.photos.map((image) => `${user?.id}/${id}/${image}`);

      if (filesToRemove) {
        await supabase.storage.from('residences').remove(filesToRemove);
      }

      if (!error) {
        setOpenedResidences((prevResidences) =>
          prevResidences.filter((_, index) => index !== residenceIndex),
        );

        setUserResidences((prevResidences) =>
          prevResidences.filter((_, index) => index !== residenceIndex),
        );

        router.replace('/home');
        handleCallNotification('Residência eliminada', 'A residência foi eliminada com sucesso');
      } else {
        alert.showAlert(
          'Erro na postagem',
          'Não foi possível eliminar a residência, tente mais tarde.',
          'Ok',
          () => {},
        );
      }
    }
  }

  useEffect(() => {
    getResidence();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-white relative w-full"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Carousel photos={residence?.photos} style={{ height: 460 }} />
      <View className="px-4 bg-white flex mt-7">
        <View className="flex flex-row items-center justify-between">
          <View className="flex gap-x-3 flex-row">
            <>
              {residenceOwner?.photo_url ? (
                <Avatar.Image size={50} source={{ uri: residenceOwner.photo_url }} />
              ) : (
                <Avatar.Text size={50} label={String(residenceOwner?.first_name[0])} />
              )}
            </>
            <View className="">
              <Text className="font-poppins-medium text-base">
                {residenceOwner
                  ? `${residenceOwner?.first_name} ${residenceOwner?.last_name}`
                  : '...'}
              </Text>
              <Text className="font-poppins-regular text-sm text-gray-400">
                {residenceOwner?.id ? (residenceOwner?.id === user?.id ? 'Eu (:' : 'Dono') : '...'}
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center">
            {residenceOwner?.id === user?.id ? (
              <>
                <IconButton
                  icon="delete"
                  mode="outlined"
                  iconColor="#000"
                  onPress={() => {
                    alert.showAlert(
                      'Alerta',
                      'Você tem ceteza que quer apagar essa residência?',
                      'Sim',
                      () => deleteResidence(),
                      'Cancelar',
                      () => {},
                    );
                  }}
                />
                {residence && (
                  <Link href={`/editor/${residence.id}`}>
                    <IconButton icon="pencil-outline" mode="outlined" iconColor="#000" />
                  </Link>
                )}
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
          <Text className="font-poppins-medium">
            {residence &&
              Constants.categories.map((categorie) => {
                if (categorie.value === residence.kind) {
                  return `${categorie.emoji} ${categorie.name}`;
                }
              })}
          </Text>
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">Data da postagem</Text>
          <PublishedSince className="font-poppins-medium" date={String(residence?.created_at)} />
        </View>

        <View className="mt-7">
          <Text className="font-poppins-regular text-xs text-gray-400">Localização</Text>

          <Text className="font-poppins-medium text-gray-600 mt-2 mb-2">
            {residence?.location ? residence?.location : '...'}
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

      {residence?.id && (
        <Header.Carousel
          owner_id={String(residence?.owner_id)}
          residence_id={String(residence?.id)}
        />
      )}
    </ScrollView>
  );
}
