import debounce from 'lodash.debounce'
import React, { forwardRef, useState, useCallback } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInputProps,
  TextInput,
} from 'react-native'

import TextFieldContainer from './TextFieldContainer'
import TextFieldInput from './TextFieldInput'
import TextFieldLabel from './TextFieldLabel'
import IconButton from '../IconButton'

import { placeApi } from '@/config/axios'
import constants from '@/constants'
import { usePlaceInput } from '@/hooks/usePlaceInput'

interface IDropDown {
  dataSource: string[]
  updateValue: (value: string) => void
  onPress: () => void
}

interface ITextFieldPlace extends TextInputProps {
  onChangeLocation: (value: string) => void
  error?: boolean
}

interface IPlace {
  display_name: string
}

interface IDropDownItem {
  value: string
  onPress: () => void
  updateValue: (value: string) => void
}

const DropDownItem = ({ value, onPress, updateValue }: IDropDownItem) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <View>
      <TouchableOpacity
        onPressIn={() => setIsActive(true)}
        onPressOut={() => setIsActive(false)}
        onPress={() => {
          updateValue(value)
          onPress()
        }}
        style={{ backgroundColor: isActive ? '#dcdcdc' : 'transparent' }}
        className="w-full pl-1 pt-1">
        <Text className="text-black p-4 font-poppins-medium">{value}</Text>
      </TouchableOpacity>
    </View>
  )
}

const DropDown = ({ updateValue, dataSource, onPress }: IDropDown) => (
  <TouchableOpacity className="w-full shadow-xl transition absolute top-16 z-50">
    <View
      className="w-full bg-white rounded"
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      {dataSource.map((value, index) => (
        <DropDownItem
          key={index}
          value={value}
          onPress={onPress}
          updateValue={updateValue}
        />
      ))}
    </View>
  </TouchableOpacity>
)

const TextFieldPlace = forwardRef<TextInput, ITextFieldPlace>(
  function TextFieldPlace(
    { error, onChangeLocation, value: propsValue, editable, ...props },
    ref,
  ) {
    const [dataSource, setDataSource] = useState<string[]>([])
    const { open, lock, setOpen, setValue, setLock, resetField } =
      usePlaceInput()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPlaces = useCallback(
      debounce(async (text: string) => {
        try {
          const response = await placeApi.get(
            `/search?featureType&countrycodes=AO&limit=5&format=json&q=${text}`,
          )
          const places = response.data.map((item: IPlace) => item.display_name)
          setDataSource(places)
        } catch {
          setDataSource([])
        }
      }, 300),
      [],
    )

    const onSearch = (text: string) => {
      setValue(text)
      setOpen(!!text)
      fetchPlaces(text)
    }

    const handleUpdateValue = (value: string) => {
      onChangeLocation(value)
      setValue(value)
      setLock(true)
    }

    return (
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View className="z-50">
          <TextFieldLabel isRequired>Localização</TextFieldLabel>
          <View className="w-full relative items-center flex-row">
            <TextFieldContainer error={error}>
              <TextFieldInput
                ref={ref}
                onChangeText={onSearch}
                {...props}
                defaultValue={propsValue}
                keyboardType="web-search"
                returnKeyType="search"
                editable={lock ? false : editable}
              />
              {lock && (
                <IconButton
                  name="Pencil"
                  className="bg-transparent"
                  color={constants.colors.primary}
                  onPress={() => {
                    resetField()
                    onChangeLocation('')
                  }}
                />
              )}
            </TextFieldContainer>
            {open && (
              <DropDown
                onPress={() => setOpen(false)}
                updateValue={handleUpdateValue}
                dataSource={dataSource}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  },
)

export default TextFieldPlace
