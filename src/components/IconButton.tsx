import { icons } from 'lucide-react-native'
import React, { forwardRef } from 'react'
import {
  TouchableOpacityProps,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { twMerge } from 'tailwind-merge'

import { hexToRGBA } from '@/functions'

interface IButton extends TouchableOpacityProps {
  name: keyof typeof icons
  size?: number
  color?: string
  fill?: string
  loading?: boolean | undefined
}

const IconButton = forwardRef<TouchableOpacity, IButton>(
  (
    {
      name,
      size = 25,
      fill = 'transparent',
      color = '#000000',
      loading,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const LucideIcon = icons[name]

    return (
      <TouchableOpacity
        ref={ref}
        className={twMerge(
          'p-[10px] rounded-full bg-white disabled:bg-transparent',
          className,
        )}
        {...props}
        disabled={disabled || loading}>
        {loading ? (
          <ActivityIndicator size={size} color={color} />
        ) : (
          <LucideIcon
            color={
              disabled && color && color !== 'transparent'
                ? hexToRGBA(color, 0.5)
                : color
            }
            fill={
              disabled && fill && fill !== 'transparent'
                ? hexToRGBA(fill, 0.5)
                : fill
            }
            size={size}
          />
        )}
      </TouchableOpacity>
    )
  },
)

// Set displayName for the component
IconButton.displayName = 'IconButton'

export default IconButton
