import clsx from 'clsx'
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native'

import { IResidenceFilterEnum } from '@/assets/@types'
import constants from '@/constants'

interface IResidenceFilterButton {
  kind?: IResidenceFilterEnum
  setKind?: React.Dispatch<React.SetStateAction<IResidenceFilterEnum>>
  paddingHorizontal: number
  excludeAllOption?: boolean
}

export default function ResidenceFilterButton(props: IResidenceFilterButton) {
  const data = props.excludeAllOption
    ? constants.categories.filter((category) => category.value !== 'all')
    : constants.categories

  function onButtonActive(value: IResidenceFilterEnum) {
    if (props?.setKind) {
      props?.setKind(value)
    }
  }

  return (
    <ScrollView>
      <View>
        <FlatList
          data={data}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: props.paddingHorizontal }}
          horizontal
          renderItem={({ item }) => (
            <Pressable
              className={clsx(
                'mr-2 py-4 px-5 border-t-transparent rounded-md bg-[#f5f5f5]',
                {
                  'bg-primary': props.kind === item.value,
                  'mr-0': data[data.length - 1] === item,
                },
              )}
              onPress={() => onButtonActive(item.value)}>
              <Text
                className={clsx('font-poppins-medium text-black text-sm', {
                  'text-white': props.kind === item.value,
                })}>
                {data
                  .filter((categorie) => categorie.value === item.value)
                  .map((categorie) => `${categorie.emoji} ${categorie.name}`)}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  )
}
