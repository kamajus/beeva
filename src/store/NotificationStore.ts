import { create } from 'zustand'

import { INotification } from '@/@types'

interface NotificationState {
  notifications: INotification[]
  add: (item: INotification) => void
  remove: (id: string) => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

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
}))
