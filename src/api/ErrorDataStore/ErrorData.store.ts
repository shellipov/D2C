import { action, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorStorageTypeEnum, ErrorTypeEnum, IError } from './ErrorData.types';
import { errorService } from './errorService';
import { suddenError } from '../../helpers';

export interface IErrorDataStore {
    readonly errors: IError[];
    refresh(): Promise<void>;
}

class ErrorDataStore implements IErrorDataStore {
  private static _instance: ErrorDataStore | null = null;
    @observable public errors: IError[] = [];

    public constructor () {
      makeObservable(this);
    }

    public static get instance (): ErrorDataStore {
      if (!ErrorDataStore._instance) {
        ErrorDataStore._instance = new ErrorDataStore();
      }

      return ErrorDataStore._instance;
    };

  @action.bound
    public async clear (): Promise<void> {
      await AsyncStorage.removeItem(errorStorageTypeEnum.Errors);
      this.refresh().then();
    }

    @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('ErrorDataStore: refresh');
      const jsonErrors = await AsyncStorage.getItem(errorStorageTypeEnum.Errors);
      if (!!jsonErrors) {
        runInAction(() => {
          this.errors = JSON.parse(jsonErrors);
        });
      }
    } catch (error: any) {
      await errorService({ type:ErrorTypeEnum.LoadData, error });
    }
  }
}

export const ErrorStore = ErrorDataStore.instance;

