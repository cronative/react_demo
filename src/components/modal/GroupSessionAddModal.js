import moment from 'moment';
import {Body, Left, List, ListItem} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-check-box';
import {Button} from 'react-native-elements';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {GroupSessionCalendarModal} from '.';
import {Delete, Get} from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import circleWarningImg from '../../assets/images/warning.png';
import {
  addGroupSessionClear,
  addGroupSessionRequest,
  editGroupSessionRequest,
} from '../../store/actions/groupSessionAction';
import {DurationTimeData, ExtraTimeData} from '../../utility/staticData';
import global from '../commonservices/toast';
import {
  CheckedBox,
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
  DownArrow,
  UncheckedBox,
} from '../icons';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export default function GroupSessionAddmodal({
  categoryInfo,
  closeModal,
  editableSession,
  fetchServices,
  businessDetails,
  scrollViewRefModal,
  handleOnScrollHandler,
  setKeyboardStatus,
}) {
  const [nameOfSessionFocus, setNameOfSessionFocus] = useState(false);
  const [durationTimeStaticData, setDurationTimeStaticData] =
    useState(DurationTimeData);
  const [isPricePerSeatFocus, setIsPricePerSeatFocus] = useState(false);
  const [numberOfSeatsFocus, setNumberOfSeatsFocus] = useState(false);
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);

  const [nameOfSession, setNameOfSession] = useState(
    editableSession.name || '',
  );
  const [isVirtualGroupChecked, setIsVirtualGroupChecked] = useState(
    editableSession.isVirtualService || false,
  );
  const [amount, setPricePerSeat] = useState(
    !!editableSession.amount ? parseInt(editableSession.amount).toString() : '',
  );
  const [loderStatus, setLoderStatus] = useState(false);
  const [noOfSeat, setNumberOfSeats] = useState(
    editableSession.noOfSeat?.toString() || 0,
  );

  const [isExtraTimeServiceChecked, setIsExtraTimeServiceChecked] = useState(
    editableSession.extraTime ? true : false,
  );
  const dispatch = useDispatch();
  const [serviceDescription, setServiceDescription] = useState(
    editableSession.description || '',
  );
  const [sessionDuration, setDuration] = useState(
    editableSession.duration || null,
  );
  const [areaCoverSelect, setAreaCoverSelectSelect] = useState(null);
  const [sessionDateTimes, setSessionDateTimes] = useState([]);
  const [newTime, setNewTime] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [extraTimeIndex, setExtraTimeIndex] = useState(null);
  const [extraTimeValue, setExtraTimeValue] = useState(
    !!editableSession.extraTimeDuration &&
      editableSession.extraTimeDuration != 0
      ? editableSession.extraTimeDuration
      : null,
  );
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [errors, setErrors] = useState({});
  const sessionLoader = useSelector((state) => state.groupSessions.loader);
  const sessionData = useSelector((state) => state.groupSessions.data);
  const [submitted, setSubmit] = useState(false);

  const [differentSessionDates, setDifferentSessionDates] = useState(null);
  const [viewBookingRedirectionId, setViewBookingRedirectionId] =
    useState(null);

  const [numberOfBookedSeats, setNumberOfBookedSeats] = useState(0);
  useEffect(() => {
    console.log('booked: ', numberOfBookedSeats);
  }, [numberOfBookedSeats]);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        console.log('Keyboard is being visible');
        setKeyboardStatus(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        console.log('Keyboard is being hidden');
        setKeyboardStatus(0);
      });

      return () => {
        setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  // useEffect(() => {
  //   if (editableSession.extraTimeDuration) {
  //     const timeSections = editableSession.extraTimeDuration.split(':');
  //     console.log('timesections: ', timeSections);
  //     let totalExtaTimeInMins =
  //       timeSections[0] * 24 + timeSections[1] * 60 + timeSections[2];
  //     console.log('calculated extra time in mins: ', totalExtaTimeInMins);
  //     setExtraTimeValue(totalExtaTimeInMins);
  //   }
  // }, [editableSession.extraTimeDuration]);

  const VirtualGroupSelectHelper = () => {
    if (isVirtualGroupChecked) {
      setIsVirtualGroupChecked(false);
    } else {
      if (businessDetails.payInApp) {
        setIsVirtualGroupChecked(true);
      } else {
        setVisibleModal('virtualGroupErrorDialog');
        setTimeout(() => {
          setVisibleModal(null);
        }, 3000);
      }
    }
  };

  const ExtraTimeServiceSelectHelper = () => {
    setIsExtraTimeServiceChecked(!isExtraTimeServiceChecked);
    setExtraTimeValue(0);
  };

  useEffect(() => {
    console.log('editablesession:', editableSession);
    if (editableSession.id) {
      fetchSessionsData();
    }
  }, [editableSession]);

  const fetchSessionsData = () => {
    Get(`pro/group-sessions/${editableSession.id}`).then(({data}) => {
      const newData = data.map((dateTime) =>
        moment(dateTime.date + 'T' + dateTime.fromTime + '.000Z'),
      );
      console.log('data', data);
      setDifferentSessionDates(data);
      setSessionDateTimes(newData);
      let bookedSeats = data.reduce(
        (prev, current) => prev + current.bookedSeats,
        0,
      );
      // setNumberOfBookedSeats(data[0].bookedSeats);
      setNumberOfBookedSeats(bookedSeats);
    });
  };

  useEffect(() => {
    if (!sessionLoader && submitted) {
      setLoderStatus(false);
      if (sessionData?.status >= 200 && sessionData?.status < 300) {
        closeModal();
        fetchServices();
        global.showToast(
          !!editableSession?.id
            ? 'Session updated successfully'
            : 'Session created successfully',
          'success',
        );
        setSubmit(false);
      } else if (sessionData?.status >= 400 && sessionData?.status <= 500) {
        if (
          sessionData?.status == 403 &&
          sessionData?.message ==
            'Group Session Cannot be Edited as one or more booking has already been made against it'
        ) {
          // console.log('pls check:', sessionData)

          setViewBookingRedirectionId(sessionData.data[0].reservationDisplayId);
          setNumberOfBookedSeats(sessionData.data.length);

          setVisibleModal('CantDeleteGSModalWithRedirect');
          setTimeout(() => {
            setVisibleModal(null);
            closeModal();
          }, 5000);
        } else {
          global.showToast(sessionData?.message, 'error');
          closeModal();
        }
        dispatch(addGroupSessionClear());
      }
    } else {
      setLoderStatus(false);
    }
  }, [sessionData, sessionLoader]);

  // Code to fetch Group session info (needed to re-direct to details page)

  // useEffect(() => {
  //   if (visibleModal === 'CantDeleteGSModal') {
  //     Get(`pro/group-session/${editableSession.id}`)
  //       .then(response => {
  //         console.log(response)
  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //   }

  // }, [visibleModal])

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const durationSelectHelper = (index, value) => {
    if (visibleModal === 'extraTimeDurationAddDialog') {
      setExtraTimeValue(value);
      setExtraTimeIndex(index);
      // setErrors({});
    } else {
      setDuration(value);
      setAreaCoverSelectSelect(index);
    }
  };

  const onSave = () => {
    const errors = {};
    if (nameOfSession.trim() == '') {
      errors.nameOfSession = 'Name is required';
    }
    if (nameOfSession.trim().length > 100) {
      errors.nameOfSession = 'Name will accept maximum 100 characters';
    }
    if (amount.trim().length == 0 || amount.trim().length == null) {
      errors.amount = 'Price per seat is required';
    }
    if (amount.trim().length > 0) {
      let pricePerSeatAmount = amount.replace('.', '#');
      if (amount < 0) {
        errors.amount = 'Price per seat will not accept negative value';
      }
      if (pricePerSeatAmount.includes('#')) {
        errors.amount = 'Price per seat will not accept decimal value';
      }
      if (isNaN(parseInt(amount))) {
        errors.amount = 'Price per seat will accept only integer value';
      }
    }
    if (sessionDuration == '' || sessionDuration == null) {
      errors.sessionDuration = 'Duration is required';
    }
    if (sessionDateTimes.length == 0) {
      errors.sessionDateTimes = 'Date and time is required';
    }
    if (isExtraTimeServiceChecked == true && extraTimeValue == 0) {
      errors.extraTime = 'Extra time is required';
    }
    if (isExtraTimeServiceChecked == true && sessionDuration < extraTimeValue) {
      errors.extraTime = 'Extra time cannot be greater than session duration';
    }
    if (noOfSeat.length == 0 || noOfSeat.length == null) {
      errors.noOfSeat = 'Number of seats is required';
    }
    if (noOfSeat.length > 0) {
      let noOSeatss = noOfSeat.replace('.', '#');
      if (noOfSeat < 0) {
        errors.noOfSeat = 'Number of seats will not accept negative value';
      }
      if (noOSeatss.includes('#')) {
        errors.noOfSeat = 'Number of seats will not accept decimal value';
      }
      if (isNaN(parseInt(noOfSeat))) {
        errors.noOfSeat = 'Number of seats will accept only integer value';
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const groupSessionObj = {
      name: nameOfSession,
      duration: parseInt(sessionDuration),
      amount: parseInt(amount),
      noOfSeat: parseInt(noOfSeat),
      currency: 'USD',
      isVirtualService: isVirtualGroupChecked ? 1 : 0,
      extraTime: isExtraTimeServiceChecked ? 1 : 0,
      extraTimeDuration: isExtraTimeServiceChecked
        ? `00:${extraTimeValue.toString()}:00`
        : '',
      description: serviceDescription,
      dateTimes: sessionDateTimes.map((dateTime) =>
        moment(dateTime).toISOString(),
      ),
      proCategoryId: categoryInfo.id,
    };

    console.log('Submission Data: ', groupSessionObj);

    if (editableSession.id) {
      dispatch(
        editGroupSessionRequest({
          ...groupSessionObj,
          serviceId: editableSession.id,
        }),
      );
    } else {
      dispatch(addGroupSessionRequest(groupSessionObj));
    }
    setLoderStatus(true);
    setSubmit(true);
  };

  const onDelete = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this session?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            Delete(`pro/services/${editableSession.id}`)
              .then((data) => {
                console.log('data', data);
                closeModal();
                fetchServices();
                global.showToast('Session deleted successfully', 'success');
              })
              .catch((error) => {
                console.log({error});
                // closeModal();
                console.log('error', {error});
                if (
                  error?.response?.data?.message ===
                  'The service you requested to delete has Bookings against it.'
                ) {
                  setVisibleModal('CantDeleteGSModal');
                  setTimeout(() => setVisibleModal(null), 4000);
                } else {
                  global.showToast(
                    error?.response?.data?.message || 'Something went wrong',
                    'error',
                  );
                }
              });
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const onDateChange = (date) => {
    if (editIndex != null) {
      setSessionDateTimes(
        sessionDateTimes.map((dateTime, index) => {
          if (index == editIndex) return date;

          return dateTime;
        }),
      );

      setEditIndex(null);
    } else {
      setSessionDateTimes([...sessionDateTimes, date]);
      setNewTime(false);
    }

    setVisibleModal({visibleModal: null});
  };

  useEffect(() => {
    if (visibleModal === 'DurationAddDialog') {
      let newArray = durationTimeStaticData.filter((item) => item.value != 15);
      setDurationTimeStaticData(newArray);
    } else if (visibleModal === 'extraTimeDurationAddDialog') {
      setDurationTimeStaticData(ExtraTimeData);
    }
  }, [visibleModal]);

  useEffect(() => {
    console.log('redirection link changed: ', viewBookingRedirectionId);
  }, [viewBookingRedirectionId]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={scrollViewRefModal}
      onScroll={handleOnScrollHandler}
      scrollEventThrottle={10}>
      {loderStatus ? <ActivityLoaderSolid /> : null}
      <View style={commonStyle.modalContent}>
        <View
          style={[
            commonStyle.dialogheadingbg,
            {borderBottomWidth: 0, paddingBottom: 0},
          ]}>
          <Text style={[commonStyle.modalforgotheading]}>
            Group session details
          </Text>
          {editableSession.id ? (
            <TouchableOpacity onPress={onDelete}>
              <Text style={commonStyle.grayText16}>Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={commonStyle.typeofServiceFilterWrap}>
          <View style={commonStyle.mb1}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              Name of session
            </Text>
            <TextInput
              style={[
                commonStyle.textInput,
                nameOfSessionFocus && commonStyle.focusinput,
              ]}
              onFocus={() => setNameOfSessionFocus(true)}
              onChangeText={(text) => setNameOfSession(text)}
              value={nameOfSession}
              maxLength={100}
              returnKeyType="done"
              keyboardType="default"
              autoCapitalize={'none'}
            />
            {errors.nameOfSession && (
              <Text style={commonStyle.inputfielderror}>
                {errors.nameOfSession}
              </Text>
            )}
          </View>
          <View style={commonStyle.mb2}>
            <CheckBox
              style={{paddingVertical: 10}}
              onClick={() => VirtualGroupSelectHelper()}
              isChecked={isVirtualGroupChecked}
              checkedCheckBoxColor={'#ff5f22'}
              uncheckedCheckBoxColor={'#e6e7e8'}
              rightText={'Virtual group session'}
              rightTextStyle={commonStyle.blackTextR}
              checkedImage={<CheckedBox />}
              unCheckedImage={<UncheckedBox />}
            />
            {isVirtualGroupChecked && (
              <View>
                <List style={[commonStyle.payinCashinfowrap, commonStyle.mt1]}>
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
                        <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                          Payments in cash will be unavailable for the virtual
                          group sessions
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List>
              </View>
            )}
          </View>
          <View style={commonStyle.mb2}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              Price per seat
            </Text>
            <View>
              <TextInput
                style={[
                  commonStyle.textInput,
                  commonStyle.prefixInput,
                  isPricePerSeatFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsPricePerSeatFocus(true)}
                onChangeText={(text) => setPricePerSeat(text)}
                keyboardType="number-pad"
                autoCapitalize={'none'}
                returnKeyType="done"
                placeholder="Amount"
                maxLength={11}
                contextMenuHidden={true}
                placeholderTextColor={'#939DAA'}
                value={amount}
              />
              {errors.amount && (
                <Text style={commonStyle.inputfielderror}>{errors.amount}</Text>
              )}
              <Text style={commonStyle.prefixText}>$</Text>
            </View>
          </View>
          <View style={commonStyle.mb2}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              Duration
            </Text>
            <TouchableOpacity
              style={commonStyle.dropdownselectmodal}
              onPress={() => {
                if (
                  !!sessionDateTimes &&
                  Array.isArray(sessionDateTimes) &&
                  sessionDateTimes.length > 0
                ) {
                  Alert.alert(
                    'Modify Duration',
                    'Modifying duration will reset all scheduled date and time values. Are you sure?',
                    [
                      {
                        text: 'Yes',
                        onPress: () => {
                          setSessionDateTimes([]);
                          setVisibleModal('DurationAddDialog');
                        },
                      },
                      {
                        text: 'No',
                        style: 'cancel',
                      },
                    ],
                  );
                } else {
                  setVisibleModal('DurationAddDialog');
                }
              }}>
              <Text
                style={
                  commonStyle[sessionDuration ? 'texttimeblack' : 'grayText16']
                }>
                {sessionDuration ? `${sessionDuration / 60}h` : 'Add duration'}
              </Text>
              <DownArrow />
            </TouchableOpacity>
            {errors.sessionDuration && (
              <Text style={commonStyle.inputfielderror}>
                {errors.sessionDuration}
              </Text>
            )}
          </View>

          <View style={commonStyle.mb2}>
            <CheckBox
              style={{paddingVertical: 10}}
              onClick={() => ExtraTimeServiceSelectHelper()}
              isChecked={isExtraTimeServiceChecked}
              checkedCheckBoxColor={'#ff5f22'}
              uncheckedCheckBoxColor={'#e6e7e8'}
              rightText={'Enable extra time after the session'}
              rightTextStyle={commonStyle.blackTextR}
              checkedImage={<CheckedBox />}
              unCheckedImage={<UncheckedBox />}
            />
          </View>

          {isExtraTimeServiceChecked && (
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Extra Time Duration
              </Text>
              <TouchableOpacity
                style={commonStyle.dropdownselectmodal}
                onPress={() => {
                  console.log('sessionDateTimes: ', sessionDateTimes.length);
                  if (
                    !!sessionDateTimes &&
                    Array.isArray(sessionDateTimes) &&
                    sessionDateTimes.length > 0
                  ) {
                    Alert.alert(
                      'Modify Extra Time',
                      'Modifying extra time will reset all scheduled date and time values. Are you sure?',
                      [
                        {
                          text: 'Yes',
                          onPress: () => {
                            setSessionDateTimes([]);
                            setVisibleModal('extraTimeDurationAddDialog');
                          },
                        },
                        {
                          text: 'No',
                          style: 'cancel',
                        },
                      ],
                    );
                  } else {
                    setVisibleModal('extraTimeDurationAddDialog');
                  }
                }}>
                {!extraTimeValue ? (
                  <Text style={commonStyle.grayText16}>Add extra time</Text>
                ) : (
                  <Text style={commonStyle.blackTextR}>
                    {extraTimeValue != 15
                      ? `${extraTimeValue / 60}h`
                      : `${extraTimeValue}m`}
                  </Text>
                )}
                <DownArrow />
              </TouchableOpacity>
              {errors.extraTime && (
                <Text style={commonStyle.inputfielderror}>
                  {errors.extraTime}
                </Text>
              )}
            </View>
          )}

          {sessionDuration && (
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Date and time
              </Text>
              {sessionDateTimes.length > 0 ? (
                sessionDateTimes.map((dateTime, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={commonStyle.dropdownselectmodal}
                    onPress={() => {
                      setEditIndex(idx);
                      setVisibleModal('RescheduleDateTimeDialog');
                    }}>
                    <View style={[commonStyle.searchBarText]}>
                      <Text style={commonStyle.grayText16}>
                        {dateTime.format('Do of MMMM, YYYY h:mm a')}
                      </Text>
                      {/* <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>21st of January 2021, 11:00 am</Text> */}
                    </View>
                    <DownArrow />
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    // setEditIndex(0);
                    setVisibleModal('RescheduleDateTimeDialog');
                  }}>
                  <View style={[commonStyle.searchBarText]}>
                    <Text style={commonStyle.grayText16}>
                      Add date and time
                    </Text>
                  </View>
                  <DownArrow />
                </TouchableOpacity>
              )}
              {newTime && (
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    setVisibleModal('RescheduleDateTimeDialog');
                  }}>
                  <View style={[commonStyle.searchBarText]}>
                    <Text style={commonStyle.grayText16}>
                      Add date and time
                    </Text>
                  </View>
                  <DownArrow />
                </TouchableOpacity>
              )}
              {errors.sessionDateTimes && (
                <Text style={commonStyle.inputfielderror}>
                  {errors.sessionDateTimes}
                </Text>
              )}
              <View style={commonStyle.mt1}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setNewTime(true)}>
                  <Text style={commonStyle.textorange}>+ Add Date</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={commonStyle.mb2}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              Number of seats
            </Text>
            <TextInput
              style={[
                commonStyle.textInput,
                numberOfSeatsFocus && commonStyle.focusinput,
              ]}
              onFocus={() => setNumberOfSeatsFocus(true)}
              onChangeText={(text) => setNumberOfSeats(text)}
              value={noOfSeat}
              maxLength={10}
              returnKeyType="done"
              keyboardType="number-pad"
              contextMenuHidden={true}
              autoCapitalize={'none'}
            />
            {errors.noOfSeat && (
              <Text style={commonStyle.inputfielderror}>{errors.noOfSeat}</Text>
            )}
          </View>

          <View style={commonStyle.mb2}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              Description (it’s optional)
            </Text>
            <View
              style={[
                commonStyle.textInput,
                commonStyle.textareainput,
                isServiceDescriptionFocus && commonStyle.focusinput,
              ]}>
              <TextInput
                style={[
                  commonStyle.newtextareaInput,
                  {height: 110, textAlignVertical: 'top'},
                ]}
                onFocus={() => setIsServiceDescriptionFocus(true)}
                onChangeText={(text) => setServiceDescription(text)}
                value={serviceDescription}
                returnKeyType="done"
                keyboardType="default"
                autoCapitalize={'none'}
                multiline={true}
                numberOfLines={6}
                maxLength={500}
                blurOnSubmit={true}
                onSubmitEditing={(e) => {
                  console.log('On Submit Editing');
                  e.target.blur();
                }}
              />
              <Text style={commonStyle.textlength}>
                {serviceDescription.length}/500
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
        <Button
          title="Save"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          loading={sessionLoader}
          onPress={onSave}
        />
      </View>

      {/* Setup Service modal start */}
      <Modal
        isVisible={
          visibleModal === 'DurationAddDialog' ||
          visibleModal === 'extraTimeDurationAddDialog'
        }
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
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 10}]}
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
                <Text style={[commonStyle.modalforgotheading]}>Duration</Text>
              </View>

              <View style={commonStyle.typeofServiceFilterWrap}>
                <View>
                  <RadioGroup
                    style={commonStyle.setupradioGroup}
                    color="#ffffff"
                    activeColor="#ffffff"
                    highlightColor={'#ffffff'}
                    selectedIndex={
                      visibleModal === 'extraTimeDurationAddDialog'
                        ? extraTimeIndex
                        : areaCoverSelect
                    }
                    onSelect={(index, value) => {
                      durationSelectHelper(index, value);
                    }}>
                    {durationTimeStaticData.map((item, index) => (
                      <RadioButton
                        key={index}
                        style={commonStyle.setupradioButton}
                        value={item.value}>
                        <View style={commonStyle.radioCustomView}>
                          <Text style={commonStyle.blackTextR}>
                            {visibleModal === 'extraTimeDurationAddDialog'
                              ? item.displayText
                              : item.durationTime}
                          </Text>
                          {(
                            visibleModal === 'extraTimeDurationAddDialog'
                              ? extraTimeValue == item.value
                              : sessionDuration == item.value
                          ) ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </RadioButton>
                    ))}
                  </RadioGroup>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View>
        </View>
      </Modal>
      {/* Setup Service modal End */}

      {/* Group session Reschedule Date & Time modal start */}
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
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 10}]}
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
            <GroupSessionCalendarModal
              isVisible={visibleModal === 'RescheduleDateTimeDialog'}
              setVisibleModal={setVisibleModal}
              duration={
                !!extraTimeValue
                  ? +sessionDuration + +extraTimeValue
                  : sessionDuration
              }
              onApply={onDateChange}
              sessionDateTimes={sessionDateTimes}
              dateTimeIndex={editIndex}
              differentSessionDates={differentSessionDates}
              setViewBookingRedirectionId={setViewBookingRedirectionId}
              fetchSessionsData={fetchSessionsData}
              setNumberOfBookedSeats={setNumberOfBookedSeats}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Booking Reschedule Date & Time modal end */}

      {/* Reschedule Group session cancellation modal start */}
      <Modal
        isVisible={visibleModal === 'DateRescheduleDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 10}]}
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
                  Are you sure you want to reschedule the session?
                </Text>
              </View>
              <View style={commonStyle.mt3}>
                <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                  You have 8 clients booked on this session already. Clients
                  will be notified about rescheduling
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Reschedule"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => setVisibleModal({visibleModal: null})}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Keep date"
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

      <Modal
        visible={visibleModal == 'errorDeleteDialog'}
        onRequestClose={() => {
          setVisibleModal(null);
        }}
        onBackdropPress={() => {
          setVisibleModal(null);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You can’t remove this category
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You have 5 services listed on Make Up category. Drag services to
              other categories or delete them first to change these settings
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visibleModal == 'virtualGroupErrorDialog'}
        onRequestClose={() => {
          setVisibleModal(null);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              Virual Group Booking can not be created
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You have not opted Pay in App option. Please enable it from Terms
              of Payments to create virtual group booking.
            </Text>
          </View>
        </View>
      </Modal>
      {/* Reschedule Group session cancellation modal end */}

      {/* Can't Delete Group Session due to present bookings Modal Start */}
      <Modal
        visible={visibleModal == 'CantDeleteGSModal'}
        onRequestClose={() => {
          // setErrorMsg(null);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You can’t Delete this Group Session
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You have {numberOfBookedSeats} clients booked on this session
              already. Cancel them first to delete this group session
            </Text>
            {/* <Button
              title="View Booking"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={[commonStyle.commonbuttonStyle, { width: 'auto' }]}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                // setVisibleModal(null)
                closeModal()
                navigation.navigate('bookingsProInner', {
                  rowId: 229,
                  // rowId: editableSession.id,
                });
              }}
            /> */}
          </View>
        </View>
      </Modal>
      {/* Can't Delete Group Session due to present bookings Modal End */}

      {/* Can't Delete Group Session due to present bookings With Redirect Modal Start */}
      <Modal
        visible={visibleModal == 'CantDeleteGSModalWithRedirect'}
        onRequestClose={() => {
          // setErrorMsg(null);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You can’t Reschedule or Delete this Group Session
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You have {numberOfBookedSeats} clients booked on this session
              already. Cancel them first to reschedule or delete this group
              session
            </Text>
            <Button
              title="View Booking"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={[commonStyle.commonbuttonStyle, {width: 'auto'}]}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                // setVisibleModal(null)
                closeModal();
                navigation.navigate('Bookings');
                setTimeout(() => {
                  navigation.navigate('bookingsProInner', {
                    rowId: viewBookingRedirectionId,
                    fromNotificationList: true,
                    // rowId: 229,
                    // rowId: editableSession.id,
                  });
                }, 100);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Can't Delete Group Session due to present bookings With Redirect Modal End */}
    </ScrollView>
  );
}
