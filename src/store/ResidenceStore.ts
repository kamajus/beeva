import { create } from 'zustand'

import {
  ICachedResidence,
  IResidence,
  ILovedResidences,
  IUser,
} from '@/assets/@types'
import { LovedResidenceRepository } from '@/repositories/loved.residence.repository'
import { SavedResidenceRepository } from '@/repositories/saved.residence.repository'

const savedResidenceRepository = new SavedResidenceRepository()
const lovedResidenceRepository = new LovedResidenceRepository()

interface ResidenceState {
  savedResidences: IResidence[]
  lovedResidences: ILovedResidences[]
  userResidences: IResidence[]
  cachedResidences: ICachedResidence[]
  addToResidences: (item: IResidence, type: 'user' | 'saved') => void
  addToLovedResidences: (item: ILovedResidences) => void
  removeLovedResidence: (id: string) => void
  pushResidence: (item: IResidence, user?: IUser) => void
  removeResidence: (id: string) => void
  resetResidenceCache: () => void
  residenceSavedStatus: (id: string, user: IUser) => Promise<boolean>
  residenceLovedStatus: (id: string, user: IUser) => Promise<boolean>
}

export const useResidenceStore = create<ResidenceState>((set, get) => ({
  savedResidences: [],
  lovedResidences: [],
  userResidences: [],
  cachedResidences: [],

  addToResidences: (item, type) => {
    if (type === 'saved') {
      set((state) => {
        const saved = [...state.savedResidences]
        const savedIndex = saved.findIndex((r) => r.id === item.id)
        if (savedIndex > -1) {
          saved[savedIndex] = item
        } else {
          saved.unshift(item)
        }

        return {
          savedResidences: saved,
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

  addToLovedResidences: (item) => {
    set((state) => {
      const loved = [...state.lovedResidences]
      const lovedIndex = loved.findIndex((r) => r.id === item.id)
      if (lovedIndex > -1) {
        loved[lovedIndex] = item
      } else {
        loved.unshift(item)
      }

      return {
        lovedResidences: loved,
      }
    })
  },

  removeLovedResidence: (id: string) => {
    set((state) => {
      return {
        lovedResidences: state.lovedResidences.filter((r) => r.id !== id),
      }
    })
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

  residenceSavedStatus: async (id: string, user: IUser) => {
    const residence = get().savedResidences.find((r) => r.id === id)

    if (!residence) {
      try {
        const data = await savedResidenceRepository.find({
          residence_id: id,
          user_id: user.id,
        })

        return data.length > 0
      } catch {
        return false
      }
    }

    return true
  },

  residenceLovedStatus: async (id: string, user: IUser) => {
    const residence = get().lovedResidences.find((r) => r.id === id)

    if (!residence) {
      try {
        const data = await lovedResidenceRepository.find({
          residence_id: id,
          user_id: user.id,
        })

        return data.length > 0
      } catch {
        return false
      }
    }

    return true
  },

  removeResidence: (id: string) => {
    set((state) => ({
      userResidences: state.userResidences.filter((r) => r.id !== id),
      savedResidences: state.savedResidences.filter((r) => r.id !== id),
      cachedResidences: state.cachedResidences.filter(
        ({ residence: r }) => r.id !== id,
      ),
    }))
  },

  resetResidenceCache: () => {
    set(() => ({
      userResidences: [],
      savedResidences: [],
      cachedResidences: [],
    }))
  },
}))
