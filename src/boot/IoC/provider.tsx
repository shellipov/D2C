import React from 'react';
import { Provider } from 'inversify-react';

import { container } from './inversify.config';

interface IInversifyProviderProps {
  children?: React.ReactNode;
}

export const InversifyReactProvider: React.FC<IInversifyProviderProps> = (props: IInversifyProviderProps) => (
  <Provider container={ container } key={container.id}>
    {props.children}
  </Provider>
);


