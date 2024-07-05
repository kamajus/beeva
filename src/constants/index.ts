import ExpoConstants from 'expo-constants';

import { ResidenceTypes } from '../assets/@types';

type Categories = { name: string; value: ResidenceTypes; emoji: string }[];

const colors = {
  primary: '#6B0088',
  input: '#f9f9f9',
  alert: '#EF4444',
};

// Calculates the distance between the custom navigation header and screen
const customHeaderDistance = ExpoConstants.statusBarHeight * 2 + 30;

const categories: Categories = [
  {
    name: 'Todos',
    value: 'all',
    emoji: '🌐',
  },
  {
    name: 'Apartamento',
    value: 'apartment',
    emoji: '🏢',
  },
  {
    name: 'Vivenda',
    value: 'villa',
    emoji: '🏡',
  },
  {
    name: 'Terreno',
    value: 'land',
    emoji: '🚧',
  },
  {
    name: 'Outros',
    value: 'others',
    emoji: '🏪',
  },
];

export default {
  colors,
  categories,
  customHeaderDistance,
};
