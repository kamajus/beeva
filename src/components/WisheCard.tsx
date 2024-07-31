import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'

import IconButton from './IconButton'

import { IWishe } from '@/@types'
import constants from '@/constants'
import { formatMoney } from '@/functions/format'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { WisheRepository } from '@/repositories/wishe.repository'
import { useWisheStore } from '@/store/WisheStore'

export default function WisheCard(props: IWishe) {
  const alert = useAlert()
  const removeFromWishe = useWisheStore((state) => state.removeFromWishe)
  const { handleCallNotification } = useSupabase()

  const wisheRepository = useMemo(() => new WisheRepository(), [])

  function deleteWishe(id: string) {
    try {
      wisheRepository.deleteById(id)
      removeFromWishe(id)

      handleCallNotification(
        'Desejo apagado',
        'O desejo foi apagado com sucesso',
      )
    } catch {
      alert.showAlert('Atenção', 'Não foi possível apagar o teu desejo.', 'Ok')
    }
  }

  function getFormattedPrice(price: number) {
    const formattedPrice = formatMoney(price)

    return props.state === 'rent' ? `${formattedPrice}/mês` : formattedPrice
  }

  return (
    <Pressable className="w-full bg-[#f5f5f561] border-[.5px] p-3 rounded relative">
      <Text className="text-black font-poppins-semibold text-[15px] w-[85%]">
        {props.location}
      </Text>
      <Text className="text-black text-xs font-poppins-medium w-[88%]">
        de {getFormattedPrice(props.minPrice)} até{' '}
        {getFormattedPrice(props.maxPrice)}
      </Text>
      <View className="flex flex-row items-center gap-x-3 mt-2">
        <Text className="text-black font-poppins-medium">
          Tipo de residência:
        </Text>
        <Text className="text-white bg-slate-400 rounded border-[.5px] border-gray-500 px-2 py-[3px] font-poppins-medium">
          {constants.categories
            .filter((category) => category.value === props.kind)
            .map((category) => `${category.name} ${category.emoji}`)}
        </Text>
      </View>
      <IconButton
        name="Trash"
        color={constants.colors.alert}
        onPress={() => {
          alert.showAlert(
            'Atenção',
            'Você tem certeza que queres apagar o teu desejo?',
            'Sim',
            () => {
              deleteWishe(props.id)
            },
            'Cancelar',
          )
        }}
        className="absolute top-3 right-3"
      />
    </Pressable>
  )
}
