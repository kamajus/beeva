import clsx from 'clsx';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

export const categories = [
  {
    name: 'Todos',
    value: 'all',
  },
  {
    name: 'Apartamentos',
    value: 'apartments',
  },
  {
    name: 'Vivendas',
    value: 'houses',
  },
  {
    name: 'Terrenos',
    value: 'lands',
  },
  {
    name: 'Lojas',
    value: 'shops',
  },
];

export default function Filter() {
  const [buttonActive, setButtonActive] = useState<string | undefined>('Todos');

  function onButtonActive(category: string) {
    setButtonActive(category);
  }

  return (
    <ScrollView className="mt-6 mb-2">
      <View>
        <FlatList
          data={categories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          horizontal
          renderItem={({ item }) => (
            <Pressable
              className={clsx('mr-2 py-4 px-5 border-t-transparent rounded-md bg-[#f5f5f5]', {
                'bg-[#a78bfa9a]': buttonActive === item.name,
                'mr-0': categories[categories.length - 1] === item,
              })}
              onPress={() => onButtonActive(item.name)}>
              <Text
                className={clsx('font-medium text-gray-500 text-sm', {
                  'text-black': buttonActive === item.name,
                })}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}
