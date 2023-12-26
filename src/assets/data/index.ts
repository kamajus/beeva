interface HouseType {
  id: number;
  image: any;
  location: string;
  status: 'sell' | 'rent';
  price: number;
  description?: string;
}

type HousesType = HouseType[];

export const HOMEDATA: HousesType = [
  {
    id: 1,
    image: require('../images/home.jpg'),
    location: 'Cazenga, Luanda',
    status: 'sell',
    price: 150000,
    description:
      'A cozinha, embora espaçosa, pode beneficiar-se de uma renovação para atender aos padrões modernos. As paredes têm histórias para contar, com algumas necessitando de reparos devido à umidade, mas isso também significa uma oportunidade para personalização.',
  },
  {
    id: 2,
    image: require('../images/home.jpg'),
    location: 'Viana, Luanda',
    status: 'sell',
    price: 150000,
  },
  {
    id: 3,
    image: require('../images/home.jpg'),
    location: 'Belas, Luanda',
    status: 'rent',
    price: 150000,
  },
  {
    id: 4,
    image: require('../images/home.jpg'),
    location: 'Prenda, Luanda',
    status: 'sell',
    price: 150000,
  },
  {
    id: 5,
    image: require('../images/home.jpg'),
    location: 'Ingombota, Luanda',
    status: 'rent',
    price: 150000,
  },
];
