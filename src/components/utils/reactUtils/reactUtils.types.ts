import React from 'react';

export interface CompoundProps<P> {
  peers?: React.ReactNode;
  predicate?: ((e?: React.ReactElement) => boolean) | React.ComponentType<any>;
  peerType?: any;
  children?: React.ReactNode | ((props: P) => React.ReactNode);
}

export function extractCompoundProps<P> (props: CompoundProps<P> & P) {
  const {
    peers, peerType, children, ...rest
  } = props;

  return {
    props: {
      peers, peerType, children,
    },
    rest,
  };
}
