import clsx from 'clsx';
import * as Notifications from 'expo-notifications';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Button, HelperText } from 'react-native-paper';

import { supabase } from '../../config/supabase';
import Constants from '../../constants';
import { useCache } from '../../hooks/useCache';

const { width } = Dimensions.get('window');
const inputWidth = width - width * 0.16;
const MAX_COUNT = 600; // 10 minutes

export default function Confirmation() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setNotifications, notifications } = useCache();

  const [counter, setCounter] = useState(180);

  useEffect(() => {
    setCounter(0);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (counter < MAX_COUNT) {
        setCounter(counter + 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [counter]);

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
        const welcome = {
          user_id: data.user?.id,
          description: 'Bem-vindo à plataforma onde seus sonhos de casa se tornam realidade! 🏡✨',
          type: 'congratulations',
        };

        setError(false);

        if (!error) {
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: false,
            }),
          });

          Notifications.scheduleNotificationAsync({
            content: {
              title: 'Seje bem vindo!',
              body: welcome.description,
            },
            trigger: null,
          });

          setNotifications([...notifications, welcome]);
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

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

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
          <Text
            className={clsx('font-poppins-medium text-gray-300', {
              'text-primary': counter === MAX_COUNT,
            })}
            onPress={() => {
              if (counter === MAX_COUNT) {
                supabase.auth.resend({ email: String(email), type: 'signup' });
                setCounter(0);
              }
            }}>
            {counter !== MAX_COUNT
              ? `Reenviar código: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
                  2,
                  '0',
                )}`
              : 'Reenviar código'}
          </Text>
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
