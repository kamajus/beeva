import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { Residence, ResidenceTypes, Notification, CachedResidence } from '../assets/@types';

type CacheContextType = {
  userResidences: Residence[];
  setUserResidences: Dispatch<SetStateAction<Residence[]>>;
  favoritesResidences: Residence[];
  setFavoritesResidences: Dispatch<SetStateAction<Residence[]>>;
  cachedResidences: CachedResidence[];
  setCachedResidences: Dispatch<SetStateAction<CachedResidence[]>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  resetCache(): void;
  updateResidenceCache(residence: Residence): void;
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
  const [cachedResidences, setCachedResidences] = useState<CachedResidence[]>([]);
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
    setCachedResidences([]);
    setNotifications([]);
  }

  function updateResidenceCache(residence: Residence) {
    const openedResidenceMatch = cachedResidences.find(({ residence: r }) => r.id === residence.id);
    if (openedResidenceMatch) {
      setCachedResidences((residences) => [
        ...residences,
        { user: openedResidenceMatch.user, residence },
      ]);
    }

    if (userResidences.find((r) => r.id === residence.id)) {
      setUserResidences((residences) => [
        ...residences.filter((r) => r.id !== residence.id),
        residence,
      ]);
    }

    if (favoritesResidences.find((r) => r.id === residence.id)) {
      setFavoritesResidences((residences) => [
        ...residences.filter((r) => r.id !== residence.id),
        residence,
      ]);
    }
  }

  return (
    <CacheContext.Provider
      value={{
        userResidences,
        favoritesResidences,
        updateResidenceCache,
        cachedResidences,
        setUserResidences,
        setFavoritesResidences,
        setCachedResidences,
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
