import { create } from 'zustand'

import { IWishe } from '@/@types'

interface WisheState {
  wishes: IWishe[]
  add: (item: IWishe) => void
  remove: (id: string) => void
  reset: () => void
}

export const useWisheStore = create<WisheState>((set) => ({
  wishes: [],

  add: (item) => {
    set((state) => {
      const wishes = [...state.wishes]
      const wisheIndex = wishes.findIndex((w) => w.id === item.id)

      if (wisheIndex > -1) {
        wishes[wisheIndex] = item
      } else {
        wishes.unshift(item)
      }

      return {
        wishes,
      }
    })
  },

  remove: (id: string) => {
    set((state) => ({
      wishes: state.wishes.filter((w) => w.id !== id),
    }))
  },

  reset: () => {
    set(() => ({
      wishes: [],
    }))
  },
}))
