import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 77,
          paddingBottom: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
      }}>
      <Tabs.Screen
        name="house"
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
