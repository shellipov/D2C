import React from 'react';
import { SafeAreaView, ViewProps } from 'react-native';
import { DebugPanel } from '../../../debug/DebugPanel.component';

export const Screen = (props: ViewProps) => {
  const { children, ...rest } = props;

  return (
    <SafeAreaView {...rest}>
      <DebugPanel />
      {children}
    </SafeAreaView>
  );
};

