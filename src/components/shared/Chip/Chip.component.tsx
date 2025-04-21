import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ITextUIProps, TextUI } from '../../ui/TextUI';
import React from 'react';
import { Theme } from '@/store';
import { useCompoundProps } from '@/utils/CompoundUtils';
import { observer } from 'mobx-react';

interface IChipProps extends TouchableOpacityProps {
    isSelected: boolean,
    onPress: () => void,
}

export const _Chip = (props: IChipProps) => {
  const { style, isSelected = false, onPress, ...rest } = props;
  const selectedStyle = isSelected ? { borderColor: Theme.color.basicInversion, borderWidth: 1 } : {};

  const innerProps = useCompoundProps(props, _Chip, 'Text');

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: Theme.color.transparent }, selectedStyle, style]}
      onPress={onPress} {...rest}>
      <TextUI size={'medium'} style={[{ color: Theme.color.textGray }, isSelected && { color: Theme.color.textPrimary }]} {...innerProps.text} />
    </TouchableOpacity>
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
