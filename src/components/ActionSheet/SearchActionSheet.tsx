import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import ActionSheet, { SheetProps, SheetManager } from 'react-native-actions-sheet';
import { Button, IconButton, RadioButton } from 'react-native-paper';

import Constants from '../../constants';
import Filter from '../Filter';
import TextField from '../TextField';

export default function SearchActionSheet(props: SheetProps) {
  const [state, setState] = useState('sell');

  return (
    <ActionSheet id={props.sheetId}>
      <View>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 border-b border-b-gray-300">
          <IconButton icon="close" size={20} onPress={() => SheetManager.hide('search-sheet')} />
          <Text className="font-poppins-semibold text-lg">Filtros</Text>
        </View>

        <View className="p-4">
          <Text className="font-poppins-medium text-base mb-3">Tipo de residência</Text>
          <Filter />
        </View>

        <View className="p-4">
          <Text className="font-poppins-medium text-base mb-3">Tipo de venda</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">Arrendamento</Text>
            <RadioButton
              value="rent"
              status={state === 'rent' ? 'checked' : 'unchecked'}
              color={Constants.colors.primary}
              onPress={() => setState('rent')}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-poppins-regular">À Venda</Text>
            <RadioButton
              value="sell"
              status={state === 'sell' ? 'checked' : 'unchecked'}
              color={Constants.colors.primary}
              onPress={() => setState('sell')}
            />
          </View>
        </View>

        <View className="p-4">
          <TextField.Label isRequired>Preço minimo</TextField.Label>
          <TextInput
            className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
            placeholder="0.0 Kz"
            keyboardType="number-pad"
          />
        </View>

        <View className="p-4">
          <TextField.Label isRequired>Preço máximo</TextField.Label>
          <TextInput
            className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
            placeholder="0.0 Kz"
            keyboardType="number-pad"
          />
        </View>

        <View className="flex flex-row justify-between items-center px-4 gap-x-2">
          <Button
            style={{
              height: 58,
              display: 'flex',
              justifyContent: 'center',
              flex: 2,
              marginTop: 10,
            }}
            mode="text"
            buttonColor={Constants.colors.alert}
            textColor="white"
            uppercase={false}>
            Remover filtros
          </Button>
          <Button
            style={{
              height: 58,
              display: 'flex',
              justifyContent: 'center',
              marginTop: 10,
            }}
            mode="contained"
            buttonColor={Constants.colors.primary}
            textColor="white"
            uppercase={false}>
            Aplicar
          </Button>
        </View>
      </View>
    </ActionSheet>
  );
}
