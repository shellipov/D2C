// @ts-ignore
import compact from 'lodash/compact';
import React, { useMemo } from 'react';
import { ViewProps } from 'react-native';

/**
 * Отрендерит первый не Falsy элемент из children. Удобно использовать для организации условной вёрстки.
 * @example
 * <First>
 *   {isError && <Error />}
 *   {isLoading && <Loader />}
 *   <Content />
 * </First>
 * @param props
 * @constructor
 */
export const First: React.FC<ViewProps> = (props) => {
  return useMemo(() => {
    const children = compact(React.Children.toArray(props.children));

    return <>{children[0] || null}</>;
  }, [props.children]);
};
