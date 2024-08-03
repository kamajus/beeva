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
  onClose: () => void
  buttons?: { text: string; onPress: () => void }[]
}

const Dialog: React.FC<IDialogProps> = ({
  visible,
  title,
  message,
  onClose,
  buttons = [],
}) => {
  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}>
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
                  onClose()
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
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
  title: string
  message: string
  primaryLabel: string
  onPressPrimary?: () => void
  secondaryLabel?: string
  onPressSecondary?: () => void
  alertVisible: boolean
  onClose: () => void
}

const CustomAlert: React.FC<ICustomAlertProps> = ({
  title,
  message,
  primaryLabel,
  onPressPrimary,
  secondaryLabel,
  onPressSecondary,
  alertVisible,
  onClose,
}) => {
  const buttons = [
    {
      text: secondaryLabel || '',
      onPress: () => {
        if (onPressSecondary) {
          onPressSecondary()
        }
      },
    },
    {
      text: primaryLabel || '',
      onPress: () => {
        if (onPressPrimary) {
          onPressPrimary()
        }
      },
    },
  ]

  return (
    <Dialog
      visible={alertVisible}
      title={title}
      message={message}
      onClose={onClose}
      buttons={buttons.filter((button) => button.text !== '')}
    />
  )
}

export default CustomAlert
