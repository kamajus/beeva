import { ImageSourcePropType } from 'react-native';

interface ResidenceBase {
  id?: number;
  location: string;
  status: 'sell' | 'rent';
  image: ImageSourcePropType;
  type?: string;
}

export interface ResidenceProps extends ResidenceBase {
  price: number;
  description?: string;
}

export interface ResidencePropsCard extends ResidenceBase {
  price: string;
}
