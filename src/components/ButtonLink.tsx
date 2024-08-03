import { router } from 'expo-router'
import { Pressable, PressableProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface IButton extends PressableProps {
  href?: string
}

export default function ButtonLink({
  href,
  children,
  className,
  ...props
}: IButton) {
  return (
    <Pressable
      className={twMerge('flex flex-row gap-2', className)}
      onPress={() => {
        router.push(href)
      }}
      {...props}>
      {children}
    </Pressable>
  )
}
