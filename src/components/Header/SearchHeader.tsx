import Constants from 'expo-constants';
import { useState } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import Filter from '../Filter';
import TextField from '../TextField';

interface SearchHeaderProps {
  goBack: () => void;
}

export default function SearchHeader({ goBack }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="border-b-[.5px] border-b-gray-300">
      <View
        style={{ marginTop: Constants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container disableFocus>
            <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
            <TextField.Input placeholder="Diga a localização" />
          </TextField.Container>
        </TextField.Root>
        <IconButton icon="tune" mode="outlined" iconColor="#000" containerColor="#fff" />
      </View>
      <View className="ml-4">
        <Filter />
      </View>
    </View>
  );
}
