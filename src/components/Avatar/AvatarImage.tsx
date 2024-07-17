/* eslint-disable jsx-a11y/alt-text */
import { Image, ImageProps } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface AvatarImageProps extends ImageProps {
  size?: number
  className?: string
}

export default function AvatarImage({
  className,
  size,
  ...props
}: AvatarImageProps) {
  return (
    <Image
      width={size}
      height={size}
      className={twMerge('rounded-full', className)}
      {...props}
    />
  )
}
