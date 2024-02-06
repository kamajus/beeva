import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ActionSheet, { SheetProps, SheetManager } from 'react-native-actions-sheet';
import CurrencyInput from 'react-native-currency-input';
import { Button, IconButton, RadioButton } from 'react-native-paper';

import { ResidenceTypes } from '../../assets/@types';
import Constants from '../../constants';
import { useCache } from '../../hooks/useCache';
import Filter from '../Filter';
import TextField from '../TextField';

export default function SearchActionSheet(props: SheetProps) {
  const { filter, setFilter } = useCache();

  const [kind, setKind] = useState<ResidenceTypes>(filter.kind ? filter.kind : 'all');
  const [state, setState] = useState<'sell' | 'rent' | undefined>(filter.state);
  const [minPrice, setMinPrice] = useState<number | undefined>(
    filter.minPrice ? filter.minPrice : undefined,
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    filter.maxPrice ? filter.maxPrice : undefined,
  );

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 border-b border-b-gray-300">
          <IconButton icon="close" size={20} onPress={() => SheetManager.hide('search-sheet')} />
          <Text className="font-poppins-semibold text-lg">Filtros</Text>
        </View>

        <View>
          <Text className="font-poppins-medium text-base mb-3 pt-4 pl-4">Tipo de residência</Text>
          <Filter paddingHorizontal={16} kind={kind} setKind={setKind} />
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
          <TextField.Label>Preço minimo</TextField.Label>
          <CurrencyInput
            value={Number(minPrice) ? Number(minPrice) : null}
            onChangeValue={(value) => {
              setMinPrice(value ? value : undefined);
            }}
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            cursorColor="#a78bfa"
            placeholder="0.00 kz"
            className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
          />
        </View>

        <View className="p-4">
          <TextField.Label>Preço máximo</TextField.Label>
          <CurrencyInput
            value={Number(maxPrice) ? Number(maxPrice) : null}
            onChangeValue={(value) => {
              setMaxPrice(value ? value : undefined);
            }}
            delimiter="."
            separator=","
            precision={2}
            minValue={0}
            cursorColor="#a78bfa"
            placeholder="0.00 kz"
            className="bg-[#f5f5f5] h-14 p-4 rounded font-poppins-medium"
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
            onPress={() => {
              setFilter({
                kind: 'all',
              });

              // Reset
              setMaxPrice(undefined);
              setMinPrice(undefined);
              setState(undefined);
              setKind('all');
              SheetManager.hide('search-sheet');
            }}
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
            onPress={() => {
              setFilter({
                kind,
                maxPrice,
                minPrice,
                state,
              });
              SheetManager.hide('search-sheet');
            }}
            uppercase={false}>
            Aplicar
          </Button>
        </View>
      </ScrollView>
    </ActionSheet>
  );
}
