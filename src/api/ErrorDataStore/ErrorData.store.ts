import { action, computed, makeObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorStorageTypeEnum, ErrorTypeEnum, IGetFakeErrorResponse } from '@/api';
import { errorService } from './errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';
import { AsyncDataHolder, IAsyncDataHolder } from '@/utils/AsyncDataHolder';
import { Maybe } from '@/utils/types/typescript.types';
import { ErrorDataModel } from '@/api/ErrorDataStore/ErrorData.model';
import { ApiStatusEnum } from '@/api/ApiTypes.types';

type TData = Maybe<IGetFakeErrorResponse>;

export interface IErrorDataStore {
    readonly holder: IAsyncDataHolder<IGetFakeErrorResponse>;
    readonly data: TData ;
    readonly model: ErrorDataModel
    readonly isError: boolean;
    refresh(): Promise<void>;
    dispose(): void;
}

@injectable()
export class ErrorDataStore implements IErrorDataStore {
  public holder = new AsyncDataHolder<IGetFakeErrorResponse>();
  public model = new ErrorDataModel(() => this.holder?.data?.data);
  private _disposers: (() => void)[] = [];

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get data () {
    return this.holder.data;
  }

  @computed
  public get isError () {
    return this.holder.isError;
  }

  @action.bound
  public async clear (): Promise<void> {
    await AsyncStorage.removeItem(errorStorageTypeEnum.Errors);
    await this.refresh();
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      this.holder.setLoading();
      await suddenError('ErrorDataStore: refresh');
      const jsonErrors = await AsyncStorage.getItem(errorStorageTypeEnum.Errors);
      if (!!jsonErrors) {
        this.holder.setData({
          data: JSON.parse(jsonErrors),
          status: ApiStatusEnum.Success,
        });
      }
    } catch (error: any) {
      this.holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }

  public dispose (): void {
    this._disposers.forEach(dispose => dispose());
    this._disposers = [];
  }
}
