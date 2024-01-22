import clsx from 'clsx';
import { ReactNode } from 'react';
import { View } from 'react-native';

interface TextFieldContainerProps {
  children: ReactNode;
  error?: boolean;
  styles?: object;
  disableFocus?: boolean;
}

export default function TextFieldContainer(props: TextFieldContainerProps) {
  return (
    <View
      className={clsx(
        'w-full px-2 flex-row items-center bg-[#f5f5f5] border-2 border-[#f5f5f5] rounded',
        {
          'focus:border-[#BA1A1A]': props.error && !props.disableFocus,
          'focus:border-primary': !props.error && !props.disableFocus,
        },
      )}
      style={props.styles}>
      {props.children}
    </View>
  );
}
