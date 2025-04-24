import { Animated, FlexAlignType, FlexStyle, StyleSheet, ViewStyle } from 'react-native';
import { shadowStyle } from '@/helpers/shadowStyle.helper';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
// @ts-ignore
import isNumber from 'lodash/isNumber';
// @ts-ignore
import isString from 'lodash/isString';
import EStyleSheet from 'react-native-extended-stylesheet';

export interface StyleProps extends FlexProps {
  style?: StyleProp<ViewStyle>;
}

interface ColorProps {
    bg?: string;
    opacity?: number | string | Animated.AnimatedNode;
}

interface PositionProps {
    absolute?: boolean;
    relative?: boolean;
    absoluteFill?: boolean;
    zIndex?: number;
}

export type FlexWrapType = 'wrap' | 'nowrap' | 'wrap-reverse';

interface FlexDirectionProps {
    // flexDirection: 'row' (row-reverse)
    row?: boolean;
    // flexDirection: 'column' (column-reverse)
    col?: boolean;
    // flexDirection: row-reverse || column-reverse
    reverse?: boolean;
    wrap?: FlexWrapType | boolean;
}

export type NumericSpacesType = 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 36 | 38 | 40 | 44 | 46 | 48;

export type SpacesType = NumericSpacesType;

interface PaddingGridProps {
    // paddingLeft
    pl?: SpacesType;
    // paddingRight
    pr?: SpacesType;
    // paddingTop
    pt?: SpacesType;
    // paddingBottom
    pb?: SpacesType;
    // paddingVertical
    pv?: SpacesType;
    // paddingHorizontal
    ph?: SpacesType;
    // padding
    pa?: SpacesType;
}

interface MarginGridProps {
    // marginLeft
    ml?: SpacesType;
    // marginRight
    mr?: SpacesType;
    // marginTop
    mt?: SpacesType;
    // marginBottom
    mb?: SpacesType;
    // marginVertical
    mv?: SpacesType;
    // marginHorizontal
    mh?: SpacesType;
    // margin
    ma?: SpacesType;
}

interface PaddingProps {
    paddingLeft?: number | string;
    paddingRight?: number | string;
    paddingTop?: number | string;
    paddingBottom?: number | string;
    paddingVertical?: number | string;
    paddingHorizontal?: number | string;
    padding?: number | string;
    paddingStart?: number | string;
    paddingEnd?: number | string;
}

interface MarginProps {
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginVertical?: number | string;
  marginHorizontal?: number | string;
  margin?: number | string;
}

interface SideProps {
  // Более короткая запись <Col left/>, вместо <Col left={0}/>
  left?: number | string | boolean;
  // Более короткая запись <Col right/>, вместо <Col right={0}/>
  right?: number | string | boolean;
  // Более короткая запись <Col top/>, вместо <Col top={0}/>
  top?: number | string | boolean;
  // Более короткая запись <Col bottom/>, вместо <Col bottom={0}/>
  bottom?: number | string | boolean;
}

interface FlexLayoutProps {
  // Более короткая запись <Col flex/>, вместо <Col flex={1}/>
  flex?: number | string | boolean;
  // Более короткая запись <Col flexGrow/>, вместо <Col flexGrow={1}/>
  flexGrow?: number | string | boolean;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  // Более короткая запись <Col flexShrink/>, вместо <Col flexShrink={1}/>
  flexShrink?: number | string | boolean;
  flexBasis?: number | string;
}

interface SizeProps {
  // Более короткая запись <Row height/>, вместо <Row height={'100%'}/>
  height?: number | string | boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  // Более короткая запись <Col width/>, вместо <Col width={'100%'}/>
  width?: number | string | boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  sizeWH?: number | string;
}

export type AlignSelfType = 'auto' | FlexAlignType;

export type JustifyContentType = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

export type AlignContentType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';

interface ShadowProps {
  elevation?: number;
}

