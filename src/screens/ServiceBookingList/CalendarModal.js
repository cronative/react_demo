import {useNavigation} from '@react-navigation/core';
import moment from 'moment';
import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {Badge, Button, Divider} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import UserSingle from '../../components/icons/UserSingle';
import {intervalInMinutes} from '../../utility/booking';
import RNModal from 'react-native-modal';

export default function CalendarModal({
  isVisible,
  setVisible,
  service,
  setServices,
  selectedServices,
  walkin,
  sessionAvailibilities,
  setGroupSessionId,
}) {
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const slots = useSelector((state) => state.bookingReducer.slots);
  const [daySlots, setSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [disabledWeekdays, setDisabledWeekdays] = useState([]);
  const [month, setMonth] = useState('');
  const [availableSeat, setSeats] = useState(null);
  const [duration, setDuration] = useState(0);
  const navigation = useNavigation();

  const inBetweenOtherServices = (slotStartTime, slotToTime) => {
    const inBetweenService =
      selectedServices?.length > 1 &&
      selectedServices.find((s) => {
        if (s.id === service.id || !s.timeSlot) return false;
        const serviceStartTime = s.timeSlot;
        const serviceEndTime = s?.timeSlot
          ?.clone()
          .add(s.totalDuration, 'minutes');
        console.log('totalDuration', s.totalDuration);

        if (
          slotToTime.isBetween(
            serviceStartTime,
            serviceEndTime,
            'minutes',
            '(]',
          ) ||
          slotStartTime.isBetween(
            serviceStartTime,
            serviceEndTime,
            'minutes',
            '[)',
          )
        )
          return true;
        else return false;
      });
    return inBetweenService;
  };

  const onChangeDate = (newDate) => {
    console.log('Slots: ', slots);
    const dateString = newDate.format('YYYY-MM-DD');
    let same = false;
    selectedServices.forEach((s) => {
      if (
        s.id !== service.id &&
        !!s.timeSlot &&
        !s.timeSlot.isSame(newDate, 'day')
      ) {
        same = true;
      }
    });

    if (same) return;

    setTimeSlot('');
    setSelectedDate(newDate);
    let proDay = professionalProfileDetailsData?.ProAvailableDays.find(
      (day) => day.dayValue - 1 == newDate.day(),
    );
    const newSlots = proDay?.ProAvailableTimes?.reduce((acc, time) => {
      const totalDuration = intervalInMinutes(service, time);
      let intervalInMins = totalDuration; // intervalInMinutes(service, time);
      setDuration(totalDuration);

      const fromTime = moment(
        dateString + ' ' + time.fromTime,
        'YYYY-MM-DD HH:mm:ss',
      );
      const toTime = moment(
        dateString + ' ' + time.toTime,
        'YYYY-MM-DD HH:mm:ss',
      );
      let finalSlotTime = moment(fromTime);

      while (
        finalSlotTime
          .clone()
          .add(intervalInMins, 'minutes')
          .isSameOrBefore(toTime)
      ) {
        if (
          !!professionalProfileDetailsData?.ProMetas.length > 0 &&
          !!professionalProfileDetailsData?.ProMetas[0]?.bookingHours &&
          !finalSlotTime.isAfter(
            moment().add(
              professionalProfileDetailsData?.ProMetas[0]?.bookingHours,
              'minutes',
            ),
          )
        ) {
          finalSlotTime = finalSlotTime.add(30, 'minutes');
          continue;
        } else if (!finalSlotTime.isAfter(moment())) {
          finalSlotTime = finalSlotTime.add(30, 'minutes');
          continue;
        }

        const bookedSlot = slots.find((slot) => {
          if (!!slot.isCart) {
            return false;
          }
          const startFromTime = moment(slot.dateTimeFrom);
          const startToTime = moment(slot.dateTimeTo);

          const slotToTime = finalSlotTime
            .clone()
            .add(totalDuration, 'minutes');
          // if (startFromTime.isSame(finalSlotTime, 'day'))
          //   console.log(
          //     'all timeslots',
          //     startFromTime.format('h:mm a'),
          //     startToTime.format('h:mm a'),
          //     finalSlotTime.format('h:mm a'),
          //     slotToTime.format('h:mm a'),
          //     startFromTime.isBetween(
          //       finalSlotTime,
          //       slotToTime,
          //       'minutes',
          //       '[]',
          //     ),
          //     startToTime.isBetween(finalSlotTime, slotToTime, 'minutes', '[]'),
          //   );

          if (
            startFromTime.isBetween(
              finalSlotTime,
              slotToTime,
              'minutes',
              '[)',
            ) ||
            startToTime.isBetween(finalSlotTime, slotToTime, 'minutes', '(]') ||
            finalSlotTime.isBetween(startFromTime, startToTime, 'minute', '[)')
          ) {
            return true;
          }
        });
        // console.log('bookedSlot', bookedSlot);
        acc =
          bookedSlot ||
          inBetweenOtherServices(
            finalSlotTime,
            finalSlotTime.clone().add(intervalInMins, 'minutes'),
          ) ||
          acc.indexOf(finalSlotTime.format('h:mm a')) > -1
            ? acc
            : [...acc, finalSlotTime.format('h:mm a')];
        //Start Change: Snehasish Das, Issue #1630
        finalSlotTime = finalSlotTime.add(30, 'minutes');
        //End Change: Snehasish Das, Issue #1630
      }

      return acc;
    }, []);

    setSlots(newSlots);
  };

  useEffect(() => {
    console.log('Service: ', service);
    if (service?.type == 2 && !!service.date) {
      chooseDate(moment(service.date, 'YYYY-MM-DD'));
      setTimeSlot(service?.timeSlot?.format('h:mm a'));
    }
  }, [service]);

  useEffect(() => {
    console.log('selected date: ', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedServices.length > 1 && !service?.timeSlot) {
      const sIndex = selectedServices.findIndex((s) => s.id === service.id);
      setSelectedDate(selectedServices[sIndex - 1].timeSlot);
      onChangeDate(selectedServices[sIndex - 1].timeSlot);
    } else if (service && service.type == 1 && service?.timeSlot) {
      onChangeDate(service?.timeSlot);
      setSelectedDate(service?.timeSlot);
      setTimeSlot(service?.timeSlot?.format('h:mm a'));
    }
  }, [selectedServices, service]);

  useEffect(() => {
    const offDays = professionalProfileDetailsData?.ProAvailableDays.filter(
      (day) => day.offDay,
    );

    setDisabledWeekdays(offDays);
  }, [professionalProfileDetailsData]);

  const onBadgeClick = (time) => {
    console.log(time);
    setTimeSlot(timeSlot === time ? '' : time);

    if (service?.type == 2) {
      let availibilityObj = sessionAvailibilities?.find((availibility) => {
        const availableDate = moment(
          availibility.date + 'T' + availibility.fromTime + '.000Z',
        ).format('h:mm a');

        return availableDate == time;
      });

      if (!!availibilityObj) {
        setSeats(availibilityObj.availableSeats || 0);
        setGroupSessionId(availibilityObj.id);
      }
    }
  };

  const onApply = () => {
    if (service.type === 2 && selectedDate && timeSlot && availableSeat == 0) {
      return;
    }
    console.log('selectedDate', selectedDate, timeSlot);
    const formattedDate = moment(selectedDate).format('DD-MM-YYYY');

    const newSelectedServices = selectedServices.map((s) =>
      s.id === service.id
        ? {
            ...s,
            timeSlot: moment(formattedDate + timeSlot, 'DD-MM-YYYYh:mm a'),
            totalDuration: duration,
          }
        : s,
    );
    console.log('newSelectedServices', newSelectedServices);
    setServices(newSelectedServices);
    setVisible(false);
  };

  const onRequestClose = () => {
    setVisible(false);
    setMonth('');
    if (
      selectedServices?.length === 1 &&
      !walkin &&
      (!selectedDate || selectedDate === '' || !timeSlot || timeSlot === '')
    )
      navigation.goBack();
    setServices(selectedServices.filter((s) => s.timeSlot));
  };

  const chooseDate = (date) => {
    console.log('in choose date');
    if (service.type == 1) {
      onChangeDate(date);
    } else {
      console.log('check1');
      let availibilityObj = {};
      setSelectedDate(date);
      setTimeSlot('');
      const newSlots = sessionAvailibilities?.reduce((acc, availibility) => {
        const availableDate = moment(
          availibility.date + 'T' + availibility.fromTime + '.000Z',
        );

        availibilityObj = availibility;
        let comparison;
        if (
          !!professionalProfileDetailsData?.ProMetas.length > 0 &&
          !!professionalProfileDetailsData?.ProMetas[0]?.bookingHours
        ) {
          comparison = moment().add(
            professionalProfileDetailsData?.ProMetas[0]?.bookingHours,
            'minutes',
          );
        } else {
          comparison = moment();
        }
        return availableDate.isSame(date, 'day') &&
          availableDate.isAfter(comparison) &&
          acc.findIndex((m) => m == availableDate.format('h:mm a')) == -1
          ? [...acc, availableDate.format('h:mm a')]
          : acc;
      }, []);

      newSlots ? setSlots(newSlots) : setSlots([]);
    }
  };

  /**
   * This method will call on Modal show hide.
   */
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  return (
    <>
      <RNModal
        //animationType="slide"
        transparent={true}
        isVisible={isVisible}
        onRequestClose={onRequestClose}
        onSwipeComplete={() => setVisible(false)}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        hasBackdrop={true}
        avoidKeyboard={true}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        backdropColor="rgba(0,0,0,0.5)"
        style={commonStyle.bottomModal}>
        <View>
          <View
            style={[
              commonStyle.modalCalender,
              {
                paddingTop: 10,
                paddingBottom:
                  (!!timeSlot && timeSlot !== '') ||
                  (selectedDate !== '' && daySlots?.length === 0)
                    ? 80
                    : 0,
              },
            ]}>
            <View style={commonStyle.horizontalPadd}>
              <TouchableOpacity
                style={[commonStyle.termswrap, commonStyle.mb1, {height: 15}]}
                onPress={() => setVisible(!isVisible)}>
                <Text
                  style={{
                    backgroundColor: '#ECEDEE',
                    width: 75,
                    height: 4,
                    borderRadius: 2,
                  }}></Text>
              </TouchableOpacity>
              <Text style={commonStyle.modalforgotheading}>Date and Time</Text>
            </View>
            {!!professionalProfileDetailsData ? (
              <ScrollView
                ref={scrollViewRef}
                onScroll={handleOnScroll}
                scrollEventThrottle={10}
                showsVerticalScrollIndicator={false}
                style={{marginTop: 10}}>
                <View style={[commonStyle.horizontalPadd, {paddingBottom: 30}]}>
                  <CalendarPicker
                    startFromMonday
                    onDateChange={chooseDate}
                    previousComponent={
                      <MaterialIcons name="chevron-left" size={25} />
                    }
                    nextComponent={
                      <MaterialIcons name="chevron-right" size={25} />
                    }
                    minDate={moment()}
                    dayLabelsWrapper={{
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                    }}
                    disabledDates={(date) => {
                      if (service.type == 2) {
                        const availability = sessionAvailibilities.find(
                          (availibility) =>
                            moment(availibility.date, 'YYYY-MM-DD').isSame(
                              date,
                              'day',
                            ),
                        );

                        return !availability && date;
                      }
                      if (selectedServices?.length <= 1) {
                        const weekDay = disabledWeekdays?.find(
                          (weekDay) =>
                            weekDay.dayValue - 1 === moment(date).day(),
                        );

                        return !!weekDay && date;
                      } else if (selectedDate) {
                        return !selectedDate?.isSame(date, 'days');
                      }
                    }}
                    selectedStartDate={moment(
                      selectedDate,
                      'D MMM YYYY - h:mm a',
                    )}
                    selectedDayStyle={{
                      borderRadius: 10,
                      backgroundColor: Colors.orange,
                    }}
                    selectedDayTextColor={Colors.white}
                    todayBackgroundColor={Colors.white}
                    todayTextStyle={{
                      color: moment().isSame(selectedDate, 'day')
                        ? Colors.white
                        : Colors.orange,
                    }}
                    selectedDayColor={Colors.orange}
                    allowRangeSelection={false}
                    onMonthChange={(month) => setMonth(month)}
                    maxDate={moment()
                      .clone()
                      .add(
                        professionalProfileDetailsData?.ProMetas[0]
                          ?.availableWindow ?? 365,
                        'day',
                      )
                      .toISOString()}
                  />

                  <Divider style={{marginVertical: 15}} />

                  {(month === '' ||
                    selectedDate === '' ||
                    moment(month).isSame(selectedDate, 'month')) && (
                    <FlatList
                      data={daySlots}
                      horizontal={false}
                      scrollEnabled={true}
                      renderItem={({item}) => {
                        return (
                          <TouchableOpacity
                            style={{
                              flexWrap: 'wrap',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => onBadgeClick(item)}>
                            <Badge
                              value={item}
                              badgeStyle={
                                item === timeSlot
                                  ? styles.activeBadge
                                  : styles.badge
                              }
                              textStyle={{
                                fontSize: 14,
                                textAlign: 'center',
                                fontFamily: 'SofiaPro',
                                color:
                                  item === timeSlot
                                    ? Colors.white
                                    : Colors.textgray,
                              }}
                            />
                          </TouchableOpacity>
                        );
                      }}
                      contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}
                      ListEmptyComponent={() => {
                        console.log('SD:', selectedDate);
                        // selectedDate !== '' && service.type != 2 ? (
                        return selectedDate !== '' ? (
                          <View style={commonStyle.notimeslotsWrap}>
                            <View style={commonStyle.noslotsclendariconbg}>
                              <Image
                                style={commonStyle.noslotsclendarimg}
                                source={require('../../assets/images/calender-img.png')}
                              />
                            </View>
                            <Text
                              style={[
                                commonStyle.blackTextR,
                                commonStyle.textCenter,
                              ]}>
                              There’re no available slots in this day.
                            </Text>
                          </View>
                        ) : (
                          <Text style={[commonStyle.textdategray]}>
                            Please select a date
                          </Text>
                        );
                      }}
                      // ListEmptyComponent={() =>
                      //   // selectedDate !== '' && service.type != 2 ? (
                      //   selectedDate === '' ? (
                      //     <Text style={[commonStyle.textdategray]}>
                      //       Please select a date
                      //     </Text>
                      //   ) : (
                      //     <View style={commonStyle.notimeslotsWrap}>
                      //       <View style={commonStyle.noslotsclendariconbg}>
                      //         <Image
                      //           style={commonStyle.noslotsclendarimg}
                      //           source={require('../../assets/images/calender-img.png')}
                      //         />
                      //       </View>
                      //       <Text
                      //         style={[
                      //           commonStyle.blackTextR,
                      //           commonStyle.textCenter,
                      //         ]}>
                      //         There’re no available slots in this day.
                      //       </Text>
                      //     </View>
                      //   )
                      // }
                    />
                  )}
                  {selectedServices[0]?.type == 2 && (
                    <>
                      <View
                        style={{
                          ...commonStyle.dividerfull,
                          marginVertical: 15,
                        }}
                      />
                      {selectedDate &&
                      timeSlot &&
                      (availableSeat || availableSeat == 0) ? (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={styles.userIcon}>
                            <UserSingle />
                          </View>
                          <Text style={commonStyle.blackTextR}>
                            {availableSeat > 0
                              ? `${availableSeat} seats left`
                              : 'Sorry! No seat left!'}
                          </Text>
                        </View>
                      ) : null}
                    </>
                  )}
                </View>
              </ScrollView>
            ) : (
              <ActivityLoaderSolid height={200} />
            )}
          </View>
        </View>
        {selectedDate !== '' && daySlots?.length === 0 && (
          <View
            style={[
              commonStyle.footerwrap,
              commonStyle.modalContent,
              styles.modalFooter,
              {
                elevation: 15,
              },
            ]}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                // title="Join the waitlist"
                title="Apply"
                disabled={true}
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
              />
            </View>
          </View>
        )}

        {!!timeSlot && timeSlot !== '' && (
          <View
            style={[
              commonStyle.footerwrap,
              commonStyle.modalContent,
              styles.modalFooter,
              {
                elevation: 15,
              },
            ]}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Apply"
                onPress={onApply}
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
              />
            </View>
          </View>
        )}
      </RNModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    height: Dimensions.get('window').height - 60,
    width: '100%',
    elevation: 10,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: Colors.orange,
    padding: 2,
    height: 32,
    minWidth: 75,
    width: 'auto',
    borderRadius: 24,
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    padding: 2,
    height: 32,
    minWidth: 75,
    width: 'auto',
    borderRadius: 24,
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignSelf: 'center',
    width: '100%',
  },
  emptyImg: {
    alignSelf: 'center',
    width: 30,
    height: 30,
  },
  circleImg: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 60,
    backgroundColor: Colors.lightViolet,
    marginBottom: 15,
  },
  modalFooter: {
    position: 'absolute',
    shadowColor: '#666',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    bottom: 0,
  },
  userIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.lightgray,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
