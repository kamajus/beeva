import { create } from 'zustand'

import { CachedResidence, Residence, User } from '../assets/@types'

interface ResidenceState {
  favoritesResidences: Residence[]
  userResidences: Residence[]
  cachedResidences: CachedResidence[]
  addToResidences: (item: Residence, type: 'user' | 'favorites') => void
  pushResidence: (item: Residence, user?: User) => void
  removeResidence: (id: string) => void
  resetResidenceCache: () => void
}

export const useResidenceStore = create<ResidenceState>((set) => {
  return {
    favoritesResidences: [],
    userResidences: [],
    cachedResidences: [],
    addToResidences: (item, type) => {
      if (type === 'favorites') {
        set((state) => {
          const favorites = [...state.favoritesResidences]
          const favoriteIndex = favorites.findIndex((r) => r.id === item.id)
          if (favoriteIndex > -1) {
            favorites[favoriteIndex] = item
          } else {
            favorites.unshift(item)
          }

          return {
            favoritesResidences: favorites,
          }
        })
      } else {
        set((state) => {
          const residences = [...state.userResidences]
          const residenceIndex = residences.findIndex((r) => r.id === item.id)

          if (residenceIndex > -1) {
            residences[residenceIndex] = item
          } else {
            residences.unshift(item)
          }

          return {
            userResidences: residences,
          }
        })
      }
    },
    pushResidence: (residence, user) => {
      set((state) => {
        const residences = [...state.cachedResidences]
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
          cachedResidences: residences,
        }
      })
    },
    removeResidence: (id: string) => {
      set((state) => ({
        userResidences: state.userResidences.filter((r) => r.id !== id),
        favoritesResidences: state.favoritesResidences.filter(
          (r) => r.id !== id,
        ),
        cachedResidences: state.cachedResidences.filter(
          ({ residence: r }) => r.id !== id,
        ),
      }))
    },
    resetResidenceCache: () => {
      set(() => ({
        userResidences: [],
        favoritesResidences: [],
        cachedResidences: [],
      }))
    },
  }
})
