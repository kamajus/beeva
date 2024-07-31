import { create } from 'zustand'

import { IWishe } from '@/assets/@types'

interface WisheState {
  wishlist: IWishe[]
  addToWishList: (item: IWishe) => void
  removeFromWishe: (id: string) => void
  resetWishListCache: () => void
}

export const useWisheStore = create<WisheState>((set, get) => ({
  wishlist: [],

  addToWishList: (item) => {
    set((state) => {
      const wishlist = [...state.wishlist]
      const wisheIndex = wishlist.findIndex((w) => w.id === item.id)

      if (wisheIndex > -1) {
        wishlist[wisheIndex] = item
      } else {
        wishlist.unshift(item)
      }

      return {
        wishlist,
      }
    })
  },

  removeFromWishe: (id: string) => {
    set((state) => ({
      wishlist: state.wishlist.filter((w) => w.id !== id),
    }))
  },

  resetWishListCache: () => {
    set(() => ({
      wishlist: [],
    }))
  },
}))
