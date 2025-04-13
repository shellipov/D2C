import { ISimplifiedProduct } from '../api';
import { ICartInfo } from '../api/CartDataStore';
import { ISimplifiedUser } from '../api/UserDataStore';
import { EventTypeEnum, ISimplifiedEvent } from '../api/EventDataStore';
import { dateFormatter } from './dateFormatter';
import { Alert } from 'react-native';

interface Props { product?: ISimplifiedProduct, cartInfo: ICartInfo, eventType: EventTypeEnum; user?: ISimplifiedUser }

export function eventCreator ({ product, user, cartInfo, eventType }: Props) : ISimplifiedEvent | undefined {
  if (!!product && !!user && !!cartInfo && !!eventType) {
    const date = dateFormatter(new Date());

    return {
      date, user, cartInfo, eventType, product,
    };
  } else {
    Alert.alert('Ошибка', `Ошибка при создании события ${eventType}`);
  }
}
