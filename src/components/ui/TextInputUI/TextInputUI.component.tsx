import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

export interface ITextInputUIProps extends TextInputProps{
    children?: React.ReactNode;
}

export function TextInputUI (props: ITextInputUIProps) {
  const { children, style, ...rest } = props;

  return (
    <TextInput style={[styles.textInput, style]} {...rest}>
      {children}
    </TextInput>
  );
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 24,
    lineHeight: 28,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
    width: 250,
  },
});
