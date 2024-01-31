import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { Residence, Notification } from '../assets/@types';

type CacheContextType = {
  userResidences: Residence[];
  setUserResidences: Dispatch<SetStateAction<Residence[]>>;
  favoritesResidences: Residence[];
  setFavoritesResidences: Dispatch<SetStateAction<Residence[]>>;
  openedResidences: Residence[];
  setOpenedResidences: Dispatch<SetStateAction<Residence[]>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[] | any>>;
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
      }}>
      {props.children}
    </CacheContext.Provider>
  );
}
