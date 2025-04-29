import { IVMCore, IVMProps } from '@/utils/types/typescript.types';
import * as OrderDataTypes from '@/api/OrderDataStore/OrderData.types';
import { ICart, ICartDataStore, IEventDataStore, IOrderDataStore, IUser, IUserDataStore } from '@/api';

export interface IScreenCreateOrderProps {
}

export interface IScreenCreateOrderVM extends IVMCore {
    readonly isError: boolean
    readonly orderStore: IOrderDataStore
    readonly userStore: IUserDataStore
    readonly cartStore: ICartDataStore
    readonly eventStore: IEventDataStore
    readonly deliveryOptions: { type: OrderDataTypes.DeliveryOptionsEnum, title: string }[];
    readonly paymentMethods: { type: OrderDataTypes.PaymentMethodsEnum, title: string }[];
    readonly user?: IUser;
    readonly cart?: ICart;
    readonly totalCartSum: number;
    readonly totalCartSumFormatted: string;
    onRefresh(): void;
}

export interface IScreenCreateOrderVMProps extends IScreenCreateOrderProps, IVMProps {}

