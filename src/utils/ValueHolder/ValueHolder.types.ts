import { LambdaValue } from '@/utils/LambdaValue';

export interface IValueHolder<T> {
  readonly value: T;
  setValue(value: LambdaValue<T>): void;
}
