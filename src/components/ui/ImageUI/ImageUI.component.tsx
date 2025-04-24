import { Image, ImageProps } from 'react-native'; // Add Image to imports
import { FlexProps, flexViewPropsStyle, getStyle } from '@/utils/PropsStyles';
import React from 'react';
import { observer } from 'mobx-react';

// @ts-ignore
export interface IImageUIProps extends FlexProps, ImageProps {}

export const ImageUI = observer((props: IImageUIProps) => {
  const { style, ...rest } = props;
  const { styleSource, restProps } = flexViewPropsStyle(rest);
  const SS = getStyle(style, styleSource);

  // @ts-ignore
  return (<Image style={SS.style} {...restProps} />);
});
