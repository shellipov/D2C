import { ICart, ICartInfo, IOrderOptions, ISimplifiedProduct, ISimplifiedUser } from '@/api';
import { ApiStatusEnum } from '@/api/ApiTypes.types';

export enum EventTypeEnum {
    AddToFavorites = 'AddToFavorites',
    DeleteFromFavorites = 'DeleteFromFavorites',
    AddToCart = 'AddToCart',
    DeleteFromCart = 'DeleteFromCart',
    CreateOrder = 'CreateOrder'
}

export interface IEvent {
    id: string;
    date: string;
    product?: ISimplifiedProduct;
    cartInfo: ICartInfo;
    eventType: EventTypeEnum;
    user: ISimplifiedUser;
    orderOptions? : IOrderOptions;
}

export interface ISimplifiedEvent extends Omit<IEvent, 'id'> {}

export interface ISimplifiedEventData extends Omit<IEvent, 'id' | 'date' | 'eventType'> {}

export enum EventStorageTypeEnum {
    Events= 'Events'
}

export interface IGetFakeEventResponse {
    data?: IEvent[];
    status?: ApiStatusEnum;
    message?: string;
}
