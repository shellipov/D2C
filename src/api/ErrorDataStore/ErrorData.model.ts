import { IGetFakeErrorResponse } from '@/api';
import { Maybe } from '@/utils/types/typescript.types';
import { DataModelBase } from '@/utils/DataModel/DataModelBase';
import { makeObservable } from 'mobx';

type TData = Maybe<IGetFakeErrorResponse['data']>;

export class ErrorDataModel extends DataModelBase<TData> {
  constructor (props?: any) {
    super(props);
    makeObservable(this);
  }
}
