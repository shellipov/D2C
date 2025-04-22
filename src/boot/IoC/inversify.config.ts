import { Container } from 'inversify';
import { ScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.vm';
import { ErrorDataStore, IErrorDataStore } from '@/api';
import { IScreenErrorsVM } from '@components/screens/Errors/ScreenErrors.types';
import { TYPES } from './types';

const container = new Container();
// stores
container.bind<IErrorDataStore>(TYPES.ErrorDataStore).to(ErrorDataStore);
// viewModels
container.bind<IScreenErrorsVM>(TYPES.ScreenErrorsVM).to(ScreenErrorsVM);

export { container };


