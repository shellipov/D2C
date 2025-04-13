import { IUser } from '../AuthDataStore';
import { ICart } from '../CartDataStore';

export type EventType = 'addToFavorites' | 'deleteFromFavorites' | 'addToCart' | 'deleteFromCart' | 'createOrder'

export interface IEvent {
    id: string;
    user: IUser
    type: EventType;
    time: string;
    cart: ICart;
}

export enum OrderStorageTypeEnum {
    Events= 'Events'
}
