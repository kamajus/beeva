import { useNavigation } from 'expo-router'
import { ReactNode, createContext, useEffect, useState } from 'react'

type PlaceInputType = {
  value: string
  lock: boolean
  open: boolean

  setValue: React.Dispatch<React.SetStateAction<string>>
  setLock: React.Dispatch<React.SetStateAction<boolean>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  resetField: () => void
}

export const PlaceInput = createContext({} as PlaceInputType)

interface IPlaceInputProvider {
  children: ReactNode
}

export default function PlaceInputProvider(props: IPlaceInputProvider) {
  const navigation = useNavigation()

  const [open, setOpen] = useState(false)
  const [lock, setLock] = useState(false)
  const [value, setValue] = useState('')

  function resetField() {
    setOpen(false)
    setLock(false)
    setValue('')
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetField()
    })

    return unsubscribe
  }, [navigation])

  return (
    <PlaceInput.Provider
      value={{
        open,
        value,
        lock,
        setOpen,
        setValue,
        setLock,
        resetField,
      }}>
      {props.children}
    </PlaceInput.Provider>
  )
}
