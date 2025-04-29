import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { TextUI } from '../../ui/TextUI';
import { useNavigationHook } from '@/hooks/useNavigation';
import { ButtonUI } from '../../ui/ButtonUI';
import { SettingsVars } from '@/settings';
import { Row } from '@shared/Row';
import { Col } from '@shared/Col';
import { Chip } from '@shared/Chip';
import { dateFormatter, eventCreator } from '@/helpers';
import { Screen } from '@shared/Screen';
import { DeliveryOptionsEnum, IOrder, OrderCreateStatusEnum, PaymentMethodsEnum } from '@/api';
import { EventTypeEnum, ISimplifiedEventData } from '@/api/EventDataStore';
import { phoneFormatter } from '@/helpers/phoneFormatter';
import { OrderCartItem } from '../Order/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInjection } from 'inversify-react';
import { TYPES } from '@/boot/IoC/types';
import { TouchableOpacityUI } from '@components/ui/TouchableOpacityUI';
import { ScrollViewUI } from '@components/ui/ScrollViewUI';
import { IScreenCreateOrderProps, IScreenCreateOrderVM } from './ScreenCreateOrder.types';
import { useAppState } from '@/hooks/useAppState';

export const ScreenCreateOrder = observer((props: { route: { params: IScreenCreateOrderProps }}) => {
  const { isActive } = useAppState();
  const vm = useInjection<IScreenCreateOrderVM>(TYPES.ScreenCreateOrderVM);
  const navigation = useNavigationHook();
  const theme = useAppTheme();
  const { color } = theme;
  const isValidPhone = useMemo(() => phoneFormatter(vm.user?.phone).isValid, [vm.user?.phone]);
  const isUserProfileError = !vm.user?.name || !vm.user?.phone || !vm.user?.address || !isValidPhone;
  const isUserProfileErrorText = [vm.user?.name, vm.user?.phone, vm.user?.address].join('').length ? 'Исправьте данные профиля' : 'Заполните данные профиля';
  const userNameColor = !vm.user?.name ? color.textRed : color.textPrimary;
  const userPhoneColor = !vm.user?.phone ? color.textRed : color.textPrimary;
  const userPhoneValueColor = !isValidPhone ? color.textRed : color.textPrimary;
  const userAddressColor = !vm.user?.address ? color.textRed : color.textPrimary;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodsEnum>(PaymentMethodsEnum.Card);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionsEnum>(DeliveryOptionsEnum.Hand);

  const getEventData = () => ({
    user: vm.userStore.model.simplifiedUser,
    orderOptions: {
      paymentMethod, deliveryOption,
    },
    cartInfo: vm.cartStore.model.cartInfo,
  }) as ISimplifiedEventData;

  useEffect(() => {
    vm.initialize(() => ({ ...props.route.params, isActive }));

    return () => {
      vm.dispose();
    };
  }, [isActive]);

  const onPressConfirm = useCallback(async ()=> {
    const date = dateFormatter(new Date());
    const order = {
      id: vm.orderStore.orders.length + 1,
      date,
      user: vm.user,
      cart: vm.cart,
      shippingCost: SettingsVars.shippingCost,
      totalSum: vm.totalCartSum,
      deliveryOption: vm.orderStore.deliveryOptions.find(i => i.type === deliveryOption),
      paymentMethod: vm.orderStore.paymentMethods.find(i => i.type === paymentMethod),
    } as IOrder;

    const status = await vm.orderStore.addOrder(order);
    if (status === OrderCreateStatusEnum.Success) {
      vm.cartStore.deleteCart().then();
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          { name: 'Order', params: { order: vm.orderStore.lastOrder } },
        ],
      });
      const newEvent = eventCreator({ ...getEventData(), eventType: EventTypeEnum.CreateOrder });
      if (!!newEvent) {
        vm.eventStore.addEvent(newEvent).then();
      }
    }
  }, [paymentMethod, deliveryOption, vm.user?.name, vm.user?.phone, vm.user?.address]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const goToProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);
  const onSetDeliveryOption = useCallback((type: DeliveryOptionsEnum) => setDeliveryOption(type), [vm.deliveryOptions]);
  const onSetPaymentMethod = useCallback((type: PaymentMethodsEnum) => setPaymentMethod(type), [vm.paymentMethods]);

  return (
    <Screen isError={vm.isError} onRefresh={vm.onRefresh}>
      <Row ph={16}>
        <ButtonUI title={'Назад'} height={40} radius={20} alignItems={'flex-start'} onPress={goBack} />
      </Row>
      <Row centerContent>
        <TextUI size={'bigTitle'} text={'Создать заказ'} ph={36} />
      </Row>
      <Col flex>
        <ScrollViewUI flex pv={8} overflow={'hidden'} bg={color.bgAdditional} borderColor={color.bgAdditional}>
          <TouchableOpacityUI onPress={goToProfile}>
            <Col bg={color.bgAdditionalTwo} borderColor={color.bgAdditionalTwo} mb={10} pt={4} pb={2}>
              <Row justifyContent={'space-between'} {...styles.row}>
                <TextUI size={'large'} style={{ color: userNameColor }} text={'Имя'} />
                <TextUI size={'medium'} numberOfLines={1} maxWidth={'70%'} alignSelf={'flex-end'} text={vm.user?.name} />
              </Row>
              <Row justifyContent={'space-between'} {...styles.row}>
                <TextUI size={'large'} style={{ color: userPhoneColor }} text={'Телефон'} />
                <TextUI
                  size={'medium'} numberOfLines={1} maxWidth={'70%'} alignSelf={'flex-end'}
                  style={{ color: userPhoneValueColor }} text={vm.user?.phone} />
              </Row>
              <Row justifyContent={'space-between'} {...styles.row}>
                <TextUI size={'large'} style={{ color: userAddressColor }} text={'Адрес'} />
                <TextUI size={'medium'} numberOfLines={1} maxWidth={'70%'} alignSelf={'flex-end'} text={vm.user?.address} />
              </Row>
            </Col>
          </TouchableOpacityUI>

          <Col mb={10}>
            {vm.cart?.map(OrderCartItem)}
          </Col>

          <Col bg={color.bgAdditionalTwo} borderColor={color.bgAdditionalTwo} mb={10} pt={4} pb={2}>
            <Row justifyContent={'space-between'} {...styles.row}>
              <TextUI size={'large'} text={'Стоимость доставки'} />
              <TextUI size={'medium'} text={`${SettingsVars.shippingCost} ₽`} />
            </Row>
          </Col>

          <Col bg={color.bgAdditionalTwo} borderColor={color.bgAdditionalTwo} mb={10} pt={4} pb={2}>
            <Row {...styles.row} justifyContent={'center'} mb={12}>
              <TextUI size={'large'} text={'Доставка'} />
            </Row>
            <Row justifyContent={'space-around'}>
              {vm.deliveryOptions.map(i => {
                const isSelected = i.type === deliveryOption;

                return (
                  <Chip key={`_${i.type}`} isSelected={isSelected} context={i.type} onPress={onSetDeliveryOption}>
                    <Chip.Text text={i.title} />
                  </Chip>
                );
              })}
            </Row>
          </Col>

          <Col bg={color.bgAdditionalTwo} borderColor={color.bgAdditionalTwo} mb={10} pt={4} pb={2}>
            <Row {... styles.row} justifyContent={'center'} mb={12}>
              <TextUI size={'large'} text={'Оплата'} />
            </Row>
            <Row justifyContent={'space-around'}>
              {vm.paymentMethods.map(i => {
                const isSelected = i.type === paymentMethod;

                return (
                  <Chip key={`_${i.type}`} isSelected={isSelected} onPress={onSetPaymentMethod} context={i.type}>
                    <Chip.Text text={i.title} />
                  </Chip>
                );
              })}
            </Row>
          </Col>

          <Col bg={color.bgAdditionalTwo} borderColor={color.bgAdditionalTwo}>
            <Row justifyContent={'flex-end'} pa={12}>
              <TextUI size={'title'} style={{ color: color.textGreen }} text={vm.totalCartSumFormatted} />
            </Row>
            <Row justifyContent={'center'}>
              {isUserProfileError && (
                <TextUI size={'medium'} text={isUserProfileErrorText} style={{ color: color.textRed }} />
              )}
            </Row>
            <Row alignItems={'center'} height={80} justifyContent={'center'}>
              <ButtonUI
                title={'Подтвердить'} width={'50%'}
                disabled={isUserProfileError} onPress={onPressConfirm} />
            </Row>
          </Col>

        </ScrollViewUI>
      </Col>
    </Screen>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
