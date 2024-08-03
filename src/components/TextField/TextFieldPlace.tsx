import debounce from 'lodash.debounce'
import React, { forwardRef, useState, useCallback } from 'react'
import { View, Text, TextInputProps, TextInput, FlatList } from 'react-native'

import TextFieldContainer from './TextFieldContainer'
import TextFieldInput from './TextFieldInput'
import TextFieldLabel from './TextFieldLabel'
import IconButton from '../IconButton'
import TouchableBrightness from '../TouchableBrightness'

import { placeApi } from '@/config/axios'
import constants from '@/constants'
import { usePlaceInput } from '@/hooks/usePlaceInput'

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
  return (
    <TouchableBrightness
      onPress={() => {
        updateValue(value)
        onPress()
      }}
      className="w-full pl-1 pt-1">
      <Text className="text-black p-4 font-poppins-medium">{value}</Text>
    </TouchableBrightness>
  )
}

const TextFieldPlace = forwardRef<TextInput, ITextFieldPlace>(
  function TextFieldPlace(
    { error, onChangeLocation, value, editable, ...props },
    ref,
  ) {
    const [dataSource, setDataSource] = useState<string[]>([])
    const { open, lock, setOpen, setLock, resetField, onChangeText } =
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
      onChangeText(text)
      setOpen(!!text)
      fetchPlaces(text)
    }

    const handleUpdateValue = useCallback(
      (value: string) => {
        onChangeLocation(value)
        onChangeText(value)
        setLock(true)
      },
      [onChangeLocation, setLock, onChangeText],
    )

    return (
      <View className="z-50">
        <TextFieldLabel>Localização</TextFieldLabel>
        <View className="w-full relative items-center flex-row">
          <TextFieldContainer error={error}>
            <TextFieldInput
              ref={ref}
              onChangeText={onSearch}
              value={value}
              keyboardType="web-search"
              returnKeyType="search"
              editable={lock ? false : editable}
              {...props}
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

          {open && dataSource.length > 0 && (
            <View className="w-full rounded shadow-xl transition absolute top-16 z-50">
              <FlatList
                keyboardShouldPersistTaps="handled"
                className="bg-white rounded"
                scrollEnabled={false}
                data={dataSource}
                style={{
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderRadius: 4,
                }}
                renderItem={(value) => (
                  <DropDownItem
                    key={value.index}
                    value={value.item}
                    onPress={() => {
                      setOpen(false)
                      handleUpdateValue(value.item)
                    }}
                    updateValue={handleUpdateValue}
                  />
                )}
              />
            </View>
          )}
        </View>
      </View>
    )
  },
)

export default TextFieldPlace
