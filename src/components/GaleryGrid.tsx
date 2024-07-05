import clsx from 'clsx';
import * as ImagePicker from 'expo-image-picker';
import { Dispatch, SetStateAction } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

import Constants from '../constants';

interface GaleryProps {
  images: ImagePicker.ImagePickerAsset[];
  cover: string | null | undefined;
  setCover: Dispatch<React.SetStateAction<string | null | undefined>>;
  setImages: Dispatch<SetStateAction<ImagePicker.ImagePickerAsset[]>>;
  setImagesToDelete?: Dispatch<React.SetStateAction<string[]>>;
  imagesToDelete?: string[];
  disabled?: boolean;
  setPhotoChanged?: Dispatch<React.SetStateAction<boolean>>;
}

export default function Galery({
  images,
  setImages,
  cover,
  setCover,
  disabled,
  setImagesToDelete,
  imagesToDelete,
  setPhotoChanged,
}: GaleryProps) {
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: images?.length ? 5 - images?.length : 5,
    });

    if (!result.canceled) {
      if (!images || images.length === 0) {
        setCover(result.assets[0].uri);
      }
      setImages([...images, ...result.assets]);

      if (setPhotoChanged) {
        setPhotoChanged(true);
      }
    }
  }

  return (
    <View>
      {images && images?.length > 0 && (
        <FlatList
          data={images}
          horizontal
          renderItem={({ item }) => (
            <Pressable
              className="relative mb-4"
              onLongPress={() => {
                setImages(images.filter((other) => other !== item));

                if (imagesToDelete && setImagesToDelete) {
                  if (
                    item.uri.includes(
                      `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/`,
                    )
                  ) {
                    setImagesToDelete([...imagesToDelete, item.uri]);
                  }
                }

                if (cover === item.uri) {
                  setCover(undefined);
                }
              }}>
              <Image
                key={item.uri}
                source={{ uri: item.uri }}
                style={{
                  height: 140,
                  width: 140,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              />

              <IconButton
                icon="star"
                mode="outlined"
                iconColor={cover === item.uri ? '#ffcb0c' : 'lightgray'}
                containerColor="#fff"
                className={clsx('absolute top-[1px] right-2', {
                  hidden: disabled,
                })}
                onPress={() => {
                  setCover(item.uri);
                }}
              />
            </Pressable>
          )}
        />
      )}

      <Button
        labelStyle={{
          textTransform: 'capitalize',
        }}
        style={{
          height: 56,
          backgroundColor: Constants.colors.primary,
        }}
        className={clsx('flex items-center justify-center', {
          hidden: disabled || images.length >= 5,
        })}
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
