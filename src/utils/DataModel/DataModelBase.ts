// @ts-ignore
import isFunction from 'lodash/isFunction';
import { computed } from 'mobx';
import * as LambdaValue from '@/utils/LambdaValue';

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export interface IDataModel<TData> extends Object {
  readonly data: TData;
}

const typeKey = Symbol.for('data-model');

function dataModelDecoratorFactory () {
  return function classDecorator<T extends new (...args: any[]) => any>(constructor: T) {
    // 1. Применить @MakeObservable()
    // const result = MakeObservable()(constructor);
    const result = constructor;
    // 2. Добавить ключ с типом
    result.prototype[typeKey] = constructor.name;

    return result;
  };
}

export const DataModel = dataModelDecoratorFactory;

/**
 * Типовой класс модели
 */
@DataModel()
export class DataModelBase<TData> implements IDataModel<TData> {
  private readonly _data: LambdaValue.LambdaValue<TData>;

  constructor (value: LambdaValue.LambdaValue<TData>) {
    this._data = value;
  }

  @computed
  public get data () {
    return LambdaValue.resolveLambdaValue(this._data);
  }

  @computed
  public get hasLambda () {
    return isFunction(this._data);
  }
}
