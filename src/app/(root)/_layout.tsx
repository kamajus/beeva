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
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused, size }) => <Icon name="home" size={23} color="#8b6cef" />,
          tabBarLabelStyle: {
            color: '#8b6cef',
            fontFamily: 'poppins-regular',
          },
        }}
      />
    </Tabs>
  );
}
