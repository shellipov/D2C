import { action, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IEvent, ISimplifiedEvent, OrderStorageTypeEnum } from './EventData.types';
import { errorService } from '../ErrorDataStore/errorService';
import { ErrorTypeEnum } from '../ErrorDataStore';
import {suddenError} from "../../helpers";

export interface IEventDataStore {
    readonly events: IEvent[];
    addEvent (order: IEvent): Promise<void>
    refresh(): Promise<void>;
}

class EventDataStore implements IEventDataStore {
  private static _instance: EventDataStore | null = null;
    @observable public events: IEvent[] = [];

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
    public async addEvent (order: ISimplifiedEvent): Promise<void> {
      try {
        const jsonEvents = await AsyncStorage.getItem(OrderStorageTypeEnum.Events);
        const orders = jsonEvents ? JSON.parse(jsonEvents) : [];
        if (orders) {
          const newEvents = [{ ...order, id: orders.length + 1 }, ...orders];
          await AsyncStorage.setItem(OrderStorageTypeEnum.Events, JSON.stringify(newEvents));
        } else {
          await errorService({ type:ErrorTypeEnum.LoadData });
        }

        await this.refresh();
      } catch (error: any) {
        await errorService({ type:ErrorTypeEnum.LoadData, error });
      }
    }

    @action.bound
    public async refresh (): Promise<void> {
      try {
        const jsonEvents = await AsyncStorage.getItem(OrderStorageTypeEnum.Events);
        if (!!jsonEvents) {
          runInAction(() => {
            this.events = JSON.parse(jsonEvents);
          });
        }
      } catch (error: any) {
        await errorService({ type:ErrorTypeEnum.LoadData, error });
      }
    }
}

export const EventStore = EventDataStore.instance;
