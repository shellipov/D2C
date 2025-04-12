import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { TextUI } from '../TextUI/TextUI.component';

export interface IButtonUIProps extends TouchableOpacityProps{
    title: string;
    children?: React.ReactNode;
}

export function ButtonUI (props: IButtonUIProps) {
  const { children, title, style, ...rest } = props;
  const colorStyle = props.disabled ? styles.disabled : styles.active;
  const testColor = props.disabled ? '#252525' : 'black';

  return (
    <TouchableOpacity style={[styles.button, colorStyle, style]} {...rest}>
      {!!title && (
        <TextUI text={title} size={'large'} style={{ color: testColor }} />
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 12,
    alignItems: 'center',
  },
  active: {
    backgroundColor: 'orange',
    borderColor: 'orange',
  },
  disabled: {
    backgroundColor: 'gray',
    borderColor: 'gray',
  },
});
