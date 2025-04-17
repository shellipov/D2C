import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { DebugPanel } from '../../../debug';
import { ColorsVars } from '../../../settings';
import { TextUI } from '../../ui/TextUI';
import { ButtonUI } from '../../ui/ButtonUI';
import { NavBar } from '../NavBar';
import { useRoute } from '@react-navigation/native';
import { Routes } from '../../../AppPouter.types';
import { observer } from 'mobx-react';
import { Theme } from '../../../store';

interface IScreenProps extends ViewProps {
    isError?: boolean;
    onRefresh?: () => void;
}

export const Screen = observer((props: IScreenProps) => {
  const { children, isError, style, ...rest } = props;
  const route = useRoute();
  const isMain = route.name === Routes.Main;

  const bgColor = { backgroundColor: Theme.color.bgBasic };

  if (isError) {
    return (
      <SafeAreaView style={[styles.screen, bgColor, style]} {...rest}>
        <DebugPanel />
        {!isMain && (
          <NavBar title={'Ошибка'} />
        )}
        <View style={styles.errorView}>
          <TextUI size={'bigTitle'} style={styles.errorText} text={'Ошибка обновления\nданных'} />
          {!!props.onRefresh && (
            <ButtonUI title={'Обновить'} style={styles.button} textColor={ColorsVars.red} onPress={props.onRefresh} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, bgColor, style]} {...rest}>
      <DebugPanel />
      {children}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorText: {
    color: ColorsVars.red,
    textAlign: 'center',
  },
  button: {
    backgroundColor: ColorsVars.white,
    borderColor: ColorsVars.red,
    marginTop: 60,
  },
});

