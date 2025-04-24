import * as api from '@/api';
import { IVMCore } from '@/utils/types/typescript.types';

export interface IScreenErrorsProps {
}

export interface IScreenErrorsVM extends IVMCore {
    errorDataStore: api.IErrorDataStore
}
