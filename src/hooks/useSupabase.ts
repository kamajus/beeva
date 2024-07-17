import { useContext } from 'react'

import { SupabaseContext } from '@/contexts/SupabaseProvider'

export const useSupabase = () => useContext(SupabaseContext)
