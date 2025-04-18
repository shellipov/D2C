import { StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { Row } from '../../shared/Row';
import { NavBar } from '../../shared/NavBar';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';
import { EventDataStore, EventTypeEnum, IEvent } from '../../../api/EventDataStore';
import { Col } from '../../shared/Col';
import { First } from '../../shared/Firts';
import { FlatListWithPagination } from '../../shared/FlatListWithPagination';

const COLORS : {[key in EventTypeEnum]? : string} = {
  [EventTypeEnum.AddToCart] : ColorsVars.green,
  [EventTypeEnum.DeleteFromCart] : ColorsVars.red,
  [EventTypeEnum.CreateOrder] : ColorsVars.violet,
};

export interface IScreenStatisticsProps {}

export const ScreenStatistics = observer((props: { route: { params: IScreenStatisticsProps } }) => {
  const events = EventDataStore.events;

  useEffect(() => {
    EventDataStore.refresh().then();
  }, []);

  const renderProductItem = ({ item }: { item: any }) => (

    <Col style={styles.item}>
      <View style={{ paddingBottom: 6 }}>
        <Row style={styles.row}>
          <TextUI size={'small'} text={`${item.eventType}`} style={{ color: COLORS[item.eventType as IEvent['eventType']] }} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <TextUI size={'small'} text={'time'} />
          <TextUI
            size={'small'}
            numberOfLines={1}
            style={{ maxWidth: '70%' }}
            text={`${item.date}`} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
          <TextUI size={'small'} text={'user'} />
          <TextUI
            size={'small'}
            style={{ maxWidth: '70%' }}
            text={`${JSON.stringify(item.user)}`} />
        </Row>
        {item.product && (
          <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <TextUI size={'small'} text={'product'} />
            <TextUI
              size={'small'}
              style={{ maxWidth: '70%' }}
              text={`${JSON.stringify(item.product, null, 2)}`} />
          </Row>
        )}
        {item.orderOptions && (
          <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <TextUI size={'small'} text={'order options'} />
            <TextUI
              size={'small'}
              style={{ maxWidth: '70%' }}
              text={`${JSON.stringify(item.orderOptions, null, 2)}`} />
          </Row>
        )}
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
          <TextUI size={'small'} text={'cart info'} />
          <TextUI
            size={'small'}
            style={{ maxWidth: '70%' }}
            text={`${JSON.stringify({ positions: item?.cartInfo?.positions, sum: item?.cartInfo?.sum })}`} />
        </Row>
        <Row style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
          <TextUI size={'small'} text={'cart'} />
          <TextUI
            size={'small'}
            style={{ maxWidth: '70%' }}
            text={`${JSON.stringify(item?.cartInfo?.cart, null, 2)}`} />
        </Row>
      </View>
    </Col>
  );

  return (
    <Screen isError={EventDataStore.isError} onRefresh={EventDataStore.refresh}>
      <NavBar title={'Статистика'} />
      <View style={{ flex: 1, paddingTop: 8, backgroundColor: Colors.lighter }}>
        <First>
          {!events?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}
          <FlatListWithPagination data={events} renderItem={renderProductItem} />
        </First>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  item: {
    backgroundColor: ColorsVars.white,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    paddingVertical: 4,
  },
});
