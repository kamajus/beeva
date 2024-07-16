import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'

import { ResidenceTypes, Notification } from '../assets/@types'

type CacheContextType = {
  notifications: Notification[]
  setNotifications: Dispatch<SetStateAction<Notification[]>>
  resetCache(): void
  filter: {
    kind?: ResidenceTypes
    state?: 'sell' | 'rent'
    minPrice?: number
    maxPrice?: number
  }
  setFilter: Dispatch<
    SetStateAction<{
      kind?: ResidenceTypes | undefined
      state?: 'sell' | 'rent' | undefined
      minPrice?: number | undefined
      maxPrice?: number | undefined
    }>
  >
}

export const CacheContext = createContext({} as CacheContextType)

interface CacheProviderProps {
  children: ReactNode
}

export default function CacheProvider(props: CacheProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const [filter, setFilter] = useState<{
    kind?: ResidenceTypes
    state?: 'sell' | 'rent'
    minPrice?: number
    maxPrice?: number
  }>({
    kind: 'all',
  })

  function resetCache() {
    setNotifications([])
  }

  return (
    <CacheContext.Provider
      value={{
        notifications,
        setNotifications,
        filter,
        setFilter,
        resetCache,
      }}>
      {props.children}
    </CacheContext.Provider>
  )
}
