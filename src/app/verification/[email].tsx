import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, ScrollView, StyleSheet, StatusBar, Dimensions, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Button, HelperText } from 'react-native-paper';

import { supabase } from '../../config/supabase';
import Constants from '../../constants';
const { width } = Dimensions.get('window');
const inputWidth = width - width * 0.16;

export default function Confirmation() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  async function signInWithOtp() {
    await supabase.auth
      .verifyOtp({
        email: String(email),
        token: code,
        type: 'email',
      })
      .then(() => {
        router.replace('/(root)/home');
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <View className="bg-white h-full">
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>Confirmação de email</Text>
          <Text style={styles.message}>
            Enviamos um código de confirmação de 5 dígitos para{' '}
            <Text style={styles.highlight}>{email}</Text>.{'\n'}
          </Text>
          <Link href="/signup" className="text-primary font-poppins-medium">
            Voltar
          </Link>
          <OtpInput
            numberOfDigits={5}
            focusColor={Constants.colors.primary}
            theme={{
              containerStyle: styles.Ocontainer,
              pinCodeContainerStyle: styles.pinCode,
            }}
            onTextChange={(value) => setCode(value)}
            focusStickBlinkingDuration={500}
          />
          <HelperText className="p-0 m-0" type="error" visible={error !== false}>
            O código está incorrecto.
          </HelperText>
          <Button
            style={{
              height: 58,
              display: 'flex',
              justifyContent: 'center',
              marginTop: 10,
            }}
            mode="contained"
            buttonColor={Constants.colors.primary}
            textColor="white"
            uppercase={false}
            onPress={signInWithOtp}>
            Verificar
          </Button>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    marginLeft: '8%',
    width: inputWidth,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontFamily: 'poppins-semibold',
    marginTop: 20,
  },
  message: {
    fontSize: 14,
    color: '#312E49',
    marginTop: 20,
    fontFamily: 'poppins-regular',
  },
  highlight: {
    fontFamily: 'poppins-semibold',
  },
  Ocontainer: {
    marginVertical: 30,
    width: inputWidth,
    height: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCode: {
    width: inputWidth / 5 - 10,
    height: inputWidth / 5 - 10,
    fontFamily: 'poppins-medium',
  },
});
