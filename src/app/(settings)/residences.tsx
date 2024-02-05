import clsx from 'clsx';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Residence } from '../../assets/@types';
import NoData from '../../assets/images/no-data';
import NoFavorite from '../../assets/images/no-favorite';
import GaleryItem from '../../components/GaleryItem';
import Header from '../../components/Header';
import LoadScreen from '../../components/LoadScreen';
import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import { useCache } from '../../hooks/useCache';
import { useSupabase } from '../../hooks/useSupabase';

export default function Favorites() {
  const {
    setFavoritesResidences,
    setUserResidences,
    userResidences,
    favoritesResidences,
    setOpenedResidences,
  } = useCache();

  const { user } = useSupabase();
  const { height } = Dimensions.get('screen');
  const [refreshing, setRefreshing] = useState(false);

  const [loadingResidences, setLoadingResidences] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  async function getResidences() {
    setLoadingResidences(true);
    const { data: residencesData } = await supabase
      .from('residences')
      .select('*')
      .eq('owner_id', user?.id)
      .returns<Residence[]>();

    if (residencesData) {
      const newResidences = residencesData.filter(
        (data) => !userResidences.some((r) => r.id === data.id),
      );

      setUserResidences([...userResidences, ...newResidences]);
      setOpenedResidences([...userResidences, ...newResidences]);
      setLoadingResidences(false);
    }
  }

  function getFavorites() {
    setLoadingFavorites(true);

    supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user?.id)
      .select()
      .then(async ({ data }) => {
        if (data) {
          const favoriteResidences = await Promise.all(
            data.map(async (item) => {
              const { data: FavoriteResidence } = await supabase
                .from('residences')
                .select('*')
                .eq('id', item.residence_id)
                .single();

              return FavoriteResidence;
            }),
          );

          setFavoritesResidences(favoriteResidences);
          setLoadingFavorites(false);
        }
      });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getResidences();
      getFavorites();
    }, 2000);
  }, []);

  useEffect(() => {
    getResidences();
    getFavorites();
  }, []);

  return (
    <View style={{ height }} className="relative bg-white">
      {!loadingFavorites || !loadingResidences ? (
        <ScrollView
          style={{ padding: 16, marginTop: Constants.customHeaderDistance }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Text className="text-black text-lg font-poppins-semibold">Postadas por mim</Text>
          <View className="mt-2 flex-1 flex-row flex-wrap">
            {userResidences && userResidences?.length > 0 ? (
              userResidences.map(({ id, cover }) => (
                <View key={id} className="mr-3 mt-3">
                  <GaleryItem image={cover} id={id} key={id} activeted={false} />
                </View>
              ))
            ) : (
              <View className="w-full flex justify-center items-center">
                <NoData />
                <Text className="font-poppins-medium text-gray-400 text-center">
                  Você não tem nehuma residência!
                </Text>
              </View>
            )}
          </View>
          <Text className="mt-4 text-[#212121] text-lg font-poppins-semibold">
            Guardados por mim
          </Text>
          <View className={clsx('mt-2 flex-1 flex-row flex-wrap')}>
            {favoritesResidences && favoritesResidences?.length > 0 ? (
              favoritesResidences.map(({ id, cover }) => (
                <View key={id} className="mr-3 mt-3">
                  <GaleryItem image={cover} id={id} key={id} activeted={false} />
                </View>
              ))
            ) : (
              <View className="w-full flex justify-center items-center">
                <NoFavorite />
                <Text className="font-poppins-medium text-gray-400 text-center">
                  Você não tem nehuma guardada.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <LoadScreen />
      )}

      <View className="absolute">
        <Header.Normal title="Minhas residências" goBack={router.back} />
      </View>
    </View>
  );
}
