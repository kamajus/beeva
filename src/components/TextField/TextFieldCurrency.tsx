import CurrencyInput from 'react-native-currency-input'
import { twMerge } from 'tailwind-merge'

import constants from '@/constants'

interface TextFieldCurrencyProps {
  className?: string
  value: number
  onChange: (value: number) => void
}

export default function TextFieldCurrency({
  className,
  value,
  onChange,
  ...props
}: TextFieldCurrencyProps) {
  return (
    <CurrencyInput
      onChangeValue={(value) => onChange(value)}
      delimiter="."
      separator=","
      precision={2}
      minValue={0}
      placeholder="0.00 kz"
      cursorColor={constants.colors.primary}
      className={twMerge(
        'flex flex-1 h-14 w-full px-2 text-sm font-poppins-medium',
        className,
      )}
      value={value}
      {...props}
    />
  )
}
