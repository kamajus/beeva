import clsx from 'clsx'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface IRadioButton {
  value: string
  isChecked?: boolean
  disabled?: boolean
  onPress: (value: string) => void
}

const RadioButton: React.FC<IRadioButton> = ({
  value,
  isChecked = false,
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress(value)}
      className={clsx('flex-row items-center my-2', {
        'opacity-50': disabled,
      })}
      disabled={disabled}>
      <View
        className={clsx(
          'w-5 h-5 rounded-full border-2 mr-2 border-black flex items-center justify-center',
        )}>
        <View
          className={clsx('w-3 h-3 rounded-full', {
            'bg-primary': isChecked,
          })}
        />
      </View>
    </TouchableOpacity>
  )
}

export default RadioButton
