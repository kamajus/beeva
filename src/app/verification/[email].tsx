import clsx from 'clsx'
import { Link, useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Text, ScrollView, StyleSheet, Dimensions, View } from 'react-native'
import { OtpInput } from 'react-native-otp-entry'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import constants from '@/constants'

const { width } = Dimensions.get('window')
const inputWidth = width - width * 0.16

export default function Confirmation() {
  const { email } = useLocalSearchParams()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [counter, setCounter] = useState(180)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1)
      } else {
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [counter])

  async function signInWithOtp() {
    setLoading(true)
    setError(false)

    await supabase.auth
      .verifyOtp({
        email: String(email),
        token: code,
        type: 'email',
      })
      .then(async ({ error, data }) => {
        if (!error) {
          await supabase.from('notifications').insert([
            {
              user_id: data.user?.id,
              title: 'Seja bem vindo',
              description:
                'Bem-vindo à plataforma onde seus sonhos de moradia se tornam realidade! 🏡✨',
              type: 'congratulations',
            },
          ])
          router.replace('/(root)/home')
        } else {
          setError(true)
        }
      })
      .catch(() => {
        setError(true)
      })
  }

  const minutes = Math.floor(counter / 60)
  const seconds = counter % 60

  return (
    <View className="bg-white h-full">
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>Confirmação de email</Text>
          <Text style={styles.message}>
            Enviamos um código de confirmação de 6 dígitos para{' '}
            <Text style={styles.highlight}>{email}</Text>
          </Text>
          <Link href="/signup" className="text-primary font-poppins-medium">
            Voltar
          </Link>
          <OtpInput
            numberOfDigits={6}
            focusColor={constants.colors.primary}
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
              'text-primary': counter === 0,
            })}
            onPress={() => {
              if (counter === 0) {
                supabase.auth.resend({ email: String(email), type: 'signup' })
                setCounter(180)
              }
            }}>
            {counter !== 0
              ? `Reenviar código: ${String(minutes).padStart(2, '0')}:${String(
                  seconds,
                ).padStart(2, '0')}`
              : 'Reenviar código'}
          </Text>
          <TextField.Helper
            visible={error !== false}
            message="O código está incorrecto."
          />
          <Button loading={loading} onPress={signInWithOtp} title="Verificar" />
        </View>
      </ScrollView>
    </View>
  )
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
})
