import { create } from 'zustand'

import { IResidence } from '@/@types'

interface ResidenceState {
  residences: IResidence[]
  add: (item: IResidence) => void
  remove: (id: string) => void
  reset: () => void
}

export const useUserResidenceStore = create<ResidenceState>((set, get) => ({
  residences: [],

  add: (item) => {
    set((state) => {
      const items = [...state.residences]
      const savedIndex = items.findIndex((i) => i.id === item.id)
      if (savedIndex > -1) {
        items[savedIndex] = item
      } else {
        items.unshift(item)
      }

      return {
        residences: items,
      }
    })
  },

  remove: (id: string) => {
    set((state) => ({
      residences: state.residences.filter((r) => r.id !== id),
    }))
  },

  reset: () => {
    set(() => ({
      residences: [],
    }))
  },
}))
