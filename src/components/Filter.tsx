import clsx from 'clsx';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import Constants from '../constants';

export default function Filter() {
  const [buttonActive, setButtonActive] = useState<string | undefined>('Todos');

  function onButtonActive(category: string) {
    setButtonActive(category);
  }

  return (
    <ScrollView>
      <View>
        <FlatList
          data={Constants.categories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          horizontal
          renderItem={({ item }) => (
            <Pressable
              className={clsx('mr-2 py-4 px-5 border-t-transparent rounded-md bg-[#f5f5f5]', {
                'bg-[#a78bfa9a]': buttonActive === item.name,
                'mr-0': Constants.categories[Constants.categories.length - 1] === item,
              })}
              onPress={() => onButtonActive(item.name)}>
              <Text className="font-poppins-medium text-black text-sm">
                {item.emoji} {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}
