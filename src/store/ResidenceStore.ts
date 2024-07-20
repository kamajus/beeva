import { create } from 'zustand'

import {
  ICachedResidence,
  IResidence,
  ISavedResidences,
  IUser,
} from '@/assets/@types'
import { supabase } from '@/config/supabase'

interface ResidenceState {
  savedResidences: IResidence[]
  userResidences: IResidence[]
  cachedResidences: ICachedResidence[]
  addToResidences: (item: IResidence, type: 'user' | 'saved') => void
  pushResidence: (item: IResidence, user?: IUser) => void
  removeResidence: (id: string) => void
  resetResidenceCache: () => void
  residenceSavedStatus: (id: string, user: IUser) => Promise<boolean>
}

export const useResidenceStore = create<ResidenceState>((set, get) => ({
  savedResidences: [],
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
    const savedResidence = get().savedResidences.find((r) => r.id === id)

    if (!savedResidence) {
      const { data } = await supabase
        .from('saved_residences')
        .select('*')
        .eq('user_id', user.id)
        .eq('residence_id', id)
        .maybeSingle<ISavedResidences>()

      return !!data
    }

    return get().savedResidences.some((r) => r.id === id)
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
