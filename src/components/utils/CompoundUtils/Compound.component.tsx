import * as React from 'react';
import { ReactUtils } from '../reactUtils';
import { observer } from 'mobx-react';
import { getCompoundProps } from './CompoundUtils.helper';

export type NonEmptyArray<T> = [T, ...T[]];

interface CompoundProps {
  peers?: React.ReactNode;
  byCondition?: (e: React.ReactElement) => boolean;
  byPeerType?: React.ComponentType<any>;
}

interface CompoundFindProps extends CompoundProps {
  children?: (foundElement?: React.ReactElement) => React.ReactNode;
}

interface CompoundFilterProps extends CompoundProps {
  // undefined или массив найденных элементов, пустой пассив не возвращается
  children?: (foundElements?: NonEmptyArray<React.ReactElement>) => React.ReactNode;
}

@observer
class CompoundFind extends React.Component<CompoundFindProps> {
  public render () {
    const { peers, byCondition, children, byPeerType } = this.props;
    const found = byCondition ?
      ReactUtils.findElement(peers, byCondition) :
      byPeerType ?
        ReactUtils.findElementByType(peers, byPeerType) :
        undefined;

    return (
      children ? children(found) : undefined
    );
  }
}

@observer
class CompoundFilter extends React.Component<CompoundFilterProps> {
  public render () {
    const { peers, byCondition, children, byPeerType } = this.props;
    if (!(!!children && (byCondition || byPeerType))) { return null; }
    const found = byCondition ?
      ReactUtils.filterElements(peers, byCondition) :
      byPeerType ?
        ReactUtils.filterElementsByType(peers, byPeerType) :
        undefined;
    const items = !!found && found.length ? found as NonEmptyArray<React.ReactElement> : undefined;

    return (
      children(items)
    );
  }
}

/**
 * Набор хелперов для реализации Compound паттерна компоновки React компонентов.
 */
export class CompoundUtils {
  public static Find = CompoundFind;
  public static Filter = CompoundFilter;
  public static getCompoundProps = getCompoundProps;
}
