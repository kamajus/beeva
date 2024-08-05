import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import ActionSheet, {
  SheetProps,
  SheetManager,
} from 'react-native-actions-sheet'

import IconButton from '@/components/IconButton'
import { supabase } from '@/config/supabase'
import { useAlert } from '@/hooks/useAlert'
import { useSupabase } from '@/hooks/useSupabase'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { useOpenedResidenceStore } from '@/store/OpenedResidenceStore'
import { useSavedResidenceStore } from '@/store/SavedResidenceStore'
import { useUserResidenceStore } from '@/store/UserResidenceStore'

export default function ResidenceMenuSheet(
  props: SheetProps<'residence-menu-sheet'>,
) {
  const { saveResidence, handleCallNotification, user } = useSupabase()
  const [saved, setSaved] = useState(false)

  const alert = useAlert()

  const residenceRepository = useMemo(() => new ResidenceRepository(), [])

  const savedResidences = useSavedResidenceStore((state) => state.residences)
  const residenceSavedStatus = useSavedResidenceStore((state) => state.status)

  const removeOpenedResidence = useOpenedResidenceStore((state) => state.remove)
  const removeUserResidence = useUserResidenceStore((state) => state.remove)

  const residence = props.payload.residence

  useEffect(() => {
    async function checkSaved() {
      if (residence) {
        const isSaved = await residenceSavedStatus(residence.id, user)
        setSaved(isSaved)
      }
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residence, savedResidences, user])

  const deleteResidence = useCallback(async () => {
    if (residence.photos) {
      try {
        await residenceRepository.deleteById(residence.id)
        await supabase.storage
          .from('residences')
          .remove(
            residence.photos.map(
              (image) => `${user.id}/${residence.id}/${image}`,
            ),
          )

        if (router.canGoBack()) {
          router.back()
        } else {
          router.replace('/home')
        }

        removeOpenedResidence(residence.id)
        removeUserResidence(residence.id)

        handleCallNotification({
          title: 'Residência apagada',
          body: 'A residência foi apagada com sucesso',
        })
      } catch {
        alert.showAlert({
          message: 'Erro ao tentar apagar',
          title: 'Não foi possível apagar a residência, tente mais tarde.',
        })
      }
    }
  }, [
    residence.photos,
    residenceRepository,
    residence.id,
    removeOpenedResidence,
    removeUserResidence,
    handleCallNotification,
    user.id,
    alert,
  ])

  return (
    <ActionSheet id={props.sheetId}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-row items-center gap-x-1 px-2 py-4 mb-5 border-b border-b-gray-300">
          <IconButton
            name="X"
            size={20}
            onPress={() => SheetManager.hide('residence-menu-sheet')}
          />
          <Text className="font-poppins-semibold text-sm">Opções</Text>
        </View>

        {residence.owner_id === user.id ? (
          <View className="flex gap-y-6 px-2 py-4">
            <Pressable
              onPress={() => {
                router.push(`/editor/${residence.id}`)
              }}
              className="px-4">
              <Text className="font-poppins-semibold text-lg">
                Editar residência
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                alert.showAlert({
                  title: 'Atenção',
                  message: 'Você tem certeza que quer apagar essa residência?',
                  primaryLabel: 'Sim',
                  secondaryLabel: 'Cancelar',
                  onPressPrimary() {
                    deleteResidence()
                  },
                })
              }}
              className="px-4">
              <Text className="font-poppins-semibold text-lg">
                Apagar essa residência
              </Text>
            </Pressable>

            <Pressable className="px-4">
              <Text className="font-poppins-semibold text-lg">
                Compartilhar
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex gap-y-6 px-2 py-4">
            <Pressable
              onPress={() => {
                async function handleSaveResidence() {
                  setSaved(!saved)
                  await saveResidence(residence, !saved)
                }

                handleSaveResidence()
              }}
              className="px-4">
              <Text className="font-poppins-semibold text-lg">
                {saved ? 'Adicionar aos guardados' : 'Remover dos guardados'}
              </Text>
            </Pressable>

            <Pressable className="px-4">
              <Text className="font-poppins-semibold text-lg">
                Compartilhar
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ActionSheet>
  )
}
