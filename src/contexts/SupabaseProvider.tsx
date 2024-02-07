import { Session, User as UserSB } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createContext, useEffect, useState } from 'react';

import { User } from '../assets/@types';
import { supabase } from '../config/supabase';
import { useAlert } from '../hooks/useAlert';
import { useCache } from '../hooks/useCache';

type SupabaseContextProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
  session: Session | null;
  initialized?: boolean;
  signUp: (email: string, password: string) => Promise<UserSB | null | void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  sendOtpCode: (email: string) => Promise<void>;
  uploadResidencesImage: (
    id: string,
    cover: string,
    images: ImagePicker.ImagePickerAsset[],
  ) => Promise<void>;
  signOut: () => Promise<void>;
  getUserById: (id?: string, upsert?: boolean) => Promise<User | void>;
  handleFavorite: (id: string, saved: boolean) => Promise<void>;
  residenceIsFavorite: (id: string) => Promise<boolean>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  setUser: () => {},
  session: null,
  initialized: false,
  signUp: async () => {},
  uploadResidencesImage: async () => {},
  signInWithPassword: async () => {},
  sendOtpCode: async () => {},
  signOut: async () => {},
  getUserById: async () => {},
  handleFavorite: async () => {},
  residenceIsFavorite: async () => false,
});

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const alert = useAlert();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { setNotifications, notifications, setOpenedResidences, openedResidences } = useCache();

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user) {
      return data.user;
    } else {
      throw error;
    }
  };

  async function uploadResidencesImage(
    id: string,
    cover: string,
    images: ImagePicker.ImagePickerAsset[],
  ) {
    const imagesToAppend = [];

    for (const image of images) {
      // Checking if the image has already been posted or is stored locally
      if (!image.uri.includes(`https://${process.env.EXPO_PUBLIC_PROJECT_ID}.supabase.co`)) {
        try {
          // Read image as base64
          const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });

          // Define the file path based on user ID, residence ID, and timestamp
          const filePath = `${user?.id}/${id}/${new Date().getTime()}`;

          // Upload the image to Supabase storage
          const { data: photo, error: uploadError } = await supabase.storage
            .from('residences')
            .upload(filePath, decode(base64), { contentType: 'image/png' });

          imagesToAppend.push(
            `https://${process.env.EXPO_PUBLIC_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/${photo?.path}`,
          );

          // Check if the uploaded image is the cover image
          if (image.uri === cover && !uploadError) {
            const coverURL = `https://${process.env.EXPO_PUBLIC_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/${photo?.path}`;
            await supabase.from('residences').update({ cover: coverURL }).eq('id', id);
          }

          if (uploadError) {
            alert.showAlert(
              'Erro a realizar postagem',
              'Houve um problema ao tentar carregar as imagens que você forneceu.',
              'Ok',
              () => {},
            );
          }
        } catch {
          alert.showAlert(
            'Erro a realizar postagem',
            'Houve um problema ao tentar carregar as imagens que você forneceu.',
            'Ok',
            () => {},
          );
        }
      }
    }

    await supabase.from('residences').update({ photos: imagesToAppend }).eq('id', id);
  }

  const residenceIsFavorite = async (id: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user?.id)
      .eq('residence_id', id);
    let isFavorite = false;

    data?.forEach((item) => {
      if (item.residence_id === id) {
        isFavorite = true;
      }
    });

    return isFavorite;
  };

  const handleFavorite = async (id: string, saved: boolean) => {
    if (!saved) {
      await supabase.from('favorites').insert({
        residence_id: id,
      });
    } else {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('residence_id', id);
    }
  };

  async function getUserById(id?: string, upsert?: boolean) {
    if (!upsert && user && user?.id === id) {
      return user;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', !id ? user?.id : id)
      .single<User>();

    if (error) {
      throw error;
    }

    return data;
  }

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      let message;
      let redirect;

      if (error.status) {
        if (error.message === 'Email not confirmed') {
          supabase.auth.resend({ email, type: 'signup' });
          redirect = `/verification/${email}`;
        }
        message = 'As credências de acesso a conta estão incorrectas.';
      }

      // eslint-disable-next-line no-throw-literal
      throw {
        message,
        redirect,
      };
    }
  };

  const sendOtpCode = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://example.com/welcome',
      },
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      if (session) {
        await getUserById(session?.user.id, true)
          .then((data) => {
            setUser(data);
          })
          .catch(async () => {
            await supabase.auth.signOut();
            router.replace('/signin');
          });

        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session?.user.id);

        if (notificationsData) {
          setNotifications(notificationsData);
        }

        supabase
          .channel('users')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
            },
            async (payload) => {
              if (session?.user.id) {
                await getUserById(session?.user.id, true)
                  .then((data) => {
                    setUser(data);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }
            },
          )
          .subscribe();

        supabase
          .channel('residences')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
            },
            async (payload) => {
              const residences = openedResidences.map((residence) => {
                if (residence.id === payload['new'].id) {
                  return payload['new'];
                }

                return residence;
              });

              setOpenedResidences(residences);
            },
          )
          .subscribe();

        supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
            },
            async (payload) => {
              if (payload['new']) {
                setNotifications([...notifications, payload['new']]);
              }
            },
          )
          .subscribe();
      } else {
        setUser(null);
      }

      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        getUserById,
        user,
        setUser,
        session,
        initialized,
        signUp,
        signInWithPassword,
        sendOtpCode,
        signOut,
        handleFavorite,
        residenceIsFavorite,
        uploadResidencesImage,
      }}>
      {children}
    </SupabaseContext.Provider>
  );
};
