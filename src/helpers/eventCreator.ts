import { ISimplifiedProduct } from '../api';
import { ICartInfo } from '../api/CartDataStore';
import { ISimplifiedUser } from '../api/UserDataStore';
import { EventTypeEnum, ISimplifiedEvent } from '../api/EventDataStore';
import { dateFormatter } from './dateFormatter';
import { Alert } from 'react-native';
import { IOrderOptions } from '../api/OrderDataStore';

interface Props {
  cartInfo: ICartInfo,
  eventType: EventTypeEnum;
  user?: ISimplifiedUser,
  product?: ISimplifiedProduct,
  orderOptions?: IOrderOptions }

export function eventCreator ({ product, user, cartInfo, eventType, orderOptions }: Props) : ISimplifiedEvent | undefined {
  if (!!user && !!cartInfo && !!eventType) {
    const date = dateFormatter(new Date());

    return {
      date,
      user,
      cartInfo,
      eventType,
      product,
      orderOptions,
    };
  } else {
    Alert.alert('Ошибка', `Ошибка при создании события ${eventType}`);
  }
}
