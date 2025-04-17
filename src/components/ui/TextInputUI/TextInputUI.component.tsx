import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {Theme} from '../../../store';

type TextSize = 'small' | 'medium' | 'large';

export interface ITextInputUIProps extends TextInputProps{
    textSize: TextSize;
    isError?: boolean;
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
  const { children, textSize, isError, style, ...rest } = props;
  const { color } = Theme;
  const borderColor = isError ? color.elementDanger : color.secondaryPrimary;

  return (
    <TextInput
      cursorColor={color.textPrimary}
      style={[
        styles.textInput,
        { color: color.textPrimary, borderColor },
        TEXT_SIZE[textSize],
        style]} {...rest}>
      {children}
    </TextInput>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
    width: 250,
    minHeight: 38,
  },
});
