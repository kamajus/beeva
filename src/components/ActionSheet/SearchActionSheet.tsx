import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { Button, Icon, RadioButton } from 'react-native-paper';

import Constants from '../../constants';
import Filter from '../Filter';

export default function SearchActionSheet(props: SheetProps) {
  const [state, setState] = useState('sell');

  return (
    <ActionSheet id={props.sheetId}>
      <View>
        <View className="flex flex-row items-center gap-x-4 px-8 py-4 border-b border-b-gray-300">
          <Icon source="close" size={20} />
          <Text className="font-semibold text-lg">Filtros</Text>
        </View>

        <View className="p-4">
          <Text className="font-medium text-base mb-3">Tipo de residência</Text>
          <Filter />
        </View>

        <View className="p-4">
          <Text className="font-medium text-base mb-3">Tipo de venda</Text>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-normal">Arrendamento</Text>
            <RadioButton
              value="rent"
              status={state === 'rent' ? 'checked' : 'unchecked'}
              color={Constants.colors.primary}
              onPress={() => setState('rent')}
            />
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm font-normal">À Venda</Text>
            <RadioButton
              value="sell"
              status={state === 'sell' ? 'checked' : 'unchecked'}
              color={Constants.colors.primary}
              onPress={() => setState('sell')}
            />
          </View>
        </View>

        <View className="p-4">
          <Text className="font-medium text-base mb-3">Preço minimo</Text>
          <TextInput className="bg-[#f5f5f5] h-14 p-4 rounded" placeholder="0.0 Kz" />
        </View>

        <View className="p-4">
          <Text className="font-medium text-base mb-3">Preço máximo</Text>
          <TextInput className="bg-[#f5f5f5] h-14 p-4 rounded" placeholder="0.0 Kz" />
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
            buttonColor="#E54D2E"
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
