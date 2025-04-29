import { inject, injectable } from 'inversify';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { ValueHolder } from '@/utils/ValueHolder';
import { Maybe } from '@/utils/types/typescript.types';
import * as api from '@/api';
import * as LambdaValue from '@/utils/LambdaValue';
import { TYPES } from '@/boot/IoC/types';
import { IScreenCreateOrderVM, IScreenCreateOrderVMProps } from './ScreenCreateOrder.types';
import { SettingsVars } from '@/settings';

@injectable()
export class ScreenCreateOrderVM implements IScreenCreateOrderVM {
  @inject(TYPES.CartDataStore) public cartStore!: api.ICartDataStore;
  @inject(TYPES.EventDataStore) public eventStore!: api.IEventDataStore;
  @inject(TYPES.UserDataStore) public userStore!: api.IUserDataStore;
  @inject(TYPES.OrderDataStore) public orderStore!: api.IOrderDataStore;
  @inject(TYPES.ProductDataStore) public productStore!: api.IProductDataStore;

  @observable private _isActive: boolean = false;
  private readonly _propsHolder = new ValueHolder<Maybe<IScreenCreateOrderVMProps>>(undefined);
  private _disposers: IReactionDisposer[] = [];

  constructor () {
    makeObservable(this);
  }

  @action.bound
  initialize (props: LambdaValue.LambdaValue<IScreenCreateOrderVMProps>) {
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

  dispose () {
    this._disposers.forEach(dispose => dispose());
    this._disposers = [];
  }

  @computed
  public get deliveryOptions () {
    return this.orderStore.deliveryOptions;
  }

  @computed
  public get paymentMethods () {
    return this.orderStore.paymentMethods;
  }

  @computed
  public get user () {
    return this.userStore.model.data;
  }

  @computed
  public get cart () {
    return this.cartStore.model.data;
  }

  @computed
  public get totalCartSum () {
    return this.cartStore.model.cartSum + SettingsVars.shippingCost;
  }

  @computed
  public get totalCartSumFormatted () {
    return `итого: ${this.totalCartSum} ₽`;
  }

  @computed
  public get isError () {
    return this.cartStore.isError || this.eventStore.isError || this.userStore.isError || this.productStore.isError || this.orderStore.isError;
  }

  public onRefresh () {
    if (this.cartStore.isError) { this.cartStore.refresh().then();}
    if (this.eventStore.isError) { this.eventStore.refresh().then();}
    if (this.userStore.isError) { this.userStore.refresh().then();}
    if (this.productStore.isError) { this.productStore.refresh().then();}
    if (this.orderStore.isError) { this.orderStore.refresh().then();}
  }

  @action.bound
  private async _refresh () {
    this.orderStore.refresh().then();
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
