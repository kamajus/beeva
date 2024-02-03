import Constants from 'expo-constants';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import TextField from '../TextField';

import '../ActionSheet';

interface SearchHeaderProps {
  goBack: () => void;
  value: string;
}

export default function SearchHeader({ goBack, value }: SearchHeaderProps) {
  return (
    <View className="border-b-[.5px] border-b-gray-300">
      <View
        style={{ marginTop: Constants.statusBarHeight }}
        className="w-full py-4 px-4 flex justify-center items-center flex-row">
        <TextField.Root>
          <TextField.Container disableFocus>
            <Icon name="arrow-left" color="#000" size={25} onPress={goBack} />
            <TextField.Input
              value={value}
              onFocus={() => router.push('/location')}
              placeholder="Diga a localização"
            />
          </TextField.Container>
        </TextField.Root>

        <IconButton
          onPress={() => SheetManager.show('search-sheet')}
          icon="tune"
          mode="outlined"
          iconColor="#000"
          containerColor="#fff"
        />
      </View>
    </View>
  );
}
