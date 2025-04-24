import { TouchableOpacity, TouchableOpacityProps as RNTouchableOpacityProps } from 'react-native';
import { FlexProps, flexViewPropsStyle, getStyle } from '@/utils/PropsStyles';
import React from 'react';
import { observer } from 'mobx-react';

export interface TouchableOpacityProps<T = any> extends Omit<RNTouchableOpacityProps, 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut'> {
  onPress?: (context?: T) => void;
  onLongPress?: (context?: T) => void;
  onPressIn?: (context?: T) => void;
  onPressOut?: (context?: T) => void;
  context?: T;
}

export interface ITouchableOpacityUI extends FlexProps, TouchableOpacityProps {}

export const TouchableOpacityUI = observer((props: ITouchableOpacityUI) => {
  const { style, onPress, onLongPress, onPressIn, onPressOut, context, children, ...rest } = props;
  const { styleSource, restProps } = flexViewPropsStyle(rest);
  const SS = getStyle(style, styleSource);

  const _onPress = () => {
    if (onPress) {
      onPress?.(context);
    }
  };
  const _onLongPress = () => {
    if (onLongPress) {
      onLongPress(context);
    }
  };

  const _onPressIn = () => {
    if (onPressIn) {
      onPressIn(context);
    }
  };

  const _onPressOut = () => {
    if (onPressOut) {
      onPressOut(context);
    }
  };

  const touchableProps = {
    onPress: onPress ? _onPress : undefined,
    onLongPress: onLongPress ? _onLongPress : undefined,
    onPressIn: onPressIn ? _onPressIn : undefined,
    onPressOut: onPressOut ? _onPressOut : undefined,
  };

  return (
    <TouchableOpacity style={SS.style} {...touchableProps} {...restProps}>
      {children}
    </TouchableOpacity>
  );
});