interface AlignProps {
  alignItems?: FlexAlignType;
  alignSelf?: AlignSelfType;
  justifyContent?: JustifyContentType;
  centerContent?: boolean;
  alignContent?: AlignContentType;
}

interface BorderProps {
  // borderRadius
  radius?: number | string;
  topRadius?: number | string;
  bottomRadius?: number | string;
  leftRadius?: number | string;
  rightRadius?: number | string;
  bottomLeftRadius?: number;
  topRightRadius?: number;
  topLeftRadius?: number;
  bottomRightRadius?: number;
  // circle - диаметр круга
  circle?: number;
  overflow?: 'visible' | 'hidden' | 'scroll' | boolean;
  borderColor?: string;
  borderWidth?: number;
  borderBottomWidth?: number;
  borderTopWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
}

interface TransformProps {
  animated?: boolean;
  /**
   * Value for: transform: [{rotate: string}]
   * Examples: '90deg', '0.785398rad'
   */
  rotate?: string | Animated.AnimatedNode;
  translateX?: number | Animated.AnimatedNode;
  translateY?: number | Animated.AnimatedNode;
  scale?: number | Animated.AnimatedNode;
  scaleX?: number | Animated.AnimatedNode;
}

export type DisplayType = 'none' | 'flex';

interface DisplayProps {
  display?: DisplayType;
}

export interface FlexProps extends PaddingGridProps, MarginGridProps, SideProps, SizeProps,
    PaddingProps, MarginProps,
    FlexLayoutProps, FlexDirectionProps, AlignProps, PositionProps, ShadowProps,
    BorderProps, TransformProps, ColorProps, DisplayProps {
}

interface FlexViewDecoratorOpts {
  ignore?: (keyof FlexProps)[];
}

type TransformsStyleProps = (
    | { rotate: string }
    | { translateX: number }
    | { translateY: number }
    | { scale: number }
    | { scaleX: number }
    )[];

const NotUndefined = (v: any) => v !== undefined;

function extractStyleProp<P extends object> (props: P, key: keyof P, predicate: (v: any) => boolean, setter: (v: any) => void) {
  const value = (props as any)[key];
  if (value !== undefined) {
    setter(value);
  }
  delete (props as any)[key];
}

const colorPropsStyle = (props: ColorProps, ss: ViewStyle) => {
  extractStyleProp(props, 'bg', NotUndefined, v => ss.backgroundColor = v);
  // extractStyleProp(props, 'opacity', NotUndefined, v => ss.opacity = v);
};

const flexDirectionPropsStyle = (props: FlexDirectionProps, ss: ViewStyle) => {
  const { row, reverse } = props;
  let res = row ? 'row' : 'column';
  if (reverse) {
    res += '-reverse';
  }

  if (res !== 'column') {
    ss.flexDirection = res as any;
  }

  if (props.wrap) {
    ss.flexWrap = props.wrap === true ? 'wrap' : props.wrap;
  }

  delete props.row;
  delete props.reverse;
};

const IsTruth = (v: any) => !!v;

const positionPropsStyle = (props: PositionProps, ss: ViewStyle) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractStyleProp(props, 'absolute', IsTruth, v => ss.position = 'absolute');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractStyleProp(props, 'relative', IsTruth, v => ss.position = 'relative');
  extractStyleProp(props, 'zIndex', IsTruth, v => ss.zIndex = v);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractStyleProp(props, 'absoluteFill', IsTruth, v => {
    ss.position = 'absolute';
    ss.left = 0;
    ss.right = 0;
    ss.top = 0;
    ss.bottom = 0;
  });
};

