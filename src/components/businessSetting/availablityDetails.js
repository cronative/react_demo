import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Get, Post, Put } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import global from '../../components/commonservices/toast';
import { CheckedBox, DownArrow, UncheckedBox } from '../../components/icons';
import {
  AvailabilitySelectModal,
  AvailabilityBookingHoursModal,
  AvailabilityBookingLimitModal,
  BusinessHoursSelectTimeModal,
} from '../../components/modal';
import { useDispatch } from 'react-redux';
import {
  AvailabilitywindowData,
  BookingHoursData,
  BookingLimitData,
} from '../../utility/staticData';
import { setupProgressionUpdate } from '../../store/actions';

const { width, height } = Dimensions.get('window');

const AvailabilityDetails = ({
  isUpdate,
  setLoader,
  redirectUrlHandler,
  progressionData,
}) => {
  const [availibilityWindowValue, setAvailibilityWindowValue] = useState(null);
  const [availibilityWindowViewText, setAvailibilityWindowViewText] =
    useState(null);
  const [tempAvailibilityWindowValue, setTempAvailibilityWindowValue] =
    useState(null);

  const [bookingHours, setBookingHours] = useState(null);
  const [bookingHoursTemp, setBookingHoursTemp] = useState(null);

  const [bookingHoursText, setBookingHoursText] = useState(null);

  const [maxBookingLimit, setMaxBookingLimit] = useState(null);
  const [maxBookingLimitTemp, setMaxBookingLimitTemp] = useState(null);

  const [showButton, setShowButton] = useState(true);
  const [businessHoursItems, setBusinessHoursItems] = useState([
    {
      businessHoursDay: 'Sun',
      dayOfTheWeek: 1,
      availableTimeArray: [],
      isChecked: false,
    },
    {
      businessHoursDay: 'Mon',
      dayOfTheWeek: 2,
      availableTimeArray: [],
      isChecked: false,
    },
    {
      businessHoursDay: 'Tue',
      dayOfTheWeek: 3,
      availableTimeArray: [],
      isChecked: false,
    },
    {
      businessHoursDay: 'Wed',
      dayOfTheWeek: 4,
      availableTimeArray: [],
      isChecked: false,
    },
    {
      businessHoursDay: 'Thu',
      dayOfTheWeek: 5,
      availableTimeArray: [],
      isChecked: false,
    },
    {
      businessHoursDay: 'Fri',
      dayOfTheWeek: 6,
      availableTimeArray: [],
      isChecked: false,
    },
    {
      businessHoursDay: 'Sat',
      dayOfTheWeek: 7,
      availableTimeArray: [],
      isChecked: false,
    },
  ]);

  const [tempBusinessParentIndex, setTempBusinessParentIndex] = useState(null);
  const [tempBusinessChildIndex, setTempBusinessChildIndex] = useState(null);

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [isUpdatedData, setIsUpdatedData] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchAvailablityDetails();

    if (!isUpdate) {
      fetchDefaultBookingHours();
      fetchDefaultBookingLimit();
    }
  }, []);

  const fetchDefaultBookingHours = () => {
    Get('admin/site-settings/defaultBookingHours')
      .then((response) => {
        console.log('def hours: ', response);
        setBookingHours(response.data.keyValue);
      })
      .catch((error) => {
        setBookingHours(null);
      });
  };
  const fetchDefaultBookingLimit = () => {
    Get('admin/site-settings/defaultBookingLimit')
      .then((response) => {
        setMaxBookingLimit(response.data.keyValue);
      })
      .catch((error) => {
        setMaxBookingLimit(null);
      });
  };

  useEffect(() => {
    console.log('Booking hours: ', bookingHours);
    console.log('max booking limit: ', maxBookingLimit);
  }, [bookingHours, maxBookingLimit]);
  useEffect(() => {
    console.log('Booking hours temp: ', bookingHoursTemp);
    console.log('max booking limit temp: ', maxBookingLimitTemp);
  }, [bookingHoursTemp, maxBookingLimitTemp]);

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

  const businessHoursSelectHelper = (item) => {
    const tempBusinessHoursItems = [...businessHoursItems];
    let index = tempBusinessHoursItems.findIndex(
      (eachItem) => eachItem === item,
    );
    const tempItem = { ...item };
    tempItem.availableTimeArray = item.isChecked
      ? []
      : tempItem.availableTimeArray;
    tempItem.isChecked = !tempItem.isChecked;
    tempBusinessHoursItems[index] = tempItem;
    checkBusinessHourValidation(tempBusinessHoursItems);
    setBusinessHoursItems([...tempBusinessHoursItems]);
  };

  const onClickBusinessDayTimeHandler = (pIndex, cIndex) => {
    console.log(
      '\n\n\n********************* onClickBusinessDayTimeHandler ',
      pIndex,
      cIndex,
    );
    setTempBusinessParentIndex(pIndex);
    setTempBusinessChildIndex(cIndex);
    setVisibleModal('BusinessHoursDialog');
  };

  const onClickSwipeBusinessDayTimeModalHandler = () => {
    setVisibleModal({ visibleModal: null });
    setTempBusinessParentIndex(null);
    setTempBusinessChildIndex(null);
  };

  const onSubmitSetTimeValue = (fromTime, toTime) => {
    onClickSwipeBusinessDayTimeModalHandler();
    const tempStringData = JSON.stringify(businessHoursItems);
    const tempParseData = JSON.parse(tempStringData);

    const tempBusinessHoursItems = [...tempParseData];
    const tempEachBusinessHour = {
      ...tempBusinessHoursItems[tempBusinessParentIndex],
    };

    if (tempBusinessChildIndex) {
      tempEachBusinessHour.availableTimeArray[tempBusinessChildIndex] = {
        fromTime: fromTime,
        toTime: toTime,
      };
    } else {
      tempEachBusinessHour.availableTimeArray.push({
        fromTime: fromTime,
        toTime: toTime,
      });
    }
    tempBusinessHoursItems[tempBusinessParentIndex] = tempEachBusinessHour;
    checkBusinessHourValidation(tempBusinessHoursItems);
    setBusinessHoursItems([...tempBusinessHoursItems]);
  };

  const checkBusinessHourValidation = (businessHoursArray) => {
    const openedBusinessDays = businessHoursArray.filter(
      (eachDay) => eachDay.isChecked,
    );

    const openedDaysTimeDetails = openedBusinessDays.filter(
      (eachDay) =>
        eachDay.availableTimeArray && eachDay.availableTimeArray.length,
    );

    if (
      // openedBusinessDays.length &&
      // openedDaysTimeDetails.length &&
      openedBusinessDays.length === openedDaysTimeDetails.length
    ) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const onSubmitAvailablityHandler = () => {
    if (availibilityWindowValue && bookingHours && maxBookingLimit) {
      const tempJsonStringData = JSON.stringify(businessHoursItems);
      const tempBusinessHoursItems = JSON.parse(tempJsonStringData);
      let proAvailDateTime = tempBusinessHoursItems.map((eachItem, index) => {
        let returnData = eachItem.availableTimeArray.map((item, index) => {
          // item.fromTime = moment(item.fromTime).utc().format('HH:mm:ss');
          // item.toTime = moment(item.toTime).utc().format('HH:mm:ss');
          item.fromTime = moment(item.fromTime).format('HH:mm:ss');
          item.toTime = moment(item.toTime).format('HH:mm:ss');
          return item;
        });
        if (isUpdatedData) {
          eachItem.offDay = eachItem.isChecked ? 0 : 1;
          eachItem.times = returnData;
          delete eachItem.dayOfTheWeek; //Need to remove
          delete eachItem.availableTimeArray;
        } else {
          eachItem.isOffDay = eachItem.isChecked ? 0 : 1;
        }
        delete eachItem.businessHoursDay;
        delete eachItem.isChecked;
        return eachItem;
      });
      let payLoad = {
        availableWindow: availibilityWindowValue,
        bookingLimit: maxBookingLimit,
        bookingHours: bookingHours,
      };
      if (isUpdatedData) {
        payLoad.data = proAvailDateTime;
      } else {
        payLoad.proAvailDateTime = proAvailDateTime;
      }
      proStepSettingSubmit(payLoad);
    }
    skipBtnHanler();

  };

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { availability: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep ? nextStep : 'SetupContacts');
      })
      .catch((error) => {
        console.log('error', error);
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };


  const onDeleteServiceHndler = (pIndex, cIndex) => {
    const tempJsonStringData = JSON.stringify(businessHoursItems);
    const tempBusinessHoursItems = JSON.parse(tempJsonStringData);
    const tempItems = tempBusinessHoursItems[pIndex];
    const tempAvailableTimeItems = tempItems.availableTimeArray;
    tempAvailableTimeItems.splice(cIndex, 1);
    tempBusinessHoursItems[pIndex] = tempItems;
    setBusinessHoursItems([...tempBusinessHoursItems]);
  };

  const onPressAvailablityWindowOpenHandler = () => {
    setVisibleModal('AvailabilityDialog');
    setTempAvailibilityWindowValue(availibilityWindowValue);
  };
  const onPressBookingHoursOpenHandler = () => {
    setVisibleModal('BookingHoursDialog');
    setBookingHoursTemp(bookingHours);
  };
  const onPressBookingLimitOpenHandler = () => {
    setVisibleModal('BookingLimitDialog');
    setMaxBookingLimitTemp(maxBookingLimit);
  };

  const onApplyAvailibilityHandler = () => {
    setVisibleModal({ visibleModal: null });
    updateAvailableWindowTextVAlue(tempAvailibilityWindowValue);
  };
  const onApplyBookingHoursHandler = () => {
    setBookingHours(bookingHoursTemp);
    setVisibleModal({ visibleModal: null });
  };
  const onApplyBookingLimitHandler = () => {
    setMaxBookingLimit(maxBookingLimitTemp);
    setVisibleModal({ visibleModal: null });
  };

  const updateAvailableWindowTextVAlue = (value) => {
    setAvailibilityWindowValue(value);
    let index = AvailabilitywindowData.findIndex((x) => x.value === value);
    if (index !== -1) {
      setAvailibilityWindowViewText(
        AvailabilitywindowData[index].availabilitywindow,
      );
    }
  };

  // const updateBookingHoursTextVAlue = (value) => {
  //   setAvailibilityWindowValue(value);
  //   let index = AvailabilitywindowData.findIndex((x) => x.value === value);
  //   setAvailibilityWindowViewText(
  //     AvailabilitywindowData[index].availabilitywindow,
  //   );
  // };

  useEffect(() => {
    let index = BookingHoursData.findIndex((x) => x.value == bookingHours);
    console.log('my index: ', index);
    console.log('hours data: ', BookingHoursData);
    console.log('selected data: ', bookingHours);
    if (index !== -1) {
      setBookingHoursText(
        BookingHoursData[index]?.availabilitywindow || 'Choose Booking Hours',
      );
    }
  }, [bookingHours]);

  const proStepSettingSubmit = (data) => {
    setLoader(true);
    if (!!isUpdatedData) {
      console.log('sending data is ****', data);
      Put('pro/availability', data)
        .then((result) => {
          console.log('availability result is', result);
          setLoader(false);
          if (result.status === 200 || result.status === 201) {
            global.showToast(result.message, 'success');
            redirectUrlHandler();
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log('error is - isUpdated true', error);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    } else {
      console.log('isUpdated false');
      Post('pro/add-availability', data)
        .then((result) => {
          setLoader(false);
          if (result.status === 201 || result.status === 200) {
            if (!!progressionData) {
              const updatedProgression = progressionData.map((step) => {
                if (step.stepNo === 6) {
                  return { ...step, isCompleted: 1 };
                }

                return step;
              });
              dispatch(setupProgressionUpdate(updatedProgression));
            }

            global.showToast(result.message, 'success');
            // navigation.navigate('SetupContacts');
            redirectUrlHandler();
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log('error is - isUpdated false', error);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    }
  };

  const fetchAvailablityDetails = () => {
    setIsUpdatedData(false);
    setLoader(true);
    Get('pro/availability', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          console.log('fetched availability data: ', result);
          if (result.data && result.data.days && result.data.days.count) {
            setIsUpdatedData(true);
            let timeData = result.data.days.rows;
            let returnData = timeData.filter((eachDay) => eachDay.offDay === 0);
            arrangeDaysData(returnData);
            if (result.data && result.data.window) {
              setAvailibilityWindowValue(result.data.window.availableWindow);
              updateAvailableWindowTextVAlue(
                result.data.window.availableWindow,
              );
            }
          }
          // CR
          if (
            result?.data?.window &&
            result?.data?.window?.bookingHours &&
            result?.data?.window?.maxBookingLimit
          ) {
            console.log('data found');
            setBookingHours(result.data.window.bookingHours);
            setMaxBookingLimit(result.data.window.maxBookingLimit);
          } else {
            fetchDefaultBookingHours();
            fetchDefaultBookingLimit();
          }
        }
      })
      .catch((error) => {
        console.log('ERROR FOUND', error);
        setLoader(false);
      });
  };

  const arrangeDaysData = (data) => {
    console.log('Get Datataaaaaaaaa : ', JSON.stringify(data));
    const tempJsonStringData = JSON.stringify(businessHoursItems);
    const tempBusinessHoursItems = JSON.parse(tempJsonStringData);
    if (data) {
      data.map((eachItem, index) => {
        let tempAvailableArray = [];
        eachItem.ProAvailableTimes.map((item, index) => {
          let tempFormTime = timeFormatmodification(item.fromTime);
          let tempToTime = timeFormatmodification(item.toTime);
          tempAvailableArray.push({ fromTime: tempFormTime, toTime: tempToTime });
        });
        tempBusinessHoursItems[eachItem.dayValue - 1].availableTimeArray =
          tempAvailableArray;
        tempBusinessHoursItems[eachItem.dayValue - 1].isChecked = true;
      });
      setBusinessHoursItems([...tempBusinessHoursItems]);
    }
  };

  const timeFormatmodification = (timeData) => {
    let date = moment().format('YYYY-MM-DD');
    // let conversion = moment.utc(`${date} ${timeData}`).local().format('HH:mm:ss');
    // let conversion2 = moment(`${date} ${timeData}`);
    // let timeArray = conversion.split(':');
    let timeArray = timeData.split(':');
    const tempDate = moment();
    tempDate.set({
      hour: timeArray[0],
      minute: timeArray[1],
      second: timeArray[2],
    });
    let value = new Date(tempDate);
    console.log(timeArray + '  ' + value);
    return value;
  };

  const convertToAmPm = (time) => {
    let timeArr = string(time).split(':');
    return `${timeArr[0]}:${timeArr[1]} ${timeArr[0].split(':')[0] >= 12 ? 'pm' : 'am'
      }`;
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
          <Text style={[commonStyle.subheading, commonStyle.mb1]}>
            Availability
          </Text>
        </View>
        <View style={commonStyle.categoriseListWrap}>
          <View style={[commonStyle.setupCardBox]}>
            <View>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.subtextbold, commonStyle.mb15]}>
                  Online booking availability
                </Text>
                {!isUpdate ? (
                  <Text style={commonStyle.blackTextR}>
                    Choose how far in advance clients can book your services
                  </Text>
                ) : null}
              </View>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Availability window
                </Text>
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    onPressAvailablityWindowOpenHandler();
                  }}>
                  {!availibilityWindowValue ? (
                    <Text style={commonStyle.grayText16}>
                      Choose Availability
                    </Text>
                  ) : (
                    <Text style={commonStyle.blackTextR}>
                      {availibilityWindowViewText}
                    </Text>
                  )}
                  <DownArrow />
                </TouchableOpacity>
              </View>
            </View>

            {/* ClIENTS CAN BOOK */}
            <View>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Clients can book
                </Text>
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    onPressBookingHoursOpenHandler();
                  }}>
                  {!bookingHours ? (
                    <Text style={commonStyle.grayText16}>
                      Choose Booking Hours
                    </Text>
                  ) : (
                    <Text style={commonStyle.blackTextR}>
                      {bookingHoursText}
                    </Text>
                  )}
                  <DownArrow />
                </TouchableOpacity>
              </View>
            </View>

            {/* MAX NUMBER OF BOOKINGS */}
            <View>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Max amount of bookings per day
                </Text>
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    onPressBookingLimitOpenHandler();
                  }}>
                  {!maxBookingLimit ? (
                    <Text style={commonStyle.grayText16}>
                      Choose Maximum Bookings per day
                    </Text>
                  ) : (
                    <Text style={commonStyle.blackTextR}>
                      {maxBookingLimit}
                    </Text>
                  )}
                  <DownArrow />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[commonStyle.setupCardBox]}>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.subtextbold]}>Business hours</Text>
            </View>
            {businessHoursItems.map((item, index) => (
              <View key={index} style={commonStyle.businessHourswrap}>
                <View style={commonStyle.businessHoursarea}>
                  <View style={{ width: 95 }}>
                    <CheckBox
                      style={{ paddingVertical: 10 }}
                      onClick={() => businessHoursSelectHelper(item)}
                      isChecked={item.isChecked}
                      checkedCheckBoxColor={'#ff5f22'}
                      uncheckedCheckBoxColor={'#e6e7e8'}
                      rightText={item.businessHoursDay}
                      rightTextStyle={commonStyle.blackTextR}
                      checkedImage={<CheckedBox />}
                      unCheckedImage={<UncheckedBox />}
                    />
                  </View>
                  <View style={{ alignItems: 'center', marginBottom: 0 }}>
                    {item.availableTimeArray.length > 0 ? (
                      <>
                        {item.availableTimeArray.map(
                          (innerItem, innerIndex) => (
                            <Text
                              key={innerIndex}
                              numberOfLines={1}
                              style={[
                                item.isChecked
                                  ? commonStyle.blackTextR
                                  : commonStyle.grayText16,
                                { marginBottom: 2 },
                              ]}>
                              {innerItem.fromTime &&
                                moment(innerItem.fromTime).format('LT')}
                              -
                              {innerItem.toTime &&
                                moment(innerItem.toTime).format('LT')}
                            </Text>
                          ),
                        )}
                      </>
                    ) : (
                      <TouchableOpacity
                        style={{ position: 'relative', marginBottom: 4 }}
                        onPress={() => {
                          item.isChecked
                            ? onClickBusinessDayTimeHandler(index, null)
                            : null;
                        }}>
                        <Text style={commonStyle.grayText16}>
                          {item.isChecked ? 'Select time' : 'Day off'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 10,
                    height: '100%',
                    backgroundColor: '#fff',
                  }}>
                  {item.availableTimeArray.length > 0 ? (
                    item.availableTimeArray.map((innerItem, innerIndex) => (
                      <View
                        key={innerIndex}
                        style={{
                          position: 'relative',
                          top: item.availableTimeArray.length > 1 ? -5 : 2,
                        }}>
                        {innerIndex === 0 ? (
                          <View
                            style={{
                              position: 'relative',
                              top: 0,
                              marginVertical: 2,
                            }}>
                            <TouchableOpacity
                              style={{
                                padding: 3,
                                width: 28,
                                height: 28,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() => {
                                onClickBusinessDayTimeHandler(index, null);
                              }}>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: 'SofiaPro',
                                  color: '#000',
                                }}>
                                +
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              position: 'relative',
                              top: -3,
                              right: 0,
                              // backgroundColor: 'red'
                            }}>
                            <TouchableOpacity
                              style={{
                                padding: 3,
                                width: 28,
                                height: 25,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={() =>
                                onDeleteServiceHndler(index, innerIndex)
                              }>
                              <Text
                                style={[commonStyle.closeiext, { fontSize: 16 }]}>
                                ✕
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))
                  ) : (
                    <View
                      style={{
                        position: 'relative',
                        top: 0,
                        marginVertical: 2,
                      }}>
                      <TouchableOpacity
                        style={{
                          padding: 3,
                          width: 28,
                          height: 28,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          if (!item.isChecked) {
                            businessHoursSelectHelper(item);
                          }
                          onClickBusinessDayTimeHandler(index, null);
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'SofiaPro',
                            color: '#000',
                          }}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </KeyboardAwareScrollView>
      {showButton && !!availibilityWindowValue && (
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title={isUpdate ? 'Update' : 'Save and Continue'}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => onSubmitAvailablityHandler()}
            />
          </View>
        </View>
      )}

      {/* Setup Availability Window modal start */}
      <Modal
        isVisible={visibleModal === 'AvailabilityDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
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
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
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
            <AvailabilitySelectModal
              availibilityWindowValue={availibilityWindowValue}
              setTempAvailibilityWindowValue={setTempAvailibilityWindowValue}
            />
          </ScrollView>

          {tempAvailibilityWindowValue ? (
            <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
              <Button
                title="Apply"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => onApplyAvailibilityHandler()}
              />
            </View>
          ) : null}
        </View>
      </Modal>
      {/* Setup Availability Window modal End */}

      {/* Setup Booking Hours modal start */}
      <Modal
        isVisible={visibleModal === 'BookingHoursDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
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
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
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
            <AvailabilityBookingHoursModal
              // availibilityWindowValue={availibilityWindowValue}
              // setTempAvailibilityWindowValue={setTempAvailibilityWindowValue}
              bookingHours={bookingHours}
              setBookingHoursTemp={setBookingHoursTemp}
            />
          </ScrollView>

          {bookingHours && (
            <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
              <Button
                title="Apply"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => onApplyBookingHoursHandler()}
              />
            </View>
          )}
        </View>
      </Modal>
      {/* Setup Booking Hours modal End */}

      {/* Setup Booking Limit modal start */}
      <Modal
        isVisible={visibleModal === 'BookingLimitDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
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
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
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
            <AvailabilityBookingLimitModal
              maxBookingLimit={maxBookingLimit}
              setMaxBookingLimitTemp={setMaxBookingLimitTemp}
            />
          </ScrollView>

          {maxBookingLimit && (
            <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
              <Button
                title="Apply"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => onApplyBookingLimitHandler()}
              />
            </View>
          )}
        </View>
      </Modal>
      {/* Setup Booking Limit modal End */}

      {/* Setup Business hours modal start */}
      <Modal
        isVisible={visibleModal === 'BusinessHoursDialog'}
        onSwipeComplete={() => onClickSwipeBusinessDayTimeModalHandler()}
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
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => onClickSwipeBusinessDayTimeModalHandler()}>
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
            <BusinessHoursSelectTimeModal
              businessWeekDayIndex={tempBusinessParentIndex}
              businessHoursItems={businessHoursItems}
              onSubmitSetTimeValue={onSubmitSetTimeValue}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Setup Service modal End */}
    </Fragment>
  );
};

export default AvailabilityDetails;
