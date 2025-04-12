import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { ColorsVars } from '../../../settings';

type TextSize = 'small' | 'medium' | 'large';

export interface ITextInputUIProps extends TextInputProps{
    textSize: TextSize
    children?: React.ReactNode;
}

const TEXT_SIZE = {
  small : {
    fontSize: 16,
    lineHeight: 20,
  },
  medium : {
    fontSize: 18,
    lineHeight: 22,
  },
  large : {
    fontSize: 24,
    lineHeight: 28,
  },
};

export function TextInputUI (props: ITextInputUIProps) {
  const { children, textSize, style, ...rest } = props;

  return (
    <TextInput style={[styles.textInput, TEXT_SIZE[textSize], style]} {...rest}>
      {children}
    </TextInput>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: ColorsVars.gray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
    width: 250,
    minHeight: 38,
  },
});
