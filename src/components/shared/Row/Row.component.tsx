import React from 'react';
import { Animated, StyleSheet, View, ViewProps } from 'react-native';
import { flexViewPropsStyle, getStyle, getStyleWithoutCache, StyleProps } from '@/utils/PropsStyles';

export interface FlexViewProps extends StyleProps, ViewProps {}

export const Row = (props: FlexViewProps) => {
  const { style, animated, children, ...rest } = props;

  const { styleSource, restProps } = flexViewPropsStyle(rest);
  const SS = (!!animated ? getStyleWithoutCache : getStyle)(style, styleSource);

  if (!!animated) {
    return (
      <Animated.View style={[styles.row, SS.style]} {...restProps}>
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={[styles.row, SS.style]} {...restProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

