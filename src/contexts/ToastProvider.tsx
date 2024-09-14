import React, { createContext, useState, ReactNode } from 'react'

import Toast from '@/components/Toast'

interface IToastObject {
  description: string
}

interface IToastContext {
  showAlert: (props: IToastObject) => void
}

export const ToastContext = createContext<IToastContext>({
  showAlert: () => {},
})

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(false)
  const [toastObject, setToastObject] = useState<IToastObject | null>(null)

  const showAlert = (props: IToastObject) => {
    setToastObject(props)
    setAlertVisible(true)

    // Faz o toast desaparecer após 3 segundos
    setTimeout(() => {
      setAlertVisible(false)
    }, 3000) // 3000 ms = 3 segundos
  }

  return (
    <ToastContext.Provider value={{ showAlert }}>
      {children}
      {alertVisible && toastObject && (
        <Toast description={toastObject.description} />
      )}
    </ToastContext.Provider>
  )
}
