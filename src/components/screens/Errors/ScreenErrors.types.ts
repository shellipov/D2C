import * as api from '@/api';
import { IVMCore, IVMProps } from '@/utils/types/typescript.types';

export interface IScreenErrorsProps {
}

export interface IScreenErrorsVM extends IVMCore {
    errorDataStore: api.IErrorDataStore
}

export interface IScreenErrorsVMProps extends IScreenErrorsProps, IVMProps {}

