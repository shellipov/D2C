import { Text, TextProps } from 'react-native';
import React from 'react';
import { Theme } from '../../../store';
import { observer } from 'mobx-react';

type TextSize = 'small' | 'medium' | 'large' | 'title' | 'bigTitle'

const TEXT_SIZE = {
  small : 12,
  medium : 16,
  large : 18,
  title : 22,
  bigTitle : 28,
};

export interface ITextUIProps extends TextProps{
    text?: string
    size : TextSize;
    children?: React.ReactNode;
}

export const TextUI = observer((props: ITextUIProps)=> {
  const { text, size, children, style, ...rest } = props;
  const color = { color: Theme.color.textPrimary };

  return (
    <Text style={[{ fontSize: TEXT_SIZE[size] }, color, style]} {...rest}>
      {text}
      {children}
    </Text>
  );
});
