import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {Body, Container, Left, List, ListItem, Title} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Button, Divider} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {Post} from '../../api/apiAgent';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import global from '../../components/commonservices/toast';
import {
  CheckedBox,
  EditIcon,
  RightAngle,
  UncheckedBox,
} from '../../components/icons';
import {ChoosePaymentMethodModal} from '../../components/modal';
import ServiceItem from '../../components/ServiceItem';
import {bookServiceRequest, listCardRequest} from '../../store/actions';
import {
  preDepositAmount,
  selectCardType,
  totalAmount,
  totalAmountWithTax,
} from '../../utility/booking';
import DisplaySelectedPayment from './displaySelectedPayment';
import Modal from 'react-native-modal';

const {width, height} = Dimensions.get('window');

const ConfirmBookingComponent = ({
  tncAgreed,
  setTncAgreed,
  bookingLoaderStatus,
  onBookService,
  visibleModal,
  setVisibleModal,
  proMetaInfo,
  selectedServices,
  paymentMethod,
  setPaymentMethod,
  cardData,
  setCardData,
  date,
  onEditServices,
  professionalProfileDetailsData,
  comment,
  navigation,
  cardsList,
  cartCreation,
  timerLimit,
  cartTime,
  groupSessionId,
}) => {
  const formatCartTime = (cartTime) => {
    let data = moment.duration(cartTime);
    let minutes =
      data.minutes() < 10 ? '0' + data.minutes() : data.minutes().toString();
    let seconds =
      data.seconds() < 10 ? '0' + data.seconds() : data.seconds().toString();
    return minutes + ':' + seconds;
  };

  let preDeposit = preDepositAmount(
    proMetaInfo,
    +totalAmountWithTax(selectedServices, proMetaInfo?.tax)[0],
  );

  return (
    <>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.horizontalPadd}>
            {/* Timer Secion */}
            {!groupSessionId &&
              !!cartCreation &&
              !!timerLimit &&
              cartTime !== null && (
                <View
                  style={[
                    commonStyle.choosePayment,
                    {
                      marginTop: 5,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                  ]}>
                  {cartTime > 0 ? (
                    <>
                      <Text
                        style={[
                          commonStyle.blackTextR,
                          {flexWrap: 'wrap', flex: 1},
                        ]}>
                        Your cart will expire in
                      </Text>
                      <Text style={[commonStyle.blackText16, {flexShrink: 1}]}>
                        {formatCartTime(cartTime)}
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        commonStyle.blackTextR,
                        {flexWrap: 'wrap', flex: 1},
                      ]}>
                      Your cart has expired
                    </Text>
                  )}
                </View>
              )}
            {/* Payment Selection Section */}
            <View style={commonStyle.mtb10}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Payment method
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={commonStyle.choosePayment}
                activeOpacity={0.8}
                onPress={() => {
                  setVisibleModal('BookingPaymentMethodDialog');
                }}>
                <View style={commonStyle.searchBarText}>
                  <DisplaySelectedPayment
                    cardData={cardData}
                    paymentMethod={paymentMethod}
                  />
                </View>
                <TouchableHighlight>
                  <RightAngle />
                </TouchableHighlight>
              </TouchableOpacity>
            </View>

            <View style={[commonStyle.setupCardBox, {paddingHorizontal: 0}]}>
              {/* Booking Pro Information */}
              <View style={commonStyle.bookingdateUserwrap}>
                <View style={commonStyle.bookingdatewrap}>
                  <Text style={commonStyle.blackTextR18} numberOfLines={1}>
                    {/* Start Change: Snehasish Das, Issue #1621 */}
                    {!!date && date}
                    {/* End Change: Snehasish Das, Issue #1621 */}
                  </Text>
                  <TouchableOpacity
                    style={commonStyle.moreInfoCircle}
                    onPress={onEditServices}>
                    <EditIcon />
                  </TouchableOpacity>
                </View>
                <View style={commonStyle.bookingUserwrap}>
                  <View style={commonStyle.bookingUserAvaterwrap}>
                    <Image
                      style={commonStyle.bookingUserAvaterImg}
                      defaultSource={require('../../assets/images/default-user.png')}
                      //Start Change: Snehasish Das Issue #1615
                      source={
                        !!professionalProfileDetailsData?.profileImage
                          ? {
                              uri: `${professionalProfileDetailsData?.profileImage}`,
                            }
                          : require('../../assets/images/default-user.png')
                      }
                      //End Change: Snehasish Das Issue #1615
                    />
                  </View>
                  <Text style={commonStyle.grayText16} numberOfLines={1}>
                    {proMetaInfo?.businessName}
                  </Text>
                </View>
              </View>

              {/* Booked Service List */}
              <View style={commonStyle.confirmbookpaddwrap}>
                <FlatList
                  data={selectedServices}
                  renderItem={({item}) => <ServiceItem service={item} />}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <Divider style={{marginVertical: 10}} />
                  )}
                />

                {!!comment && (
                  <View
                    style={[commonStyle.bookadditionaltext, commonStyle.mb2]}>
                    <Text style={commonStyle.texttimeblack}>{comment}</Text>
                  </View>
                )}
              </View>

              {/* Tax Section */}
              {!!parseFloat(proMetaInfo?.tax) && (
                <>
                  <View
                    style={[
                      commonStyle.confirmbookpaddwrap,
                      {paddingBottom: 20},
                    ]}>
                    <View style={styles.cardHeading}>
                      <Text style={commonStyle.blackTextR18}>Tax</Text>
                      <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                        $
                        {totalAmountWithTax(
                          selectedServices,
                          proMetaInfo?.tax,
                        )[1].toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {/* Total Amount Section */}
              <View style={commonStyle.horizontalPadd}>
                <View
                  style={[
                    commonStyle.bookingdatewrap,
                    commonStyle.mb15,
                    commonStyle.mt2,
                  ]}>
                  <Text style={commonStyle.blackTextR} numberOfLines={1}>
                    Total
                  </Text>
                  <Text
                    style={[commonStyle.blackText16, commonStyle.colorOrange]}>
                    {`$${totalAmountWithTax(
                      selectedServices,
                      proMetaInfo?.tax,
                    )[0].toFixed(2)}`}
                  </Text>
                </View>
                {!!proMetaInfo?.applyDeposite ? (
                  <List style={commonStyle.payinCashinfowrap}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <View style={commonStyle.serviceListtouch}>
                        <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                          <Image
                            source={require('../../assets/images/payincashicon.png')}
                            style={commonStyle.payincashimg}
                            resizeMode={'contain'}
                          />
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            Only a partial payment is due now - This booking
                            requires a deposit of {preDeposit}.
                          </Text>
                        </Body>
                      </View>
                    </ListItem>
                  </List>
                ) : (
                  <List style={commonStyle.payinCashinfowrap}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <View style={commonStyle.serviceListtouch}>
                        <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                          <Image
                            source={require('../../assets/images/payincashicon.png')}
                            style={commonStyle.payincashimg}
                            resizeMode={'contain'}
                          />
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            You won't be charged now, payment will be collected
                            after your booking
                          </Text>
                        </Body>
                      </View>
                    </ListItem>
                  </List>
                )}
              </View>
            </View>

            {/* Cancellation Policies */}
            {(!!proMetaInfo?.cancellationHours ||
              proMetaInfo?.cancellationHours == 0) &&
              !!proMetaInfo?.applyDeposite && (
                <View style={[commonStyle.setupCardBox]}>
                  <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
                    Cancellation policies
                  </Text>
                  {proMetaInfo?.cancellationHours == -1 ? (
                    <View>
                      <Text style={commonStyle.grayText16}>
                        Cancel for free anytime before your appointment. For{' '}
                        <Title style={commonStyle.blackTextR}>
                          not showing up
                        </Title>{' '}
                        you will loose your full deposit.
                      </Text>
                    </View>
                  ) : (
                    <View style={commonStyle.termswrap}>
                      <Text style={commonStyle.grayText16}>
                        Cancel for free up to{' '}
                        <Title style={commonStyle.blackTextR}>
                          {proMetaInfo?.cancellationHours || 0}{' '}
                          {proMetaInfo?.cancellationHours > 1
                            ? 'hours'
                            : 'hour'}{' '}
                          ahead{' '}
                        </Title>
                        of your appointment time, after this grace period you
                        will loose your deposit. For{' '}
                        <Title style={commonStyle.blackTextR}>
                          not showing up
                        </Title>{' '}
                        you will loose your full deposit too.
                      </Text>
                    </View>
                  )}
                </View>
              )}

            {/* Tax Policies */}
            {!!parseFloat(proMetaInfo?.tax) && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
                  Tax policies
                </Text>
                <View style={commonStyle.termswrap}>
                  <Text style={commonStyle.grayText16}>
                    This professional charges a{' '}
                    <Title style={commonStyle.blackTextR}>
                      {proMetaInfo?.tax}%
                    </Title>{' '}
                    tax on the total amount of all services booked.
                  </Text>
                </View>
              </View>
            )}

            {/* Other Policies */}
            {!!proMetaInfo?.otherPolicies && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
                  Other policies
                </Text>
                <View
                  style={[
                    commonStyle.termswrap,
                    {
                      alignSelf: 'flex-start',
                    },
                  ]}>
                  <HTMLView
                    value={proMetaInfo.otherPolicies}
                    textComponentProps={{style: commonStyle.grayText16}}
                  />
                </View>
              </View>
            )}

            {/* Terms and Conditions */}
            <View style={[commonStyle.mb3, commonStyle.mt1, {}]}>
              <View style={(commonStyle.textalignwrap, {flexDirection: 'row'})}>
                <CheckBox
                  style={{paddingVertical: 0, marginRight: 10}}
                  onClick={() => setTncAgreed(!tncAgreed)}
                  isChecked={tncAgreed}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  rightText={''}
                  rightTextStyle={commonStyle.blackTextR}
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                />
                <Text style={[commonStyle.grayText16]}>
                  I agree with{' '}
                  <Text
                    style={[commonStyle.textorange]}
                    onPress={() =>
                      navigation.navigate('TermsOfServiceInExplore')
                    }>
                    Terms and Conditions{' '}
                  </Text>
                  and{' '}
                  <Text
                    style={[commonStyle.textorange]}
                    onPress={() =>
                      navigation.navigate('PrivacyPolicyInExplore')
                    }>
                    Cancelation policies
                  </Text>
                </Text>

                {/* <Text
                  style={[
                    commonStyle.grayText16,
                    commonStyle.mrsmall,
                    {lineHeight: 22},
                  ]}>
                  I agree with
                </Text>
                <TouchableOpacity
                  // Start Change: Snehasish Das Issue #1638
                  onPress={() => navigation.navigate('TermsOfServiceInExplore')}
                  // End Change: Snehasish Das Issue #1638
                >
                  <Text
                    style={[
                      commonStyle.textorange,
                      commonStyle.mrsmall,
                      {lineHeight: 22, textAlign: 'center'},
                    ]}>
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    commonStyle.grayText16,
                    commonStyle.mrsmall,
                    {lineHeight: 22},
                  ]}>
                  and
                </Text>
                <TouchableOpacity
                  // Start Change: Snehasish Das Issue #1638
                  onPress={() => navigation.navigate('PrivacyPolicyInExplore')}
                  // End Change: Snehasish Das Issue #1638
                >
                  <Text style={[commonStyle.textorange, {lineHeight: 22}]}>
                    Cancelation policies
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* Submit Button */}
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Confirm"
              disabled={!tncAgreed || !paymentMethod}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              disabledStyle={commonStyle.commondisabledbuttonStyle}
              onPress={onBookService}
              loading={bookingLoaderStatus}
            />
          </View>
        </View>
      </Container>

      {/* Payment Selection Modal */}
      <ChoosePaymentMethodModal
        isVisible={visibleModal === 'BookingPaymentMethodDialog'}
        setVisible={setVisibleModal}
        preDeposite={preDeposit}
        proMetaInfo={proMetaInfo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cardData={cardData}
        setCardData={setCardData}
        cardsList={cardsList}
        navigation={navigation}
        selectedServices={selectedServices}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConfirmBookingComponent;
