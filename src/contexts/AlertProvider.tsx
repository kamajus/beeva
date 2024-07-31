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
  primaryLabel: string
  onPressPrimary?: () => void
  secondaryLabel?: string
  onPressSecondary?: () => void
  alertVisible: boolean
  setAlertVisible: Dispatch<SetStateAction<boolean>>
}

interface AlertContextProps {
  showAlert: (
    title: string,
    message: string,
    primaryLabel: string,
    onPressPrimary?: () => void,
    secondaryLabel?: string,
    onPressSecondary?: () => void,
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
    primaryLabel: string,
    onPressPrimary: () => void,
    secondaryLabel?: string,
    onPressSecondary?: () => void,
  ) => {
    setAlertObject({
      title,
      message,
      primaryLabel,
      onPressPrimary,
      secondaryLabel,
      onPressSecondary,
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
