import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

export const Col = (props: ViewProps) => {
  const { children, style, ...rest } = props;

  return (
    <View style={[styles.col, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
  },
});

