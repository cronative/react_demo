// import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {Body, Container, Left, List, ListItem, Right} from 'native-base';
import React, {Fragment, useEffect, useRef, useState, useCallback} from 'react';
import {getCurrentCountryCode} from '../utility/commonService';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Button} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import PhoneInput from 'react-native-phone-number-input';
import {useDispatch, useSelector} from 'react-redux';
import {Get, Post} from '../api/apiAgent';
import commonStyle, {Colors} from '../assets/css/mainStyle';
import global from '../components/commonservices/toast';
import {
  CheckedBox,
  CloseIcon,
  DownArrow,
  UncheckedBox,
} from '../components/icons';
import {
  AddBookingServicesModal,
  BookingSelectClientModal,
} from '../components/modal';
import {
  clientsListRequest,
  professionalProfileDetailsRequest,
  profileViewRequest,
} from '../store/actions';
import {getSlotsRequest} from '../store/actions/bookingAction';
import {formattedServiceDuration, intervalInMinutes} from '../utility/booking';
import CalendarModal from './ServiceBookingList/CalendarModal';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import {
  checkGracePeriodExpiry,
  fetchGracePeriodData,
} from '../utility/fetchGracePeriodData';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const NewWalkInBooking = (props) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isNewClientChecked, setIsNewClientChecked] = useState(false);
  const [isRecurringBookingChecked, setIsRecurringBookingChecked] =
    useState(false);

  const [isClientNameFocus, setIsClientNameFocus] = useState(false);
  const [clientName, setClientName] = useState('');

  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [isClientMobileFocus, setIsClientMobileFocus] = useState('');
  const phoneInput = useRef('');

  const [isClientEmailFocus, setIsClientEmailFocus] = useState(false);
  const [clientemail, setClientEmail] = useState('');
  const [type, setType] = useState('');
  const [isnotesFocus, setIsNotesFocus] = useState(false);
  const [notes, setNotes] = useState('');

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const [servicesData, setServiceData] = useState(null);
  const [selectedServices, setServices] = useState([]);
  const [proClient, setClientId] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const scrollViewRef = useRef(0);
  const [loader, setLoader] = useState(false);
  const [date, setDate] = useState(null);
  const clientList = useSelector((state) => state.clientsListReducer.details);
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  )?.data;
  const slots = useSelector((state) => state.bookingReducer.slots);
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );

  // const { preSelected, selectedUser } = props.route.params;
  const [preSelected, setPreSelected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [isReschedule, setIsReschedule] = useState(false);
  const [notifyImg, setNotifyImg] = useState(true);
  const [subscriptionPlanStatus, setSubscriptionPlanStatus] = useState(null);
  const [graceExpirationDate, setGraceExpirationDate] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    console.log('profile data: ', professionalProfileDetailsData);
  }, [professionalProfileDetailsData]);

  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const determineGracePeriodStatus = async () => {
    // 0 = pla active, 1 = everything expired (main plan + grace), 2 = in grace period
    const response = await fetchGracePeriodData();
    if (response.subscriptionStatus === 1) {
      setSubscriptionPlanStatus(1);
    } else if (
      response.subscriptionStatus === 2 &&
      response?.gracePeriodExpiryDate
    ) {
      console.log('GRACE PERIOD: ', response);
      setSubscriptionPlanStatus(2);
      setGraceExpirationDate(response.gracePeriodExpiryDate);
    } else {
      setSubscriptionPlanStatus(0);
      setType(response.type);
    }
    if (response.subscriptionStatus === 0 && response.type === 2)
      setNotifyImg(false);
  };

  const getServiceDetails = () => {
    // setLoader(true);
    Get('pro/services', '')
      .then((result) => {
        if (result.status === 200 && result.data && result.data.count) {
          console.log('services result', result);
          setServiceData(result.data);
        }
      })
      .catch((error) => {
        console.log('error', error);
        // getMainCategory();
      });
  };

  useEffect(() => {
    if (
      props?.route?.params?.preSelected &&
      props?.route?.params?.selectedUser
    ) {
      setPreSelected(props.route.params.preSelected);
      setSelectedUser(props.route.params.selectedUser);
    }

    if (props?.route?.params?.preSelected && props?.route?.params?.serviceId) {
      setServiceId(props?.route?.params?.serviceId);
      if (!!props?.route?.params?.isReschedule) {
        setIsReschedule(true);
      }
    }

    getServiceDetails();
    determineGracePeriodStatus();
  }, []);

  useEffect(() => {
    if (preSelected && selectedUser && clientList?.rows?.length) {
      setClientId(clientList.rows.find((client) => client.id == selectedUser));
    }
  }, [clientList, preSelected]);

  useEffect(() => {
    if (!!servicesData && !!serviceId) {
      servicesData.rows.forEach((category) => {
        let serviceIndex = category.Services.findIndex(
          (m) => m.id == serviceId,
        );
        if (serviceIndex != -1) {
          setCurrentService(category.Services[serviceIndex]);
          setServices([category.Services[serviceIndex]]);
          return;
        }
      });
    }
  }, [servicesData, serviceId]);

  useEffect(() => {
    dispatch(profileViewRequest());
    dispatch(clientsListRequest({listType: 'contacts'}));
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      dispatch(professionalProfileDetailsRequest({proId: profileData?.id}));
      dispatch(getSlotsRequest({proId: profileData?.id}));
    }
  }, [dispatch, profileData]);
  /**
   * =======================.
   */

  const onSelectClient = (client) => {
    setClientId(client);
    setVisibleModal(null);
  };

  /**
   * This method will call on Current Location Select.
   */
  const newClientSelectHelper = () => {
    setIsNewClientChecked(!isNewClientChecked);
  };

  const setServicesClient = (service) => {
    setVisibleModal(null);
    if (selectedServices.findIndex((s) => s.id === service.id) == -1) {
      setCurrentService(service);
      setServices([...selectedServices, service]);
      setTimeout(() => {
        setVisibleModal('CalendarModal');
      }, 1200);
    } else {
      setServices(selectedServices.filter((s) => service.id !== s.id));
    }
  };

  const onOpenCalendar = (service) => {
    setCurrentService(service);
    setVisibleModal('CalendarModal');
  };

  /**
   * This method will call on Current Location Select.
   */
  const recurringBookingHelper = () => {
    setIsRecurringBookingChecked(!isRecurringBookingChecked);
  };

  const onAddNewBooking = () => {
    if (!isNewClientChecked && !proClient) {
      global.showToast('Please select or add a walk-in client', 'error');
      return false;
    } else if (isNewClientChecked && clientName === '') {
      global.showToast('Please fill the required client details', 'error');
      return false;
    }

    if (selectedServices.findIndex((service) => !service?.timeSlot) != -1) {
      global.showToast('One or more services missing date and time', 'error');
      return false;
    }

    console.log('After Grace Period', graceExpirationDate);

    if (subscriptionPlanStatus === 2 && graceExpirationDate) {
      if (
        selectedServices.findIndex((service) =>
          moment(service.timeSlot).utc().isAfter(moment(graceExpirationDate)),
        ) != -1
      ) {
        console.log('After Grace Period', graceExpirationDate);
        global.showToast(
          "Can't place a walkin booking after expiry of grace period",
          'error',
        );
        return false;
      }
    }

    if (!isReschedule) {
      let newObj = isNewClientChecked
        ? {
            client: {
              name: clientName,
              email: clientemail,
              phone: value,
              countryCode:
                !value || value == ''
                  ? ''
                  : `+${phoneInput.current.getCallingCode()}`,
            },
          }
        : {proContactId: proClient.id};

      newObj = {
        ...newObj,
        note: notes,
        services: selectedServices.map((service) => ({
          serviceId: service.id,
          //date: service.timeSlot.format('YYYY-MM-DD'),
          duration: intervalInMinutes(service, service),
          startTime: moment(service.timeSlot).utc().format(),
        })),
        notification: isEnabled,
      };

      setLoader(true);
      Post('/pro/client-walkin', newObj)
        .then((result) => {
          // setClientEmail('');
          // setClientId(null);
          // setClientName('');
          // setValue('');
          // setServices([]);
          // setIsNewClientChecked(false);
          // setNotes('');
          // console.log('NEW BOOKING DETAILS: ', result);
          setLoader(false);
          global.showToast('New walk-in booking added', 'success');
          props.navigation.goBack();
          // dispatch(getSlotsRequest({proId: profileData?.id}));
        })
        .catch((error) => {
          setLoader(false);
          console.log('error', error);
          global.showToast(
            error?.response?.data?.message
              ? error?.response?.data?.message
              : 'Walkin booking cannot be added',
            'error',
          );
        });
    } else {
      setLoader(true);
      Post(
        `/pro/reschedule-walkin-booking/${props.route.params.rescheduleId}`,
        {
          blockFrom: moment(selectedServices[0].timeSlot).utc().format(),
          blockTo: moment(selectedServices[0].timeSlot)
            .add(
              intervalInMinutes(selectedServices[0], selectedServices[0], true),
              'minutes',
            )
            .utc()
            .format(),
        },
      )
        .then((response) => {
          setLoader(false);
          global.showToast('Booking rescheduled successfully', 'success');
          props.navigation.goBack();
        })
        .catch((error) => {
          console.log('error', error);
          setLoader(false);
          global.showToast(
            error?.response?.data?.message
              ? error?.response?.data?.message
              : 'Reschedule booking failed',
            'error',
          );
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkGracePeriodExpiry()
        .then((isGracePeriodExpired) => {
          console.log('result found: ', isGracePeriodExpired);
          if (isGracePeriodExpired) {
            navigation.navigate('TrialFinished');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, []),
  );

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox, commonStyle.mt1]}>
              <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                Client
              </Text>
              <View style={commonStyle.mb15}>
                <Text
                  style={[
                    commonStyle.texttimeblack,
                    commonStyle.mb15,
                    isNewClientChecked && {color: Colors.textgray},
                  ]}>
                  Client’s name
                </Text>
                {preSelected ? (
                  <Text
                    style={[
                      commonStyle.grayText16,
                      commonStyle.dropdownselectmodal,
                    ]}>
                    {!proClient ? 'Select walk-in client' : proClient?.name}
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={commonStyle.dropdownselectmodal}
                    onPress={() => {
                      setVisibleModal('BookingsSelectClientDialog');
                    }}>
                    <Text
                      style={[
                        commonStyle.grayText16,
                        !!proClient &&
                          !isNewClientChecked && {color: Colors.theamblack},
                      ]}>
                      {!proClient ? 'Select walk-in client' : proClient?.name}
                    </Text>
                    <DownArrow />
                  </TouchableOpacity>
                )}
              </View>
              {!preSelected ? (
                <View style={commonStyle.mb2}>
                  <View style={[commonStyle.newclientwrap]}>
                    <CheckBox
                      style={{paddingVertical: 10}}
                      onClick={() => newClientSelectHelper()}
                      isChecked={isNewClientChecked}
                      checkedCheckBoxColor={'#ff5f22'}
                      uncheckedCheckBoxColor={'#e6e7e8'}
                      rightText={'New client'}
                      rightTextStyle={commonStyle.blackTextR}
                      checkedImage={<CheckedBox />}
                      unCheckedImage={<UncheckedBox />}
                    />
                    {isNewClientChecked == 1 ? (
                      <View style={[commonStyle.mt1]}>
                        <View style={[commonStyle.mb2]}>
                          <Text
                            style={[
                              commonStyle.texttimeblack,
                              commonStyle.mb15,
                            ]}>
                            Client’s name
                          </Text>
                          <TextInput
                            style={[
                              commonStyle.textInput,
                              isClientNameFocus && commonStyle.focusinput,
                            ]}
                            onFocus={() => setIsClientNameFocus(true)}
                            onChangeText={(text) => setClientName(text)}
                            onBlur={() => setIsClientNameFocus(false)}
                            returnKeyType="done"
                            keyboardType="default"
                            autoCapitalize={'none'}
                            placeholder="Enter client’s name"
                            placeholderTextColor={'#939DAA'}
                            value={clientName}
                          />
                        </View>
                        <View style={[commonStyle.mb2]}>
                          <Text
                            style={[
                              commonStyle.texttimeblack,
                              commonStyle.mb15,
                            ]}>
                            Add phone to save client profile (optional)
                          </Text>
                          <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}
                            defaultCode={'US'}
                            layout="first"
                            placeholder={'XXXX XXX XXX'}
                            placeholderTextColor={'#939DAA'}
                            onChangeText={(text) => {
                              setValue(text);
                            }}
                            onChangeFormattedText={(text) => {
                              setFormattedValue(text);
                            }}
                            withDarkTheme={false}
                            withShadow={false}
                            autoFocus={false}
                            containerStyle={[
                              commonStyle.phonecontainerBorder,
                              isClientMobileFocus &&
                                commonStyle.phonecontainerBorderFocus,
                            ]}
                            textContainerStyle={
                              commonStyle.phonetextContainerStyle
                            }
                            textInputStyle={commonStyle.phonetextInputStyle}
                            codeTextStyle={commonStyle.phonecodeTextStyle}
                            flagButtonStyle={commonStyle.phoneflagButtonStyle}
                            countryPickerButtonStyle={
                              commonStyle.phonecountryPickerButtonStyle
                            }
                            value={value}
                            textInputProps={{
                              onFocus: () => setIsClientMobileFocus(true),
                              onBlur: () => setIsClientMobileFocus(false),
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              commonStyle.texttimeblack,
                              commonStyle.mb15,
                            ]}>
                            Client’s email (optional)
                          </Text>
                          <TextInput
                            style={[
                              commonStyle.textInput,
                              isClientEmailFocus && commonStyle.focusinput,
                            ]}
                            onFocus={() => setIsClientEmailFocus(true)}
                            onChangeText={(text) => setClientEmail(text)}
                            onBlur={() => setIsClientEmailFocus(false)}
                            returnKeyType="done"
                            keyboardType="email-address"
                            autoCapitalize={'none'}
                            placeholder="Email"
                            placeholderTextColor={'#939DAA'}
                            value={clientemail}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
              {!isReschedule && (
                <View>
                  <List style={[commonStyle.switchAccountWrap]}>
                    <ListItem
                      style={[
                        commonStyle.switchAccountView,
                        {
                          borderTopWidth: 1,
                          borderTopColor: '#dcdcdc',
                          paddingTop: 15,
                        },
                      ]}>
                      <Left>
                        <Text style={commonStyle.blackTextR}>
                          SMS notifications
                        </Text>
                      </Left>
                      <Right>
                        <Switch
                          disabled={notifyImg ? true : false}
                          trackColor={{false: '#939DAA', true: '#F36A46'}}
                          thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                        />
                      </Right>
                    </ListItem>
                  </List>
                </View>
              )}
              {notifyImg ? (
                <List style={[commonStyle.payinCashinfowrap, commonStyle.mt1]}>
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
                          SMS reminders for your clients are only available for
                          Pro users - upgrade your subscription.
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List>
              ) : null}
            </View>
            <View style={[commonStyle.setupCardBox]}>
              <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
                Service
              </Text>

              <View
                style={[
                  commonStyle.mb2,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: '#dcdcdc',
                    paddingBottom: 25,
                  },
                ]}>
                {selectedServices.length === 0 && !isReschedule && (
                  <TouchableOpacity
                    style={[commonStyle.modalcancle, {elevation: 5}]}
                    activeOpacity={0.5}
                    onPress={() => {
                      setVisibleModal('AddBookingServicesDialog');
                    }}>
                    <Text style={commonStyle.outlinetitleStyle}>
                      + Add service
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {selectedServices.length > 0 && (
                <View
                  style={[commonStyle.setupCardBox, {paddingHorizontal: 0}]}>
                  {selectedServices.length > 0 &&
                    selectedServices.map((service) => (
                      <List
                        key={service.id}
                        style={[
                          commonStyle.setupserviceList,
                          {paddingHorizontal: 20},
                        ]}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          <View style={commonStyle.serviceListtouch}>
                            <Left
                              style={{
                                alignSelf: 'flex-start',
                                marginTop: 7,
                                marginRight: 15,
                              }}>
                              <Text
                                style={[
                                  commonStyle.dotLarge,
                                  {
                                    backgroundColor: service.categoryColor,
                                    marginLeft: 0,
                                    marginRight: 0,
                                  },
                                ]}>
                                .
                              </Text>
                            </Left>
                            <Body style={commonStyle.categoriseListBody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb05,
                                ]}
                                numberOfLines={1}>
                                {service.name}
                              </Text>
                              <View style={commonStyle.searchBarText}>
                                <Text
                                  style={[
                                    commonStyle.grayText16,
                                    {marginRight: 4},
                                  ]}>
                                  {formattedServiceDuration(service)}
                                </Text>
                                <Text
                                  style={[
                                    commonStyle.dotSmall,
                                    {opacity: 0.4},
                                  ]}>
                                  .
                                </Text>
                                <Text
                                  style={[
                                    commonStyle.grayText16,
                                    {marginLeft: 4},
                                  ]}>
                                  ${service.amount}
                                </Text>
                              </View>

                              <View>
                                <TouchableOpacity
                                  style={[
                                    commonStyle.dropdownselectmodal,
                                    {marginTop: 10},
                                  ]}
                                  onPress={() => onOpenCalendar(service)}
                                  activeOpacity={1}>
                                  {/* <View style={[commonStyle.searchBarText]}>
                                    <Text style={commonStyle.grayText16}>Date and Time</Text>
                                  </View> */}
                                  {!!service?.timeSlot ? (
                                    <View style={[commonStyle.searchBarText]}>
                                      <Text
                                        style={[
                                          commonStyle.blackTextR,
                                          {marginLeft: 4},
                                        ]}>
                                        {service?.timeSlot?.format('D MMM')}
                                      </Text>
                                      <Text style={commonStyle.dotSmall}>
                                        .
                                      </Text>
                                      <Text
                                        style={[
                                          commonStyle.blackTextR,
                                          {marginLeft: 4},
                                        ]}>
                                        {service?.timeSlot?.format('h:mm a')} -{' '}
                                        {service?.timeSlot
                                          ?.clone()
                                          .add(
                                            intervalInMinutes(
                                              service,
                                              service,
                                              false,
                                            ),
                                            'minutes',
                                          )
                                          .format('h:mm a')}
                                      </Text>
                                    </View>
                                  ) : (
                                    <Text style={commonStyle.grayText16}>
                                      Select a Date and Time
                                    </Text>
                                  )}
                                  <DownArrow />
                                </TouchableOpacity>
                              </View>
                            </Body>
                            {!isReschedule && (
                              <View style={{alignSelf: 'flex-start'}}>
                                <TouchableOpacity
                                  style={commonStyle.moreInfoCircle}
                                  onPress={() => setServicesClient(service)}>
                                  <CloseIcon />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </ListItem>
                      </List>
                    ))}
                  {!isReschedule && (
                    <TouchableOpacity
                      style={commonStyle.bookingdateselectmodal}
                      activeOpacity={0.5}
                      onPress={() =>
                        setVisibleModal('AddBookingServicesDialog')
                      }>
                      <Text style={commonStyle.outlinetitleStyle}>
                        + Add service
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* <View style={commonStyle.mb1}>
                <CheckBox
                  style={{paddingVertical: 10}}
                  onClick={() => recurringBookingHelper()}
                  isChecked={isRecurringBookingChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  rightText={'Recurring booking'}
                  rightTextStyle={commonStyle.blackTextR}
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                />
              </View> */}
            </View>
            {!isReschedule && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                  Notes
                </Text>
                <View style={[commonStyle.mb2]}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    Internal note (viewable by stuff only)
                  </Text>
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isnotesFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setIsNotesFocus(true)}
                    onChangeText={(text) => setNotes(text)}
                    value={notes}
                    onBlur={() => setIsNotesFocus(false)}
                    returnKeyType="done"
                    keyboardType="default"
                    autoCapitalize={'none'}
                  />
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title={!isReschedule ? 'Add new booking' : 'Reschedule Booking'}
              loading={loader}
              disabled={selectedServices.length === 0}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={onAddNewBooking}
            />
          </View>
        </View>
      </Container>
      {/* Bookings Select Client modal start */}
      <Modal
        isVisible={visibleModal === 'BookingsSelectClientDialog'}
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
            <BookingSelectClientModal
              setClientId={setClientId}
              setVisibleModal={setVisibleModal}
              onSelectClient={onSelectClient}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Bookings Select Client modal end */}

      {/* Bookings Select Service modal start */}
      <Modal
        isVisible={visibleModal === 'AddBookingServicesDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
            onPress={() => setVisibleModal(null)}>
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
            {!!professionalProfileDetailsData ? (
              <AddBookingServicesModal
                servicesData={servicesData}
                selectedServices={selectedServices}
                setServices={setServicesClient}
                setVisibleModal={setVisibleModal}
              />
            ) : (
              <ActivityLoaderSolid height={200} />
            )}
          </ScrollView>

          {/* <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Add service"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View> */}
        </View>
      </Modal>
      {/* Bookings Select Service modal end */}

      {/* {currentService && (
        <CalendarModal
          setVisible={setVisibleModal}
          isVisible={visibleModal === 'CalendarModal'}
          service={currentService}
          selectedServices={selectedServices}
          setServices={setServices}
          walkin={true}
        />
      )} */}
      <CalendarModal
        setVisible={setVisibleModal}
        isVisible={visibleModal === 'CalendarModal'}
        date={date}
        setDate={setDate}
        service={currentService}
        selectedServices={selectedServices}
        setServices={setServices}
        sessionAvailibilities={[]}
        setGroupSessionId={() => {
          console.log('Group Session');
        }}
        walkin={true}
      />
    </Fragment>
  );
};

export default NewWalkInBooking;
