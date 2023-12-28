import { ImageSourcePropType } from 'react-native';

export interface ResidenceProps {
  id?: number;
  image: ImageSourcePropType;
  location: string;
  price: number;
  status: 'sell' | 'rent';
  type?: string;
  description?: string;
}
