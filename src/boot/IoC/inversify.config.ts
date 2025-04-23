import { Container } from 'inversify';
import { ScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.vm';
import {
  IUserDataStore,
  UserDataStore,
  ICartDataStore,
  CartDataStore,
  IErrorDataStore,
  ErrorDataStore,
  IEventDataStore,
  EventDataStore,
  IOrderDataStore,
  OrderDataStore,
  IProductDataStore,
  ProductDataStore,
} from '@/api';
import { IScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.types';
import { TYPES } from './types';
import { IThemeStore, ThemeStore } from '@/store';

const container = new Container();
// system stores
container.bind<IThemeStore>(TYPES.ThemeStore).to(ThemeStore).inSingletonScope();
// data stores
container.bind<IUserDataStore>(TYPES.UserDataStore).to(UserDataStore).inSingletonScope();
container.bind<ICartDataStore>(TYPES.CartDataStore).to(CartDataStore).inSingletonScope();
container.bind<IErrorDataStore>(TYPES.ErrorDataStore).to(ErrorDataStore);
container.bind<IEventDataStore>(TYPES.EventDataStore).to(EventDataStore);
container.bind<IOrderDataStore>(TYPES.OrderDataStore).to(OrderDataStore);
container.bind<IProductDataStore>(TYPES.ProductDataStore).to(ProductDataStore);
// view models
container.bind<IScreenErrorsVM>(TYPES.ScreenErrorsVM).to(ScreenErrorsVM);

export { container };


