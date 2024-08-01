import { ReactNode, useEffect } from 'react'
import type { UseFormReturn, Path } from 'react-hook-form'
import { View, ViewProps } from 'react-native'

interface IForm<T> extends ViewProps {
  children: ReactNode
  handler: UseFormReturn<T, unknown, undefined>
}

export default function Form<T extends Record<string, unknown>>({
  children,
  handler,
  ...props
}: IForm<T>) {
  const {
    setFocus,
    formState: { errors },
  } = handler

  useEffect(() => {
    const firstError = Object.keys(errors).reduce(
      (field, a) => {
        return errors[field] ? field : a
      },
      null as string | null,
    ) as Path<T>

    if (firstError) {
      setFocus(firstError)
    }
  }, [errors, setFocus])

  return <View {...props}>{children}</View>
}