const paddingGridPropsStyle = (props: PaddingGridProps, ss: ViewStyle) => {
  extractStyleProp(props, 'pl', IsTruth, v => ss.paddingLeft = v);
  extractStyleProp(props, 'pr', IsTruth, v => ss.paddingRight = v);
  extractStyleProp(props, 'pt', IsTruth, v => ss.paddingTop = v);
  extractStyleProp(props, 'pb', IsTruth, v => ss.paddingBottom = v);
  extractStyleProp(props, 'pv', IsTruth, v => ss.paddingVertical = v);
  extractStyleProp(props, 'ph', IsTruth, v => ss.paddingHorizontal = v);
  extractStyleProp(props, 'pa', IsTruth, v => ss.padding = v);
};

const marginGridPropsStyle = (props: MarginGridProps, ss: ViewStyle) => {
  extractStyleProp(props, 'ml', IsTruth, v => ss.marginLeft = v);
  extractStyleProp(props, 'mr', IsTruth, v => ss.marginRight = v);
  extractStyleProp(props, 'mt', IsTruth, v => ss.marginTop = v);
  extractStyleProp(props, 'mb', IsTruth, v => ss.marginBottom = v);
  extractStyleProp(props, 'mv', IsTruth, v => ss.marginVertical = v);
  extractStyleProp(props, 'mh', IsTruth, v => ss.marginHorizontal = v);
  extractStyleProp(props, 'ma', IsTruth, v => ss.margin = v);
};

const paddingPropsStyle = (props: PaddingProps, ss: ViewStyle) => {
  extractStyleProp(props, 'paddingLeft', NotUndefined, v => ss.paddingLeft = v);
  extractStyleProp(props, 'paddingRight', NotUndefined, v => ss.paddingRight = v);
  extractStyleProp(props, 'paddingTop', NotUndefined, v => ss.paddingTop = v);
  extractStyleProp(props, 'paddingBottom', NotUndefined, v => ss.paddingBottom = v);
  extractStyleProp(props, 'paddingVertical', NotUndefined, v => ss.paddingVertical = v);
  extractStyleProp(props, 'paddingHorizontal', NotUndefined, v => ss.paddingHorizontal = v);
  extractStyleProp(props, 'padding', NotUndefined, v => ss.padding = v);
  extractStyleProp(props, 'paddingStart', NotUndefined, v => ss.paddingStart = v);
  extractStyleProp(props, 'paddingEnd', NotUndefined, v => ss.paddingEnd = v);
};

const marginPropsStyle = (props: MarginProps, ss: ViewStyle) => {
  extractStyleProp(props, 'marginLeft', NotUndefined, v => ss.marginLeft = v);
  extractStyleProp(props, 'marginRight', NotUndefined, v => ss.marginRight = v);
  extractStyleProp(props, 'marginTop', NotUndefined, v => ss.marginTop = v);
  extractStyleProp(props, 'marginBottom', NotUndefined, v => ss.marginBottom = v);
  extractStyleProp(props, 'marginVertical', NotUndefined, v => ss.marginVertical = v);
  extractStyleProp(props, 'marginHorizontal', NotUndefined, v => ss.marginHorizontal = v);
  extractStyleProp(props, 'margin', NotUndefined, v => ss.margin = v);
};

const sidePropsStyle = (props: SideProps, ss: ViewStyle) => {
  extractStyleProp(props, 'left', NotUndefined, v => ss.left = v === true ? 0 : v);
  extractStyleProp(props, 'right', NotUndefined, v => ss.right = v === true ? 0 : v);
  extractStyleProp(props, 'top', NotUndefined, v => ss.top = v === true ? 0 : v);
  extractStyleProp(props, 'bottom', NotUndefined, v => ss.bottom = v === true ? 0 : v);
};

const flexPropsStyle = (props: FlexLayoutProps, ss: ViewStyle) => {
  extractStyleProp(props, 'flex', NotUndefined, v => ss.flex = v === true ? 1 : v);
  extractStyleProp(props, 'flexGrow', NotUndefined, v => ss.flexGrow = v === true ? 1 : v);
  extractStyleProp(props, 'flexShrink', NotUndefined, v => ss.flexShrink = v === true ? 1 : v);
  extractStyleProp(props, 'flexBasis', NotUndefined, v => ss.flexBasis = v === true ? 1 : v);
};

