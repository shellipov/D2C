import { observer } from 'mobx-react';
import * as React from 'react';
import { FC } from 'react';
import { Col } from '../components/shared/Col';
import { DebugVars } from './debug.vars';
import { ViewProps } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TextUI } from '../components/ui/TextUI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps

const _DebugPanel: FC<Props> = (props: Props) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <Col style={{ position: 'absolute', left: 8, top: insets.top, zIndex: 2000, backgroundColor: '#ffffff', borderRadius: 3 }} {...props}>
      { DebugVars?.showScreenNames && (
        <TextUI size={'small'} style={{ color: 'red' }} text={'Screen' + route.name} />
      )}
    </Col>
  );
};

export const DebugPanel = observer(_DebugPanel);
