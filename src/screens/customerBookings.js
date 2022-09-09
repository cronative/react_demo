import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { Body, Container, Left, List, ListItem } from 'native-base';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Button } from 'react-native-elements';
import EventCalendar from 'react-native-events-calendar';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import { Get } from '../api/apiAgent';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import {
  CalendarIcon,
  CloseIcon,
  DownArrow,
  PlayIcon,
} from '../components/icons';
import {
  BookingManageCalenderModal,
  CompleteProfileModal,
} from '../components/modal';
import {
  professionalBookingListRequest,
  professionalBookingListRequestClear,
} from '../store/actions/bookingAction';
import { setupProgressionUpdate } from '../store/actions/professionalSetupProgressionAction';
import { fromtoToService, intervalInMinutes } from '../utility/booking';
const { width, height } = Dimensions.get('window');
import { checkGracePeriodExpiry } from '../utility/fetchGracePeriodData';

const CustomerBookings = ({ navigation }) => {
  // Declare the constant
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [markedDatesArray, setMarkedDatesArray] = useState([]);
  const [scrolling, setScrolling] = useState(false);
  const [formatedDate, setFormatedDate] = useState(
    moment(new Date()).format('DD MMMM YYYY'),
  );
  const [coloringStartDate, setColoringStartDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [coloringEndDate, setColoringEndDate] = useState(null);
  const [formatedDateTo, setFormatedDateTo] = useState('');
  const [bookingToggle, setBookingToggle] = useState(true);
  const [applyFilter, setApplyFilter] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleBusinessInfoModal, setVisibleBusinessInfoModal] =
    useState(null);
  const [eventInitDate, setEventInitDate] = useState('');
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const bookingData = useSelector(
    (state) => state.bookingReducer.profUpcomingBookingListDetails,
  );
  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );
  const loderStatus = useSelector((state) => state.bookingReducer.loader);
  const [events, setEvents] = useState([]);
  // Start Change: Snehasish Das, Issue #1344
  const [listEvents, setListEvents] = useState([]);
  // End Change: Snehasish Das, Issue #1344
  const [loader, setLoader] = useState(false);
  const [businessInfoDetails, setBusinessInfoDetails] = useState(null);
  const [loginUserId, setLoginUserId] = useState();
  const [profileFinished, setProfileFinished] = useState(false);

  //Start Change: Snehasish Das, Issue #1782
  const eventStyles = StyleSheet.create({
    eventContainer: {
      backgroundColor: '#FF9589',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontFamily: 'SofiaPro',
      opacity: 1,
      height: '100%',
      width: '100%',
    },
    blockEventContainer: {
      backgroundColor: '#FF8A8A',
      fontFamily: 'SofiaPro',
      opacity: 0.6,
      height: '100%',
      width: '100%',
    },
    eventTitle: {
      color: '#000',
      fontFamily: 'SofiaPro',
      fontSize: 12,
      lineHeight: 14,
      fontWeight: '400',
    },
    eventTime: {
      color: '#000',
      fontFamily: 'SofiaPro',
      fontSize: 12,
      lineHeight: 14,
      fontWeight: '700',
    },
    interpunct: {
      color: '#000',
      fontFamily: 'SofiaPro',
      fontSize: 12,
      lineHeight: 10,
      fontWeight: '400',
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  });
  //End Change: Snehasish Das, Issue #1782

  // const [setupProgress, setSetupProgress] = useState([
  //   { name: 'dateOfBirth', stepNo: 1, status: 0, routeName: '' },
  //   { name: 'primaryCategory', stepNo: 2, status: 0, routeName: 'BusinessSettingsMainCategories' },
  //   { name: 'additionalCategories', stepNo: 3, status: 0, routeName: 'BusinessSettingsAdditionalCategories' },
  //   { name: 'businessDetails', stepNo: 4, status: 0, routeName: 'BusinessSettingsYourBusiness' },
  //   { name: 'services', stepNo: 5, status: 0, routeName: 'BusinessSettingsService' },
  //   { name: 'availability', stepNo: 6, status: 0, routeName: 'BusinessSettingsAvailability' },
  //   { name: 'contact', stepNo: 7, status: 0, routeName: 'BusinessSettingsContacts' },
  //   { name: 'paymentTerms', stepNo: 8, status: 0, routeName: 'BusinessSettingsTermsOfPayment' },
  //   { name: 'additionalInfo', stepNo: 9, status: 0, routeName: 'BusinessSettingsAdditionalInfo' },
  //   { name: 'proFaqs', stepNo: 10, status: 0, routeName: 'BusinessSettingsFaq' },
  // ]);
  const [setupProgress, setSetupProgress] = useState([
    { name: 'dateOfBirth', stepNo: 1, isCompleted: 0, routeName: 'SetupDOB' },
    {
      name: 'primaryCategory',
      stepNo: 2,
      isCompleted: 0,
      routeName: 'SetupMainCategories',
    },
    {
      name: 'additionalCategories',
      stepNo: 3,
      isCompleted: 0,
      routeName: 'SetupAdditionalCategories',
    },
    {
      name: 'businessDetails',
      stepNo: 4,
      isCompleted: 0,
      routeName: 'SetupBusiness',
    },
    { name: 'services', stepNo: 5, isCompleted: 0, routeName: 'SetupService' },
    {
      name: 'availability',
      stepNo: 6,
      isCompleted: 0,
      routeName: 'SetupAvailability',
    },
    { name: 'contact', stepNo: 7, isCompleted: 0, routeName: 'SetupContacts' },
    {
      name: 'paymentTerms',
      stepNo: 8,
      isCompleted: 0,
      routeName: 'SetupTermsOfPayment',
    },
    {
      name: 'additionalInfo',
      stepNo: 9,
      isCompleted: 0,
      routeName: 'SetupAdditionalInfo',
    },
    { name: 'proFaqs', stepNo: 10, isCompleted: 0, routeName: 'SetupFaq' },
  ]);

  let [nextNavigationStep, setNextNavigationStep] = useState(null);
  const [completeBtnDisabled, setCompleteBtnDisabled] = useState(true);
  let scrollerRef = useRef();
  let calendarRef = useRef();

  useEffect(() => {
    getLogedinUserId();
    getBusinessCompleteInfo();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkGracePeriodExpiry()
        .then((isGracePeriodExpired) => {
          if (isGracePeriodExpired) {
            navigation.navigate('TrialFinished');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, []),
  );

  // Start Change: Snehasish Das, Issue #1698
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     getBusinessCompleteInfo();
  //   });
  //   return unsubscribe;
  // }, [navigation]);
  // End Change: Snehasish Das, Issue #1698

  useEffect(() => {
    if (!bookingToggle) {
      // Start Change: Snehasish Das, Issue #1344
      // let obj = {
      //   date: formatedDate,
      //   toDate: null,
      // };
      setScrolling(true);
      dispatch(
        professionalBookingListRequest({
          date: moment(formatedDate, 'DD MMMM YYYY')
            .subtract(7, 'd')
            .format('YYYY-MM-DD'),
          toDate: moment(formatedDate, 'DD MMMM YYYY')
            .add(7, 'd')
            .format('YYYY-MM-DD'),
        }),
      );
      // End Change: Snehasish Das, Issue #1344
    }
  }, [bookingToggle]);

  // Start Change: Snehasish Das, Issue #1698
  // useEffect(() => {
  //   if (isFocused) getBusinessCompleteInfo();
  // }, [isFocused]);
  useFocusEffect(
    useCallback(() => {
      if (!profileFinished) {
        getBusinessCompleteInfo();
      }
    }, [profileFinished]),
  );

  // End Change: Snehasish Das, Issue #1698

  useEffect(() => {
    if (businessInfoDetails?.completionDetails) {


      console.log(">>>>>>??????>>>>>>> " + businessInfoDetails?.completionDetails["dateOfBirth"]);

      console.log(">>>>>>??????>>>>>>> " + businessInfoDetails?.completionDetails["primaryCategory"]);

      let updatedProgress = [];

      // if (businessInfoDetails.completionDetails["dateOfBirth"] != 1 || businessInfoDetails.completionDetails["primaryCategory"] != 1) {
      //   for (let stepIndex in setupProgress) {
      //     let step = setupProgress[stepIndex];
      //     console.log(step)
      //     console.log(businessInfoDetails.completionDetails[step.name])
      //     if (businessInfoDetails.completionDetails[step.name] == 1) {
      //       updatedProgress.push({ ...step, isCompleted: 1 });
      //     } else if (businessInfoDetails.completionDetails[step.name] == 0) {
      //       updatedProgress.push({ ...step, isCompleted: 0 });
      //     }
      //   }
      // }

      // dispatch(setupProgressionUpdate(updatedProgress));
      // console.log('check: ', updatedProgress)
      // let firstUnfinishedStep = updatedProgress.find(
      //   (step) => step.isCompleted === 0,
      // );
      // console.log('firstUnfinishedStep ', firstUnfinishedStep)
      // if (updatedProgress.length > 0) {
      //   console.log('firstUnfinishedStep ', firstUnfinishedStep)
      //   let nextStep;
      //   if (firstUnfinishedStep?.routeName) {
      //     nextStep = firstUnfinishedStep.routeName;
      //   }
      //   //  else {
      //   //   nextStep = 'SetupSubscription';
      //   // }
      //   console.log('Next step is: ', nextStep);
      //   setNextNavigationStep(nextStep);
      // }

      // setCompleteBtnDisabled(false);
    }
  }, [businessInfoDetails]);

  const getLogedinUserId = async () => {
    const userId = (await AsyncStorage.getItem('userId')) || '';
    const emailId = (await AsyncStorage.getItem('email')) || '';
    if (userId) {
      setLoginUserId(userId);
    }
    if (userId && emailId) {
      Intercom.registerIdentifiedUser({
        email: emailId,
        userId: 'DEV_' + userId,
      });
    }
  };


  useEffect(() => {
    // navigation.navigate('Profile', {
    //   screen: nextNavigationStep,
    // });
    console.log("nextNavigationStep >>>>>");
    console.log(nextNavigationStep);
    if (nextNavigationStep != null) {
      navigation.navigate(nextNavigationStep);
    }

  }, [nextNavigationStep])

  // const onPressCompleteHandler = () => {
  //   // navigation.navigate('Profile')
  //   // setTimeout(() => navigation.navigate(nextNavigationStep), 0)
  //   navigation.navigate('Profile', {
  //     screen: nextNavigationStep,
  //   });
  // };

  // This method for the clear filter
  const clearFilter = () => {
    setApplyFilter(false);

    // Refresh the page
    let dataVal = moment(new Date()).format('YYYY-MM-DD');
    let desireDateFormat = moment(new Date()).format('DD MMM YYYY');
    setColoringStartDate(moment().format('YYYY-MM-DD'));
    setColoringEndDate(null);
    setFormatedDate(desireDateFormat);
    setFormatedDateTo('');

    // Start Change: Snehasish Das, Issue #1344
    // let obj = {
    //   date: dataVal,
    //   toDate: null,
    // };
    setScrolling(true);
    dispatch(
      professionalBookingListRequest({
        date: moment(dataVal).subtract(7, 'd').format('YYYY-MM-DD'),
        toDate: moment(dataVal).add(7, 'd').format('YYYY-MM-DD'),
      }),
    );
    // End Change: Snehasish Das, Issue #1344
    setEventInitDate(dataVal);
  };

  // Get the date format
  const formatDate = (dateVal = null) => {
    console.log('this function is calling , applyFilter', applyFilter);
    if (applyFilter === false) {
      let newDateVal, desireDate;

      // Get new date and desire date
      if (dateVal !== null) {
        newDateVal = moment(dateVal).format('YYYY-MM-DD');
        desireDate = dateVal;
      } else {
        newDateVal = moment(new Date()).format('YYYY-MM-DD');
        desireDate = new Date();
      }

      // Get the desire date format
      let desireDateFormat = moment(desireDate).format('DD MMM YYYY');
      setColoringStartDate(moment(desireDate).format('YYYY-MM-DD'));
      setColoringEndDate(null);
      setFormatedDate(desireDateFormat);
      setFormatedDateTo('');

      // sending request to to get booking details
      if (newDateVal !== null || newDateVal !== '') {
        // Start Change: Snehasish Das, Issue #1344
        // let obj = {
        //   date: newDateVal,
        //   toDate: null,
        // };
        setScrolling(true);
        dispatch(
          professionalBookingListRequest({
            date: moment(newDateVal).subtract(7, 'd').format('YYYY-MM-DD'),
            toDate: moment(newDateVal).add(7, 'd').format('YYYY-MM-DD'),
          }),
        );
        // End Change: Snehasish Das, Issue #1344
        setEventInitDate(newDateVal);
      }
      return true;
    } else {
      let dataVal = moment(dateVal).format('YYYY-MM-DD');
      setEventInitDate(dataVal);
      return false;
    }
  };

  // This method will call on Map show hide.
  const bookingToggleHandle = () => {
    setBookingToggle(!bookingToggle);
  };

  // After select date range
  const calenderdate = (startDate, endDate) => {
    if (startDate !== null && endDate !== null) {
      customDateFormat(startDate, endDate);
    }
  };

  // This method for custom date format
  const customDateFormat = (startDate, endDate) => {
    setMarkedDatesArray([]);
    let newStartDate, newEndDate, newStartDesireDate, newEndDesireDate;

    newStartDate = moment(startDate).format('YYYY-MM-DD');
    newEndDate = moment(endDate).format('YYYY-MM-DD');
    newStartDesireDate = moment(startDate).format('DD MMM YYYY');
    newEndDesireDate = moment(endDate).format('DD MMM YYYY');

    // Set formated date format
    setFormatedDate(newStartDesireDate);
    setFormatedDateTo(newEndDesireDate);
    setColoringStartDate(moment(newStartDate).format('YYYY-MM-DD'));
    setColoringEndDate(moment(newEndDate).format('YYYY-MM-DD'));

    if (newStartDate !== null && newEndDate !== null) {
      let obj = {
        date: newStartDate,
        toDate: newEndDate,
      };
      setScrolling(true);
      dispatch(professionalBookingListRequest(obj));
      setVisibleModal({ visibleModal: null });
      setApplyFilter(true);
    }
    return true;
  };

  // This function will basically handle the upcoming booking data response
  useEffect(() => {
    if (scrolling === true) {
      setLoader(true);
      if (bookingData && bookingData.status == 200) {
        setScrolling(false);
        dispatch(professionalBookingListRequestClear());

        let markedDates = [];
        let eventDates = [];
        let listEvents = [];

        if (bookingData.data.count > 0) {
          let rowsData = bookingData.data.rows;
          // Start Change: Snehasish Das, Issue #1344
          /* Old: 
          let todayDate = moment(new Date()).format('DD-MM-YYYY');
          let dateResss = moment(rowsData[0].date).format('DD-MM-YYYY');
          */
          markedDates = rowsData.reduce((accumulator, row) => {
            if (
              accumulator.findIndex((m) => m.date == row.date) === -1 &&
              row.isCanceled !== 1 &&
              ((!!row.groupSessionId && !!row.Service) ||
                row.reservationServiceMetaId !== 0)
            ) {
              let todayDate = moment(new Date()).format('YYYY-MM-DD');
              let dateResss = moment(
                row.date + 'T' + row.time + '.000Z',
              ).format('YYYY-MM-DD');
              if (dateResss >= todayDate) {
                let markObj = {
                  date: dateResss,
                  dots: [
                    {
                      color: '#F36A46',
                    },
                  ],
                };
                accumulator.push(markObj);
                return accumulator;
                // setEventInitDate(rowsData[0].date);
              } else {
                let markObj = {
                  date: dateResss,
                  dots: [
                    {
                      color: 'black',
                    },
                  ],
                };
                accumulator.push(markObj);
                return accumulator;
                // setEventInitDate(rowsData[0].date);
              }
            } else {
              return accumulator;
            }
          }, []);
          // End Change: Snehasish Das, Issue #1344

          eventDates = rowsData.reduce((acc, data) => {
            if (
              moment(data.date + 'T' + data.time + '.000Z').isSame(
                moment(formatedDate, 'DD MMMM YYYY'),
                'day',
              ) &&
              data.isCanceled !== 1 &&
              ((!!data.groupSessionId && !!data.Service) ||
                data.reservationServiceMetaId !== 0)
            ) {
              console.log('Booking: ', data);
              // Start Change: Snehasish Das, Issue #1350
              // Old: const formatDateTimeFrom = moment.utc(`${data.date} ${data.time}`).local().format('YYYY-MM-DD hh:mm:ss');
              const formatDateTimeFrom = moment
                .utc(`${data.date} ${data.time}`)
                .local()
                .format('YYYY-MM-DD HH:mm:ss');
              // End Change: Snehasish Das, Issue #1350

              const totalDuration = intervalInMinutes(data, data, false);
              // Start Change: Snehasish Das, Issue #1350
              /* Old:
            const formatDateTimeTo = moment.utc(`${data.date} ${data.time}`)
              .add(totalDuration, 'minutes')
              .local()
              .format('YYYY-MM-DD hh:mm:ss');
            */
              const formatDateTimeTo = moment
                .utc(`${data.date} ${data.time}`)
                .add(totalDuration, 'minutes')
                .local()
                .format('YYYY-MM-DD HH:mm:ss');
              // End Change: Snehasish Das, Issue #1350

              const newObj = {
                start: formatDateTimeFrom,
                end: formatDateTimeTo,
                orderDisplayId: data.id,
                reservationDisplayId: data.reservationDisplayId,
                backgroundColor:
                  data?.ReservedServiceMeta?.ProCategory?.categoryColor,
              };

              if (data.groupSessionId) {
                const addedGroupSession = acc.findIndex(
                  (session) => session.groupSessionId === data.groupSessionId,
                );

                if (addedGroupSession > -1) {
                  acc[addedGroupSession] = {
                    ...newObj,
                    title:
                      acc[addedGroupSession].title +
                      ', ' +
                      data.customer?.userName,
                    summary: 'Group Session',
                    groupSessionId: data.groupSessionId,
                    backgroundColor: data?.Service?.proCategory?.categoryColor,
                  };
                }

                return addedGroupSession > -1
                  ? acc
                  : [
                    ...acc,
                    {
                      ...newObj,
                      title: data.customer?.userName,
                      summary: 'Group Session',
                      groupSessionId: data.groupSessionId,
                      backgroundColor:
                        data?.Service?.proCategory?.categoryColor,
                    },
                  ];
              } else {
                return [
                  ...acc,
                  {
                    ...newObj,
                    title: data.customer?.userName,
                    summary: data.ReservedServiceMeta.name,
                  },
                ];
              }
            } else {
              return acc;
            }
          }, []);

          // Start Change: Snehasish Das, Issue #1344
          listEvents = rowsData.reduce((accumulator, row) => {
            if (
              moment(row.date + 'T' + row.time + '.000Z').isSame(
                moment(formatedDate, 'DD MMMM YYYY'),
                'day',
              ) &&
              ((!!row.groupSessionId && !!row.Service) ||
                row.reservationServiceMetaId !== 0)
            ) {
              if (row.groupSessionId) {
                const addedGroupSession = accumulator.findIndex(
                  (session) => session.groupSessionId === row.groupSessionId,
                );

                if (addedGroupSession > -1) {
                  accumulator[addedGroupSession] = {
                    ...accumulator[addedGroupSession],
                    seatCount: accumulator[addedGroupSession].seatCount + 1,
                  };
                  return accumulator;
                } else {
                  row.seatCount = 1;
                }
              }
              accumulator.push(row);
              return accumulator;
            } else {
              return accumulator;
            }
          }, []);
        }

        if (bookingData.blockTimes.count > 0) {
          let blockTimeData = bookingData.blockTimes.rows;

          markedDates = blockTimeData.reduce((accumulator, blockedTime) => {
            if (blockedTime?.serviceId) {
              if (
                moment(blockedTime?.blockTimeFrom).isBefore(moment(), 'day') &&
                accumulator.findIndex((m) =>
                  moment(m.date).isSame(
                    moment(blockedTime.blockTimeFrom),
                    'day',
                  ),
                ) == -1 &&
                blockedTime?.status !== 4
              ) {
                accumulator.push({
                  date: blockedTime.blockTimeFrom,
                  dots: [
                    {
                      color: 'black',
                    },
                  ],
                });
              } else if (
                accumulator.findIndex((m) =>
                  moment(m.date).isSame(
                    moment(blockedTime.blockTimeFrom),
                    'day',
                  ),
                ) == -1 &&
                blockedTime?.status !== 4
              ) {
                accumulator.push({
                  date: blockedTime.blockTimeFrom,
                  dots: [
                    {
                      color: '#F36A46',
                    },
                  ],
                });
              }
            }
            return accumulator;
          }, markedDates);

          eventDates = blockTimeData.reduce((accumulator, blockedTime) => {
            if (
              moment(blockedTime?.blockTimeFrom).isSame(
                moment(formatedDate, 'DD MMMM YYYY'),
                'day',
              ) &&
              blockedTime?.status !== 4
            ) {
              const formatDateTimeFrom = moment(
                blockedTime?.blockTimeFrom,
              ).format('YYYY-MM-DD HH:mm:ss');

              const formatDateTimeTo = moment(blockedTime?.blockTimeTo).format(
                'YYYY-MM-DD HH:mm:ss',
              );

              if (!!blockedTime?.serviceId) {
                console.log(blockedTime);
              }

              const newObj = {
                start: formatDateTimeFrom,
                end: !!blockedTime?.serviceId
                  ? moment(blockedTime?.blockTimeFrom)
                    .add(
                      intervalInMinutes(
                        blockedTime?.Service,
                        blockedTime?.Service,
                        false,
                      ),
                      'minutes',
                    )
                    .format('YYYY-MM-DD HH:mm:ss')
                  : formatDateTimeTo,
                orderDisplayId: !!blockedTime?.serviceId
                  ? blockedTime?.id
                  : null,
                title: blockedTime?.walkInClient?.name
                  ? blockedTime?.walkInClient?.name + ' (Walkin)'
                  : undefined,
                summary: blockedTime?.Service?.name,
                isWalkin: !!blockedTime?.serviceId ? true : false,
                backgroundColor:
                  blockedTime?.Service?.ProCategory?.categoryColor,
              };

              accumulator.push(newObj);
            }
            return accumulator;
          }, eventDates);

          listEvents = blockTimeData.reduce((accumulator, blockedTime) => {
            if (
              moment(blockedTime?.blockTimeFrom).isSame(
                moment(formatedDate, 'DD MMMM YYYY'),
                'day',
              ) &&
              blockedTime?.serviceId
            ) {
              listEvents.push({ ...blockedTime, isWalkin: true });
            }

            return accumulator;
          }, listEvents);
        }

        setEvents(eventDates);
        setMarkedDatesArray(markedDates);
        setListEvents(listEvents);
        setTimeout(() => {
          setLoader(false);
        }, 200);
      } else if (bookingData && bookingData.status != 200) {
        dispatch(professionalBookingListRequestClear());
        setMarkedDatesArray([]);
        setScrolling(false);
        setEvents([]);
        // Start Change: Snehasish Das, Issue #1344
        setListEvents([]);
        // End Change: Snehasish Das, Issue #1344
        setTimeout(() => {
          setLoader(false);
        }, 200);
      }
    }
  }, [bookingData]);

  // On Click of event showing alert from here
  const eventClicked = (event) => {
    if (event.isWalkin) {
      navigation.navigate('bookingsProWalkinDetails', {
        id: event.id ? event.id : event.orderDisplayId,
      });
      return;
    }
    if (!event.reservationDisplayId || !event.orderDisplayId) return;

    let decodeKey = event.reservationDisplayId;
    navigation.navigate('bookingsProInner', {
      rowId: decodeKey,
      fromNotificationList: false,
    });
  };

  // This method will call on Modal show hide.
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  // This method for current position reference
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // This method to get the month name
  // const getMonthName = (start, end) => {
  //   if (bookingToggle) {
  //     let obj = {
  //       date: moment(start).format('YYYY-MM-DD'),
  //       toDate: moment(end).format('YYYY-MM-DD'),
  //     };
  //     dispatch(professionalBookingListRequest(obj));
  //   }
  // };

  const getBusinessCompleteInfo = () => {
    setLoader(true);
    Get('pro/completion-status', '')
      .then((result) => {
        setLoader(false);
        console.log(result.data);
        if (result.status === 200) {
          setBusinessInfoDetails(result.data);
          if (result.data.percentage === 100) {
            // Start Change: Snehasish Das, Issue #1698
            setProfileFinished(true);
            // End Change: Snehasish Das, Issue #1698
            formatDate();
          }
        }
      })
      .catch((error) => {
        setLoader(false);
        formatDate();
      });
  };

  const businessInfoModalClose = () => {
    setVisibleBusinessInfoModal({ visibleBusinessInfoModal: null });
  };

  // This function is to refresh the page
  const refreshPage = () => {
    clearFilter();
  };

  const scrollToCurrentTime = () => {
    const offset = 100;
    const timeNowHour = moment().hour();
    const timeNowMin = moment().minutes();
    if (!!scrollerRef?.current && Platform.OS === 'android') {
      scrollerRef.current.scrollTo({
        x: 0,
        y:
          offset * timeNowHour +
          (offset * timeNowMin) / 60 -
          (height - 160) / 2 ?? 0,
        animated: true,
      });
    } else if (!!calendarRef?.current && Platform.OS === 'ios') {
      calendarRef.current.scrollTo({
        x: 0,
        y:
          offset * timeNowHour +
          (offset * timeNowMin) / 60 -
          (height - 200) / 2 ?? 0,
        animated: true,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToCurrentTime();
    }, 1);
  }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {/* <PTRView
          scrollEnabled={false}
          onRefresh={refreshPage}
          colors="#ff5f22"
          style={{backgroundColor: '#F5FCFF', color: '#ff5f22'}}> */}
        {/* {loderStatus || loader ? <ActivityLoaderSolid /> : null} */}
        <View style={commonStyle.bookingheader}>
          {applyFilter === true ? (
            <TouchableOpacity
              style={commonStyle.bookingdateselectmodal}
              onPress={clearFilter}>
              <Text
                style={[
                  commonStyle.blackText16,
                  { marginRight: 8, color: '#F36A46' },
                ]}>
                Clear
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={commonStyle.bookingdateselectmodal}
            onPress={() => {
              setVisibleModal('RescheduleDateTimeDialog');
            }}>
            <Text style={[commonStyle.blackText16, { marginRight: 5 }]}>
              {formatedDate} {formatedDateTo ? '-' + formatedDateTo : ''}
            </Text>
            <DownArrow />
          </TouchableOpacity>
          {/* <TouchableOpacity style={commonStyle.bookingdateselectmodal}>
          <Text style={[commonStyle.blackText16, {marginRight: 5}]}>{formatedDate}</Text>
          <DownArrow/>
        </TouchableOpacity> */}
          <TouchableOpacity
            style={commonStyle.bookingtoggle}
            onPress={bookingToggleHandle}>
            {bookingToggle ? <PlayIcon /> : <CalendarIcon />}
          </TouchableOpacity>
        </View>

        {/* {businessInfoDetails && businessInfoDetails.percentage !== 100 ? ( */}
        {/* <View style={commonStyle.horizontalPadd}>
            <View style={[commonStyle.setupCardBox, commonStyle.mt1]}>
              <Text style={commonStyle.subtextbold}>
                Complete your business info to list your profile online
              </Text>
              <View style={commonStyle.ratingprecessWrap}>
                <TouchableHighlight style={{marginRight: 10}}>
                  <Progress.Bar
                    progress={
                      businessInfoDetails &&
                      businessInfoDetails.percentage / 100
                    }
                    width={width - 120}
                    color="#F36A46"
                    unfilledColor="#FFEBCE"
                    borderColor="transparent"
                    borderWidth={0}
                    borderRadius={0}
                    height={3}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.text14bold}>
                  {businessInfoDetails && businessInfoDetails.percentage}%
                </Text>
              </View>
              <Button
                title="Complete"
                containerStyle={[commonStyle.buttoncontainerothersStyle]}
                buttonStyle={commonStyle.changePassModalbutton}
                titleStyle={commonStyle.buttontitleStyle}
                // onPress={onPressCompleteHandler}
                disabled={completeBtnDisabled}
                onPress={() => {
                  setVisibleBusinessInfoModal('CompleteProfileDialog');
                }}
              />
            </View>
          </View>
        ) : ( */}
        <>
          <View>
            <CalendarStrip
              calendarAnimation={{ type: 'sequence', duration: 30 }}
              daySelectionAnimation={{
                type: 'border',
                duration: 200,
                borderWidth: 1,
                borderHighlightColor: '#F36A46',
              }}
              style={{
                height: 90,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: '#fff',
              }}
              calendarHeaderStyle={{ display: 'none' }}
              // calendarHeaderContainerStyle={{marginTop: 0}}
              calendarColor={'#fff'}
              onDateSelected={(date) => formatDate(date)}
              //onWeekScrollStart={(start, end) => getMonthName(start, end)}
              dateNumberStyle={{
                color: '#110F17',
                fontFamily: 'SofiaPro',
                fontSize: 16,
              }}
              dateNameStyle={{
                color: '#110F17',
                fontFamily: 'SofiaPro',
                fontSize: 12,
                lineHeight: 24,
                marginTop: 5,
              }}
              highlightDateNumberStyle={{
                color: '#ffffff',
                fontFamily: 'SofiaPro',
                fontSize: 16,
              }}
              highlightDateNameStyle={{
                color: '#ffffff',
                fontFamily: 'SofiaPro',
                fontSize: 12,
                lineHeight: 24,
                marginTop: 5,
              }}
              dayContainerStyle={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#dcdcdc',
                maxHeight: 65,
                height: 62,
              }}
              dayComponentHeight={70}
              customDatesStyles={[
                {
                  startDate: coloringStartDate,
                  endDate: coloringEndDate,
                  dateNameStyle: {
                    color: '#ffffff',
                  },
                  dateNumberStyle: {
                    color: '#ffffff',
                  },
                  dateContainerStyle: {
                    backgroundColor: '#F36A46',
                  },
                },
              ]}
              disabledDateNameStyle={{ color: 'grey' }}
              disabledDateNumberStyle={{ color: 'grey' }}
              innerStyle={{ flex: 1, height: 100 }}
              // datesWhitelist={datesWhitelist}
              // datesBlacklist={datesBlacklist}
              iconContainer={{ display: 'none' }}
              markedDates={markedDatesArray}
              markedDatesStyle={{
                borderWidth: 2,
                borderColor: '#fff',
                width: 11,
                height: 11,
                position: 'relative',
                top: 8,
                marginTop: 0,
              }}
              scrollable={true}
              selectedDate={
                !!coloringStartDate
                  ? coloringStartDate
                  : moment().format('YYYY-MM-DD')
              }
            // scrollerPaging={true}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
            }
            ref={scrollerRef}>
            {bookingToggle && (
              // Start Change: Snehasish Das, Issue #1343
              /* Old:
                <View style={{marginTop: -90, paddingBottom: 5}}>
                */
              <View
                style={{
                  marginTop: -50,
                  paddingBottom: Platform.OS === 'android' ? 5 : 100,
                  height: Platform.OS === 'android' ? 'auto' : height - 130,
                }}>
                {/* End Change: Snehasish Das, Issue #1343 */}
                <EventCalendar
                  calendarRef={calendarRef}
                  eventTapped={eventClicked}
                  events={events}
                  width={width}
                  //Start Change: Snehasish Das, Issue #1347
                  /* Old:
                    size={60}
                    initDate={eventInitDate}
                    scrollToFirst={false}
                    styles={{
                      container: {
                          backgroundColor: 'red'
                      }, 
                      event: {
                          opacity: 0.5,
                          backgroundColor: 'green'
                      }
                    }}
                    scrollToFirst
                    */
                  size={0}
                  initDate={eventInitDate}
                  scrollToFirst={false}
                  virtualizedListProps={{
                    getItemCount: () => {
                      return 1;
                    },
                  }}
                  //End Change: Snehasish Das, Issue #1347
                  styles={{
                    event: {
                      backgroundColor: 'rgba(0,0,0,0)',
                      borderRadius: 8,
                      borderWidth: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      opacity: 1,
                    },
                    timeLabel: {
                      color: '#939DAA',
                      fontFamily: 'SofiaPro',
                      fontSize: 12,
                    },
                  }}
                  //Start Change: Snehasish Das, Issue #1782
                  renderEvent={(event) => (
                    <TouchableOpacity
                      style={
                        event?.orderDisplayId
                          ? [
                            eventStyles.eventContainer,
                            !!event?.backgroundColor && {
                              backgroundColor: event?.backgroundColor,
                            },
                          ]
                          : eventStyles.blockEventContainer
                      }
                      activeOpacity={event?.orderDisplayId ? 0.5 : 1}
                      onPress={() => eventClicked(event)}>
                      {event?.orderDisplayId &&
                        (moment(event.start)
                          .clone()
                          .add(29, 'minutes')
                          .isBefore(moment(event.end)) ? (
                          <>
                            <Text style={eventStyles.eventTime}>
                              {moment(event.start).format('hh:mm a') +
                                ' - ' +
                                moment(event.end).format('hh:mm a')}
                            </Text>
                            <View style={eventStyles.titleContainer}>
                              <Text style={eventStyles.eventTitle}>
                                {event?.title}
                              </Text>
                              <Text style={eventStyles.interpunct}>
                                {' . '}
                              </Text>
                              <Text style={eventStyles.eventTitle}>
                                {event?.summary}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <View style={eventStyles.titleContainer}>
                            <Text style={eventStyles.eventTime}>
                              {moment(event.start).format('hh:mm a') +
                                ' - ' +
                                moment(event.end).format('hh:mm a')}
                            </Text>
                            <Text style={eventStyles.eventTitle}>
                              {' - '}
                              {event?.title}
                            </Text>
                            <Text style={eventStyles.interpunct}>{' . '}</Text>
                            <Text style={eventStyles.eventTitle}>
                              {event?.summary}
                            </Text>
                          </View>
                        ))}
                    </TouchableOpacity>
                  )}
                //End Change: Snehasish Das, Issue #1782
                />
              </View>
            )}

            {!bookingToggle && (
              <View>
                {/* Start Change: Snehasish Das, Issue #1344 */}
                {listEvents.length === 0 ? (
                  // End Change: Snehasish Das, Issue #1344
                  <View style={commonStyle.noBookingWrap}>
                    <Image
                      style={commonStyle.nobookingsimg}
                      source={require('../assets/images/no-bookings-img.png')}
                    />
                    <Text
                      style={[
                        commonStyle.subtextbold,
                        commonStyle.textCenter,
                        commonStyle.mb1,
                      ]}>
                      No upcoming bookings
                    </Text>
                    {/* <Text
                        style={[
                          commonStyle.grayText16,
                          commonStyle.textCenter,
                        ]}>
                        Invite clients or send message blast
                      </Text> */}
                    {/* <TouchableOpacity
                        style={[
                          commonStyle.commonOrangeButton,
                          commonStyle.mt3,
                        ]}
                        activeOpacity={0.5}
                        onPress={() => {
                          navigation.navigate('NewWalkInBooking');
                        }}>
                        <Text
                          style={[
                            commonStyle.buttontitleStyle,
                            commonStyle.textCenter,
                          ]}>
                          Invite clients
                        </Text>
                      </TouchableOpacity> */}
                  </View>
                ) : (
                  // Start Change: Snehasish Das, Issue #1344
                  <View style={commonStyle.horizontalPadd}>
                    <View style={commonStyle.mb2}>
                      <Text style={commonStyle.grayText16}>
                        You have {listEvents.length} bookings today
                      </Text>
                    </View>
                    {listEvents !== null &&
                      listEvents.map((eachbooking, index) =>
                        // End Change: Snehasish Das, Issue #1344
                        !!eachbooking?.isWalkin ? (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              eventClicked(eachbooking);
                            }}
                            style={[
                              commonStyle.bookingCardBox,
                              commonStyle.mt05,
                              {
                                borderLeftWidth: 3,
                                borderLeftColor:
                                  eachbooking?.Service?.ProCategory
                                    ?.categoryColor,
                              },
                            ]}>
                            <List
                              style={[
                                commonStyle.bookingdateUserwrap,
                                {
                                  borderBottomWidth: 0,
                                  paddingBottom: 10,
                                  paddingTop: 10,
                                },
                              ]}>
                              <ListItem
                                thumbnail
                                style={[commonStyle.commListitem]}>
                                <Left style={commonStyle.bookingUserAvaterwrap}>
                                  <Image
                                    style={commonStyle.bookingUserAvaterImg}
                                    defaultSource={require('../assets/images/default.png')}
                                    // Start Change: Snehasish Das, Issue #1682
                                    source={
                                      !!eachbooking?.walkInClient?.profileImage
                                        ? {
                                          uri: eachbooking?.walkInClient
                                            ?.profileImage,
                                        }
                                        : require('../assets/images/default-user.png')
                                    }
                                  // End Change: Snehasish Das, Issue #1682
                                  />
                                </Left>
                                <Body style={commonStyle.categoriseListBody}>
                                  <Text
                                    style={commonStyle.blackText16}
                                    numberOfLines={1}>
                                    {eachbooking?.walkInClient?.name}
                                  </Text>
                                </Body>
                                {eachbooking?.status == 0 && (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.noshowStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Pending
                                    </Text>
                                  </TouchableHighlight>
                                )}

                                {eachbooking?.status == 1 && (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.confirmStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Confirmed
                                    </Text>
                                  </TouchableHighlight>
                                )}

                                {eachbooking?.status == 2 && (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.ongoingStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Ongoing
                                    </Text>
                                  </TouchableHighlight>
                                )}

                                {eachbooking?.status == 3 && (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.completedStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Completed
                                    </Text>
                                  </TouchableHighlight>
                                )}

                                {eachbooking?.status == 4 && (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.cancelledStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Cancelled
                                    </Text>
                                  </TouchableHighlight>
                                )}
                              </ListItem>

                              <View
                                style={[
                                  commonStyle.bookingdatewrap,
                                  commonStyle.mt15,
                                ]}>
                                <Text
                                  style={commonStyle.blackTextR}
                                  numberOfLines={1}>
                                  {eachbooking?.Service?.name
                                    ? eachbooking?.Service?.name
                                      ?.charAt(0)
                                      .toUpperCase() +
                                    eachbooking?.Service?.name?.slice(1)
                                    : eachbooking?.Service?.name}
                                </Text>
                                <TouchableHighlight>
                                  <Text style={commonStyle.blackTextR}>
                                    {moment(eachbooking?.blockTimeFrom).format(
                                      'hh:mm a',
                                    )}
                                    {' - '}
                                    {moment(eachbooking?.blockTimeFrom)
                                      .add(
                                        intervalInMinutes(
                                          eachbooking?.Service,
                                          eachbooking?.Service,
                                          false,
                                        ),
                                        'minutes',
                                      )
                                      .format('hh:mm a')}
                                  </Text>
                                </TouchableHighlight>
                              </View>
                            </List>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              navigation.navigate('bookingsProInner', {
                                rowId: eachbooking?.reservationDisplayId,
                                fromNotificationList: false,
                              });
                            }}
                            style={[
                              commonStyle.bookingCardBox,
                              commonStyle.mt05,
                              {
                                borderLeftWidth: 3,
                                borderLeftColor: !!eachbooking.groupSessionId
                                  ? eachbooking?.Service?.proCategory
                                    ?.categoryColor
                                  : eachbooking?.ReservedServiceMeta
                                    ?.ProCategory?.categoryColor,
                              },
                            ]}>
                            <List
                              style={[
                                commonStyle.bookingdateUserwrap,
                                {
                                  borderBottomWidth: 0,
                                  paddingBottom: 10,
                                  paddingTop: 10,
                                },
                              ]}>
                              <ListItem
                                thumbnail
                                style={[commonStyle.commListitem]}>
                                {!eachbooking?.groupSessionId && (
                                  <Left
                                    style={commonStyle.bookingUserAvaterwrap}>
                                    <Image
                                      style={commonStyle.bookingUserAvaterImg}
                                      defaultSource={require('../assets/images/default.png')}
                                      // Start Change: Snehasish Das, Issue #1682
                                      source={
                                        !!eachbooking?.customer?.profileImage
                                          ? {
                                            uri: eachbooking?.customer
                                              ?.profileImage,
                                          }
                                          : require('../assets/images/default-user.png')
                                      }
                                    // End Change: Snehasish Das, Issue #1682
                                    />
                                  </Left>
                                )}
                                <Body style={commonStyle.categoriseListBody}>
                                  {eachbooking?.groupSessionId ? (
                                    <Text
                                      style={commonStyle.blackText16}
                                      numberOfLines={1}>
                                      {eachbooking?.seatCount}
                                      <Text style={commonStyle.grayText16}>
                                        {' '}
                                        / {eachbooking?.Service?.noOfSeat} seats
                                      </Text>
                                    </Text>
                                  ) : (
                                    <Text
                                      style={commonStyle.blackText16}
                                      numberOfLines={1}>
                                      {eachbooking?.customer?.userName}
                                    </Text>
                                  )}
                                </Body>
                                {/* 1:-pending,2:-ongoing,3:-completed,4:-no show */}
                                {eachbooking.isConfirmed == 1 &&
                                  eachbooking.isCanceled == 0 &&
                                  eachbooking.status == 1 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.confirmStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Confirmed
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.isCanceled == 1 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.cancelledStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Cancelled
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.status == 1 &&
                                  eachbooking.isConfirmed == 0 &&
                                  eachbooking.isCanceled == 0 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.noshowStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Pending
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.status == 2 &&
                                  eachbooking.isConfirmed == 1 &&
                                  eachbooking.isCanceled == 0 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.ongoingStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Ongoing
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.status == 3 &&
                                  eachbooking.isConfirmed == 1 &&
                                  eachbooking.isCanceled == 0 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.completedStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Completed
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.status == 4 &&
                                  eachbooking.isCanceled == 0 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.noshowStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      No show
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.status == 5 &&
                                  eachbooking.isCanceled == 0 &&
                                  eachbooking.isConfirmed == 1 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.noshowStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Cash not recieved
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}

                                {eachbooking.status == 6 &&
                                  eachbooking.isCanceled == 0 &&
                                  eachbooking.isConfirmed == 1 ? (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.bookingStatusbtn,
                                      commonStyle.noshowStatusbtn,
                                    ]}>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
                                      Incomplete
                                    </Text>
                                  </TouchableHighlight>
                                ) : null}
                              </ListItem>
                              <View
                                style={[
                                  commonStyle.bookingdatewrap,
                                  commonStyle.mt15,
                                ]}>
                                <Text
                                  style={commonStyle.blackTextR}
                                  numberOfLines={1}>
                                  {eachbooking?.ReservedServiceMeta?.name
                                    ? eachbooking?.ReservedServiceMeta?.name
                                      ?.charAt(0)
                                      .toUpperCase() +
                                    eachbooking?.ReservedServiceMeta?.name?.slice(
                                      1,
                                    )
                                    : eachbooking?.Service?.name
                                      ?.charAt(0)
                                      .toUpperCase() +
                                    eachbooking?.Service?.name?.slice(1)}
                                </Text>
                                <TouchableHighlight>
                                  <Text style={commonStyle.blackTextR}>
                                    {fromtoToService(
                                      eachbooking?.date,
                                      eachbooking?.time,
                                      eachbooking?.duration,
                                      0,
                                      eachbooking?.ReservedServiceMeta
                                        ?.extraTimeDuration,
                                    )}
                                  </Text>
                                </TouchableHighlight>
                              </View>
                            </List>
                          </TouchableOpacity>
                        ),
                      )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
          {coloringStartDate != moment().format('YYYY-MM-DD') && (
            <TouchableOpacity
              onPress={() => {
                scrollToCurrentTime();
                formatDate(moment().format('YYYY-MM-DD'));
              }}
              style={commonStyle.stickybutton}>
              <Text style={commonStyle.stickytext}>Today</Text>
            </TouchableOpacity>
          )}
        </>
        {/* )} */}
        {/* </PTRView> */}
      </Container>
      {/* Booking Reschedule Date & Time modal start */}
      <Modal
        isVisible={visibleModal === 'RescheduleDateTimeDialog'}
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
        <View style={[commonStyle.scrollableModal, { maxHeight: 600 }]}>
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
            <BookingManageCalenderModal
              isVisible={visibleModal === 'RescheduleDateTimeDialog'}
              setVisibleModal={setVisibleModal}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Booking Reschedule Date & Time modal end */}

      {/* Complete Profile info modal full start */}
      <Modal
        isVisible={visibleBusinessInfoModal === 'CompleteProfileDialog'}
        onSwipeComplete={() =>
          setVisibleBusinessInfoModal({ visibleBusinessInfoModal: null })
        }
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
        <View style={commonStyle.scrollablefullscreenModal}>
          <TouchableOpacity
            style={{
              marginRight: 15,
              marginTop: 8,
              marginBottom: 2,
              width: 30,
              height: 30,
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red'
            }}
            onPress={() =>
              setVisibleBusinessInfoModal({ visibleBusinessInfoModal: null })
            }>
            <CloseIcon />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <CompleteProfileModal
              businessCompletionDetails={
                businessInfoDetails && businessInfoDetails.completionDetails
              }
              businessInfoModalClose={businessInfoModalClose}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Preview"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={
                () => {
                  setVisibleBusinessInfoModal({
                    visibleBusinessInfoModal: null,
                  });
                  navigation.navigate('ProfessionalPublicProfile', {
                    proId: loginUserId,
                    singleBack: true,
                  });
                }

                // navigation.navigate('Profile', {
                //   screen: nextNavigationStep,
                // })
              }
            />
          </View>
        </View>
      </Modal>
      {/* Complete Profile info modal full end PreviewProfileServices */}
    </Fragment>
  );
};

export default CustomerBookings;
