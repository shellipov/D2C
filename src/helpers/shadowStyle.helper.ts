// eslint-disable-next-line react-native/split-platform-components
import { Platform, ShadowStyleIOS } from 'react-native';

export function shadowStyle (elevation: number): any {
  return Platform.select<any>({
    ios: shadowMapping[elevation],
    android: { elevation },
    web: boxShadow(elevation),
  });
}

const shadowOpacity = (key: number): number => 0.14;

const shadowMapping: { [key: number]: ShadowStyleIOS } = {
  0: { shadowRadius: 0, shadowOffset: { height: 0, width: 0 }, shadowColor: 'transparent', shadowOpacity: 1 },
  1: { shadowRadius: 1 * 2, shadowOffset: { height: 1, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(1) },
  2: { shadowRadius: 2 * 2, shadowOffset: { height: 1, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(2) },
  3: { shadowRadius: 3 * 2, shadowOffset: { height: 2, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(3) },
  4: { shadowRadius: 4 * 2, shadowOffset: { height: 2, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(4) },
  5: { shadowRadius: 5 * 2, shadowOffset: { height: 3, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(5) },
  6: { shadowRadius: 6 * 2, shadowOffset: { height: 3, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(6) },
  7: { shadowRadius: 7 * 2, shadowOffset: { height: 4, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(7) },
  8: { shadowRadius: 8 * 2, shadowOffset: { height: 4, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(8) },
  9: { shadowRadius: 9 * 2, shadowOffset: { height: 5, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(9) },
  10: { shadowRadius: 10 * 2, shadowOffset: { height: 5, width: 0 }, shadowColor: 'black', shadowOpacity: shadowOpacity(10) },
};

const boxShadow = (elevation = 0) => ({ boxShadow: `0px ${elevation}px ${2 * elevation}px 1px ${rgba(elevation)}` });

const rgba = (elevation: number) => !!elevation ? `${'rgba(0,0,0,0.14)'}` : `${'rgba(0,0,0,0)'}`;
