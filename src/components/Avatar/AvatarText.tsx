import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface AvatarTextProps {
  size?: number
  className?: string
  label: string
}

export default function AvatarText({
  className,
  size,
  ...props
}: AvatarTextProps) {
  return (
    <View
      className={twMerge(
        'rounded-full bg-primary flex items-center justify-center',
        className,
      )}
      style={{
        width: size,
        height: size,
      }}>
      <Text className="text-white font-poppins-semibold">{props.label}</Text>
    </View>
  )
}
