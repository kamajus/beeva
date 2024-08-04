import React, { createContext, useState, ReactNode } from 'react'

import CustomAlert from '@/components/CustomAlert'

interface IAlertObject {
  title: string
  message: string
  primaryLabel?: string
  onPressPrimary?: () => void
  secondaryLabel?: string
  onPressSecondary?: () => void
}

interface IAlertContext {
  showAlert: (props: IAlertObject) => void
  hideAlert: () => void
}

export const AlertContext = createContext<IAlertContext>({
  hideAlert: () => {},
  showAlert: () => {},
})

interface AlertProviderProps {
  children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertObject, setAlertObject] = useState<IAlertObject | null>(null)

  const showAlert = ({ primaryLabel = 'Ok', ...props }: IAlertObject) => {
    setAlertObject({ primaryLabel, ...props })
    setAlertVisible(true)
  }

  const hideAlert = () => {
    setAlertVisible(false)
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertVisible && alertObject && (
        <CustomAlert
          title={alertObject.title}
          message={alertObject.message}
          primaryLabel={alertObject.primaryLabel}
          onPressPrimary={alertObject.onPressPrimary}
          secondaryLabel={alertObject.secondaryLabel}
          onPressSecondary={alertObject.onPressSecondary}
          alertVisible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </AlertContext.Provider>
  )
}
