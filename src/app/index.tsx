import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

import LoadScreen from '@/components/LoadScreen'
import useLoadFonts from '@/hooks/useLoadFonts'
import { useSupabase } from '@/hooks/useSupabase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function App() {
  const { fontError, fontsLoaded } = useLoadFonts()
  const { session, initialized } = useSupabase()
  const { replace } = useRouter()

  useEffect(() => {
    const handleRedirect = () => {
      console.log('Handling redirect...')
      console.log(`fontsLoaded: ${fontsLoaded}`)
      console.log(`fontError: ${fontError}`)
      console.log(`initialized: ${initialized}`)
      console.log(`session: ${session.user.email}`)

      if (fontsLoaded && !fontError && initialized) {
        console.log('Redirecting...')
        if (session) {
          replace('/(root)/home')
        } else {
          replace('/signin')
        }
      }
    }

    handleRedirect()
  }, [session, initialized, replace, fontsLoaded, fontError])

  return <LoadScreen />
}
