import { useState, cloneElement, ReactElement } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import Constants from '../constants';

interface PromptProps {
  content: string;
  children: ReactElement;
  onPress: () => Promise<any>;
}

export default function Prompt(props: PromptProps) {
  const [disabled, setDisabled] = useState(false);
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  function handleClick() {
    setVisible(false);
    setDisabled(true);

    props.onPress();
  }

  return (
    <View>
      {cloneElement(props.children, { onPress: showDialog })}
      <Portal>
        <Dialog dismissable={disabled} visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alerta</Dialog.Title>
          <Dialog.Content>
            <Text>{props.content}</Text>
          </Dialog.Content>
          <View className="flex flex-row justify-end">
            <Dialog.Actions>
              <Button
                labelStyle={{
                  textTransform: 'lowercase',
                }}
                textColor={disabled ? 'lightgray' : Constants.colors.alert}
                disabled={disabled}
                onPress={hideDialog}>
                Cancelar
              </Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button
                labelStyle={{
                  textTransform: 'lowercase',
                }}
                textColor={disabled ? 'lightgray' : Constants.colors.primary}
                disabled={disabled}
                onPress={handleClick}>
                Sim
              </Button>
            </Dialog.Actions>
          </View>
        </Dialog>
      </Portal>
    </View>
  );
}
