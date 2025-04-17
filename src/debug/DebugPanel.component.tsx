import { observer } from 'mobx-react';
import * as React from 'react';
import { FC } from 'react';
import { DebugVars } from './debug.vars';
import { ViewProps } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TextUI } from '../components/ui/TextUI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonUI } from '../components/ui/ButtonUI';
import { Theme } from '../store';
import { Row } from '../components/shared/Row';

type Props = ViewProps

const _DebugPanel: FC<Props> = (props: Props) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <Row style={{ position: 'absolute', right: 16, top: insets.top, zIndex: 2000, backgroundColor: Theme.color.bgAdditional, borderRadius: 3 }} {...props}>
      { DebugVars?.enableToggleThemeButton && (
        <ButtonUI title={Theme.name} type={ 'debug' } onPress={Theme.changeTheme} />
      )}
      { DebugVars?.showScreenNames && (
        <TextUI size={'small'} style={{ color: Theme.color.textRed }} text={'Screen' + route.name} />
      )}
    </Row>
  );
};

export const DebugPanel = observer(_DebugPanel);
