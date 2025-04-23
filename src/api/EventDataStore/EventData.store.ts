import { action, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EventDataTypes from './EventData.types';
import { errorService } from '../ErrorDataStore/errorService';
import { ErrorTypeEnum } from '@/api';

export interface IEventDataStore {
  readonly events: EventDataTypes.IEvent[];
  readonly isError: boolean;

  addEvent(order: EventDataTypes.IEvent): Promise<void>

  refresh(): Promise<void>;
}

class EventDataStore implements IEventDataStore {
  private static _instance: EventDataStore | null = null;
  @observable public events: EventDataTypes.IEvent[] = [];
  @observable public isError = false;

  private constructor () {
    makeObservable(this);
  }

  public static get instance (): EventDataStore {
    if (!EventDataStore._instance) {
      EventDataStore._instance = new EventDataStore();
    }

    return EventDataStore._instance;
  };

  @action.bound
  public async addEvent (order: EventDataTypes.ISimplifiedEvent): Promise<void> {
    try {
      const jsonEvents = await AsyncStorage.getItem(EventDataTypes.OrderStorageTypeEnum.Events);
      const orders = jsonEvents ? JSON.parse(jsonEvents) : [];
      if (orders) {
        const newEvents = [{ ...order, id: orders.length + 1 }, ...orders];
        await AsyncStorage.setItem(EventDataTypes.OrderStorageTypeEnum.Events, JSON.stringify(newEvents));
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
      const jsonEvents = await AsyncStorage.getItem(EventDataTypes.OrderStorageTypeEnum.Events);
      if (!!jsonEvents) {
        runInAction(() => {
          EventStore.events = JSON.parse(jsonEvents);
          EventStore.isError = false;
        });
      }
    } catch (error: any) {
      runInAction(() => {
        EventStore.isError = true;
      });
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

export const EventStore = EventDataStore.instance;
