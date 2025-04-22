// @ts-ignore
import isFunction from 'lodash/isFunction';
import { LambdaValue } from './LambdaValue.types';

// Если value функция, вызвать для получения значения, иначе вернуть value.
export function resolveLambdaValue<TValue, TArgs = unknown> (value: LambdaValue<TValue>, args?: TArgs): TValue {
  // @ts-ignore
  return isFunction(value) ? value(args) : value;
}
