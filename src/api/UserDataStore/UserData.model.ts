import { IGetFakeUserResponse, ISimplifiedUser } from '@/api';
import { Maybe } from '@/utils/types/typescript.types';
import { DataModelBase } from '@/utils/DataModel/DataModelBase';
import { computed, makeObservable } from 'mobx';

type TData = Maybe<IGetFakeUserResponse['data']>;

export class UserDataModel extends DataModelBase<TData> {
  constructor (props?: any) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get simplifiedUser (): ISimplifiedUser | undefined {
    return !!this.data ? {
      id: this.data?.id,
      userName: this.data?.userName,
    } : undefined;
  }
}
