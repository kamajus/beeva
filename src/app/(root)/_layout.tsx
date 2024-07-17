import { Tabs } from 'expo-router'
import { Home, PlusCircle, SettingsIcon } from 'lucide-react-native'

import constants from '@/constants'

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: constants.colors.primary,
        tabBarInactiveTintColor: '#212121',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: 'poppins-medium',
        },
        tabBarIconStyle: {
          width: 23,
          height: 23,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Criar',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Definições',
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon size={size} color={color} fill="white" />
          ),
        }}
      />
    </Tabs>
  )
}
