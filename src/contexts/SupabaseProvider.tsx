import { Session, User } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

import { User as UserDB } from '../assets/@types';
import { supabase } from '../config/supabase';

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  sendOtpCode: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserById: (id?: string) => Promise<UserDB | void>;
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

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      let message;
      if (error.status) {
        message = 'Algo de errado aconteceu, tente novamente mais tarde.';
      }
      throw message;
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
      const { error } = await supabase.from('favorites').insert({
        residence_id: id,
      });
      console.log(`Error ${error?.message}`);
    } else {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('residence_id', id);
      console.log(`Error ${error?.message}`);
    }
  };

  async function getUserById(id?: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', !id ? user?.id : id)
      .single<UserDB>();

    if (error) {
      console.error('Error fetching user:', error.message);
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
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
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
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
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
