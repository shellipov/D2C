import { Text, TextProps } from 'react-native';
import React from 'react';

type TextSize = 'small' | 'medium' | 'large' | 'title'

const TEXT_SIZE = {
  small : 12,
  medium : 16,
  large : 20,
  title : 24,
};

export interface ITextUIProps extends TextProps{
    text: string
    size : TextSize;
    children?: React.ReactNode;
}

export function TextUI (props: ITextUIProps) {
  const { text, size, children, ...rest } = props;

  return (
    <Text style={[{ fontSize: TEXT_SIZE[size] }]} {...rest}>
      {text}
      {children}
    </Text>
  );
}