const sizePropsStyle = (props: SizeProps, ss: ViewStyle) => {
  extractStyleProp(props, 'width', NotUndefined, v => ss.width = v === true ? '100%' : v);
  extractStyleProp(props, 'height', NotUndefined, v => ss.height = v === true ? '100%' : v);
  extractStyleProp(props, 'minHeight', NotUndefined, v => ss.minHeight = v);
  extractStyleProp(props, 'maxHeight', NotUndefined, v => ss.maxHeight = v);
  extractStyleProp(props, 'minWidth', NotUndefined, v => ss.minWidth = v);
  extractStyleProp(props, 'maxWidth', NotUndefined, v => ss.maxWidth = v);
  extractStyleProp(props, 'sizeWH', NotUndefined, v => {
    ss.width = v === true ? '100%' : v;
    ss.height = v === true ? '100%' : v;
  });
};

export const getStyleWithoutCache = (style: StyleProp<ViewStyle>, flexViewStyle: FlexStyle) => {
  const { opacity, ...styleSource } = {
    ...StyleSheet.flatten(style),
    ...flexViewStyle,
  };

  // анимированный opacity оказывается нельзя прогонять через StyleSheet.create
  const isAnimatedOpacity = !!opacity && !isNumber(opacity) && !isString(opacity);
  if (!isAnimatedOpacity) {
    (styleSource as any).opacity = opacity;
  }

  let result;

  EStyleSheet.build({});

  if (EStyleSheet.create) {
    result = EStyleSheet.create({
      style: styleSource,
    });
  } else {
    result = StyleSheet.create({
      style: styleSource,
    });
  }

  if (isAnimatedOpacity) {
    result.style = { ...result.style, opacity };
  }

  return result;
};

export const getStyle = getStyleWithoutCache;


