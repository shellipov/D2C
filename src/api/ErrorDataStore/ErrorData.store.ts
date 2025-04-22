import { action, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorStorageTypeEnum, ErrorTypeEnum, IError } from '@/api';
import { errorService } from './errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';

export interface IErrorDataStore {
    readonly data: IError[];
    readonly isError: boolean;
    refresh(): Promise<void>;
    dispose(): void;
}

@injectable()
export class ErrorDataStore implements IErrorDataStore {
    @observable public data: IError[] = [];
    @observable public isError = false;
    private _disposers: (() => void)[] = [];

    public constructor () {
      makeObservable(this);
    }

  @action.bound
    public async clear (): Promise<void> {
      await AsyncStorage.removeItem(errorStorageTypeEnum.Errors);
      await this.refresh();
    }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('ErrorDataStore: refresh');
      const jsonErrors = await AsyncStorage.getItem(errorStorageTypeEnum.Errors);
      if (!!jsonErrors) {
        runInAction(() => {
          this.data = JSON.parse(jsonErrors);
          this.isError = false;
        });
      }
    } catch (error: any) {
      runInAction(() => {
        this.isError = true;
      });
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }

  public dispose (): void {
    this._disposers.forEach(dispose => dispose());
    this._disposers = [];
  }
}
