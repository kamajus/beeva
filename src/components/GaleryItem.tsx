import { Link } from 'expo-router';
import { Image, View } from 'react-native';

interface GaleryItemProps {
  id: string;
  image: string | null;
  activeted: boolean;
}

export default function GaleryItem({ activeted, id, image }: GaleryItemProps) {
  return (
    <Link
      href={{
        pathname: '/residence/[id]',
        params: { id },
      }}>
      <View key={id} className="relative h-28 w-28">
        <Image source={{ uri: String(image) }} className="h-full w-full rounded-lg" />
      </View>
    </Link>
  );
}
