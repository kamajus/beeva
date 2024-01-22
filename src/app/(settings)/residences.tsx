import ExpoConstants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Residence } from '../../assets/@types';
import GaleryItem from '../../components/GaleryItem';
import Header from '../../components/Header';
import { supabase } from '../../config/supabase';
import { useSupabase } from '../../hooks/useSupabase';

export default function Favorites() {
  const [residences, setResidences] = useState<Residence[] | null>();
  const [favorites, setFavorites] = useState<Residence[]>([]);

  const { user } = useSupabase();
  const { height } = Dimensions.get('screen');
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  async function getResidences() {
    const { data } = await supabase
      .from('residences')
      .select('*')
      .eq('owner_id', user?.id)
      .returns<Residence[]>();

    setResidences(data);
  }

  function getFavorites() {
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

          setFavorites(favoriteResidences);
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
      <ScrollView
        style={{ padding: 16, marginTop: ExpoConstants.statusBarHeight * 2 + 25 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text className="text-black text-lg font-poppins-semibold">Postadas por mim</Text>
        <View className="mt-2 flex-1 flex-row flex-wrap">
          {residences && residences?.length > 0 ? (
            residences.map(({ id, cover }) => (
              <View key={id} className="mr-3 mt-3">
                <GaleryItem image={cover} id={id} key={id} activeted={false} />
              </View>
            ))
          ) : (
            <Text className="font-poppins-medium text-gray-500">
              As residências postadas por ti apareceram aqui...
            </Text>
          )}
        </View>
        <Text className="mt-4 text-[#212121] text-lg font-poppins-semibold">Minhas favoritas</Text>
        <View className="mt-2 flex-1 flex-row flex-wrap">
          {favorites && favorites?.length > 0 ? (
            favorites.map(({ id, cover }) => (
              <View key={id} className="mr-3 mt-3">
                <GaleryItem image={cover} id={id} key={id} activeted={false} />
              </View>
            ))
          ) : (
            <Text className="font-poppins-medium text-gray-500">
              As tuas residências favoritas vão aparecer aqui...
            </Text>
          )}
        </View>

        <StatusBar style="dark" backgroundColor="#fff" />
      </ScrollView>
      <View className="absolute">
        <Header.Normal title="Minhas listas" goBack={router.back} />
      </View>
    </View>
  );
}
