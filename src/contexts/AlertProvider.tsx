import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'

import CustomAlert from '@/components/CustomAlert'

interface AlertObject {
  title: string
  message: string
  valueOption1: string
  functionOption1: () => void
  valueOption2?: string
  functionOption2?: () => void
  alertVisible: boolean
  setAlertVisible: Dispatch<SetStateAction<boolean>>
}

interface AlertContextProps {
  showAlert: (
    title: string,
    message: string,
    valueOption1: string,
    functionOption1: () => void,
    valueOption2?: string,
    functionOption2?: () => void,
  ) => void
  hideAlert: () => void
}

export const AlertContext = createContext<AlertContextProps>({
  hideAlert: () => {},
  showAlert: () => {},
})

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertObject, setAlertObject] = useState<AlertObject | null>(null)

  const showAlert = (
    title: string,
    message: string,
    valueOption1: string,
    functionOption1: () => void,
    valueOption2?: string,
    functionOption2?: () => void,
  ) => {
    setAlertObject({
      title,
      message,
      valueOption1,
      functionOption1,
      valueOption2,
      functionOption2,
      alertVisible: true,
      setAlertVisible,
    })
    setAlertVisible(true)
  }

  const hideAlert = () => {
    setAlertVisible(false)
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertVisible && <CustomAlert {...alertObject} />}
    </AlertContext.Provider>
  )
}
