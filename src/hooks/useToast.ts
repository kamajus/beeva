import { useContext } from 'react'

import { ToastContext } from '@/contexts/ToastProvider'

export const useAlert = () => useContext(ToastContext)
