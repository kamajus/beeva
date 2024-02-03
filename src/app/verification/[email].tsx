import { Link, useLocalSearchParams, router } from 'expo-router';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function signInWithOtp() {
    setLoading(true);
    setError(false);

    await supabase.auth
      .verifyOtp({
        email: String(email),
        token: code,
        type: 'email',
      })
      .then(async ({ error, data }) => {
        setError(false);

        if (!error) {
          const welcome = {
            user_id: data.user?.id,
            description:
              'Bem-vindo à plataforma onde seus sonhos de casa se tornam realidade! 🏡✨',
            type: 'congratulation',
          };

          await supabase.from('notifications').insert([welcome]).select();

          router.replace('/(root)/home');
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <View className="bg-white h-full">
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>Confirmação de email</Text>
          <Text style={styles.message}>
            Enviamos um código de confirmação de 6 dígitos para{' '}
            <Text style={styles.highlight}>{email}</Text>.{'\n'}
          </Text>
          <Link href="/signup" className="text-primary font-poppins-medium">
            Voltar
          </Link>
          <OtpInput
            numberOfDigits={6}
            focusColor={Constants.colors.primary}
            theme={{
              containerStyle: styles.Ocontainer,
              pinCodeContainerStyle: styles.pinCode,
              pinCodeTextStyle: styles.pinCodeTextStyle,
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
            loading={loading}
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
    fontFamily: 'poppins-medium',
  },
  pinCode: {
    width: inputWidth / 6 - 10,
    height: inputWidth / 6 - 10,
    fontFamily: 'poppins-medium',
  },
  pinCodeTextStyle: {
    fontFamily: 'poppins-semibold',
  },
});
