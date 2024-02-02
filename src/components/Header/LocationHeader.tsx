import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import TextField from '../TextField';

import '../ActionSheet';

interface LocationHeaderProps {
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQuery: string;
}

export default function LocationHeader({ setSearchQuery, searchQuery }: LocationHeaderProps) {
  const { back } = useRouter();

  return (
    <View className="border-b-[.5px] border-b-gray-300">
      <View
        style={{ marginTop: Constants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container disableFocus>
            <Icon name="arrow-left" color="#000" size={25} onPress={back} />
            <TextField.Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Qual é a localização?"
              autoFocus
            />
          </TextField.Container>
        </TextField.Root>
      </View>
    </View>
  );
}
