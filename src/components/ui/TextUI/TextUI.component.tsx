import { Text, TextProps } from 'react-native';
import React from 'react';
import { observer } from 'mobx-react';
import { useAppTheme } from '@/hooks/useAppTheme';

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
    size?: TextSize;
    children?: React.ReactNode;
}

export const TextUI = observer((props: ITextUIProps)=> {
  const { text, size, children, style, ...rest } = props;
  const theme = useAppTheme();
  const styles = { color: theme.color.textPrimary, fontSize: TEXT_SIZE[size || 'medium'] };

  return (
    <Text style={[styles, style]} {...rest}>
      {text}
      {children}
    </Text>
  );
});
