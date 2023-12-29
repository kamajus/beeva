import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

import constants from '../constants';

export default function Galery() {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: images?.length ? 5 - images?.length : 5,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  return (
    <View>
      {images && images?.length > 0 && (
        <FlatList
          data={images}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity className="relative mb-4">
              <Image
                key={item.fileName}
                source={{ uri: item.uri }}
                style={{
                  height: 140,
                  width: 140,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              />

              <IconButton
                icon="trash-can"
                mode="outlined"
                iconColor="#fd6963"
                containerColor="#fff"
                className="absolute top-[1px] right-2"
                onPress={() => {
                  setImages(images.filter((other) => other !== item));
                }}
              />
            </TouchableOpacity>
          )}
        />
      )}

      <Button
        labelStyle={{
          textTransform: 'capitalize',
        }}
        style={{
          height: 56,
          backgroundColor: constants.colors.primary,
          display: images && images.length >= 5 ? 'none' : 'flex',
        }}
        className="flex items-center justify-center"
        icon="camera"
        mode="contained"
        onPress={pickImage}>
        {images && images?.length > 0
          ? `(${images.length}) Adicicionar mais fotos`
          : 'Adicionar fotografias'}
      </Button>
    </View>
  );
}
