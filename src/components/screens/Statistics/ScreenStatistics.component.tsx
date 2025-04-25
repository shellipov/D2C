import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { EventTypeEnum, IEvent, IEventDataStore } from '@/api/EventDataStore';
import { TextUI } from '@/components/ui/TextUI';
import { FlatListWithPagination } from '@shared/FlatListWithPagination';
import { First } from '@shared/Firts';
import { NavBar } from '@shared/NavBar';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Screen } from '@shared/Screen';
import { InfoRow } from '@shared/InfoRow';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { Loader } from '@shared/Loader';

export interface IScreenStatisticsProps {}

export const ScreenStatistics = observer((props: { route: { params: IScreenStatisticsProps } }) => {
  const theme = useAppTheme();
  const eventStore = useInjection<IEventDataStore>(TYPES.EventDataStore);
  const colors : {[key in EventTypeEnum]? : string} = {
    [EventTypeEnum.AddToCart] : theme.color.textGreen,
    [EventTypeEnum.DeleteFromCart] : theme.color.textRed,
    [EventTypeEnum.CreateOrder] : theme.color.textViolet,
  };

  useEffect(() => {
    eventStore.refresh().then();
  }, []);

  const renderProductItem = ({ item }: { item: any }) => {
    const userValue = `${JSON.stringify(item.user)}` ;
    const productValue = `${JSON.stringify(item.product, null, 2)}`;
    const orderOptionsValue = `${JSON.stringify(item.orderOptions, null, 2)}`;
    const cartInfoValue = `${JSON.stringify({ positions: item?.cartInfo?.positions, sum: item?.cartInfo?.sum })}`;
    const cartValue = `${JSON.stringify(item?.cartInfo?.cart, null, 2)}`;

    return (
      <Col mv={4} mh={8} radius={8} ph={16} pt={8} pv={6} style={[{ backgroundColor: theme.color.bgAdditionalTwo }]}>
        <Row pv={4}>
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
    <Screen isError={eventStore.isError} onRefresh={eventStore.refresh}>
      <NavBar title={'Статистика'} />
      <Col flex pt={8} bg={theme.color.bgAdditional}>
        <First>
          {eventStore.isLoading && (
            <Loader />
          )}
          {!eventStore.events?.length && (
            <Col flex centerContent>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </Col>
          )}
          <FlatListWithPagination data={eventStore.events} renderItem={renderProductItem} />
        </First>
      </Col>
    </Screen>
  );
});
