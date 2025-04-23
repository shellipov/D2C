import { action, computed, makeObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EventDataTypes from './EventData.types';
import { ErrorTypeEnum, IGetFakeEventResponse } from '@/api';
import { errorService } from '../ErrorDataStore/errorService';
import { injectable } from 'inversify';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';

export interface IEventDataStore {
  readonly events: EventDataTypes.IEvent[];
  readonly isError: boolean;
  addEvent(order: EventDataTypes.ISimplifiedEvent): Promise<void>
  refresh(): Promise<void>;
}

@injectable()
export class EventDataStore implements IEventDataStore {
  private _holder = new AsyncDataHolder<IGetFakeEventResponse>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get events () {
    return this._holder.data?.data || [];
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @action.bound
  public async addEvent (order: EventDataTypes.ISimplifiedEvent): Promise<void> {
    try {
      const jsonEvents = await AsyncStorage.getItem(EventDataTypes.EventStorageTypeEnum.Events);
      const orders = jsonEvents ? JSON.parse(jsonEvents) : [];
      if (orders) {
        const newEvents = [{ ...order, id: orders.length + 1 }, ...orders];
        await AsyncStorage.setItem(EventDataTypes.EventStorageTypeEnum.Events, JSON.stringify(newEvents));
      } else {
        await errorService({ type: ErrorTypeEnum.LoadData });
      }

      await this.refresh();
    } catch (error: any) {
      await errorService({ type: ErrorTypeEnum.LoadData, error });
    }
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      this._holder.setLoading();
      const jsonEvents = await AsyncStorage.getItem(EventDataTypes.EventStorageTypeEnum.Events);
      if (!!jsonEvents) {
        this._holder.setData({
          data: JSON.parse(jsonEvents),
          status: ApiStatusEnum.Success,
        });
      }
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}
