import { useCallback } from 'react'

import { useLovedResidenceStore } from '@/store/LovedResidenceStore'
import { useNotificationStore } from '@/store/NotificationStore'
import { useOpenedResidenceStore } from '@/store/OpenedResidenceStore'
import { useResidenceNotificationStore } from '@/store/ResidenceNotificationStore'
import { useSavedResidenceStore } from '@/store/SavedResidenceStore'
import { useUserResidenceStore } from '@/store/UserResidenceStore'
import { useWisheStore } from '@/store/WisheStore'

export const useReset = () => {
  const resetOpenedResidences = useOpenedResidenceStore((state) => state.reset)
  const resetLovedResidences = useLovedResidenceStore((state) => state.reset)
  const resetSavedResidences = useSavedResidenceStore((state) => state.reset)
  const resetUserResidences = useUserResidenceStore((state) => state.reset)
  const resetWishes = useWisheStore((state) => state.reset)
  const resetNotifications = useNotificationStore((state) => state.reset)

  const residenceResidenceNotifications = useResidenceNotificationStore(
    (state) => state.reset,
  )

  const clearCache = useCallback(() => {
    residenceResidenceNotifications()
    resetOpenedResidences()
    resetLovedResidences()
    resetSavedResidences()
    resetUserResidences()
    resetWishes()
    resetNotifications()
  }, [
    residenceResidenceNotifications,
    resetOpenedResidences,
    resetLovedResidences,
    resetSavedResidences,
    resetUserResidences,
    resetWishes,
    resetNotifications,
  ])

  return { clearCache }
}
