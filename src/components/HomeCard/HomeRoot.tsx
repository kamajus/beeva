import { ReactNode } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Constants from '../../constants';

interface HomeRootProps {
  children: ReactNode;
  title: string;
  icon?: string;
  iconColor?: string;
  withoutPlus?: boolean;
}

export default function HomeRoot({ children, title, withoutPlus, icon, iconColor }: HomeRootProps) {
  return (
    <View className="mt-4">
      <View className="px-4 flex flex-row justify-between mb-4">
        <View className="flex flex-row items-center gap-2">
          {icon && <Icon name={icon} color={iconColor} size={23} />}
          <Text className="font-poppins-bold text-lg">{title}</Text>
        </View>
        {!withoutPlus && (
          <TouchableOpacity className="flex flex-row items-center gap-2">
            <Text className="font-poppins-medium text-primary">Ver mais</Text>
            <MaterialIcon name="arrow-right-alt" color={Constants.colors.primary} size={20} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}
