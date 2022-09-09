import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert, Text, Image, View} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {Button} from 'react-native-elements';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {professionalProfileDetailsRequest} from '../../store/actions';
import {getSlotsRequest} from '../../store/actions/bookingAction';
import {intervalInMinutes} from '../../utility/booking';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import {NextArrow, PreviousArrow} from '../icons';

const BookingRescheduleCalenderModal = ({
  type,
  dateRange,
  rescheduleBooking,
}) => {
  const dispatch = useDispatch();
  const [servicesFilterSelect, setServicesFilterSelect] = useState(null);
  // const [priceRangeFilterSelect, setPriceRangeFilterSelect] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const bookingData = useSelector(
    (state) =>
      state.bookingReducer[
        type === 'pro' ? 'profBookingInnerDetails' : 'userBookingDetails'
      ],
  );

  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const slots = useSelector((state) => state.bookingReducer.slots);
  const [timeSlot, setTimeSlot] = useState([]);

  // This method will call on Calendar.
  const onDateChange = (date, type) => {
    let dateFormat = moment(date).format('YYYY-MM-DD');
    setSelectedStartDate(dateFormat);
    setSelectedStartTime(null);
    setServicesFilterSelect(null);
  };

  const customDayHeaderStylesCallback = () => {
    return {
      textStyle: {
        color: '#110F17',
        fontFamily: 'SofiaPro',
        fontSize: 16,
      },
    };
  };

  // This method will call on Service Fillter Select.
  const servicesFilterSelectHelper = (index, value) => {
    setServicesFilterSelect(index);
  };

  const calenderdate = () => {
    if (selectedStartDate !== null && selectedStartTime !== null) {
      if (type === 'pro') {
        dateRange(selectedStartDate, selectedStartTime);
      } else {
        rescheduleBooking(selectedStartDate, selectedStartTime);
      }
    } else {
      Alert.alert(
        '',
        'Please select the date and time',
        [{text: 'OK', onPress: () => console.log('Ok Pressed')}],
        {cancelable: false},
      );
    }
  };

  // This function is to set tye time
  const setTime = (time) => {
    setSelectedStartTime(
      moment(`${selectedStartDate} ${time}`, 'YYYY-MM-DD h:mm a').format(
        'HH:mm:ss',
      ),
    );
  };

  useEffect(() => {
    if (
      bookingData?.data &&
      professionalProfileDetailsData &&
      !!selectedStartDate
    ) {
      const selectedDate = selectedStartDate;
      const proDay = professionalProfileDetailsData.ProAvailableDays.find(
        (day) => day.dayValue - 1 === moment(selectedDate, 'YYYY-MM-DD').day(),
      );
      console.log('\n\nPro Details: ', professionalProfileDetailsData, '\n\n');

      const newSlots = proDay?.ProAvailableTimes.reduce((acc, time) => {
        let intervalInMins = 30;
        const service =
          bookingData?.data?.[
            type === 'pro' ? 'Service' : 'ReservedServiceMeta'
          ];
        const totalDuration = intervalInMinutes(service, service);

        const fromTime = moment(selectedDate + ' ' + time.fromTime);
        const toTime = moment(selectedDate + ' ' + time.toTime).subtract(
          totalDuration,
          'minutes',
        );

        let finalSlotTime = moment(fromTime);

        while (finalSlotTime.isSameOrBefore(toTime)) {
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
            finalSlotTime = finalSlotTime.add(intervalInMins, 'minutes');
            continue;
          }
          if (finalSlotTime.isAfter(moment())) {
            const bookedSlot = slots.find((slot) => {
              if (!!slot.isCart) {
                return false;
              }

              const startFromTime = moment(slot.dateTimeFrom);
              const startToTime = moment(slot.dateTimeTo);
              const slotToTime = finalSlotTime
                .clone()
                .add(totalDuration, 'minutes');

              if (
                startFromTime.isBetween(
                  finalSlotTime,
                  slotToTime,
                  'minutes',
                  '[)',
                ) ||
                startToTime.isBetween(
                  finalSlotTime,
                  slotToTime,
                  'minutes',
                  '(]',
                ) ||
                finalSlotTime.isBetween(
                  startFromTime,
                  startToTime,
                  'minute',
                  '[)',
                )
              ) {
                return true;
              }
            });

            if (!bookedSlot) {
              acc.push(finalSlotTime.format('h:mm a'));
            }
          }

          finalSlotTime = finalSlotTime.add(intervalInMins, 'minutes');
        }

        return acc;
      }, []);

      setTimeSlot(newSlots);
    }
  }, [slots, bookingData, professionalProfileDetailsData, selectedStartDate]);

  useEffect(() => {
    dispatch(
      professionalProfileDetailsRequest({proId: bookingData?.data?.proId}),
    );
    dispatch(getSlotsRequest({proId: bookingData?.data?.proId}));
  }, [dispatch, bookingData]);

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Date & Time</Text>
      </View>
      {!!professionalProfileDetailsData ? (
        <View style={[commonStyle.typeofServiceFilterWrap, commonStyle.mb15]}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={false}
            minDate={moment()}
            weekdays={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
            months={[
              'January',
              'Febraury',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]}
            dayLabelsWrapper={{
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            previousTitle={<PreviousArrow />}
            nextTitle={<NextArrow />}
            todayBackgroundColor="#ffffff"
            todayTextStyle={{
              color:
                !!selectedStartDate &&
                moment(selectedStartDate, 'YYYY-MM-DD').isSame(moment(), 'day')
                  ? '#fff'
                  : '#F36A46',
            }}
            selectedDayColor="#F36A46"
            selectedDayTextColor="#fff"
            scaleFactor={375}
            customDayHeaderStyles={customDayHeaderStylesCallback}
            textStyle={{
              fontFamily: 'SofiaPro',
              color: '#110F17',
            }}
            disabledDates={(date) => {
              const offDay =
                professionalProfileDetailsData?.ProAvailableDays?.find(
                  (day) => day.offDay && day.dayValue - 1 === date.day(),
                );
              return offDay && date;
            }}
            onDateChange={onDateChange}
            maxDate={moment()
              .clone()
              .add(
                professionalProfileDetailsData?.ProMetas[0]?.availableWindow ??
                  365,
                'day',
              )
              .toISOString()}
          />
        </View>
      ) : (
        <ActivityLoaderSolid height={200} />
      )}
      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          {timeSlot?.length ? (
            <RadioGroup
              style={commonStyle.filtergroup}
              color="#ffffff"
              activeColor="#F36A46"
              highlightColor={'#F36A46'}
              selectedIndex={servicesFilterSelect}
              onSelect={(index, value) => {
                servicesFilterSelectHelper(index, value);
                setTime(value);
              }}>
              {timeSlot.map((item, index) => (
                <RadioButton
                  style={[commonStyle.radiofiltercol, {width: 72}]}
                  value={item}
                  key={index}>
                  <Text
                    style={
                      servicesFilterSelect == index
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    {item}
                  </Text>
                </RadioButton>
              ))}
            </RadioGroup>
          ) : (
            !!selectedStartDate && (
              <View style={commonStyle.notimeslotsWrap}>
                <View style={commonStyle.noslotsclendariconbg}>
                  <Image
                    style={commonStyle.noslotsclendarimg}
                    source={require('../../assets/images/calender-img.png')}
                  />
                </View>
                <Text style={[commonStyle.blackTextR, commonStyle.textCenter]}>
                  There’re no available slots in this day
                </Text>
              </View>
            )
          )}
          <Button
            title="Apply"
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={calenderdate}
          />
        </View>
      </View>
    </View>
  );
};

export default BookingRescheduleCalenderModal;
