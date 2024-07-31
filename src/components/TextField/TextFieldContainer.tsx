import clsx from 'clsx'
import { View, ViewProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface TextFieldContainerProps extends ViewProps {
  error?: boolean
  disableFocus?: boolean
}

export default function TextFieldContainer({
  className,
  error,
  disableFocus,
  ...props
}: TextFieldContainerProps) {
  return (
    <View
      className={twMerge(
        clsx(
          'w-full px-2 flex-row items-center bg-input border-2 border-input rounded',
          {
            'focus:border-alert': error && !disableFocus,
            'focus:border-primary': !error && !disableFocus,
          },
        ),
        className,
      )}
      {...props}
    />
  )
}
