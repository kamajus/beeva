import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#8b6cef',
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
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Criar',
          tabBarIcon: ({ color, size }) => <Icon name="add-circle" size={size} color={color} />,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => <Icon name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
