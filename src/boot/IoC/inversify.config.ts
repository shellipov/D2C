import { Container } from 'inversify';
import { ScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.vm';
import { ErrorDataStore, IErrorDataStore } from '@/api';
import { IScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.types';
import { TYPES } from './types';
import { IThemeStore, ThemeStore } from '@/store';

const container = new Container();
// stores
container.bind<IThemeStore>(TYPES.ThemeStore).to(ThemeStore).inSingletonScope();
container.bind<IErrorDataStore>(TYPES.ErrorDataStore).to(ErrorDataStore);
// viewModels
container.bind<IScreenErrorsVM>(TYPES.ScreenErrorsVM).to(ScreenErrorsVM);

export { container };


