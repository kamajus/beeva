import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface DropDownProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  dataSource: string[];
  updateValue: (...event: any[]) => void;
  onPress: () => void;
}

export default function SearchSelectDropDown({
  updateValue,
  dataSource,
  setValue,
  onPress,
}: DropDownProps) {
  return (
    <TouchableOpacity className="w-full shadow-xl transition absolute top-16 z-50">
      <View className="w-full bg-white rounded">
        {dataSource.length ? (
          dataSource.map((item, index) => (
            <View className="w-fullpl-1 py-4" key={index}>
              <Text
                className="text-black px-4 font-poppins-medium"
                onPress={() => {
                  onPress();
                  setValue(item);
                  updateValue(item);
                }}>
                {item}
              </Text>
            </View>
          ))
        ) : (
          <View className="w-full h-24 justify-center items-center content-center">
            <Text className="text-lg text-black font-poppins-semibold">
              Nenhum resultado encontrado.
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
