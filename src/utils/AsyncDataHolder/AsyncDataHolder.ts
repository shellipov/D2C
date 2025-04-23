import { IAsyncDataHolder } from './AsyncDataHolder.types';
import { AsyncDataHolderBase } from './AsyncDataHolderBase';

// Открытый для изменения снаружи, используется автономно, не как базовый класс.
export class AsyncDataHolder<T = unknown> extends AsyncDataHolderBase<T> implements IAsyncDataHolder<T> {
  public setEmpty () {
    return super.setEmpty();
  }

  public setLoading (isLoading: boolean = true) {
    return super.setLoading(isLoading);
  }

  public setData (data?: T) {
    return super.setData(data);
  }

  public setError (error?: Error) {
    return super.setError(error);
  }
}
