import { useState } from 'react';
import { ScrollView, Text, View, StatusBar } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function SignIn() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ScrollView className="bg-white">
      <View className="px-7 mt-[15%] bg-white">
        <Text className="text-xl font-semibold mb-5">Iniciar sessão</Text>

        <View className=" flex gap-2">
          <TextInput
            mode="outlined"
            label="Email"
            style={{
              fontSize: 15,
            }}
            outlineColor="transparent"
            activeOutlineColor="#8b6cef"
          />

          <TextInput
            mode="outlined"
            label="Senha"
            style={{
              fontSize: 15,
            }}
            outlineColor="transparent"
            activeOutlineColor="#8b6cef"
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                onPress={() => setPasswordVisible(!passwordVisible)}
                icon={passwordVisible ? 'eye' : 'eye-off'}
              />
            }
          />

          <Text className="text-[#8b6cef] font-medium">Algo deu errado?</Text>

          <Button
            style={{
              height: 58,
              display: 'flex',
              justifyContent: 'center',
              marginTop: 10,
            }}
            mode="contained"
            buttonColor="#8b6cef"
            textColor="white"
            uppercase={false}>
            Entrar
          </Button>
        </View>
      </View>

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </ScrollView>
  );
}
