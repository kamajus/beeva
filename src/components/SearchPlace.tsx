import React, { useState } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInputProps,
} from 'react-native'

import TextField from '@/components/TextField'
import { placeApi } from '@/config/axios'

interface DropDownProps {
  setValue: React.Dispatch<React.SetStateAction<string>>
  dataSource: string[]
  updateValue: (value: string) => void
  onPress: () => void
}

interface SearchSelectProps extends TextInputProps {
  error?: boolean
}

interface Place {
  display_name: string
}

const DropDownItem: React.FC<{
  item: string
  onPress: () => void
  setValue: React.Dispatch<React.SetStateAction<string>>
  updateValue: (value: string) => void
}> = ({ item, onPress, setValue, updateValue }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <View>
      <TouchableOpacity
        onPressIn={() => setIsActive(true)}
        onPressOut={() => setIsActive(false)}
        onPress={() => {
          onPress()
          setValue(item)
          updateValue(item)
        }}
        style={{
          backgroundColor: isActive ? '#dcdcdc' : 'transparent',
        }}
        className="w-full pl-1 pt-1">
        <Text className="text-black p-4 font-poppins-medium">{item}</Text>
      </TouchableOpacity>
    </View>
  )
}

const DropDown: React.FC<DropDownProps> = ({
  updateValue,
  dataSource,
  setValue,
  onPress,
}) => (
  <TouchableOpacity className="w-full shadow-xl transition absolute top-16 z-50">
    <View
      className="w-full bg-white"
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      {dataSource.length
        ? dataSource.map((item, index) => (
            <DropDownItem
              key={index}
              item={item}
              onPress={onPress}
              setValue={setValue}
              updateValue={updateValue}
            />
          ))
        : null}
    </View>
  </TouchableOpacity>
)

const SearchSelect: React.FC<SearchSelectProps> = (props) => {
  const [dataSource, setDataSource] = useState<string[]>([])
  const [searching, setSearching] = useState(false)
  const [value, setValue] = useState(props.value ?? '')

  const onSearch = (text: string) => {
    props.onChangeText(text)
    setValue(text)

    if (text) {
      setSearching(true)

      placeApi
        .get(
          `/search?featureType&countrycodes=AO&limit=5&format=json&q=${text}`,
        )
        .then((res) => {
          const places: string[] = res.data.map(
            (item: Place) => item.display_name,
          )
          setDataSource(places)
        })
        .catch(() => {})
    } else {
      setSearching(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => setSearching(false)}>
      <View className="z-50">
        <TextField.Label isRequired>Localização</TextField.Label>
        <View className="w-full relative items-center flex-row">
          <TextField.Container error={props.error}>
            <TextField.Input
              placeholder={props.placeholder}
              onChangeText={onSearch}
              editable={props.editable}
              value={value}
              keyboardType="web-search"
              returnKeyType="search"
              autoFocus
            />
          </TextField.Container>
          {searching && (
            <DropDown
              onPress={() => setSearching(false)}
              updateValue={props.onChangeText}
              setValue={setValue}
              dataSource={dataSource}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SearchSelect
