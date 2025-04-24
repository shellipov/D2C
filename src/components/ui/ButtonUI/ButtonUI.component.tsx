import React from 'react';
import { ColorValue, StyleSheet, TouchableOpacityProps } from 'react-native';
import { TextUI } from '../TextUI';
import { observer } from 'mobx-react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FlexProps, flexViewPropsStyle, getStyle } from '@/utils/PropsStyles';
import { TouchableOpacityUI } from '@components/ui/TouchableOpacityUI';

export type ButtonType = 'debug' | 'white' | 'red' | 'redBorder'

export interface IButtonUIProps extends TouchableOpacityProps, FlexProps {
    title: string;
    type?: ButtonType
    textColor?: ColorValue
    children?: React.ReactNode;
}

export const ButtonUI = observer((props: IButtonUIProps) => {
  const { children, title, textColor, style, ...rest } = props;
  const { styleSource, restProps } = flexViewPropsStyle(rest);
  const SS = getStyle(style, styleSource);
  const theme = useAppTheme();
  const { color } = theme;

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

  switch (props.type) {
    case 'debug':
      return (
        <TouchableOpacityUI
          borderWidth={1} radius={4} alignItems={'center'} mr={16} borderColor={color.bgGray}
          style={[colorStyle, SS.style]} {...restProps}>
          {!!title && (
            <TextUI text={title} size={'small'} style={{ backgroundColor: color.bgGray }} />
          )}
          {children}
        </TouchableOpacityUI>
      );
    case 'white':
      return (
        <TouchableOpacityUI style={[styles.button, whiteButtonColor, SS.style]} {...restProps}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledTextColor }} />
          )}
          {children}
        </TouchableOpacityUI>
      );
    case 'red':
      return (
        <TouchableOpacityUI style={[styles.button, redButtonColor, SS.style]} {...restProps}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledInversionTextColor }} />
          )}
          {children}
        </TouchableOpacityUI>
      );
    case 'redBorder':
      return (
        <TouchableOpacityUI style={[styles.button, { backgroundColor: color.bgBasic, borderColor: color.elementDanger }, SS.style]} {...restProps}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: color.textRed }} />
          )}
          {children}
        </TouchableOpacityUI>
      );
    default:
      return (
        <TouchableOpacityUI style={[styles.button, colorStyle, SS.style]} {...restProps}>
          {!!title && (
            <TextUI text={title} size={'large'} style={{ color: disabledInversionTextColor }} />
          )}
          {children}
        </TouchableOpacityUI>
      );
  }
});

const styles = StyleSheet.create({
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
