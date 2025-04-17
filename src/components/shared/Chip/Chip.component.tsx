import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { TextUI } from '../../ui/TextUI';
import React from 'react';
import { Theme } from '../../../store';

interface IChipProps extends TouchableOpacityProps {
    label: string,
    isSelected: boolean,
    onPress: () => void,
}

export const Chip = (props: IChipProps) => {
  const { label, style, isSelected = false, onPress, ...rest } = props;

  return (
    <TouchableOpacity style={[styles.chip, isSelected && { borderColor: Theme.color.basicInversion, borderWidth: 1 }, style]} onPress={onPress} {...rest}>
      <TextUI size={'medium'} text={label} style={[{ color: Theme.color.textGray }, isSelected && { color: Theme.color.textPrimary }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 45,
  },
});
