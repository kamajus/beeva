import { IResidence } from '@/@types'

export const RESIDENCE_DATA: IResidence[] = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
    owner_id: 'd6c5b4a3-2f1e-0d9c-8b7a-6f5e4d3c2b1a',
    cover: 'https://placehold.co/600x600/212121/ffffff/png',
    photos: [
      'https://placehold.co/600x600/212121/ffffff/png',
      'https://placehold.co/600x600/212121/ffffff/png',
    ],
    approval_status: true,
    location: 'Cazenga, Luanda',
    state: 'sell',
    kind: 'land',
    price: 385456045,
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
    description:
      'A cozinha, embora espaçosa, pode beneficiar-se de uma renovação para atender aos padrões modernos. As paredes têm histórias para contar, com algumas necessitando de reparos devido à umidade, mas isso também significa uma oportunidade para personalização.',
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2a3b4c5d6e7f',
    owner_id: 'e7f6d5c4-3b2a-1e0d-9c8b-7a6f5d4c3b2a',
    cover: 'https://placehold.co/600x600/212121/ffffff/png',
    photos: [
      'https://placehold.co/600x600/212121/ffffff/png',
      'https://placehold.co/600x600/212121/ffffff/png',
    ],
    approval_status: true,
    location: 'Luada, Prenda',
    state: 'sell',
    kind: 'land',
    price: 789345000,
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
    description:
      'A cozinha, embora espaçosa, pode beneficiar-se de uma renovação para atender aos padrões modernos. As paredes têm histórias para contar, com algumas necessitando de reparos devido à umidade, mas isso também significa uma oportunidade para personalização.',
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2a-3b4c5d6e7f8a',
    owner_id: 'f8e7d6c5-4b3a-2e1d-0c9b-8a7f6d5c4b3a',
    cover: 'https://placehold.co/600x600/212121/ffffff/png',
    photos: [
      'https://placehold.co/600x600/212121/ffffff/png',
      'https://placehold.co/600x600/212121/ffffff/png',
    ],
    approval_status: true,
    location: 'Viana, Luanda',
    state: 'sell',
    kind: 'apartment',
    price: 550000000,
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
    description:
      'Este apartamento está localizado em uma área tranquila e segura de Viana. Possui três quartos espaçosos, uma sala de estar aconchegante e uma cozinha moderna. O edifício oferece estacionamento seguro e uma área de lazer compartilhada.',
  },
  {
    id: 'd4e5f6a7-b8c9-0d1e-2a3b-4c5d6e7f8a9b',
    owner_id: '9b8a7f6e-5d4c-3b2a-1e0d-9c8b7a6f5d4c',
    cover: 'https://placehold.co/600x600/212121/ffffff/png',
    photos: [
      'https://placehold.co/600x600/212121/ffffff/png',
      'https://placehold.co/600x600/212121/ffffff/png',
    ],
    approval_status: true,
    location: 'Benguela, Benguela',
    state: 'sell',
    kind: 'villa',
    price: 1200000000,
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
    description:
      'Esta casa espaçosa em Benguela é perfeita para uma família grande. Possui cinco quartos, um jardim amplo e bem cuidado, uma piscina privativa e uma área de churrasco. A localização oferece fácil acesso a escolas, lojas e outros serviços essenciais.',
  },
]
