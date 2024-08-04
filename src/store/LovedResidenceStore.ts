import { create } from 'zustand'

import { ILovedResidences, IUser } from '@/@types'
import { LovedResidenceRepository } from '@/repositories/loved.residence.repository'

const lovedResidenceRepository = new LovedResidenceRepository()

interface LovedResidenceState {
  residences: ILovedResidences[]
  add: (item: ILovedResidences) => void
  remove: (id: string) => void
  status: (id: string, user: IUser) => Promise<boolean>
  reset: () => void
}

export const useLovedResidenceStore = create<LovedResidenceState>(
  (set, get) => ({
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

    status: async (id: string, user: IUser) => {
      const residence = get().residences.find((i) => i.id === id)

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
