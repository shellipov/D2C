import { IReactionDisposer } from 'mobx';

// Часто проще использовать чем "| undefined"
export type Maybe<T> = T | undefined;

export interface ISupportInitialize {
    initialize(arg?: any): Promise<void> | IReactionDisposer[];
}

export interface ISupportDispose {
    dispose(): void;
}

export interface IVMCore extends ISupportInitialize, ISupportDispose {
}

export interface IVMProps {
    isActive : boolean
}
