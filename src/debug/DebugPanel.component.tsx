import { observer } from 'mobx-react';
import * as React from 'react';
import { FC } from 'react';
import { DebugVars } from './debug.vars';
import { ViewProps } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TextUI } from '@components/ui/TextUI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonUI } from '@components/ui/ButtonUI';
import { Row } from '@shared/Row';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = ViewProps

const _DebugPanel: FC<Props> = (props: Props) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = {
    position: 'absolute',
    right: 16,
    top: insets.top,
    zIndex: 2000,
    backgroundColor: theme.color.bgAdditional,
    borderRadius: 3,
  } as StyleProp<ViewStyle>;

  return (
    <Row style={styles} {...props}>
      { DebugVars?.enableToggleThemeButton && (
        <ButtonUI title={theme.name} type={ 'debug' } onPress={theme.changeTheme} />
      )}
      { DebugVars?.showScreenNames && (
        <TextUI size={'small'} style={{ color: theme.color.textRed }} text={'Screen' + route.name} />
      )}
    </Row>
  );
};

export const DebugPanel = observer(_DebugPanel);
