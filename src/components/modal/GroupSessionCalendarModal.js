import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {Button} from 'react-native-elements';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {professionalProfileDetailsRequest} from '../../store/actions';
import {getSlotsRequest} from '../../store/actions/bookingAction';
import {NextArrow, PreviousArrow} from '../icons';
import global from '../../components/commonservices/toast';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import {Delete} from '../../api/apiAgent';

const GroupSessionCalendarModal = ({
  duration,
  onApply,
  sessionDateTimes,
  dateTimeIndex,
  isVisible,
  setVisibleModal,
  differentSessionDates,
  setViewBookingRedirectionId,
  fetchSessionsData,
  setNumberOfBookedSeats,
}) => {
  const dispatch = useDispatch();
  const [servicesFilterSelect, setServicesFilterSelect] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [timeSlot, setTimeSlot] = useState([]);

  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const slots = useSelector((state) => state.bookingReducer.slots);
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  )?.data;

  useEffect(() => {
    console.log(
      'professionalProfileDetailsData: ',
      professionalProfileDetailsData,
    );
  }, [professionalProfileDetailsData]);

  useEffect(() => {
    if (isVisible) {
      console.log('Duration: ', duration);
      dispatch(professionalProfileDetailsRequest({proId: profileData?.id}));
      dispatch(getSlotsRequest({proId: profileData?.id}));
    }
  }, [isVisible]);

  useEffect(() => {
    console.log('dateTimeIndex', dateTimeIndex, sessionDateTimes);
    if (dateTimeIndex != null && sessionDateTimes.length > 0) {
      const dateTime = sessionDateTimes[dateTimeIndex];
      console.log('filter', dateTime);
      setSelectedStartDate(moment(dateTime).format('YYYY-MM-DD'));
      setSelectedStartTime(moment(dateTime).format('HH:mm:ss'));
      onDateChange(dateTime);
    }
  }, [dateTimeIndex, sessionDateTimes]);

  useEffect(() => {
    if (
      dateTimeIndex != null &&
      sessionDateTimes.length > 0 &&
      timeSlot.length > 0
    ) {
      const dateTime = sessionDateTimes[dateTimeIndex];
      console.log('find time slot', dateTime.format('h:mm a'));
      const selectedSlotIndex = timeSlot.findIndex(
        (slot) => slot == dateTime.format('h:mm a'),
      );
      setServicesFilterSelect(selectedSlotIndex);
    }
  }, [timeSlot, dateTimeIndex, sessionDateTimes]);

  const inBetweenOtherServices = (slotStartTime, slotToTime) => {
    console.log('between inBetweenOtherServices', sessionDateTimes);
    if (sessionDateTimes.length == 0) return false;

    const inBetweenService =
      sessionDateTimes?.length > 0 &&
      sessionDateTimes.find((s, index) => {
        if (index === dateTimeIndex) return false;

        const serviceStartTime = s;
        const serviceEndTime = s.clone().add(duration, 'minutes');
        console.log('totalDuration', duration);
        console.log(
          'checking inBetweenOtherServices',
          serviceStartTime.format('DD-MM-YYYY h:mm:ss a'),
          serviceEndTime.format('DD-MM-YYYY h:mm:ss a'),
          slotStartTime.format('DD-MM-YYYY h:mm:ss a'),
          slotToTime.format('DD-MM-YYYY h:mm:ss a'),
          serviceStartTime.diff(
            slotStartTime.clone().add(-moment().utcOffset(), 'm'),
            'minute',
          ),
          slotStartTime.isBetween(
            serviceStartTime,
            serviceEndTime,
            'minutes',
            '[]',
          ),
          slotToTime.isBetween(
            serviceStartTime,
            serviceEndTime,
            'minutes',
            '[]',
          ),
        );
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

  // This method will call on Calendar.
  const onDateChange = (date) => {
    let dateFormat = moment(date).format('YYYY-MM-DD');
    setSelectedStartDate(dateFormat);

    const selectedDate = date;
    const proDay = professionalProfileDetailsData?.ProAvailableDays.find(
      (day) => day.dayValue - 1 === moment(selectedDate, 'YYYY-MM-DD').day(),
    );

    const newSlots = proDay?.ProAvailableTimes.reduce((acc, time) => {
      let intervalInMins = 30; // intervalInMinutes(service, time);

      const totalDuration = duration;
      const fromTime = moment(dateFormat + ' ' + time.fromTime);
      const toTime = moment(dateFormat + ' ' + time.toTime);
      let finalSlotTime = fromTime;
      console.log(
        'while loop',
        fromTime.format('h:mm a'),
        toTime.format('h:mm a'),
        finalSlotTime
          .clone()
          .add(intervalInMins, 'minutes')
          .isSameOrBefore(toTime),
        finalSlotTime.isAfter(moment()),
      );
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
          finalSlotTime = finalSlotTime.add(intervalInMins, 'minutes');
          continue;
        } else if (!finalSlotTime.isAfter(moment())) {
          finalSlotTime = finalSlotTime.add(intervalInMins, 'minutes');
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
        console.log('bookedSlot', bookedSlot);
        acc =
          bookedSlot ||
          inBetweenOtherServices(
            finalSlotTime,
            finalSlotTime.clone().add(duration, 'minutes'),
          ) ||
          acc.indexOf(finalSlotTime.format('h:mm a')) > -1
            ? acc
            : [...acc, finalSlotTime.format('h:mm a')];
        finalSlotTime = finalSlotTime.add(30, 'minutes');
      }

      return acc;
    }, []);

    setTimeSlot(newSlots || []);
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

  const applySessionTime = () => {
    console.log(
      'selectedStartTime',
      selectedStartTime,
      selectedStartDate,
      moment(selectedStartDate + ' ' + selectedStartTime),
    );
    if (!!selectedStartDate && !!selectedStartTime) {
      onApply(moment(selectedStartDate + ' ' + selectedStartTime));
    }
  };

  // This function is to set tye time
  const setTime = (time) => {
    // console.log(
    //   'time',
    //   moment(`${selectedStartDate} ${time}`, 'YYYY-MM-DD h:mm a'),
    // );
    setSelectedStartTime(
      moment(`${selectedStartDate} ${time}`, 'YYYY-MM-DD h:mm a').format(
        'HH:mm:ss',
      ),
    );
  };

  const onDelete = () => {
    // console.log(differentSessionDates[dateTimeIndex].id)
    Delete('pro/group-session/' + differentSessionDates[dateTimeIndex].id)
      .then((response) => {
        console.log(response);
        fetchSessionsData();
        setVisibleModal(null);

        global.showToast('Deleted Successfully', 'success');
      })
      .catch((error) => {
        setViewBookingRedirectionId(
          error.response.data.data[0].reservationDisplayId,
        );
        setNumberOfBookedSeats(error.response.data.data.length);

        setVisibleModal('CantDeleteGSModalWithRedirect');
        setTimeout(() => setVisibleModal(null), 5000);

        // console.log(error.response.data.data[0].reservationDisplayId)
      });
  };

  return !!professionalProfileDetailsData ? (
    <View style={commonStyle.modalContent}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={[
            commonStyle.dialogheadingbg,
            {borderBottomWidth: 0, paddingBottom: 0},
          ]}>
          <Text style={[commonStyle.modalforgotheading]}>Date & Time</Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Text style={commonStyle.grayText16}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={[commonStyle.typeofServiceFilterWrap, commonStyle.mb15]}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={false}
          minDate={moment()}
          maxDate={new Date(2050, 6, 3)}
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
          todayBackgroundColor={'#fff'}
          todayTextStyle={{
            color: moment().isSame(
              moment(selectedStartDate, 'YYYY-MM-DD'),
              'day',
            )
              ? '#fff'
              : '#F36A46',
          }}
          selectedDayColor="#F36A46"
          selectedDayTextColor="#ffffff"
          scaleFactor={375}
          customDayHeaderStyles={customDayHeaderStylesCallback}
          textStyle={{
            fontFamily: 'SofiaPro',
            color: '#110F17',
          }}
          selectedStartDate={selectedStartDate}
          disabledDates={(date) => {
            const offDay =
              professionalProfileDetailsData?.ProAvailableDays?.find((day) => {
                return day.offDay && day.dayValue - 1 === date.day();
              });
            return offDay && date;
          }}
          onDateChange={onDateChange}
        />
      </View>
      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <RadioGroup
            style={[commonStyle.filtergroup, {paddingLeft: 5, fontSize: 0}]}
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
                style={[
                  commonStyle.radiofiltercol,
                  {width: 72, paddingTop: 6, fontSize: 0},
                ]}
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

          {!!selectedStartDate && timeSlot?.length === 0 && (
            <View>
              <Text style={[commonStyle.textdategray, {textAlign: 'center'}]}>
                There’re no available slots in this day
              </Text>
            </View>
          )}
          <Button
            title="Apply"
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={applySessionTime}
            disabled={!selectedStartTime || !selectedStartDate}
          />
        </View>
      </View>
    </View>
  ) : (
    <ActivityLoaderSolid height={200} />
  );
};

export default GroupSessionCalendarModal;
