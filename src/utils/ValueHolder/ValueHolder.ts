// @ts-ignore
import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable, when } from 'mobx';
import { IValueHolder } from '@/utils/ValueHolder/ValueHolder.types';
import * as LambdaValue from '@/utils/LambdaValue';


/**
 * Помогает хранить и задавать observable значение.
 * Значение может быть задано через observable функцию.
 */
export class ValueHolder<T> implements IValueHolder<T> {
  // @ts-ignore
  @observable.ref private _value: LambdaValue.LambdaValue<T> = undefined;

  constructor (value: LambdaValue.LambdaValue<T>) {
    makeObservable?.(this);
    this._value = value;
  }

  @action.bound
  public setValue (value: LambdaValue.LambdaValue<T>) {
    this._value = value;
  }

  @computed
  public get value () {
    return LambdaValue.resolveLambdaValue(this._value);
  }

  @computed
  public get isLambda () {
    return isFunction(this._value);
  }

  public whenChanged () {
    const value = this.value;

    return when(() => this.value !== value);
  }
}
