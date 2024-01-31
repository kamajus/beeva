import { Session, User as UserSB } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

import { User } from '../assets/@types';
import { supabase } from '../config/supabase';
import { useCache } from '../hooks/useCache';

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  signUp: (email: string, password: string) => Promise<UserSB | null | void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  sendOtpCode: (email: string) => Promise<void>;
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
  session: null,
  initialized: false,
  signUp: async () => {},
  signInWithPassword: async () => {},
  sendOtpCode: async () => {},
  signOut: async () => {},
  getUserById: async () => {},
  handleFavorite: async () => {},
  residenceIsFavorite: async () => false,
});

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { setNotifications, notifications } = useCache();

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
          sendOtpCode(email);
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
          .catch((e) => {
            console.error(e);
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
                getUserById(session?.user.id, true).then((data) => {
                  setUser(data);
                });
              }
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
        session,
        initialized,
        signUp,
        signInWithPassword,
        sendOtpCode,
        signOut,
        handleFavorite,
        residenceIsFavorite,
      }}>
      {children}
    </SupabaseContext.Provider>
  );
};
