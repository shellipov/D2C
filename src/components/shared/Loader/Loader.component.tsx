import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Col, FlexViewProps } from '@shared/Col';
import { useAppTheme } from '@/hooks/useAppTheme';

export const Loader = (props: FlexViewProps) => {
  const { children, ...rest } = props;
  const { color } = useAppTheme();

  return (
    <Col flex alignItems={'center'} justifyContent={'center'} pb={64} {...rest}>
      <ActivityIndicator size="large" color={color.elementPrimary} />
      {children}
    </Col>
  );
};

