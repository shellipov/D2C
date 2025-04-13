import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { DeliveryOptionsEnum, IOrder, OrderCreateStatusEnum, orderStorageTypeEnum, PaymentMethodsEnum } from './OrderData.types';

export interface IOrderDataStore {
    readonly orders: IOrder[];
    readonly paymentMethods: { type: PaymentMethodsEnum, title: string }[];
    readonly deliveryOptions: { type: DeliveryOptionsEnum, title: string }[];
    addOrder (order: IOrder): Promise<OrderCreateStatusEnum>
    refresh(): Promise<void>;
}

class OrderDataStore implements IOrderDataStore {
  private static _instance: OrderDataStore | null = null;
    @observable public orders: IOrder[] = [];

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
        const jsonOrders = await AsyncStorage.getItem(orderStorageTypeEnum.Orders);
        const orders = jsonOrders ? JSON.parse(jsonOrders) : [];
        if (orders) {
          const newOrders = [order, ...orders];
          await AsyncStorage.setItem(orderStorageTypeEnum.Orders, JSON.stringify(newOrders));
        } else {
          Alert.alert('Error', 'Api error');

          return OrderCreateStatusEnum.Error;
        }

        await this.refresh();

        return OrderCreateStatusEnum.Success;
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Api error');

        return OrderCreateStatusEnum.Error;
      }
    }

    @action.bound
    public async refresh (): Promise<void> {
      try {
        const jsonOrders = await AsyncStorage.getItem(orderStorageTypeEnum.Orders);
        if (!!jsonOrders) {
          runInAction(() => {
            this.orders = JSON.parse(jsonOrders);
          });
        }
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Api error');
      }
    }
}

export const OrderStore = OrderDataStore.instance;
