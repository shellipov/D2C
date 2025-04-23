// @ts-ignore
import isEmpty from 'lodash/isEmpty';
import { action, computed, makeObservable, observable } from 'mobx';
import { IAsyncStatusHolder } from './AsyncDataHolder.types';

export interface IDisposable {
  dispose(): void;
}

// Закрытый для изменения снаружи, используется как базовый класс. Как автономный холдер используем AsyncDataHolder.
export abstract class AsyncDataHolderBase<T = unknown> implements IAsyncStatusHolder<T>, IDisposable {
  @observable.ref public _data?: T = undefined;
  @observable.ref public error?: Error = undefined;
  @observable.ref public isLoading: boolean = true;
  private _isFirstLoaded: boolean = false;

  constructor () {
    makeObservable?.(this);
  }

  public dispose (): void {
    this.setEmpty();
  }

  @action
  protected setEmpty () {
    this.isLoading = false;
    this._isFirstLoaded = true;
    this._data = undefined;
    this.error = undefined;

    return this;
  }

  @action
  protected setLoading (isLoading: boolean = true) {
    this.isLoading = isLoading;

    return this;
  }

  @action
  protected setData (data?: T) {
    this.isLoading = false;
    this._isFirstLoaded = true;
    this.error = undefined;
    this._data = data;

    return this;
  }

  @action
  protected setError (error?: Error) {
    this.isLoading = false;
    this._isFirstLoaded = true;
    this.error = error;

    return this;
  }

  @computed.struct
  public get data () {
    return this._data;
  }

  @computed
  public get isReady () {
    return this.isError || this.isFilled;
  }

  @computed
  public get isFilled () {
    return !isEmpty(this.data);
  }

  @computed
  public get isError () {
    return !!this.error;
  }

  // Состояние первой загрузки до вызова setData, setEmpty или setError
  @computed
  public get isFirstLoading () {
    return this.isLoading && !this._isFirstLoaded;
  }
}
