import clsx from 'clsx';
import { ReactNode } from 'react';
import { View } from 'react-native';

interface TextFieldContainerProps {
  children: ReactNode;
  errors?: string | undefined;
  styles?: object;
}

export default function TextFieldContainer(props: TextFieldContainerProps) {
  return (
    <View
      className={clsx(
        'w-full px-2 flex-row items-center bg-[#f5f5f5] border-2 border-[#f5f5f5] focus:border-[#8b6cef] rounded',
        {
          'border-red-500': props.errors,
        },
      )}
      style={props.styles}>
      {props.children}
    </View>
  );
}
