import React, { useState } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native'

import TextField from './TextField'
import TouchableBrightness from './TouchableBrightness'
import { placeApi } from '../config/axios'

interface DropDownProps {
  setValue: React.Dispatch<React.SetStateAction<string>>
  dataSource: string[]
  updateValue: (...event: string[]) => void
  onPress: () => void
}

interface SearchSelectProps {
  value?: string
  placeholder: string
  onBlur: () => void
  onChange: (...event: string[]) => void
  editable?: boolean
  error?: boolean
}

interface Place {
  display_name: string
}

const DropDownItem = ({
  item,
  onPress,
  setValue,
  updateValue,
}: {
  item: string
  onPress: () => void
  setValue: React.Dispatch<React.SetStateAction<string>>
  updateValue: (...event: string[]) => void
}) => (
  <View style={{ width: '100%', paddingLeft: 4, paddingTop: 4 }}>
    <TouchableBrightness
      onPress={() => {
        onPress()
        setValue(item)
        updateValue(item)
      }}>
      <Text
        style={{ color: 'black', padding: 16, fontFamily: 'poppins-medium' }}>
        {item}
      </Text>
    </TouchableBrightness>
  </View>
)

const NoResults = () => (
  <View
    style={{
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
    <Text
      style={{ fontSize: 16, color: 'black', fontFamily: 'poppins-semibold' }}>
      Nenhum resultado encontrado.
    </Text>
  </View>
)

const DropDown = ({
  updateValue,
  dataSource,
  setValue,
  onPress,
}: DropDownProps) => (
  <TouchableOpacity
    style={{ width: '100%' }}
    className="shadow-xl transition absolute top-16 z-50">
    <View
      style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      {dataSource.length ? (
        dataSource.map((item, index) => (
          <DropDownItem
            key={index}
            item={item}
            onPress={onPress}
            setValue={setValue}
            updateValue={updateValue}
          />
        ))
      ) : (
        <NoResults />
      )}
    </View>
  </TouchableOpacity>
)

const SearchSelect = (props: SearchSelectProps) => {
  const [dataSource, setDataSource] = useState<string[]>([])
  const [searching, setSearching] = useState(false)
  const [value, setValue] = useState(props.value ? `${props.value}` : '')

  const onSearch = (text: string) => {
    props.onChange(text)
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
        .catch((error) => {
          console.error(error)
        })
    } else {
      setSearching(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => setSearching(false)}>
      <View style={{ zIndex: 50 }}>
        <TextField.Label isRequired>Localização</TextField.Label>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            position: 'relative',
          }}>
          <TextField.Container error={props.error}>
            <TextField.Input
              placeholder={props.placeholder}
              onChange={props.onChange}
              onChangeText={onSearch}
              editable={props.editable}
              value={value}
            />
          </TextField.Container>
          {searching && (
            <DropDown
              onPress={() => setSearching(false)}
              updateValue={props.onChange}
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
