import { useRouter } from 'expo-router';
import { useState, cloneElement, ReactElement } from 'react';
import { Alert, View } from 'react-native';
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
  const router = useRouter();

  function handleClick() {
    setVisible(true);
    setDisabled(false);

    props
      .onPress()
      .then(() => {
        setVisible(false);
        setDisabled(true);

        Alert.alert('Alerta', 'A residência foi eliminada com sucesso, clique em continuar.');
        router.replace('/home');
      })
      .catch(() => {
        Alert.alert(
          'Erro na postagem',
          'Não foi possível realizar a postagem da casa, tente mais tarde.',
        );
      })
      .finally(() => {
        setDisabled(true);
      });
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
