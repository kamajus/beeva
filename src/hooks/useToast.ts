import { useContext } from 'react'

import { ToastContext } from '@/contexts/ToastProvider'

export const useToast = () => useContext(ToastContext)
