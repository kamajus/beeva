import React from 'react'
import { View, Text, Modal, StyleSheet, Dimensions } from 'react-native'

import Button from './Button'

import constants from '@/constants'

const { width } = Dimensions.get('window')
const inputWidth = width - width * 0.16

interface IDialogProps {
  visible: boolean
  title?: string
  message?: string
  onDismiss: () => void
  buttons?: { text: string; onPress: () => void }[]
}

const Dialog: React.FC<IDialogProps> = ({
  title,
  message,
  onDismiss,
  buttons = [],
}) => {
  return (
    <Modal animationType="slide" transparent visible onRequestClose={onDismiss}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {title && (
            <View className="w-full mt-3 mb-3">
              <Text className="font-poppins-semibold text-xl">{title}</Text>
            </View>
          )}
          {message && (
            <View style={styles.modalContent}>
              <Text className="text-left font-poppins-regular">{message}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                className="p-2 rounded bg-transparent"
                labelStyle={{
                  color:
                    index === 0
                      ? constants.colors.alert
                      : constants.colors.primary,
                }}
                onPress={() => {
                  button.onPress()
                  onDismiss()
                }}
                title={button.text}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: inputWidth,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    marginBottom: 12,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})

interface ICustomAlertProps {
  title?: string
  message?: string
  valueOption1?: string
  functionOption1?: () => void
  valueOption2?: string
  functionOption2?: () => void
  alertVisible?: boolean
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomAlert: React.FC<ICustomAlertProps> = ({
  title,
  message,
  valueOption1,
  functionOption1,
  valueOption2,
  functionOption2,
  alertVisible,
  setAlertVisible,
}) => {
  const buttons = [
    {
      text: valueOption2 || '',
      onPress: () => {
        if (functionOption2) {
          functionOption2()
        }
      },
    },
    {
      text: valueOption1 || '',
      onPress: () => {
        if (functionOption1) {
          functionOption1()
        }
      },
    },
  ]

  return (
    <Dialog
      visible={alertVisible || false}
      title={title}
      message={message}
      onDismiss={() => {
        if (setAlertVisible) {
          setAlertVisible(false)
        }
      }}
      buttons={buttons.filter((button) => button.text !== '')}
    />
  )
}

export default CustomAlert
