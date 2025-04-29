import { StyleSheet } from 'react-native';
import { ITextUIProps, TextUI } from '../../ui/TextUI';
import React from 'react';
import { useCompoundProps } from '@/utils/CompoundUtils';
import { observer } from 'mobx-react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ITouchableOpacityUIProps, TouchableOpacityUI } from '@components/ui/TouchableOpacityUI';

interface IChipProps extends ITouchableOpacityUIProps {
    isSelected: boolean,
}

export const _Chip = (props: IChipProps) => {
  const { style, isSelected = false, ...rest } = props;
  const theme = useAppTheme();
  const selectedStyle = isSelected ? { borderColor: theme.color.basicInversion, borderWidth: 1 } : {};

  const innerProps = useCompoundProps(props, _Chip, 'Text');

  return (
    <TouchableOpacityUI
      style={[styles.chip, { backgroundColor: theme.color.transparent }, selectedStyle, style]} {...rest}>
      <TextUI size={'medium'} style={[{ color: theme.color.textGray }, isSelected && { color: theme.color.textPrimary }]} {...innerProps.text} />
    </TouchableOpacityUI>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 45,
  },
});

_Chip.Text = (props: ITextUIProps) => null;

export const Chip = observer(_Chip);
