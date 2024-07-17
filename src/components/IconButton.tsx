import { icons } from 'lucide-react-native'
import {
  TouchableOpacityProps,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { twMerge } from 'tailwind-merge'

interface IButton extends TouchableOpacityProps {
  name: keyof typeof icons
  size?: number
  color?: string
  containerColor?: string
  fill?: string
  loading?: boolean | undefined
}
export default function IconButton({
  name,
  size = 25,
  fill = 'transparent',
  containerColor = 'transparent',
  color = '#000',
  loading,
  className,
  ...props
}: IButton) {
  const LucideIcon = icons[name]

  return (
    <TouchableOpacity
      className={twMerge(
        `p-[10px] rounded-full bg-[${containerColor}]`,
        className,
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator size={size} color={color} />
      ) : (
        <LucideIcon color={color} fill={fill} size={size} />
      )}
    </TouchableOpacity>
  )
}
