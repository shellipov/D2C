import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export const Row = (props: ViewProps) => {
  const { children, style, ...rest } = props;

  return (
    <View style={[styles.row, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

