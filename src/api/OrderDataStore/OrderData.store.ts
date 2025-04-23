import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as OrderDataTypes from './OrderData.types';
import { errorService } from '../ErrorDataStore/errorService';
import { ErrorTypeEnum } from '@/api';
import { suddenError } from '@/helpers';

export interface IOrderDataStore {
  readonly orders: OrderDataTypes.IOrder[];
  readonly isError: boolean;
  readonly paymentMethods: { type: OrderDataTypes.PaymentMethodsEnum, title: string }[];
  readonly deliveryOptions: { type: OrderDataTypes.DeliveryOptionsEnum, title: string }[];

  addOrder(order: OrderDataTypes.IOrder): Promise<OrderDataTypes.OrderCreateStatusEnum>

  refresh(): Promise<void>;
}

class OrderDataStore implements IOrderDataStore {
  private static _instance: OrderDataStore | null = null;
  @observable public orders: OrderDataTypes.IOrder[] = [];
  @observable public isError = false;

  private constructor () {
    makeObservable(this);
  }

  public static get instance (): OrderDataStore {
    if (!OrderDataStore._instance) {
      OrderDataStore._instance = new OrderDataStore();
    }

    return OrderDataStore._instance;
  };

  @computed
  public get lastOrder () {
    return this.orders[0];
  };

  @computed
  public get paymentMethods () {
    return [
      {
        type: OrderDataTypes.PaymentMethodsEnum.Card,
        title: 'Картой',
      },
      {
        type: OrderDataTypes.PaymentMethodsEnum.Cash,
        title: 'Наличными',
      },
    ];
  };


  @computed
  public get deliveryOptions () {
    return [
      {
        type: OrderDataTypes.DeliveryOptionsEnum.Hand,
        title: 'Отдать в руки',
      },
      {
        type: OrderDataTypes.DeliveryOptionsEnum.Door,
        title: 'Оставить у двери',
      },
    ];
  };

  @action.bound
  public async addOrder (order: OrderDataTypes.IOrder): Promise<OrderDataTypes.OrderCreateStatusEnum> {
    try {
      await suddenError('OrderDataStore: addOrder');
      const jsonOrders = await AsyncStorage.getItem(OrderDataTypes.OrderStorageTypeEnum.Orders);
      const orders = jsonOrders ? JSON.parse(jsonOrders) : [];
      if (orders) {
        const newOrders = [order, ...orders];
        await AsyncStorage.setItem(OrderDataTypes.OrderStorageTypeEnum.Orders, JSON.stringify(newOrders));
      } else {
        await errorService({ type: ErrorTypeEnum.CreateOrder });

        return OrderDataTypes.OrderCreateStatusEnum.Error;
      }

      await this.refresh();

      return OrderDataTypes.OrderCreateStatusEnum.Success;
    } catch (error: any) {
      await errorService({ type: ErrorTypeEnum.CreateOrder, error });

      return OrderDataTypes.OrderCreateStatusEnum.Error;
    }
  }

  @action.bound
  public async clear (): Promise<void> {
    await AsyncStorage.removeItem(OrderDataTypes.OrderStorageTypeEnum.Orders);
    this.refresh().then();
  }

  @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('OrderDataStore: refresh');
      const jsonOrders = await AsyncStorage.getItem(OrderDataTypes.OrderStorageTypeEnum.Orders);
      if (!!jsonOrders) {
        runInAction(() => {
          OrderStore.orders = JSON.parse(jsonOrders);
          OrderStore.isError = false;
        });
      }
    } catch (error: any) {
      runInAction(() => {
        this.isError = true;
      });
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}

export const OrderStore = OrderDataStore.instance;
