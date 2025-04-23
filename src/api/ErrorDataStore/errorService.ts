import { ErrorStorageTypeEnum, ErrorTypeEnum } from './ErrorData.types';
import { dateFormatter } from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ApiStatusEnum } from '../ApiTypes.types';

const ERROR_DATA = {
  [ErrorTypeEnum.AddToCart]: {
    title: 'Ошибка при добавлении в корзину',
    description: 'Товары закончились',
  },
  [ErrorTypeEnum.DeleteFromCart]: {
    title: 'Ошибка при удалении из корзины',
    description: 'Попробуйте еще раз',
  },
  [ErrorTypeEnum.CreateOrder]: {
    title: 'Ошибка при создании заказа',
    description: 'Попробуйте еще раз',
  },
  [ErrorTypeEnum.LoadData]: {
    title: 'Ошибка при обновлении данных',
    description: 'Попробуйте еще раз',
  },
};

interface IErrorService {
  type: ErrorTypeEnum,
  withoutAlerts?: boolean;
  error?: { message?: string }
}

export async function errorService (props:IErrorService): Promise<ApiStatusEnum> {
  const message = props.error?.message;
  const withoutAlerts = props.withoutAlerts;
  const errorData = ERROR_DATA[props.type];
  const date = dateFormatter(new Date());

  try {
    const jsonErrors = await AsyncStorage.getItem(ErrorStorageTypeEnum.Errors);
    const errors = jsonErrors ? JSON.parse(jsonErrors) : [];
    const id = errors.length;

    if (errors) {
      const newErrors = [{ ...errorData, id, date, message }, ...errors];

      await AsyncStorage.setItem(ErrorStorageTypeEnum.Errors, JSON.stringify(newErrors));
      if (!withoutAlerts) {
        Alert.alert(errorData.title, [errorData.description, message].join('\n'));
      }

      return ApiStatusEnum.Error;
    } else {
      if (!withoutAlerts) {
        Alert.alert(errorData.title, [errorData.description, message].join('\n'));
      }

      return ApiStatusEnum.Error;
    }
  } catch (err: any) {
    if (!withoutAlerts) {
      Alert.alert(errorData.title, [errorData.description, message, err.message].join('\n'));
    }

    return ApiStatusEnum.Error;
  }
}
