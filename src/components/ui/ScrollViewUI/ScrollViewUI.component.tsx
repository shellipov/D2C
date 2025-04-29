import { observer } from 'mobx-react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { FlexProps, flexViewPropsStyle, getStyle } from '@/utils/PropsStyles';
import React from 'react';

export interface IScrollViewUIProps extends ScrollViewProps, FlexProps {
}

export const ScrollViewUI = observer((props: IScrollViewUIProps)=> {
  const { children, style, ...rest } = props;
  const { styleSource, restProps } = flexViewPropsStyle(rest);
  const SS = getStyle(style, styleSource);

  return (
    <ScrollView style={SS.style} {...restProps}>
      {children}
    </ScrollView>
  );
});