export function flexViewPropsStyle<P> (inProps: FlexProps & P, opts?: FlexViewDecoratorOpts): { styleSource: FlexStyle; restProps: P } {
  const passProps = { ...inProps };
  // exclude
  let ignore: any;
  if (opts && opts.ignore) {
    ignore = {};
    opts.ignore.forEach(prop => {
      if (passProps[prop]) {
        ignore[prop] = passProps[prop];
      }
      delete passProps[prop];
    });
  }

  const {
    alignItems,
    alignSelf,
    justifyContent,
    centerContent,
    elevation,
    // border
    radius,
    topRadius,
    bottomRadius,
    leftRadius,
    rightRadius,
    bottomLeftRadius,
    topRightRadius,
    topLeftRadius,
    bottomRightRadius,
    circle,
    overflow,
    // transform
    rotate,
    translateX,
    translateY,
    scale,
    scaleX,
    // border
    borderColor,
    borderWidth,
    borderBottomWidth,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth,
    opacity,
    display,

    ...props
  } = passProps;

  const ss: ViewStyle = {};

  if (centerContent) {
    ss.alignItems = 'center';
    ss.justifyContent = 'center';
  }
  if (alignItems) {
    ss.alignItems = alignItems;
  }
  if (alignSelf) {
    ss.alignSelf = alignSelf;
  }
  if (justifyContent) {
    ss.justifyContent = justifyContent;
  }
  if (elevation !== undefined) {
    Object.assign(ss, shadowStyle(elevation));
  }

  // border
  if (circle && Number.isFinite(circle)) {
    ss.width = circle;
    ss.height = circle;
    ss.borderRadius = circle / 2;
  }
  if (radius) {
    ss.borderRadius = radius as any;
  }
  if (topRadius) {
    ss.borderTopLeftRadius = topRadius as any;
    ss.borderTopRightRadius = topRadius as any;
  }
  if (bottomRadius) {
    ss.borderBottomLeftRadius = bottomRadius as any;
    ss.borderBottomRightRadius = bottomRadius as any;
  }
  if (leftRadius) {
    ss.borderBottomLeftRadius = leftRadius as any;
    ss.borderTopLeftRadius = leftRadius as any;
  }
  if (rightRadius) {
    ss.borderBottomRightRadius = rightRadius as any;
    ss.borderTopRightRadius = rightRadius as any;
  }
  if (bottomLeftRadius) {
    ss.borderBottomLeftRadius = bottomLeftRadius as any;
  }
  if (topRightRadius) {
    ss.borderTopRightRadius = topRightRadius as any;
  }
  if (topLeftRadius) {
    ss.borderTopLeftRadius = topLeftRadius as any;
  }
  if (bottomRightRadius) {
    ss.borderBottomRightRadius = bottomRightRadius as any;
  }
  if (borderColor) { ss.borderColor = borderColor; }
  if (borderWidth) { ss.borderWidth = borderWidth; }
  if (borderBottomWidth) { ss.borderBottomWidth = borderBottomWidth; }
  if (borderTopWidth) { ss.borderTopWidth = borderTopWidth; }
  if (borderLeftWidth) { ss.borderLeftWidth = borderLeftWidth; }
  if (borderRightWidth) { ss.borderRightWidth = borderRightWidth; }
  if (opacity !== undefined) { ss.opacity = opacity as any; }
  if (display) { ss.display = display; }

  if (overflow !== undefined) {
    ss.overflow = overflow === false ? 'hidden' : (overflow === true ? 'visible' : overflow);
  }

  // transform
  const transform: TransformsStyleProps = [];
  if (rotate) {
    transform.push({ rotate: rotate as string });
  }
  if (translateX) {
    transform.push({ translateX: translateX as number });
  }
  if (translateY) {
    transform.push({ translateY: translateY as number });
  }
  if (scale) {
    transform.push({ scale: scale as number });
  }
  if (scaleX) {
    transform.push({ scaleX: scaleX as number });
  }
  if (transform.length) {
    ss.transform = transform;
  }

  colorPropsStyle(props, ss);
  flexDirectionPropsStyle(props, ss);
  positionPropsStyle(props, ss);
  paddingGridPropsStyle(props, ss);
  marginGridPropsStyle(props, ss);
  paddingPropsStyle(props, ss);
  marginPropsStyle(props, ss);
  sidePropsStyle(props, ss);
  flexPropsStyle(props, ss);
  sizePropsStyle(props, ss);

  if (ignore) {
    Object.assign(props, ignore);
  }

  const styleSource = { ...ss } as FlexStyle;

  return { styleSource, restProps: props as P };
}

// TODO: декоратор для добавления пропсов, нужно протестить

// function flexViewDecorator (opts?: FlexViewDecoratorOpts) {
//   return function decorator<T extends ComponentType<any>> (Component: T): T {
//     // @ts-ignore
//     @observer
//     class HOCComponent extends React.Component<any> {
//       private _ref = React.createRef<any>();
//
//       constructor (props: any, context: any) {
//         super(props, context);
//
//         return new Proxy(this, {
//           get: (target: any, p: string | number | symbol, receiver: any) => {
//             if (!target[p] && this._ref.current != null && !!this._ref.current?.[p]) {
//               return this._ref.current[p];
//             }
//
//             return target[p];
//           },
//         });
//       }
//
//       public render () {
//         const { style, ...props } = this.props;
//         const { styleSource, restProps } = flexViewPropsStyle(props, opts);
//         const SS = getStyle(style, styleSource);
//
//         return (
//         // @ts-ignore
//           <Component style={SS.style} {...restProps} ref={this._ref} />
//         );
//       }
//     }
//
//     hoistNonReactStatics(HOCComponent, Component);
//     (HOCComponent as any).displayName = ((Component as any).displayName || (Component as any).name) + '_flexView';
//
//     return HOCComponent as any as T;
//   };
// }
//
// export const flexView = flexViewDecorator;
