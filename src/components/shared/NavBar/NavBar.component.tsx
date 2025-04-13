import React, { useCallback } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { Row } from '../Row';
import { ButtonUI } from '../../ui/ButtonUI';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '../../../hooks/useNavigation';

export interface INavBarProps extends ViewProps {
  title: string;
}

export const NavBar = (props: INavBarProps) => {
  const navigation = useNavigationHook();
  const { title, ...rest } = props;

  const onPress = useCallback(()=> {
    navigation.goBack();
  }, []);

  return (
    <Row style={styles.navBar}>
      <ButtonUI title={'Назад'} style={styles.button} onPress={onPress} {...rest} />
      <TextUI size={'title'} text={title} />
    </Row>
  );
};

const styles = StyleSheet.create({
  navBar: { paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center' },
  button: { height: 40, borderRadius: 20, alignSelf: 'flex-start' },
});
