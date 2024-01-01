import clsx from 'clsx';
import { ReactNode } from 'react';
import { View } from 'react-native';

interface TextFieldContainerProps {
  children: ReactNode;
  errors?: string | undefined;
  styles?: object;
  disableFocus?: boolean;
}

export default function TextFieldContainer(props: TextFieldContainerProps) {
  return (
    <View
      className={clsx(
        'w-full px-2 flex-row items-center bg-[#f5f5f5] border-2 border-[#f5f5f5] rounded',
        {
          'border-red-500': props.errors,
          'focus:border-[#8b6cef]': !props.disableFocus,
        },
      )}
      style={props.styles}>
      {props.children}
    </View>
  );
}
