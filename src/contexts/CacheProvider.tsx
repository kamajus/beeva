import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { Residence, ResidenceTypes, Notification } from '../assets/@types';

type CacheContextType = {
  userResidences: Residence[];
  setUserResidences: Dispatch<SetStateAction<Residence[]>>;
  favoritesResidences: Residence[];
  setFavoritesResidences: Dispatch<SetStateAction<Residence[]>>;
  openedResidences: Residence[];
  setOpenedResidences: Dispatch<SetStateAction<Residence[]>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[] | any>>;
  resetCache(): void;
  filter: {
    kind?: ResidenceTypes;
    state?: 'sell' | 'rent';
    minPrice?: number;
    maxPrice?: number;
  };
  setFilter: Dispatch<
    SetStateAction<{
      kind?: ResidenceTypes | undefined;
      state?: 'sell' | 'rent' | undefined;
      minPrice?: number | undefined;
      maxPrice?: number | undefined;
    }>
  >;
};

export const CacheContext = createContext({} as CacheContextType);

interface CacheProviderProps {
  children: ReactNode;
}

export default function CacheProvider(props: CacheProviderProps) {
  const [userResidences, setUserResidences] = useState<Residence[]>([]);
  const [favoritesResidences, setFavoritesResidences] = useState<Residence[]>([]);
  const [openedResidences, setOpenedResidences] = useState<Residence[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [filter, setFilter] = useState<{
    kind?: ResidenceTypes;
    state?: 'sell' | 'rent';
    minPrice?: number;
    maxPrice?: number;
  }>({
    kind: 'all',
  });

  function resetCache() {
    setUserResidences([]);
    setFavoritesResidences([]);
    setOpenedResidences([]);
    setNotifications([]);
  }

  return (
    <CacheContext.Provider
      value={{
        userResidences,
        favoritesResidences,
        openedResidences,
        setUserResidences,
        setFavoritesResidences,
        setOpenedResidences,
        notifications,
        setNotifications,
        filter,
        setFilter,
        resetCache,
      }}>
      {props.children}
    </CacheContext.Provider>
  );
}
