import React, { createContext, useState, ReactNode } from 'react'

import Toast from '@/components/Toast'

interface IToastObject {
  description: string
}

interface IToastContext {
  show: (props: IToastObject) => void
}

export const ToastContext = createContext<IToastContext>({
  show: () => {},
})

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [toastObject, setObject] = useState<IToastObject | null>(null)

  const show = (props: IToastObject) => {
    setObject(props)
    setVisible(true)

    // Makes the toast disappear after 3 seconds
    setTimeout(() => {
      setVisible(false)
    }, 2000) // 2000 ms = 2 seconds
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && toastObject && (
        <Toast description={toastObject.description} />
      )}
    </ToastContext.Provider>
  )
}
