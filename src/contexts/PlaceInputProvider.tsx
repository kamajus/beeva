import { ReactNode, createContext, useState } from 'react'

type PlaceInputType = {
  lock: boolean
  open: boolean

  setLock: React.Dispatch<React.SetStateAction<boolean>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>

  onChangeText: (value: string) => void
  resetField: () => void
}

export const PlaceInput = createContext({} as PlaceInputType)

interface IPlaceInputProvider {
  children: ReactNode
  onChangeText: (value: string) => void
}

export default function PlaceInputProvider({
  onChangeText,
  ...props
}: IPlaceInputProvider) {
  const [open, setOpen] = useState(false)
  const [lock, setLock] = useState(false)

  function resetField() {
    setOpen(false)
    setLock(false)
    onChangeText('')
  }

  return (
    <PlaceInput.Provider
      value={{
        open,
        lock,
        setOpen,
        onChangeText,
        setLock,
        resetField,
      }}>
      {props.children}
    </PlaceInput.Provider>
  )
}
