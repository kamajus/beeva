import { create } from 'zustand'

import { IResidenceNotification } from '@/@types'

interface ResidenceNotificationState {
  notifications: IResidenceNotification[]
  getByNotificationId: (notificationId: string) => IResidenceNotification
  add: (item: IResidenceNotification) => void
  remove: (id: string) => void
  reset: () => void
}

export const useResidenceNotificationStore = create<ResidenceNotificationState>(
  (set, get) => ({
    notifications: [],

    getByNotificationId: (id) => {
      return get().notifications.find((d) => d.id === id)
    },

    add: (item) => {
      set((state) => {
        const notifications = [...state.notifications]
        const index = notifications.findIndex((d) => d.id === item.id)

        if (index > -1) {
          notifications[index] = item
        } else {
          notifications.unshift(item)
        }

        return {
          notifications,
        }
      })
    },

    remove: (id: string) => {
      set((state) => ({
        notifications: state.notifications.filter((w) => w.id !== id),
      }))
    },

    reset: () => {
      set(() => ({
        notifications: [],
      }))
    },
  }),
)
