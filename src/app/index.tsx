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
      console.log(`session on index: ${session}`)

      if (fontsLoaded && !fontError && initialized) {
        if (session) {
          replace('/home')
        } else {
          replace('/signin')
        }
      }
    }

    handleRedirect()
  }, [session, initialized, replace, fontsLoaded, fontError])

  return <LoadScreen />
}
