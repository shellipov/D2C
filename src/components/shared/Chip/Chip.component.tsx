import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { TextUI } from '../../ui/TextUI';
import React from 'react';
import { ColorsVars } from '../../../settings';

interface IChipProps extends TouchableOpacityProps {
    label: string,
    selected: boolean,
    onPress: () => void,
}

export const Chip = (props: IChipProps) => {
  const { label, selected = false, onPress, ...rest } = props;

  return (
    <TouchableOpacity style={[styles.chip, selected && styles.selectedChip]} onPress={onPress} {...rest}>
      <TextUI size={'medium'} text={label} style={[styles.chipText, selected && styles.selectedChipText]} />
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
  },
  selectedChip: {
    borderColor: ColorsVars.black,
    borderWidth: 1,
  },
  chipText: {
    color: ColorsVars.gray,
  },
  selectedChipText: {
    color: 'black',
  },
});
