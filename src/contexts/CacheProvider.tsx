import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'

import {
  IResidenceFilterEnum,
  INotification,
  IResidenceStateEnum,
} from '@/@types'

type CacheContextType = {
  notifications: INotification[]
  setNotifications: Dispatch<SetStateAction<INotification[]>>
  resetCache(): void
  filter: {
    kind?: IResidenceFilterEnum
    state?: IResidenceStateEnum
    minPrice?: number
    maxPrice?: number
  }
  setFilter: Dispatch<
    SetStateAction<{
      kind?: IResidenceFilterEnum | undefined
      state?: IResidenceStateEnum | undefined
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
  const [notifications, setNotifications] = useState<INotification[]>([])

  const [filter, setFilter] = useState<{
    kind?: IResidenceFilterEnum
    state?: IResidenceStateEnum
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
