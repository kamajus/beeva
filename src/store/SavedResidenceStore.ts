import { create } from 'zustand'

import { IResidence, IUser } from '@/@types'
import { SavedResidenceRepository } from '@/repositories/saved.residence.repository'

const savedResidenceRepository = new SavedResidenceRepository()

interface SavedResidenceState {
  residences: IResidence[]
  add: (item: IResidence) => void
  remove: (id: string) => void
  status: (id: string, user: IUser) => Promise<boolean>
  reset: () => void
}

export const useSavedResidenceStore = create<SavedResidenceState>(
  (set, get) => ({
    residences: [],

    add: (item) => {
      set((state) => {
        const items = [...state.residences]
        const index = items.findIndex((i) => i.id === item.id)
        if (index > -1) {
          items[index] = item
        } else {
          items.unshift(item)
        }

        return {
          residences: items,
        }
      })
    },

    status: async (id: string, user: IUser) => {
      const residence = get().residences.find((i) => i.id === id)

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

    remove: (id: string) => {
      set((state) => ({
        residences: state.residences.filter((i) => i.id !== id),
      }))
    },

    reset: () => {
      set(() => ({
        residences: [],
      }))
    },
  }),
)
