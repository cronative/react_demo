import moment from 'moment';
import {Container, Title} from 'native-base';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {DownArrow} from '../components/icons';
import {BookingRescheduleCalenderModal} from '../components/modal';
import {
  userbookingRescheduleRequest,
  userbookingRescheduleRequestClear,
} from '../store/actions/bookingAction';
const {width, height} = Dimensions.get('window');

const timeDiff = (bookingData) => {
  const startTime = moment(`${bookingData?.date}T${bookingData?.time}.000Z`);
  return `${
    bookingData?.duration % 60 > 30 || bookingData?.duration % 60 === 0
      ? Math.round(bookingData?.duration / 60) + 'h'
      : Math.floor(bookingData?.duration / 60) + 'h 30m'
  } . ${startTime.format('h:mm a')} - ${startTime
    .add(bookingData.duration, 'minutes')
    .format('h:mm a')}`;
};
const BookingsReschedule = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);
  const [serviceDescription, setServiceDescription] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const bookingData =
    route.params?.bookingData ||
    useSelector((state) => state.bookingReducer.userBookingDetails)?.data;
  const service = bookingData?.ReservedServiceMeta;
  const pro = bookingData?.ProMeta;
  const [selectedStartDate, setSelectedStartDate] = useState(bookingData?.date);
  const [selectedStartTime, setSelectedStartTime] = useState(bookingData?.time);
  const bookingRescheduleData = useSelector(
    (state) => state.bookingReducer.userBookingRescheduleDetails,
  );
  const loderStatus = useSelector((state) => state.bookingReducer.loader);

  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );

  // This method will call on Modal show hide.
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // This function will call after click on reschedule the booking
  const setDateAndTime = (startDate, startTime) => {
    let selectedDate = moment(
      `${startDate} ${startTime}`,
      'YYYY-MM-DD HH:mm:ss',
    ).utc();
    setSelectedStartDate(selectedDate.format('YYYY-MM-DD'));
    setSelectedStartTime(selectedDate.format('HH:mm:ss'));
    setVisibleModal(null);
  };

  const bookingReschedule = () => {
    if (
      professionalProfileDetailsData?.subscriptionData?.isExpire === 2 &&
      !!professionalProfileDetailsData?.subscriptionData?.expirationDate
    ) {
      let gracePeriodDate = new Date(
        professionalProfileDetailsData?.subscriptionData?.expirationDate,
      );
      const gracePeriodDays = Number(
        professionalProfileDetailsData?.subscriptionData?.gracePeriod,
      );
      gracePeriodDate.setDate(gracePeriodDate.getDate() + gracePeriodDays);

      if (
        new Date(`${selectedStartDate}T${selectedStartTime}.000Z`) >
        gracePeriodDate
      ) {
        Alert.alert("Can't reschedule after expiry of pro's grace period");
        return;
      }
    }
    let obj = {
      reservationId: bookingData?.id?.toString(),
      date: selectedStartDate,
      time: selectedStartTime,
      commentByCustomer: serviceDescription,
    };

    dispatch(userbookingRescheduleRequest(obj));
  };

  // This function is for handle the response of reschedule booking
  useEffect(() => {
    if (bookingRescheduleData !== null && bookingRescheduleData.status == 200) {
      dispatch(userbookingRescheduleRequestClear());
      global.showToast(bookingRescheduleData.message, 'success');
      setTimeout(() => {
        navigation.navigate('BookingsUpcomingInner', {
          bookingId: service?.id.toString(),
          fromNotificationList: false,
        });
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1500);
    } else if (bookingRescheduleData && bookingRescheduleData.status != 200) {
      if (
        bookingRescheduleData.response.data.message !== null &&
        bookingRescheduleData.response.data.message !== ''
      ) {
        global.showToast(bookingRescheduleData.response.data.message, 'error');
        dispatch(userbookingRescheduleRequestClear());
      }
    }
  }, [bookingRescheduleData]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.categoriseListWrap, commonStyle.mt2]}>
            <View style={[commonStyle.setupCardBox]}>
              <View>
                <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                  {service.name}
                </Text>
                <View style={[commonStyle.searchBarText, commonStyle.mb1]}>
                  <Text style={[commonStyle.grayText16, {marginRight: 4}]}>
                    {timeDiff(bookingData)}
                  </Text>
                </View>
                <View
                  style={[
                    commonStyle.bookingdatewrap,
                    commonStyle.mb05,
                    commonStyle.mt2,
                  ]}>
                  <Text style={commonStyle.blackTextR} numberOfLines={1}>
                    Total
                  </Text>
                  <Text
                    style={[commonStyle.blackText16, commonStyle.colorOrange]}>
                    ${bookingData.amount}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[commonStyle.horizontalPadd, commonStyle.mtb10]}>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Select date and time
                </Text>
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    setVisibleModal('RescheduleDateTimeDialog');
                  }}>
                  <View style={[commonStyle.searchBarText]}>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      {selectedStartDate !== null && selectedStartTime !== null
                        ? moment(
                            selectedStartDate +
                              'T' +
                              selectedStartTime +
                              '.000Z',
                          ).format('Do MMM h:mm a')
                        : 'Select Date & Time'}
                    </Text>
                  </View>
                  <DownArrow />
                </TouchableOpacity>
              </View>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Description (it’s optional)
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isServiceDescriptionFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsServiceDescriptionFocus(true)}
                  onChangeText={(text) => setServiceDescription(text)}
                  returnKeyType="done"
                  keyboardType="email-address"
                  autoCapitalize={'none'}
                  multiline={true}
                  numberOfLines={7}
                  maxLength={500}
                  value={serviceDescription}
                  blurOnSubmit={true}
                  onSubmitEditing={(e) => {
                    console.log('On Submit Editing');
                    e.target.blur();
                  }}
                />
                <Text style={commonStyle.textlength}>
                  {!!serviceDescription ? serviceDescription.length : 0}/500
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Reschelule"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={bookingReschedule}
            />
          </View>
        </View>
      </Container>

      {/* Booking Cancel modal start */}
      <Modal
        isVisible={visibleModal === 'BookingCancelDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <View style={commonStyle.modalContent}>
              <View
                style={[
                  commonStyle.dialogheadingbg,
                  {borderBottomWidth: 0, paddingBottom: 0},
                ]}>
                <Text
                  style={[
                    commonStyle.modalforgotheading,
                    commonStyle.textCenter,
                  ]}>
                  Are you sure you want to cancel your booking?
                </Text>
              </View>
              {/* <View style={commonStyle.mt3}>
                        <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>You will not be charged</Text>
                      </View> */}
              <View style={commonStyle.mt3}>
                <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                  Due to the late cancellation, you’ll lose your deposit of 20%
                  from the services value ($80)
                </Text>
              </View>
              <TouchableOpacity
                style={[commonStyle.termswrap, commonStyle.mt2]}>
                <Text style={commonStyle.grayText16}>
                  See the{' '}
                  <Title style={commonStyle.textorange}>
                    Cancellation policy
                  </Title>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Cancel booking"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => setVisibleModal({visibleModal: null})}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Keep booking"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={[
                    commonStyle.buttonStylehalf,
                    commonStyle.lightorang,
                  ]}
                  titleStyle={[
                    commonStyle.buttontitleStyle,
                    commonStyle.colorOrange,
                  ]}
                  onPress={() => setVisibleModal({visibleModal: null})}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Booking Cancel modal end */}

      {/* Booking Reschedule Date & Time modal start */}
      <Modal
        isVisible={visibleModal === 'RescheduleDateTimeDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <BookingRescheduleCalenderModal
              rescheduleBooking={setDateAndTime}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Booking Reschedule Date & Time modal end */}
    </Fragment>
  );
};

export default BookingsReschedule;
