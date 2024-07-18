import { icons } from 'lucide-react-native'
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
export default function IconButton({
  name,
  size = 25,
  fill = 'transparent',
  color = '#000000',
  loading,
  className,
  disabled,
  ...props
}: IButton) {
  const LucideIcon = icons[name]

  return (
    <TouchableOpacity
      className={twMerge(
        'p-[10px] rounded-full bg-white disabled:bg-transparent',
        className,
      )}
      {...props}
      disabled={disabled}>
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
}
