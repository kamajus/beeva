import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'

import IconButton from './IconButton'

import { IWishe } from '@/@types'
import constants from '@/constants'
import { formatMoney } from '@/functions/format'
import { useAlert } from '@/hooks/useAlert'
import { useToast } from '@/hooks/useToast'
import { WisheRepository } from '@/repositories/wishe.repository'
import { useWisheStore } from '@/store/WisheStore'

export default function WisheCard(props: IWishe) {
  const toast = useToast()
  const alert = useAlert()
  const removeWishe = useWisheStore((state) => state.remove)

  const wisheRepository = useMemo(() => new WisheRepository(), [])

  const deleteWishe = (id: string) => {
    try {
      wisheRepository.deleteById(id)
      removeWishe(id)
      toast.show({ description: 'Desejo apagado com sucesso!' })
    } catch {
      alert.show({
        title: 'Erro',
        message: 'Não foi possível apagar o desejo. Tente novamente.',
      })
    }
  }

  const getFormattedPrice = (price: number) => {
    const formattedPrice = formatMoney(price)
    return props.state === 'rent' ? `${formattedPrice}/mês` : formattedPrice
  }

  return (
    <Pressable className="w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4 relative">
      <Text className="text-black font-semibold text-lg font-poppins-medium w-[95%]">
        {props.location}
      </Text>
      <Text className="text-gray-700 text-sm mt-1 font-poppins-regular">
        {props.min_price === 0
          ? `Até ${getFormattedPrice(props.max_price)}`
          : `De ${getFormattedPrice(props.min_price)} até ${getFormattedPrice(props.max_price)}`}
      </Text>
      <View className="flex flex-row items-center gap-2 mt-2">
        <Text className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-poppins-regular font-medium">
          {props.state === 'rent' ? 'Aluguel' : 'Venda'}
        </Text>
        <Text className="bg-gray-300 text-gray-800 rounded-full px-3 py-1 text-xs font-medium font-poppins-regular">
          {
            constants.categories.find(
              (category) => category.value === props.kind,
            )?.name
          }{' '}
          {
            constants.categories.find(
              (category) => category.value === props.kind,
            )?.emoji
          }
        </Text>
      </View>
      <IconButton
        name="Trash"
        color={constants.colors.alert}
        onPress={() => {
          alert.show({
            title: 'Atenção',
            message: 'Você tem certeza que deseja apagar este desejo?',
            primaryLabel: 'Sim',
            secondaryLabel: 'Cancelar',
            onPressPrimary: () => deleteWishe(props.id),
          })
        }}
        className="absolute top-3 right-3"
      />
    </Pressable>
  )
}
