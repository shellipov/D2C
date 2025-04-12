import { Text, TextProps } from 'react-native';
import React from 'react';

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

export function TextUI (props: ITextUIProps) {
  const { text, size, children, style, ...rest } = props;

  return (
    <Text style={[{ fontSize: TEXT_SIZE[size] }, style]} {...rest}>
      {text}
      {children}
    </Text>
  );
}
