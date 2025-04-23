import { Container } from 'inversify';
import { ScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.vm';
import { CartDataStore, ErrorDataStore, EventDataStore, ICartDataStore, IErrorDataStore, IEventDataStore, IUserDataStore, UserDataStore } from '@/api';
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
// view models
container.bind<IScreenErrorsVM>(TYPES.ScreenErrorsVM).to(ScreenErrorsVM);

export { container };


