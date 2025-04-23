import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { EventDataStore, EventTypeEnum, IEvent } from '@/api/EventDataStore';
import { TextUI } from '@/components/ui/TextUI';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { First } from '@shared/Firts';
import { NavBar } from '@shared/NavBar';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Screen } from '@shared/Screen';
import { InfoRow } from '@shared/InfoRow';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IScreenStatisticsProps {}

export const ScreenStatistics = observer((props: { route: { params: IScreenStatisticsProps } }) => {
  const theme = useAppTheme();
  const events = EventDataStore.events;
  const contentStyles = { flex: 1, paddingTop: 8, backgroundColor: theme.color.bgAdditional };
  const colors : {[key in EventTypeEnum]? : string} = {
    [EventTypeEnum.AddToCart] : theme.color.textGreen,
    [EventTypeEnum.DeleteFromCart] : theme.color.textRed,
    [EventTypeEnum.CreateOrder] : theme.color.textViolet,
  };

  useEffect(() => {
    EventDataStore.refresh().then();
  }, []);

  const renderProductItem = ({ item }: { item: any }) => {
    const userValue = `${JSON.stringify(item.user)}` ;
    const productValue = `${JSON.stringify(item.product, null, 2)}`;
    const orderOptionsValue = `${JSON.stringify(item.orderOptions, null, 2)}`;
    const cartInfoValue = `${JSON.stringify({ positions: item?.cartInfo?.positions, sum: item?.cartInfo?.sum })}`;
    const cartValue = `${JSON.stringify(item?.cartInfo?.cart, null, 2)}`;

    return (
      <Col style={[styles.item, { backgroundColor: theme.color.bgAdditionalTwo }]}>
        <Row style={styles.row}>
          <TextUI size={'small'} text={`${item.eventType}`} style={{ color: colors[item.eventType as IEvent['eventType']] }} />
        </Row>
        <InfoRow>
          <InfoRow.Label text={'time'} size={'small'} />
          <InfoRow.Value text={item.date} size={'small'} />
        </InfoRow>
        <InfoRow>
          <InfoRow.Label text={'user'} size={'small'} />
          <InfoRow.Value text={userValue} size={'small'} />
        </InfoRow>
        {item.product && (
          <InfoRow multilineValue>
            <InfoRow.Label text={'product'} size={'small'} />
            <InfoRow.Value text={productValue} size={'small'} />
          </InfoRow>
        )}
        {item.orderOptions && (
          <InfoRow multilineValue>
            <InfoRow.Label text={'order options'} size={'small'} />
            <InfoRow.Value text={orderOptionsValue} size={'small'} />
          </InfoRow>
        )}
        <InfoRow multilineValue>
          <InfoRow.Label text={'cart info'} size={'small'} />
          <InfoRow.Value text={cartInfoValue} size={'small'} />
        </InfoRow>
        <InfoRow multilineValue>
          <InfoRow.Label text={'cart'} size={'small'} />
          <InfoRow.Value text={cartValue} size={'small'} />
        </InfoRow>
      </Col>
    );
  };

  return (
    <Screen isError={EventDataStore.isError} onRefresh={EventDataStore.refresh}>
      <NavBar title={'Статистика'} />
      <View style={contentStyles}>
        <First>
          {!events?.length && (
            <View style={styles.emptyView}>
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
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  row: {
    paddingVertical: 4,
  },
});
