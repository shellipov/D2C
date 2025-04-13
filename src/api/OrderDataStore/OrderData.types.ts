import { IUser } from '../UserDataStore';
import { ICart } from '../CartDataStore';

export enum PaymentMethodsEnum {
    Card = 'Card',
    Cash= 'Cash',
}

export enum DeliveryOptionsEnum {
    Hand= 'GiveInHand',
    Door= 'LeaveAtTheDoor',
}

export enum orderStorageTypeEnum {
    Orders = 'Orders',
}

export enum OrderCreateStatusEnum {
    Success = 'Success',
    Error = 'Error',
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
