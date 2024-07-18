import { Link } from 'expo-router'
import { Image, View } from 'react-native'

interface IGaleryItem {
  id: string
  image: string | null
  activeted: boolean
}

export default function GaleryItem({ activeted, id, image }: IGaleryItem) {
  return (
    <Link
      href={{
        pathname: '/residence/[id]',
        params: { id },
      }}>
      <View key={id} className="relative h-28 w-28">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          source={{ uri: String(image) }}
          className="h-full w-full rounded-lg"
        />
      </View>
    </Link>
  )
}
