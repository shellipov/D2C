import React from 'react';
import { ColorValue, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { TextUI } from '../TextUI';
import { ColorsVars } from '../../../settings';
import { Theme } from '../../../store';
import { observer } from 'mobx-react';

export enum IButtonTypeEnum {
  Debug = 'Debug',
}

export interface IButtonUIProps extends TouchableOpacityProps{
    title: string;
    type?: IButtonTypeEnum,
    textColor?: ColorValue
    children?: React.ReactNode;
}

export const ButtonUI = observer((props: IButtonUIProps) => {
  const { children, title, textColor, style, ...rest } = props;
  const { color } = Theme;

  const activeButtonColor = {
    backgroundColor: color.elementPrimary,
    borderColor: color.elementPrimary,
  };

  const disabledButtonColor = {
    backgroundColor: color.elementDisabled,
    borderColor: color.elementDisabled,
  };

  const colorStyle = props.disabled ? disabledButtonColor : activeButtonColor;
  const debugButtonColor = Theme.isDark ? ColorsVars.gray : ColorsVars.disabledText;
  const disabledTextColor = props.disabled ? ColorsVars.disabledText : !!textColor ? textColor : ColorsVars.black;


  switch (props.type) {
    case IButtonTypeEnum.Debug:
      return (
        <TouchableOpacity style={[styles.debugButton, colorStyle, style, { borderColor: debugButtonColor }]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'small'} style={{ backgroundColor: debugButtonColor }} />
          )}
          {children}
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity style={[styles.button, colorStyle, style]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledTextColor }} />
          )}
          {children}
        </TouchableOpacity>
      );
  }
});

const styles = StyleSheet.create({
  debugButton: {
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 16,
  },
  button: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 12,
    alignItems: 'center',
  },
});
