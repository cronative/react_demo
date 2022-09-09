import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  TouchableOpacity,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {
  professionalProfileDetailsRequest,
  profileViewRequest,
} from '../../store/actions';
import {getSlotsRequest} from '../../store/actions/bookingAction';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import {NextArrow, PreviousArrow} from '../icons';

const BlockTimeModal = (props) => {
  const [fromTime, setFromTime] = useState(undefined);
  const [toTime, setToTime] = useState(undefined);
  const [fromTimeFormatted, setFromTimeFormatted] = useState('');
  const [toTimeFormatted, setToTimeFormatted] = useState('');
  const [fromtimePickerVisible, setFromTimePickerVisible] = useState(false);
  const [toTimePickerVisible, setToTimePickerVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  )?.data;
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const slots = useSelector((state) => state.bookingReducer.slots);

  const showFromTimePicker = () => {
    setFromTimePickerVisible(true);
  };

  const hideFromTimePicker = () => {
    setFromTimePickerVisible(false);
  };

  const handleFromTimeConfirm = (fromTime) => {
    hideFromTimePicker();
    setErrors({fromTime: null});
    setFromTime(undefined);
    setFromTimeFormatted('');
    props.setBlockFromTime(null);
    const derivedFromTime = moment(fromTime);

    if (derivedFromTime.isBefore(moment())) {
      setErrors({fromTime: 'From time cannot be before current time'});
      return;
    }

    if (!!toTime && derivedFromTime.isSameOrAfter(toTime)) {
      setErrors({fromTime: 'From time cannot be more than to time'});
      return;
    }

    if (
      professionalProfileDetailsData?.ProAvailableDays.find(
        (availableDay) =>
          derivedFromTime.clone().local().day() === availableDay.dayValue - 1,
      ).offDay
    ) {
      setErrors({fromTime: 'Can not block time on an off day'});
      return;
    }
    console.log('Slots: ', slots);
    const matchedSlot = slots.find((slot) =>
      moment(derivedFromTime).isBetween(
        moment(slot.dateTimeFrom),
        moment(slot.dateTimeTo),
        'minute',
        '[)',
      ),
    );

    if (!!matchedSlot?.reservationId) {
      setErrors({fromTime: 'Booking exists on selected block time'});
      return;
    } else if (!!matchedSlot?.isBlockedTime) {
      setErrors({fromTime: 'Block time exists on selected time'});
      return;
    }

    const formattedTime = derivedFromTime.isSame(moment(), 'day')
      ? 'Today, ' + derivedFromTime.clone().format('hh:mm a')
      : derivedFromTime.clone().format('ddd DD MMM, hh:mm a');
    setFromTime(fromTime);
    setFromTimeFormatted(formattedTime);
    props.setBlockFromTime(derivedFromTime.clone().utc().format());
  };

  const showToTimePicker = () => {
    setToTimePickerVisible(true);
  };

  const hideToTimePicker = () => {
    setToTimePickerVisible(false);
  };

  const handleToTimeConfirm = (toTime) => {
    setErrors({});
    hideToTimePicker();
    setToTime(undefined);
    setToTimeFormatted('');
    props.setBlockToTime(null);

    if (!!fromTime) {
      let derivedToTime = moment(toTime);
      derivedToTime.date(moment(fromTime).date());
      derivedToTime.month(moment(fromTime).month());
      derivedToTime.year(moment(fromTime).year());
      console.log(derivedToTime);

      if (derivedToTime.isBefore(moment())) {
        setErrors({toTime: 'To time cannot be before current time'});
        return;
      }

      if (!!fromTime && derivedToTime.isSameOrBefore(fromTime, 'minute')) {
        setErrors({toTime: 'To time cannot be less than or same as from time'});
        return;
      }

      const matchedSlot = slots.find(
        (slot) =>
          !slot.isCart &&
          (moment(derivedToTime).isBetween(
            moment(slot.dateTimeFrom),
            moment(slot.dateTimeTo),
            'minute',
            '(]',
          ) ||
            moment(slot.dateTimeFrom).isBetween(
              moment(fromTime),
              moment(derivedToTime),
              'minute',
              '[)',
            )),
      );

      if (!!matchedSlot?.reservationId) {
        setErrors({toTime: 'Booking exists on selected block time'});
        return;
      } else if (!!matchedSlot?.isBlockedTime) {
        setErrors({toTime: 'Block time exists on selected time'});
        return;
      }

      const formattedTime = derivedToTime.clone().format('hh:mm a');
      setToTime(derivedToTime);
      setToTimeFormatted(formattedTime);
      props.setBlockToTime(derivedToTime.clone().utc().format());
    } else {
      setErrors({toTime: 'From time must be provided before to time'});
    }
  };

  useEffect(() => {
    if (props.isVisible) {
      dispatch(profileViewRequest());
    }
  }, [props.isVisible]);

  useEffect(() => {
    if (profileData) {
      dispatch(professionalProfileDetailsRequest({proId: profileData?.id}));
      dispatch(getSlotsRequest({proId: profileData?.id}));
    }
  }, [profileData]);

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Block Time</Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        {!!professionalProfileDetailsData ? (
          <View style={commonStyle.mb2}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              From
            </Text>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => showFromTimePicker()}>
              <TextInput
                pointerEvents="none"
                style={[
                  commonStyle.textInput,
                  fromtimePickerVisible && commonStyle.focusinput,
                ]}
                placeholder="Block From"
                editable={false}
                returnKeyType="done"
                autoCapitalize={'none'}
                value={fromTimeFormatted}
              />
            </TouchableOpacity>
            <Text style={styles.error}>{errors.fromTime}</Text>
            <DateTimePickerModal
              minuteInterval={30}
              isVisible={fromtimePickerVisible}
              mode="datetime"
              date={fromTime}
              minimumDate={new Date()}
              onConfirm={handleFromTimeConfirm}
              onCancel={hideFromTimePicker}
            />
          </View>
        ) : (
          <ActivityLoaderSolid height={100} />
        )}
        {!!fromTime && (
          <View style={commonStyle.mb2}>
            <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
              To
            </Text>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => showToTimePicker(true)}>
              <TextInput
                pointerEvents="none"
                style={[
                  commonStyle.textInput,
                  toTimePickerVisible && commonStyle.focusinput,
                ]}
                placeholder="Block To Time"
                editable={false}
                returnKeyType="done"
                autoCapitalize={'none'}
                value={toTimeFormatted}
              />
            </TouchableOpacity>
            <Text style={styles.error}>{errors.toTime}</Text>
            <DateTimePickerModal
              minuteInterval={30}
              isVisible={toTimePickerVisible}
              mode="time"
              onConfirm={handleToTimeConfirm}
              onCancel={hideToTimePicker}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    color: Colors.theamRed,
    margin: 2,
  },
});

export default BlockTimeModal;
