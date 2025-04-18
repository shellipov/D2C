import { observer } from 'mobx-react';
import React from 'react';
import { getCompoundProps } from '@components/utils/CompoundUtils';
import { computed } from 'mobx';
import { Row } from '@shared/Row';
import { ITextUIProps, TextUI } from '@components/ui/TextUI';
import { StyleSheet, ViewProps } from 'react-native';

interface Props extends ViewProps {
  multilineValue?: boolean;
}

@observer
export class InfoRow extends React.Component<Props> {
  public static readonly Label = (props: ITextUIProps) => null;
  public static readonly Value = (props: ITextUIProps) => null;

  constructor (props?: any) {
    super(props);
  }

  public render () {
    const { multilineValue, style, ...rowProps } = this.props;
    const innerProps = this._props;
    const multilineValueStyles = multilineValue ? { justifyContent: 'space-between', alignItems: 'flex-start' } as ViewProps : {};

    return (
      <Row style={[styles.row, multilineValueStyles, style]} {...rowProps}>
        <TextUI {...innerProps.label} />
        <TextUI style={styles.value} {...innerProps.value} />
      </Row>
    );
  }

  @computed
  private get _props () {
    return getCompoundProps(this.props, InfoRow, 'Label', 'Value');
  }
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    maxWidth: '70%',
  },
});
