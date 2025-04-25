import { action, computed, makeObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as OrderDataTypes from './OrderData.types';
import { ErrorTypeEnum, IGetFakeOrderResponse, IOrder } from '@/api';
import { errorService } from '../ErrorDataStore/errorService';
import { suddenError } from '@/helpers';
import { injectable } from 'inversify';
import { AsyncDataHolder } from '@/utils/AsyncDataHolder';
import { ApiStatusEnum } from '@/api/ApiTypes.types';
import { getDataWithRandomDelay } from '@/helpers/getDataWithRandomDelay.helper';

export interface IOrderDataStore {
  readonly orders: OrderDataTypes.IOrder[];
  readonly isError: boolean;
  readonly isLoading: boolean;
  readonly lastOrder: IOrder;
  readonly paymentMethods: { type: OrderDataTypes.PaymentMethodsEnum, title: string }[];
  readonly deliveryOptions: { type: OrderDataTypes.DeliveryOptionsEnum, title: string }[];
  addOrder(order: OrderDataTypes.IOrder): Promise<OrderDataTypes.OrderCreateStatusEnum>
  refresh(): Promise<void>;
}

@injectable()
export class OrderDataStore implements IOrderDataStore {
  private _holder = new AsyncDataHolder<IGetFakeOrderResponse>();

  public constructor () {
    makeObservable(this);
  }

  @computed
  public get orders () {
    return this._holder.data?.data || [];
  }

  @computed
  public get isError () {
    return this._holder.isError;
  }

  @computed
  public get isLoading () {
    return this._holder.isLoading;
  }

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
      this._holder.setLoading();
      await suddenError('OrderDataStore: refresh');
      const jsonOrders = await AsyncStorage.getItem(OrderDataTypes.OrderStorageTypeEnum.Orders);
      if (!!jsonOrders) {
        const data = await getDataWithRandomDelay(JSON.parse(jsonOrders));
        this._holder.setData({
          data,
          status: ApiStatusEnum.Success,
        });
      }
    } catch (error: any) {
      this._holder.setError(error);
      await errorService({ type:ErrorTypeEnum.LoadData, error, withoutAlerts: true });
    }
  }
}
