import { FlatList, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { Row } from '../../shared/Row';
import { NavBar } from '../../shared/NavBar';
import { Screen } from '../../shared/Screen';
import { ColorsVars } from '../../../settings';
import { EventDataStore, EventTypeEnum } from '../../../api/EventDataStore';
import { Col } from '../../shared/Col';
import { First } from '../../shared/Firts';

const COLORS : {[key in EventTypeEnum]? : string} = {
  [EventTypeEnum.AddToCart] : ColorsVars.green,
  [EventTypeEnum.DeleteFromCart] : ColorsVars.red,
  [EventTypeEnum.CreateOrder] : ColorsVars.green,
};

export interface IScreenStatisticsProps {}

export const ScreenStatistics = observer((props: { route: { params: IScreenStatisticsProps } }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const events = EventDataStore.events;

  useEffect(() => {
    EventDataStore.refresh().then();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const itemStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  };

  return (
    <Screen style={{ flex: 1, backgroundColor: isDarkMode ? 'rgb(24, 24, 24)' : 'white' }}>
      <NavBar title={'Статистика'} />
      <View style={[backgroundStyle, { flex: 1, paddingTop: 8 }]}>
        <First>

          {!events?.length && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextUI size={'title'} text={'Tут пока ничего нет'} />
            </View>
          )}

          <FlatList
            data={events}
            keyExtractor={(item) => `item_${item.id}`}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
              <Col style={itemStyle}>
                <View style={{ paddingBottom: 6 }}>
                  <Row style={[styles.item]}>
                    <TextUI size={'small'} text={`${item.eventType}`} style={{ color: COLORS[item.eventType] }} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <TextUI size={'small'} text={'time'} />
                    <TextUI
                      size={'small'}
                      numberOfLines={1}
                      style={{ maxWidth: '70%' }}
                      text={`${item.date}`} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                    <TextUI size={'small'} text={'user'} />
                    <TextUI
                      size={'small'}
                      style={{ maxWidth: '70%' }}
                      text={`${JSON.stringify(item.user)}`} />
                  </Row>
                  {item.product && (
                    <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                      <TextUI size={'small'} text={'user'} />
                      <TextUI
                        size={'small'}
                        style={{ maxWidth: '70%' }}
                        text={`${JSON.stringify(item.product, null, 2)}`} />
                    </Row>
                  )}
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                    <TextUI size={'small'} text={'cartInfo'} />
                    <TextUI
                      size={'small'}
                      style={{ maxWidth: '70%' }}
                      text={`${JSON.stringify({ positions: item?.cartInfo?.positions, sum: item?.cartInfo?.sum })}`} />
                  </Row>
                  <Row style={[styles.item, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                    <TextUI size={'small'} text={'cart'} />
                    <TextUI
                      size={'small'}
                      style={{ maxWidth: '70%' }}
                      text={`${JSON.stringify(item?.cartInfo?.cart, null, 2)}`} />
                  </Row>
                </View>
              </Col>
            )} />
        </First>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  item: {
    paddingVertical: 4,
  },
});
