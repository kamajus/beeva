import { create } from 'zustand'

import { ICachedResidence, IResidence, IUser } from '@/@types'

interface ResidenceState {
  residences: ICachedResidence[]
  add: (item: IResidence, user?: IUser) => void
  remove: (id: string) => void
  reset: () => void
}

export const useOpenedResidenceStore = create<ResidenceState>((set, get) => ({
  residences: [],

  add: (residence, user) => {
    set((state) => {
      const residences = [...state.residences]
      const residenceIndex = residences.findIndex(
        ({ residence: r }) => r.id === residence.id,
      )
      if (residenceIndex > -1) {
        residences[residenceIndex].residence = residence
        if (user) residences[residenceIndex].user = user
      } else {
        residences.unshift({ residence, user })
      }

      return {
        residences,
      }
    })
  },

  remove: (id: string) => {
    set((state) => ({
      residences: state.residences.filter(({ residence: r }) => r.id !== id),
    }))
  },

  reset: () => {
    set(() => ({
      residences: [],
    }))
  },
}))
