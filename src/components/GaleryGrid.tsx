import clsx from 'clsx'
import * as ImagePicker from 'expo-image-picker'
import { FlatList, Image, Pressable, View } from 'react-native'

import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import constants from '@/constants'

interface IGaleryGrid {
  images: ImagePicker.ImagePickerAsset[]
  cover: string | null | undefined
  imagesToDelete?: string[]
  disabled?: boolean
  changeImages: (images: ImagePicker.ImagePickerAsset[]) => void
  changeCoverImage: (value: string) => void
  deleteImages?: (value: string[]) => void
  handlePhotoChanged?: (value: boolean) => void
}

export default function Galery({
  images,
  cover,
  imagesToDelete,
  disabled,
  changeCoverImage,
  changeImages,
  deleteImages,
  handlePhotoChanged,
}: IGaleryGrid) {
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: images?.length ? 5 - images?.length : 5,
    })

    if (!result.canceled) {
      if (!images || images.length === 0) {
        changeCoverImage(result.assets[0].uri)
      }

      changeImages([...images, ...result.assets])

      if (handlePhotoChanged) {
        handlePhotoChanged(true)
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
                changeImages(images.filter((other) => other !== item))

                if (imagesToDelete && deleteImages) {
                  if (item.uri.includes(constants.storageUrl)) {
                    deleteImages([...imagesToDelete, item.uri])
                  }
                }

                if (cover === item.uri) {
                  changeCoverImage(undefined)
                }
              }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
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
                name="Star"
                size={18}
                onPress={() => {
                  changeCoverImage(item.uri)
                }}
                className={clsx('absolute top-[4px] right-3', {
                  hidden: disabled,
                })}
                color={cover === item.uri ? '#ffcb0c' : 'lightgray'}
                fill={cover === item.uri ? '#ffcb0c' : 'lightgray'}
              />
            </Pressable>
          )}
        />
      )}

      <Button
        onPress={pickImage}
        className={clsx('flex items-center justify-center', {
          hidden: disabled || images.length >= 5,
        })}
        title={
          images && images?.length > 0
            ? `(${images.length}) Adicicionar mais fotos`
            : 'Adicionar fotografias'
        }
      />
    </View>
  )
}
