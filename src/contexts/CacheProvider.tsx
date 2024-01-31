import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { NewFileObject, Residence, Notification } from '../assets/@types';

type CacheContextType = {
  userResidences: Residence[];
  setUserResidences: Dispatch<SetStateAction<Residence[]>>;
  favoritesResidences: Residence[];
  setFavoritesResidences: Dispatch<SetStateAction<Residence[]>>;
  openedResidences: Residence[];
  setOpenedResidences: Dispatch<SetStateAction<Residence[]>>;
  residencesImages: { id: string; images: NewFileObject[] }[];
  setResidencesImages: Dispatch<SetStateAction<{ id: string; images: NewFileObject[] }[]>>;
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
  const [residencesImages, setResidencesImages] = useState<
    {
      id: string;
      images: NewFileObject[];
    }[]
  >([]);

  return (
    <CacheContext.Provider
      value={{
        userResidences,
        favoritesResidences,
        openedResidences,
        residencesImages,
        setUserResidences,
        setFavoritesResidences,
        setOpenedResidences,
        setResidencesImages,
        notifications,
        setNotifications,
      }}>
      {props.children}
    </CacheContext.Provider>
  );
}
