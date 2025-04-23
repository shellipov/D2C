import { computed } from 'mobx';
import { LambdaValue } from '@/utils/LambdaValue';
import { Maybe } from '@/utils/types/typescript.types';
import { DataModelBase } from '@/utils/DataModel/DataModelBase';
import { EnumValues } from '@/helpers/enumValues';
import { stringCapitalize } from '@/helpers/string.helper';

type TEnumProps<TEnum> = { [K in keyof TEnum as `is${Capitalize<string & K>}`]: boolean };
type EnumValue<TEnum> = TEnum[keyof TEnum];
type ModelClassType<T, TEnum> = new(enm: LambdaValue<Maybe<EnumValue<TEnum>>>) => T;
type TEnumModelBase<TEnum> = ModelClassType<TEnumProps<TEnum> & DataModelBase<Maybe<EnumValue<TEnum>>>, TEnum>;

/**
 * Создаёт класс модели по энуму.
 * @example
 * const BsModelBase = createEnumModelBase<typeof BsEnum>(BsEnum);
 * const bs = new BsModelBase(BsEnum.Buy);
 * bs.isBuy; // true
 * bs.isSell; // false
 *
 * @param enm
 */
export function createEnumModelBase<TEnum> (enm: any) {
  class EnumModel extends DataModelBase<Maybe<EnumValue<TEnum>>> {
  }

  // Тут генерируем реализацию проверочных пропсов по каждому полю энума, которые соответствуют типу TEnumProps
  EnumValues.getNamesAndValues<any>(enm).forEach(item => {
    const key = `is${stringCapitalize(item.name)}`;
    Object.defineProperty(EnumModel.prototype, key, {
      get () {
        return this.data === item.value;
      },
    });

    // @computed - декоратор
    computed(EnumModel, key);
  });

  return EnumModel as TEnumModelBase<TEnum>;
}
