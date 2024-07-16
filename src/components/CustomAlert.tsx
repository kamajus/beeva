import { Dispatch, SetStateAction } from 'react'
import { Text } from 'react-native'
import { Portal, Dialog, Button } from 'react-native-paper'

import Constants from '../constants'

interface CustomAlertProps {
  title?: string
  message?: string
  valueOption1?: string
  functionOption1?: () => void
  valueOption2?: string
  functionOption2?: () => void
  alertVisible?: boolean
  setAlertVisible?: Dispatch<SetStateAction<boolean>>
}

export default function CustomAlert(props: CustomAlertProps) {
  return (
    <Portal>
      <Dialog
        visible
        onDismiss={() => {
          if (props?.setAlertVisible) {
            props?.setAlertVisible(false)
          }
        }}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.Content>
          <Text className="font-poppins-regular">{props.message}</Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            style={{
              display:
                !props?.functionOption2 && !props.valueOption2
                  ? 'none'
                  : 'flex',
            }}
            textColor={Constants.colors.alert}
            labelStyle={{
              textTransform: 'capitalize',
            }}
            onPress={() => {
              if (props?.setAlertVisible && props?.functionOption2) {
                props?.setAlertVisible(false)
                props?.functionOption2()
              }
            }}>
            {props.valueOption2}
          </Button>

          <Button
            style={{
              display:
                !props?.functionOption1 && !props.valueOption1
                  ? 'none'
                  : 'flex',
            }}
            textColor={Constants.colors.primary}
            labelStyle={{
              textTransform: 'capitalize',
            }}
            onPress={() => {
              if (props?.setAlertVisible && props?.functionOption1) {
                props?.setAlertVisible(false)
                props?.functionOption1()
              }
            }}>
            {props.valueOption1}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
