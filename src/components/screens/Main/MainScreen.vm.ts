import { inject, injectable } from 'inversify';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { ValueHolder } from '@/utils/ValueHolder';
import { IVMProps, Maybe } from '@/utils/types/typescript.types';
import * as api from '@/api';
import * as LambdaValue from '@/utils/LambdaValue';
import { IScreenMainProps, IScreenMainVM } from './ScreenMain.types';
import { TYPES } from '@/boot/IoC/types';

export interface IScreenMainVMProps extends IScreenMainProps, IVMProps {}

@injectable()
export class ScreenMainVM implements IScreenMainVM {
    @inject(TYPES.CartDataStore) public cartStore!: api.ICartDataStore;
    @inject(TYPES.ProductDataStore) public productStore!: api.IProductDataStore;
    @observable private _isActive: boolean = false;
    private readonly _propsHolder = new ValueHolder<Maybe<IScreenMainVMProps>>(undefined);
    private _disposers: IReactionDisposer[] = [];

    constructor () {
      makeObservable(this);
    }

    @action.bound
    initialize (props: LambdaValue.LambdaValue<IScreenMainVMProps>) {
      this._propsHolder.setValue(props);

      const disposer = reaction(
        () => this._props?.isActive,
        (isActive) => {
          this._setActive(isActive).then();
        },
        { fireImmediately: true },
      );

      this._disposers.push(
        disposer,
      );

      return [
        disposer,
      ];
    }

    @computed
    public get categories () {
      return this.productStore.categories;
    }

    @computed
    public get isError () {
      return this.productStore.isError || this.cartStore.isError;
    }

    public onRefresh = () => {
      if (this.productStore.isError) {
        this.productStore.refresh().then();
      }
      if (this.cartStore.isError) {
        this.cartStore.refresh().then();
      }
    };

    dispose () {
      this._disposers.forEach(dispose => dispose());
      this._disposers = [];
    }

    @action.bound
    private async _refresh () {
      this.productStore.refresh().then();
    }

    @action.bound
    private async _setActive (active: boolean = false) {
      if (this._isActive === active) { return; }

      this._isActive = active;
      if (active) {
        this._refresh().then();
      }
    }

    @computed
    private get _props () {
      return this._propsHolder.value;
    }
}
