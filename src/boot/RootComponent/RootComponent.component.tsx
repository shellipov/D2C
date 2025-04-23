import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRouter } from '@/AppRouter';
import { useAppState } from '@/hooks/useAppState';
import { reactotronInit } from '@/debug/reactotron';
import { DebugVars } from '@/debug';
import { useAppTheme } from '@/hooks/useAppTheme';
import { observer } from 'mobx-react';

export const RootComponent = observer((): React.JSX.Element => {
  const { isActive } = useAppState();
  const theme = useAppTheme();

  useEffect(() => {
    if (isActive) {
      theme.refresh().then();
    }
  }, [isActive]);

  useEffect(() => {
    if (DebugVars?.enableReactotron) {
      reactotronInit();
    }
  }, []);


  return (
    <SafeAreaProvider style={{ backgroundColor: theme.color.bgBasic }}>
      <AppRouter />
    </SafeAreaProvider>
  );
});
