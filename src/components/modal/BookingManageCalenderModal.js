import moment from 'moment';
import {Title} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
// import CalendarPicker from 'react-native-calendar-picker';
import {Calendar} from 'react-native-calendars';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {Get, PostPromiseIntact} from '../../api/apiAgent';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {
  professionalProfileDetailsRequest,
  profileViewRequest,
} from '../../store/actions';
import {
  getSlotsRequest,
  professionalBookingListRequest,
} from '../../store/actions/bookingAction';
import global from '../../components/commonservices/toast';
import ActivityLoaderSolid from '../ActivityLoaderSolid';

let initialDates = [];

const BookingManageCalenderModal = ({isVisible, setVisibleModal}) => {
  const dispatch = useDispatch();
  const [markedDates, setmarkedDates] = useState({});
  const [dynamicsText, setDynamicsText] = useState('Calendar');
  const [loading, setLoading] = useState(false);
  const [manage, setManage] = useState(false);

  //New States
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [blockedDays, setBlockedDays] = useState([]);
  const [bookingDays, setBookingDays] = useState([]);
  const [unManagedDays, setUnManagedDays] = useState([]);
  const [tempBlockDays, setTempBlockDays] = useState([]);
  const [tempUnBlockDays, setTempUnBlockDays] = useState([]);
  const [offDayCount, setOffDayCount] = useState(0);

  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  )?.data;
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const slots = useSelector((state) => state.bookingReducer.slots);

  // This method will call on Calendar.
  const onDateSelected = (calendarDate) => {
    console.log('Date: ', calendarDate);
    if (manage && moment(calendarDate.timestamp).month() == selectedMonth) {
      const date = moment(calendarDate.timestamp);
      console.log('Date Selected: ', date);
      if (
        bookingDays.findIndex((bookingDay) => date.isSame(bookingDay, 'day')) !=
        -1
      ) {
        global.showAlert(
          'You need to cancel this booking then you can make this day a non business day',
          'error',
        );
      } else if (
        blockedDays.findIndex((bookingDay) => date.isSame(bookingDay, 'day')) !=
        -1
      ) {
        global.showAlert('Blocked time already exists on this day', 'error');
      } else {
        let markedDatesLocal = JSON.parse(JSON.stringify(markedDates));

        if (
          tempBlockDays.findIndex((temp) => date.isSame(temp, 'day')) == -1 &&
          unManagedDays.findIndex((temp) => date.isSame(temp, 'day')) == -1
        ) {
          let currentDate = markedDatesLocal[date.format('YYYY-MM-DD')];
          currentDate.color = '#fff';
          currentDate.startingDay = false;
          currentDate.endingDay = false;
          let prevDate =
            markedDatesLocal[
              date.clone().subtract(1, 'd').format('YYYY-MM-DD')
            ];
          if (!!prevDate) {
            prevDate.endingDay = true;
          }

          let nextDate =
            markedDatesLocal[date.clone().add(1, 'd').format('YYYY-MM-DD')];
          if (!!nextDate) {
            nextDate.startingDay = true;
          }

          if (date.isSame(moment(), 'day')) {
            currentDate.textColor = undefined;
          }

          console.log(prevDate, currentDate, nextDate);
          setTempBlockDays([...tempBlockDays, date]);
          setmarkedDates(markedDatesLocal);
        } else {
          if (
            tempBlockDays.findIndex((temp) => date.isSame(temp, 'day')) != -1
          ) {
            let currentDate = markedDatesLocal[date.format('YYYY-MM-DD')];
            currentDate.color = '#FFE8E2';
            let prevDate =
              markedDatesLocal[
                date.clone().subtract(1, 'd').format('YYYY-MM-DD')
              ];
            if (!!prevDate) {
              prevDate.endingDay = false;
              if (prevDate.disabled) {
                currentDate.startingDay = true;
              }
            } else {
              currentDate.startingDay = true;
            }

            let nextDate =
              markedDatesLocal[date.clone().add(1, 'd').format('YYYY-MM-DD')];
            if (!!nextDate) {
              nextDate.startingDay = false;
              if (nextDate.disabled) {
                currentDate.endingDay = true;
              }
            } else {
              currentDate.endingDay = true;
            }

            if (date.isSame(moment(), 'day')) {
              currentDate.textColor = '#fff';
              currentDate.color = Colors.orange;
            }

            setTempBlockDays(
              tempBlockDays.filter((temp) => !date.isSame(temp, 'day')),
            );
          } else if (
            unManagedDays.findIndex((temp) => date.isSame(temp, 'day')) != -1 &&
            tempUnBlockDays.findIndex((temp) => date.isSame(temp, 'day')) != -1
          ) {
            let currentDate = markedDatesLocal[date.format('YYYY-MM-DD')];
            currentDate.color = '#fff';
            currentDate.startingDay = false;
            currentDate.endingDay = false;
            let prevDate =
              markedDatesLocal[
                date.clone().subtract(1, 'd').format('YYYY-MM-DD')
              ];
            if (!!prevDate) {
              prevDate.endingDay = true;
            }

            let nextDate =
              markedDatesLocal[date.clone().add(1, 'd').format('YYYY-MM-DD')];
            if (!!nextDate) {
              nextDate.startingDay = true;
            }

            if (date.isSame(moment(), 'day')) {
              currentDate.textColor = undefined;
            }

            setTempUnBlockDays(
              tempUnBlockDays.filter((temp) => !date.isSame(temp, 'day')),
            );
          } else {
            let currentDate = markedDatesLocal[date.format('YYYY-MM-DD')];
            currentDate.color = '#FFE8E2';
            let prevDate =
              markedDatesLocal[
                date.clone().subtract(1, 'd').format('YYYY-MM-DD')
              ];
            if (!!prevDate) {
              prevDate.endingDay = false;
              if (prevDate.disabled) {
                currentDate.startingDay = true;
              }
            } else {
              currentDate.startingDay = true;
            }

            let nextDate =
              markedDatesLocal[date.clone().add(1, 'd').format('YYYY-MM-DD')];
            if (!!nextDate) {
              nextDate.startingDay = false;
              if (nextDate.disabled) {
                currentDate.endingDay = true;
              }
            } else {
              currentDate.endingDay = true;
            }

            if (date.isSame(moment(), 'day')) {
              currentDate.textColor = '#fff';
              currentDate.color = Colors.orange;
            }

            setTempUnBlockDays([...tempUnBlockDays, date]);
          }

          setmarkedDates(markedDatesLocal);
        }
      }
    } else if (moment(calendarDate.timestamp).month() != selectedMonth) {
      onMonthChange(moment(calendarDate.timestamp).month());
    }
  };

  const onSubmit = async () => {
    const allRequestDatas = [];
    let serviceCalls = [];

    tempBlockDays.forEach((temp) => {
      allRequestDatas.push({
        blockFrom: moment(temp).clone().startOf('day').utc().format(),
        blockTo: moment(temp).clone().endOf('day').utc().format(),
      });
    });

    tempUnBlockDays.forEach((temp) => {
      allRequestDatas.push({
        blockFrom: moment(temp).clone().startOf('day').utc().format(),
        blockTo: moment(temp).clone().endOf('day').utc().format(),
        unblock: 1,
      });
    });

    console.log(allRequestDatas);

    allRequestDatas.forEach((data) => {
      serviceCalls.push(PostPromiseIntact('/pro/block-time/', data));
    });

    console.log('Service Calls: ', serviceCalls);

    try {
      let response = await Promise.all(serviceCalls);
      console.log(response);
      setManage(false);
      setDynamicsText('Calendar');
      setVisibleModal(false);
      global.showToast(
        'Blocking and unblocking time added successfully',
        'success',
      );
    } catch (error) {
      console.log(error);
      etManage(false);
      setDynamicsText('Calendar');
      setVisibleModal(false);
      global.showToast(
        'Blocking and unblocking time has not been saved',
        'error',
      );
    }
  };

  const onMonthChange = (month) => {
    console.log(month);
    if (month.year != selectedYear) {
      setSelectedYear(month.year);
    }
    setSelectedMonth(month.month - 1);
    setTempBlockDays([]);
    setTempUnBlockDays([]);
  };

  const changeMarking = () => {
    let lastEntry;
    let markedDatesLocal = JSON.parse(JSON.stringify(markedDates));
    if (!!markedDatesLocal) {
      if (manage) {
        console.log('Manage is on');
        Object.entries(markedDatesLocal).forEach(([key, value]) => {
          if (!value.disabled && !value.unManaged) {
            if (!lastEntry || lastEntry.disabled || lastEntry.unManaged) {
              value.startingDay = true;
            } else {
              lastEntry.endingDay = false;
              value.startingDay = false;
            }
            value.color = moment(key, 'YYYY-MM-DD').isBefore(moment(), 'day')
              ? undefined
              : moment(key, 'YYYY-MM-DD').isSame(moment(), 'day')
              ? Colors.orange
              : '#FFE8E2';

            value.textColor = moment(key, 'YYYY-MM-DD').isSame(moment(), 'day')
              ? '#fff'
              : undefined;
          } else {
            if (!!lastEntry && !lastEntry.disabled && !lastEntry.unManaged) {
              lastEntry.endingDay = true;
            }

            value.textColor = undefined;
          }

          value.dotColor = moment(key, 'YYYY-MM-DD').isBefore(moment(), 'day')
            ? '#fff'
            : !!value.dotColor
            ? '#FFE8E2'
            : undefined;
          lastEntry = value;
        });
      } else {
        console.log('Manage is off');
        Object.entries(markedDatesLocal).forEach(([key, value]) => {
          if (!value.disabled) {
            value.color = '#fff';
          }

          value.dotColor = moment(key, 'YYYY-MM-DD').isBefore(moment(), 'day')
            ? Colors.theamblack
            : !!value.dotColor
            ? Colors.orange
            : undefined;
          value.textColor = moment(key, 'YYYY-MM-DD').isSame(moment(), 'day')
            ? Colors.orange
            : undefined;
          lastEntry = value;
        });
      }
      if (!!lastEntry && !lastEntry.disabled && !lastEntry.unManaged) {
        lastEntry.endingDay = true;
      }
      setmarkedDates(markedDatesLocal);
    }
  };

  useEffect(() => {
    if (isVisible) {
      dispatch(profileViewRequest());
    }
  }, [isVisible]);

  useEffect(() => {
    if (profileData) {
      dispatch(professionalProfileDetailsRequest({proId: profileData?.id}));
      dispatch(getSlotsRequest({proId: profileData?.id}));
    }
  }, [profileData]);

  useEffect(() => {
    if (!!slots && Array.isArray(slots) && slots.length > 0) {
      console.log('Slots: ', slots);
      let blockedDaysLocal = [];
      let unManagedDaysLocal = [];

      slots.forEach((slot) => {
        if (
          slot.isCart ||
          !moment(slot.dateTimeFrom).isSame(
            new Date(selectedYear, selectedMonth, 1),
            'month',
          ) ||
          moment(slot.dateTimeFrom).isBefore(moment(), 'day')
        ) {
          console.log('Cart added slot');
        } else if (slot.isBlockedTime) {
          if (
            blockedDaysLocal.findIndex((blockedDay) =>
              moment(slot.dateTimeFrom).isSame(blockedDay, 'day'),
            ) == -1 &&
            moment(slot.dateTimeTo).diff(
              moment(slot.dateTimeFrom),
              'minutes',
              false,
            ) < 1439
          ) {
            blockedDaysLocal.push(moment(slot.dateTimeFrom));
          } else if (
            unManagedDaysLocal.findIndex((blockedDay) =>
              moment(slot.dateTimeFrom).isSame(blockedDay, 'day'),
            ) == -1 &&
            moment(slot.dateTimeTo).diff(
              moment(slot.dateTimeFrom),
              'minutes',
              false,
            ) === 1439
          ) {
            unManagedDaysLocal.push(moment(slot.dateTimeFrom));
          }
        }
        // else if (slot.reservationId) {
        //   if (
        //     bookingDaysLocal.findIndex((bookingDay) =>
        //       moment(slot.dateTimeFrom).isSame(bookingDay, 'day'),
        //     ) == -1
        //   ) {
        //     bookingDaysLocal.push(moment(slot.dateTimeFrom));
        //   }
        // }
      });
      console.log('Blocked Days: ', blockedDaysLocal);
      console.log('Unamanged Days: ', unManagedDaysLocal);
      setBlockedDays(blockedDaysLocal);
      setUnManagedDays(unManagedDaysLocal);
    }
  }, [slots, selectedMonth]);

  useEffect(() => {
    if (!!professionalProfileDetailsData) {
      let startingDate;
      let endingDate;
      let markedDatesLocal = {};
      let offDays = 0;
      if (
        selectedMonth == moment().month() &&
        selectedYear == moment().year()
      ) {
        startingDate = moment();
      } else if (
        selectedMonth < moment().month() ||
        selectedYear < moment().year()
      ) {
        startingDate = undefined;
      } else {
        startingDate = moment(new Date(selectedYear, selectedMonth, 1));
      }

      if (!!startingDate) {
        endingDate = startingDate.clone().endOf('month');

        console.log(startingDate, endingDate);
        let lastEntry;
        while (startingDate.isSameOrBefore(endingDate, 'day')) {
          //* Check if off day
          let selectedDay =
            professionalProfileDetailsData?.ProAvailableDays.find(
              (availableDay) =>
                startingDate.day() === availableDay.dayValue - 1,
            );
          if (!selectedDay || selectedDay?.offDay) {
            offDays++;
            markedDatesLocal[startingDate.format('YYYY-MM-DD')] = {
              disabled: true,
              disableTouchEvent: true,
            };
            if (!!lastEntry && !lastEntry.disabled && !lastEntry.unManaged) {
              lastEntry.endingDay = true;
            }
          } else {
            //* Check if unManaged day
            if (
              unManagedDays.findIndex((blockedDay) =>
                startingDate.isSame(blockedDay, 'day'),
              ) != -1
            ) {
              markedDatesLocal[startingDate.format('YYYY-MM-DD')] = {
                color: '#fff',
                startingDay: false,
                endingDay: false,
                unManaged: true,
              };

              if (!!lastEntry && !lastEntry.disabled && !lastEntry.unManaged) {
                lastEntry.endingDay = true;
              }

              if (startingDate.isSame(moment(), 'day')) {
                markedDatesLocal[startingDate.format('YYYY-MM-DD')].color =
                  manage ? Colors.orange : '#fff';
                markedDatesLocal[startingDate.format('YYYY-MM-DD')].textColor =
                  manage ? '#fff' : Colors.orange;
              }
            }
            //* Check if booking day
            else if (
              bookingDays.findIndex((bookingDay) =>
                startingDate.isSame(bookingDay, 'day'),
              ) != -1
            ) {
              markedDatesLocal[startingDate.format('YYYY-MM-DD')] = {
                marked: true,
                dotColor: manage ? '#FFE8E2' : Colors.orange,
                color: manage ? '#FFE8E2' : '#fff',
              };

              if (!lastEntry || lastEntry.disabled || lastEntry.unManaged) {
                markedDatesLocal[
                  startingDate.format('YYYY-MM-DD')
                ].startingDay = true;
              }

              if (startingDate.isSame(moment(), 'day')) {
                markedDatesLocal[startingDate.format('YYYY-MM-DD')].color =
                  manage ? Colors.orange : '#fff';
                markedDatesLocal[startingDate.format('YYYY-MM-DD')].textColor =
                  manage ? '#fff' : Colors.orange;
              }
            } else {
              markedDatesLocal[startingDate.format('YYYY-MM-DD')] = {
                color: manage ? '#FFE8E2' : '#fff',
              };

              if (!lastEntry || lastEntry.disabled || lastEntry.unManaged) {
                markedDatesLocal[
                  startingDate.format('YYYY-MM-DD')
                ].startingDay = true;
              }

              if (startingDate.isSame(moment(), 'day')) {
                markedDatesLocal[startingDate.format('YYYY-MM-DD')].color =
                  manage ? Colors.orange : '#fff';
                markedDatesLocal[startingDate.format('YYYY-MM-DD')].textColor =
                  manage ? '#fff' : Colors.orange;
              }
            }
          }

          lastEntry = markedDatesLocal[startingDate.format('YYYY-MM-DD')];
          startingDate.add(1, 'd');
        }
        if (!!lastEntry && !lastEntry.disabled && !lastEntry.unManaged) {
          lastEntry.endingDay = true;
        }
      }

      bookingDays.forEach((booking) => {
        if (
          booking.isBefore(moment(), 'day') &&
          !markedDatesLocal[booking.format('YYYY-MM-DD')]?.marked
        ) {
          markedDatesLocal[booking.format('YYYY-MM-DD')] = {
            marked: true,
            dotColor: manage ? '#fff' : Colors.theamblack,
            color: '#fff',
          };
          offDays++;
        }
      });

      console.log(
        'Counts: ',
        Object.entries(markedDatesLocal).length,
        offDays,
        tempBlockDays.length,
        blockedDays.length,
        unManagedDays.length,
      );

      setOffDayCount(offDays);
      setmarkedDates(markedDatesLocal);
    }
  }, [
    selectedMonth,
    selectedYear,
    bookingDays,
    blockedDays,
    unManagedDays,
    professionalProfileDetailsData,
  ]);

  useEffect(() => {
    setTempBlockDays([]);
    changeMarking();
  }, [manage]);

  useEffect(() => {
    setBookingDays([]);
    Get(
      `/pro/booking/calendar?date=${moment(
        `${selectedYear}-${selectedMonth + 1}-01`,
        'YYYY-M-DD',
      )
        .startOf('month')
        .format('YYYY-MM-DD')}&toDate=${moment(
        `${selectedYear}-${selectedMonth + 1}-01`,
        'YYYY-M-DD',
      )
        .endOf('month')
        .format('YYYY-MM-DD')}`,
    )
      .then((response) => {
        let bookingDaysLocal = [];
        let blockTimeData = response.blockTimes.rows;

        bookingDaysLocal = blockTimeData.reduce((accumulator, blockedTime) => {
          if (blockedTime?.serviceId) {
            if (
              accumulator.findIndex((m) =>
                moment(m.date).isSame(moment(blockedTime.blockTimeFrom), 'day'),
              ) == -1 &&
              blockedTime?.status !== 4
            ) {
              accumulator.push(moment(blockedTime.blockTimeFrom));
            }
          }
          return accumulator;
        }, bookingDaysLocal);

        let rowsData = response.data.rows;
        bookingDaysLocal = rowsData.reduce((accumulator, row) => {
          if (
            accumulator.findIndex((m) => m.date == row.date) === -1 &&
            row.isCanceled !== 1 &&
            ((!!row.groupSessionId && !!row.Service) ||
              row.reservationServiceMetaId !== 0)
          ) {
            accumulator.push(moment(row.date + 'T' + row.time + '.000Z'));
          }
          return accumulator;
        }, bookingDaysLocal);

        console.log(
          'Booking Days: ',
          bookingDaysLocal,
          response.blockTimes.rows,
          response.data.rows,
        );
        setBookingDays(bookingDaysLocal);
      })
      .catch((error) => {});
  }, [selectedMonth, selectedYear]);

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        {/* Manage your calendar */}
        <Text style={[commonStyle.subtextbold]}>{dynamicsText}</Text>
        {/* <Text style={[commonStyle.grayText16]}>Cancel</Text> */}
        {!!professionalProfileDetailsData &&
          (manage ? (
            <TouchableOpacity
              style={[commonStyle.termswrap, commonStyle.mt2]}
              onPress={() => {
                setDynamicsText('Calendar');
                setManage(false);
              }}>
              <Text style={[commonStyle.grayText16]}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[commonStyle.termswrap, commonStyle.mt2]}
              onPress={() => {
                setDynamicsText('Manage your calendar');
                setManage(true);
              }}>
              <Text style={[commonStyle.textorange]}>Manage</Text>
            </TouchableOpacity>
          ))}
      </View>
      <Text style={[commonStyle.grayText16, !manage && commonStyle.mb15]}>
        You have{' '}
        <Title style={commonStyle.blackTextR}>
          {!!professionalProfileDetailsData
            ? Object.entries(markedDates).length -
              offDayCount -
              tempBlockDays.length -
              unManagedDays.length +
              tempUnBlockDays.length
            : 0}
        </Title>{' '}
        business days this month.
      </Text>
      {manage && (
        <Text style={[commonStyle.grayText16, commonStyle.mb15]}>
          Select dates to block or unblock
        </Text>
      )}

      {!!professionalProfileDetailsData ? (
        <Calendar
          minDate={new Date()}
          markingType={'period'}
          markedDates={markedDates}
          onDayPress={onDateSelected}
          onMonthChange={onMonthChange}
          theme={{
            //todayTextColor: Colors.orange,
            arrowColor: Colors.orange,
            textMonthFontSize: 18,
            textDayFontFamily: 'SofiaPro',
          }}
        />
      ) : (
        <ActivityLoaderSolid height={400} />
      )}
      {/* <CalendarPicker
        startFromMonday
        minDate={new Date()}
        maxDate={new Date(2050, 6, 3)}
        weekdays={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
        previousTitle={<PreviousArrow />}
        nextTitle={<NextArrow />}
        todayBackgroundColor="#F36A46"
        todayTextStyle={{color: '#fff'}}
        selectedDayColor="#FFE8E2"
        selectedDayTextColor="#110F17"
        scaleFactor={375}
        customDayHeaderStyles={customDayHeaderStylesCallback}
        textStyle={{
          fontFamily: 'SofiaPro',
          color: '#110F17',
        }}
        dayLabelsWrapper={{
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        customDatesStyles={customDateStyle}
        onDateChange={onDateChange}
        // onMonthChange={(month) => setMonth(month)}
        disabledDates={disabledDates}
      /> */}
      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        {manage && (
          <Button
            title="Save changes"
            containerStyle={[
              commonStyle.buttoncontainerothersStyle,
              {alignItems: 'center'},
            ]}
            loading={loading}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={onSubmit}
          />
        )}
      </View>
    </View>
  );
};

export default BookingManageCalenderModal;
