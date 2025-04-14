import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeliveryOptionsEnum, IOrder, OrderCreateStatusEnum, orderStorageTypeEnum, PaymentMethodsEnum } from './OrderData.types';
import { errorService } from '../ErrorDataStore/errorService';
import { errorStorageTypeEnum, ErrorTypeEnum } from '../ErrorDataStore';
import { suddenError } from '../../helpers';

export interface IOrderDataStore {
    readonly orders: IOrder[];
    readonly isError: boolean;
    readonly paymentMethods: { type: PaymentMethodsEnum, title: string }[];
    readonly deliveryOptions: { type: DeliveryOptionsEnum, title: string }[];
    addOrder (order: IOrder): Promise<OrderCreateStatusEnum>
    refresh(): Promise<void>;
}

class OrderDataStore implements IOrderDataStore {
  private static _instance: OrderDataStore | null = null;
    @observable public orders: IOrder[] = [];
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
          type: PaymentMethodsEnum.Card,
          title: 'Картой',
        },
        {
          type: PaymentMethodsEnum.Cash,
          title: 'Наличными',
        },
      ];
    };


    @computed
    public get deliveryOptions () {
      return [
        {
          type: DeliveryOptionsEnum.Hand,
          title: 'Отдать в руки',
        },
        {
          type: DeliveryOptionsEnum.Door,
          title: 'Уставить у двери',
        },
      ];
    };

    @action.bound
    public async addOrder (order: IOrder): Promise<OrderCreateStatusEnum> {
      try {
        await suddenError('OrderDataStore: addOrder');
        const jsonOrders = await AsyncStorage.getItem(orderStorageTypeEnum.Orders);
        const orders = jsonOrders ? JSON.parse(jsonOrders) : [];
        if (orders) {
          const newOrders = [order, ...orders];
          await AsyncStorage.setItem(orderStorageTypeEnum.Orders, JSON.stringify(newOrders));
        } else {
          await errorService({ type:ErrorTypeEnum.CreateOrder });

          return OrderCreateStatusEnum.Error;
        }

        await this.refresh();

        return OrderCreateStatusEnum.Success;
      } catch (error: any) {
        await errorService({ type:ErrorTypeEnum.CreateOrder, error });

        return OrderCreateStatusEnum.Error;
      }
    }

  @action.bound
    public async clear (): Promise<void> {
      await AsyncStorage.removeItem(orderStorageTypeEnum.Orders);
      this.refresh().then();
    }

    @action.bound
  public async refresh (): Promise<void> {
    try {
      await suddenError('OrderDataStore: refresh');
      const jsonOrders = await AsyncStorage.getItem(orderStorageTypeEnum.Orders);
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
