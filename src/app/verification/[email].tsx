import clsx from 'clsx'
import { Link, useLocalSearchParams, router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Text, ScrollView, StyleSheet, Dimensions, View } from 'react-native'
import { OtpInput } from 'react-native-otp-entry'

import Button from '@/components/Button'
import TextField from '@/components/TextField'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import { NotificationRepository } from '@/repositories/notification.repository'

const { width } = Dimensions.get('window')
const inputWidth = width - width * 0.16

export default function Confirmation() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [counter, setCounter] = useState(180)

  const notificationRepository = useMemo(() => new NotificationRepository(), [])

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
        email,
        token: code,
        type: 'email',
      })
      .then(async ({ error, data }) => {
        if (!error) {
          await notificationRepository.create({
            user_id: data.user.id,
            title: 'Seja bem vindo',
            description:
              'Bem-vindo à plataforma onde seus sonhos de moradia se tornam realidade! 🏡✨',
            type: 'new-user-account',
            was_readed: false,
          })
          router.replace('/home')
        } else {
          setLoading(false)
          setError(true)
        }
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })
  }

  const minutes = Math.floor(counter / 60)
  const seconds = counter % 60

  return (
    <View className="bg-white h-full">
      <ScrollView className="mt-[10%] ml-[8%]" style={{ width: inputWidth }}>
        <View>
          <Text className="mt-5 font-poppins-semibold text-2xl">
            Confirmação de email
          </Text>
          <Text className="font-poppins-regular w-full">
            Enviamos um código de confirmação de 6 dígitos para{' '}
            <Text className="font-poppins-semibold">{email}</Text>
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
            onFilled={signInWithOtp}
            autoFocus
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
          <TextField.Helper message={error && 'O código está incorrecto.'} />
          <Button loading={loading} onPress={signInWithOtp} title="Verificar" />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
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
