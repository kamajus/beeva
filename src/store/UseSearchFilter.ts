import { create } from 'zustand'

import { IResidenceFilterEnum, IResidenceStateEnum } from '@/@types'

interface SearchFilterState {
  filter: {
    kind?: IResidenceFilterEnum
    state?: IResidenceStateEnum
    minPrice?: number
    maxPrice?: number
  }
  setFilter: (filter: {
    kind?: IResidenceFilterEnum
    state?: IResidenceStateEnum
    minPrice?: number
    maxPrice?: number
  }) => void
}

export const useSearchFilterStore = create<SearchFilterState>((set) => ({
  filter: {
    kind: 'all',
  },
  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),
}))
