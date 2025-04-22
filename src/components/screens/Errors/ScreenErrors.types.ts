import { IReactionDisposer } from 'mobx';
import * as api from '@/api';

export interface ISupportInitialize {
    initialize(arg?: any): Promise<void> | IReactionDisposer[];
}

export interface IScreenErrorsVM extends ISupportInitialize {
    errorDataStore: api.IErrorDataStore
    dispose(): void;
}
