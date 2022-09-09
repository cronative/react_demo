import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {Post} from '../api/apiAgent';
import commonStyle from '../assets/css/mainStyle';
import global from '../components/commonservices/toast';
import {
  CheckedBox,
  EditIcon,
  RightAngle,
  UncheckedBox,
} from '../components/icons';
import {ChoosePaymentMethodModal} from '../components/modal';
import ServiceItem from '../components/ServiceItem';
import {bookServiceRequest, listCardRequest} from '../store/actions';
import {
  preDepositAmount,
  selectCardType,
  totalAmount,
} from '../utility/booking';

const {width, height} = Dimensions.get('window');

const BookingFlowConfirmBooking = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const proMetaInfo = professionalProfileDetailsData?.ProMetas?.[0];
  const [visibleModal, setVisibleModal] = useState(false);
  const [date, setDate] = useState('');
  const [selectedServices, setServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(2);
  const [comment, setComment] = useState('');
  const [tnc, setTncAgreed] = useState(false);
  const cardsList = useSelector(
    (state) => state.profileReducer.listCardData,
  )?.data;
  const [cardData, setCardData] = useState({});
  const [isBooking, setBooking] = useState(false);
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const bookingLoaderStatus = useSelector(
    (state) => state.bookingReducer.loader,
  );
  const bookingError = useSelector((state) => state.bookingReducer.error);
  const {groupSessionId, comment: sessionComment} = route.params || {};

  useEffect(() => {
    AsyncStorage.getItem('cartData').then((cartData) => {
      let prevSelectedServices;

      if (cartData) {
        cartData = JSON.parse(cartData);
        prevSelectedServices = cartData?.selectedServices.map((s) => ({
          ...s,
          timeSlot: moment(s.timeSlot),
        }));
      }

      setServices(prevSelectedServices);
      setDate(moment(cartData.date));
      setComment(cartData.comment);
    });
  }, []);

  useEffect(() => {
    // if (dispatch) dispatch({ type: 'SET_BOOKING_EDIT', payload: false });

    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch({type: 'SET_BOOKING_EDIT', payload: true});
        navigation.goBack();
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, [dispatch]);

  // useEffect(() => {
  //   if (dispatch && isFocused) {
  //     setTimeout(( ) => {
  //       dispatch({ type: 'SET_BOOKING_EDIT', payload: false });
  //     }, 3000);
  //   }
  // }, [dispatch, isFocused]);

  useEffect(() => {
    if (cardsList && Array.isArray(cardsList)) {
      setCardData(cardsList.find((card) => card.isDefault));
    }
  }, [cardsList]);

  useEffect(() => {
    dispatch(listCardRequest());
  }, [dispatch, visibleModal]);

  useEffect(() => {
    if (isBooking) {
      if (!bookingLoaderStatus && !bookingError) {
        navigation.navigate('BookingSuccess');
        setBooking(false);
      } else if (!bookingLoaderStatus && !bookingError) {
        setBooking(false);
      }
    }
  }, [isBooking, bookingLoaderStatus, bookingError]);

  const onEditServices = () => {
    dispatch({type: 'SET_BOOKING_EDIT', payload: true});
    navigation.goBack();
  };

  const onBookService = async () => {
    if (groupSessionId) {
      const userId = await AsyncStorage.getItem('userId');

      Post('user/book-service-group', {
        groupSessionId,
        proUserId: professionalProfileDetailsData.id,
        paymentMethod: paymentMethod === 1 ? 1 : 2,
        note: sessionComment,
      })
        .then(() => {
          navigation.navigate('BookingSuccess');
        })
        .catch((error) => {
          console.log('error', error.response);
          const msg = error.response?.data?.message;
          global.showToast(msg ? msg : 'Something went wrong', 'error');
        });
      return;
    }

    dispatch(bookServiceRequest({paymentMethod: paymentMethod === 1 ? 1 : 2}));
    setBooking(true);
  };
  console.log('professionalData', professionalProfileDetailsData);
  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.horizontalPadd}>
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
                  {!!cardData?.cardType ? (
                    <View style={[commonStyle.paymentCardSelect]}>
                      <Image
                        style={commonStyle.paymentCardImg}
                        source={selectCardType(cardData?.cardType)}
                      />
                      <Text style={commonStyle.blackTextR}>
                        ****{cardData?.cardNumber?.substr(15, 4)}
                      </Text>
                    </View>
                  ) : (
                    <Text style={commonStyle.grayText16}>
                      Choose payment method
                    </Text>
                  )}
                </View>
                <TouchableHighlight>
                  <RightAngle />
                </TouchableHighlight>
              </TouchableOpacity>
            </View>

            <View style={[commonStyle.setupCardBox, {paddingHorizontal: 0}]}>
              <View style={commonStyle.bookingdateUserwrap}>
                <View style={commonStyle.bookingdatewrap}>
                  <Text style={commonStyle.blackTextR18} numberOfLines={1}>
                    {/* Start Change: Snehasish Das, Issue #1621 */}
                    {selectedServices.length !== 0 &&
                      moment(selectedServices[0].timeSlot).format(
                        'D MMMM YYYY',
                      )}
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
                      defaultSource={require('../assets/images/default-user.png')}
                      //Start Change: Snehasish Das Issue #1615
                      source={
                        !!professionalProfileDetailsData.profileImage
                          ? {
                              uri: `${professionalProfileDetailsData.profileImage}`,
                            }
                          : require('../assets/images/default-user.png')
                      }
                      //End Change: Snehasish Das Issue #1615
                    />
                  </View>
                  <Text style={commonStyle.grayText16} numberOfLines={1}>
                    {proMetaInfo?.businessName}
                  </Text>
                </View>
              </View>
              <View style={commonStyle.confirmbookpaddwrap}>
                <FlatList
                  data={selectedServices}
                  renderItem={({item}) => <ServiceItem service={item} />}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <Divider style={{marginVertical: 10}} />
                  )}
                />

                {comment !== '' && (
                  <View
                    style={[commonStyle.bookadditionaltext, commonStyle.mb2]}>
                    <Text style={commonStyle.texttimeblack}>{comment}</Text>
                  </View>
                )}
              </View>
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
                    {`$${totalAmount(selectedServices)}`}
                  </Text>
                </View>
                {!!proMetaInfo?.applyDeposite && (
                  <List style={commonStyle.payinCashinfowrap}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <View style={commonStyle.serviceListtouch}>
                        <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                          <Image
                            source={require('../assets/images/payincashicon.png')}
                            style={commonStyle.payincashimg}
                            resizeMode={'contain'}
                          />
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            Only a partial payment is due now - This booking
                            requires a deposit of{' '}
                            {preDepositAmount(
                              proMetaInfo,
                              totalAmount(selectedServices),
                            )}
                            .
                          </Text>
                        </Body>
                      </View>
                    </ListItem>
                  </List>
                )}
              </View>
            </View>

            {!!proMeta?.applyDeposite && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
                  Cancellation policies
                </Text>
                {proMeta?.cancellationHours == -1 ? (
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
                        {proMeta?.cancellationHours || 0}{' '}
                        {proMeta?.cancellationHours > 1 ? 'hours' : 'hour'}{' '}
                        ahead{' '}
                      </Title>
                      of your appointment time, after this grace period you will
                      loose your deposit. For{' '}
                      <Title style={commonStyle.blackTextR}>
                        not showing up
                      </Title>{' '}
                      you will loose your full deposit too.
                    </Text>
                  </View>
                )}
              </View>
            )}
            <View style={[commonStyle.mb3, commonStyle.mt1]}>
              <View style={(commonStyle.textalignwrap, {flexDirection: 'row'})}>
                <CheckBox
                  style={{paddingVertical: 0, marginRight: 10}}
                  onClick={() => setTncAgreed(!tnc)}
                  isChecked={tnc}
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
                    { lineHeight: 22 },
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
                      { lineHeight: 22, marginRight: 20 },
                    ]}>
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    commonStyle.grayText16,
                    commonStyle.mrsmall,
                    { lineHeight: 22, marginLeft: 35 },
                  ]}>
                  and
                </Text>
                <TouchableOpacity
                  // Start Change: Snehasish Das Issue #1638
                  onPress={() => navigation.navigate('PrivacyPolicyInExplore')}
                // End Change: Snehasish Das Issue #1638
                >
                  <Text style={[commonStyle.textorange, { lineHeight: 22 }]}>
                    Cancelation policies
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Confirm"
              disabled={!tnc}
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

      <ChoosePaymentMethodModal
        isVisible={visibleModal === 'BookingPaymentMethodDialog'}
        setVisible={setVisibleModal}
        preDeposite={preDepositAmount(
          proMetaInfo,
          totalAmount(selectedServices),
        )}
        proMetaInfo={proMetaInfo}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      {/*  Booking Flow Payment Method modal end */}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  watingTime: {
    backgroundColor: '#E9F3FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default BookingFlowConfirmBooking;
