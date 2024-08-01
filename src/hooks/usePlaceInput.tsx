import { useContext } from 'react'

import { PlaceInput } from '@/contexts/PlaceInputProvider'

export const usePlaceInput = () => useContext(PlaceInput)
