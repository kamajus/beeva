/* eslint-disable jsx-a11y/alt-text */

import { Image } from 'react-native'
import { twMerge } from 'tailwind-merge'

import { formatPhotoUrl } from '@/functions/format'

interface IAvatarImage {
  src?: string
  size?: number
  className?: string
  updateAt?: string
}

export default function AvatarImage({
  className,
  size,
  src,
  updateAt,
  ...props
}: IAvatarImage) {
  if (src?.startsWith('https://')) {
    src = formatPhotoUrl(src, updateAt)
  }

  return (
    <Image
      width={size}
      height={size}
      className={twMerge('rounded-full', className)}
      source={{
        uri: src,
      }}
      {...props}
    />
  )
}
