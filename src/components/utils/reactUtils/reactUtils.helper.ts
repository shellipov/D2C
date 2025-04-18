// @ts-ignore
import isFunction from 'lodash/isFunction';
import * as React from 'react';

/**
 * Сгенерировать массив, используя генератор.
 */
export function generateArray<R> (generator: () => IterableIterator<R>): R[] {
  return Array.from(generator());
}

/**
 * Проверить итерируемый ли объект. Можно ли использовать с ним for of.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isIterable<I extends Iterable<T>, T> (iterable: any): iterable is Iterable<T> {
  return typeof (iterable) === 'object' && iterable !== null && typeof ((iterable as any)[Symbol.iterator]) === 'function';
}

type ReactElementTypePropType = React.ReactElement['type'];

export const ReactUtils = {
  toIterable,

  findElement: (peers: React.ReactNode | undefined, predicate?: (element: React.ReactElement) => boolean): React.ReactElement | undefined => {
    for (const c of toIterable(peers)) {
      if (c && React.isValidElement(c) && (!predicate || predicate(c))) {
        return c as React.ReactElement;
      }
    }

    return undefined;
  },

  findElementByType: (peers: React.ReactNode | undefined, type: ReactElementTypePropType): React.ReactElement | undefined => {
    for (const c of toIterable(peers)) {
      if (c && React.isValidElement(c) && c.type === type) {
        return c as React.ReactElement;
      }
    }

    return undefined;
  },

  filterElements: (peers: React.ReactNode | undefined, predicate?: (element: React.ReactElement) => boolean): React.ReactElement[] => {
    return generateArray(function* () {
      for (const c of toIterable(peers)) {
        if (c && React.isValidElement(c) && (!predicate || predicate(c))) {
          yield c as React.ReactElement;
        }
      }
    });
  },

  filterElementsByType: (peers: React.ReactNode | undefined, type: ReactElementTypePropType): React.ReactElement[] => {
    return generateArray(function* () {
      for (const c of toIterable(peers)) {
        if (c && React.isValidElement(c) && c.type === type) {
          yield c as React.ReactElement;
        }
      }
    });
  },

  unionElements: (children?: React.ReactNode, peers?: React.ReactNode) => {
    if (!children) { return peers; }
    if (!peers) { return children; }

    return generateArray(function* () {
      yield* toIterable(children);
      yield* toIterable(peers);
    });
  },

  splitChildren,

  resolveChildren: <P>(children?: React.ReactNode | ((props?: P) => React.ReactNode), props?: P) => {
    // @ts-ignore
    return isFunction(children) ? children(props) : undefined;
  },
};

/**
 * Идея метода в том, чтобы иметь возможность прервать перебор элементов children.
 * React.Children.toArray, forEach, map - перебирают все элементы children, не позволяя прерваться, создают лишние коллекции.
 * @param children
 *
 * @example
 * // фильтрация элементов
 * return generateArray(function* () {
 *  for (const c of ReactUtils.toIterable(children)) {
 *    if (c && React.isValidElement(c) && (!predicate || predicate(c))) {
 *      yield c as React.ReactElement;
 *    }
 *  }
 * };
 *
 * @example
 * // поиск одного элемента
 * for (const c of ReactUtils.toIterable(children)) {
 *  if (c && React.isValidElement(c) && c.type === type) {
 *    return c as React.ReactElement;
 *  }
 * }
 */
function* toIterable (children: React.ReactNode | undefined) {
  if (!isIterable(children)) {
    yield children;
  } else {
    // Надёжного способа перебрать элементы, так чтобы можно было прервать перебор, так и не получилось найти
    const array = React.Children.toArray(children);
    for (const item of array) {
      yield item;
    }
    /*
        for (const item of children) {
          // toArray добавлен не просто так. Без него в результат не попадают элементы children, создаваемые через map коллекции
          const itemArray = React.Children.toArray(item);
          yield itemArray?.[0] || item;
        }
    */
  }
}

function splitChildren<T, K extends { [P: string]: ((i: T) => boolean) | true }>(
  children?: T | T[],
  conds?: K,
): { [P in keyof K]: T[] } {
  const result: any = {};
  const parts = Object.keys(conds || {});

  for (const part of parts) {
    result[part] = [];
  }

  if (!!children && !!conds) {
    // @ts-ignore
    for (const item of toIterable(children)) {
      for (const part of parts) {
        const cond = conds[part];
        if (cond === true || (item && cond(item as any))) {
          result[part].push(item);
          break;
        }
      }
    }
  }

  return result;
}
