import { IEvent, IUser } from '@/api';
import { ICart } from '@/api';
import { ApiStatusEnum } from '@/api/ApiTypes.types';

export enum PaymentMethodsEnum {
    Card = 'Card',
    Cash= 'Cash',
}

export enum DeliveryOptionsEnum {
    Hand= 'GiveInHand',
    Door= 'LeaveAtTheDoor',
}

export enum OrderStorageTypeEnum {
    Orders = 'Orders',
}

export enum OrderCreateStatusEnum {
    Success = 'Success',
    Error = 'Error',
}

export interface IOrderOptions {
    paymentMethod: PaymentMethodsEnum,
    deliveryOption: DeliveryOptionsEnum,
}

export interface IOrder {
    id: number;
    date: string;
    user: IUser;
    cart: ICart;
    shippingCost: number;
    totalSum: number;
    paymentMethod: {type: PaymentMethodsEnum, title: string };
    deliveryOption: {type: DeliveryOptionsEnum, title: string };
}

export interface IGetFakeOrderResponse {
    data?: IOrder[];
    status?: ApiStatusEnum;
    message?: string;
}
