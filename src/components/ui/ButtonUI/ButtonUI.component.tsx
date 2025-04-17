import React from 'react';
import { ColorValue, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { TextUI } from '../TextUI';
import { Theme } from '../../../store';
import { observer } from 'mobx-react';
import { ColorsVars } from '../../../settings';

export type ButtonType = 'debug' | 'white' | 'red' | 'redBorder'


export interface IButtonUIProps extends TouchableOpacityProps{
    title: string;
    type?: ButtonType
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

  const whiteButtonColor = {
    backgroundColor: color.bgBasic,
    borderColor: color.secondaryPrimary,
  };

  const redButtonColor = {
    backgroundColor: color.elementDanger,
    borderColor: color.elementDanger,
  };

  const colorStyle = props.disabled ? disabledButtonColor : activeButtonColor;
  const disabledTextColor = props.disabled ? color.disabledPrimary : !!textColor ? textColor : color.textPrimary;
  const disabledInversionTextColor = props.disabled ? color.disabledPrimary : !!textColor ? textColor : color.textWhite;

  // textColor={'white'} style={{ backgroundColor: ColorsVars.red, borderColor: ColorsVars.red }}

  switch (props.type) {
    case 'debug':
      return (
        <TouchableOpacity style={[styles.debugButton, colorStyle, style, { borderColor: color.bgGray }]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'small'} style={{ backgroundColor: color.bgGray }} />
          )}
          {children}
        </TouchableOpacity>
      );
    case 'white':
      return (
        <TouchableOpacity style={[styles.button, whiteButtonColor, style]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledTextColor }} />
          )}
          {children}
        </TouchableOpacity>
      );
    case 'red':
      return (
        <TouchableOpacity style={[styles.button, redButtonColor, style]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledInversionTextColor }} />
          )}
          {children}
        </TouchableOpacity>
      );
    case 'redBorder':
      return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color.bgBasic, borderColor: color.elementDanger }, style]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: color.textRed }} />
          )}
          {children}
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity style={[styles.button, colorStyle, style]} {...rest}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledInversionTextColor }} />
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
