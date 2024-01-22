import { useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import DropDown from './DropDown';
import { placeApi } from '../../config/axios';
import TextField from '../TextField';

interface SearchSelectProps {
  placeholder: string;
  onBlur: () => void;
  onChange: (...event: any[]) => void;
  editable?: boolean;
  error?: boolean;
}

export default function SearchSelect(props: SearchSelectProps) {
  const [dataSource, setDataSource] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [value, setValue] = useState('');

  const onSearch = (text: string) => {
    if (text) {
      props.onChange(text);
      setSearching(true);
      setValue(text);

      placeApi
        .get(`/search?featureType&countrycodes=AO&limit=5&format=json&q=${text}`)
        .then((res) => {
          const places: string[] = [];
          res.data.map((item: any) => {
            places.push(item.display_name);
          });

          setDataSource(places);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSearching(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setSearching(false)}>
      <View className="z-50">
        <TextField.Label isRequired>Localização</TextField.Label>
        <View className="w-full items-center flex relative">
          <TextField.Container error={props.error}>
            <TextField.Input
              placeholder={props.placeholder}
              onChange={props.onChange}
              onChangeText={onSearch}
              onBlur={props.onBlur}
              editable={props.editable}
              defaultValue={value}
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
  );
}
