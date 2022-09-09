import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import commonStyle from '../../assets/css/mainStyle';

const BusinessHoursSelectTimeModal = (props) => {
  console.log('props.businessHoursItems', props);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [fromtimePickerVisible, setFromTimePickerVisible] = useState(false);
  const [toTimePickerVisible, setToTimePickerVisible] = useState(false);
  const [weekday, setWeekDay] = useState();
  const [validationErrorMessage, setValidationErrorMessage] = useState(null);
  const [businessTimeArray, setBusinessTimeArray] = useState(
    props.businessHoursItems[props.businessWeekDayIndex],
  );

  useEffect(() => {
    let daysInWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    setWeekDay(daysInWeek[props.businessWeekDayIndex]);
  }, []);

  const changeFromTimePicker = () => {
    setFromTimePickerVisible(!fromtimePickerVisible);
  };

  const changeToTimePicker = () => {
    setToTimePickerVisible(!toTimePickerVisible);
  };

  const handleTimeConfirm = (value, type) => {
    console.log(value);
    setValidationErrorMessage(null);
    const tempDate = moment(value);
    tempDate.set({
      second: 0,
    });
    const date = new Date(tempDate);
    if (type === 'from') {
      setFromTime(date);
      changeFromTimePicker();
    } else {
      setToTime(date);
      changeToTimePicker();
    }
  };

  const onSubmitSetTimeValue = () => {
    let isValidTime = true;
    if (fromTime > toTime) {
      setValidationErrorMessage(
        'To time must be equal or greater then start time',
      );
      return false;
    } else {
      if (businessTimeArray && businessTimeArray.availableTimeArray) {
        businessTimeArray.availableTimeArray.forEach((element, index) => {
          let oldFromTime = moment(element.fromTime);
          oldFromTime.set({
            second: 0,
          });
          oldFromTime = new Date(oldFromTime);

          let oldToTime = moment(element.toTime);
          oldToTime.set({
            second: 0,
          });
          oldToTime = new Date(oldToTime);
          if (
            (moment(fromTime) >= moment(oldFromTime) &&
              moment(fromTime) <= moment(oldToTime)) ||
            (moment(toTime) >= moment(oldFromTime) &&
              moment(toTime) <= moment(oldToTime))
          ) {
            setValidationErrorMessage('Time slot already exists');
            isValidTime = false;
            return false;
          }
          // else if (
          //   moment(oldFromTime) >= moment(fromTime) &&
          //   moment(fromTime) <= moment(oldToTime)
          // ) {
          //   setValidationErrorMessage('Time slot already exists');
          //   isValidTime = false;
          //   return false;
          // }
        });
        if (isValidTime) {
          setValidationErrorMessage(null);
          props.onSubmitSetTimeValue(fromTime, toTime);
        }
      } else {
        setValidationErrorMessage(null);
        props.onSubmitSetTimeValue(fromTime, toTime);
      }
    }
  };

  return (
    <>
      <View style={commonStyle.modalContent}>
        <View
          style={[
            commonStyle.dialogheadingbg,
            {borderBottomWidth: 0, paddingBottom: 0},
          ]}>
          <Text style={[commonStyle.modalforgotheading]}>
            Business hours. {weekday}
          </Text>
        </View>

        <View style={commonStyle.typeofServiceFilterWrap}>
          <View style={commonStyle.mb2}>
            <View style={commonStyle.commRow}>
              <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Start time
                </Text>
                <TouchableOpacity
                  onPress={changeFromTimePicker}
                  style={[
                    commonStyle.textInput,
                    {
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <Text>{fromTime && moment(fromTime).format('LT')}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={fromtimePickerVisible}
                  mode="time"
                  onConfirm={(value) => handleTimeConfirm(value, 'from')}
                  onCancel={changeFromTimePicker}
                />
              </View>
              <View style={[commonStyle.CommCol6, {paddingLeft: 5}]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  End time
                </Text>

                <TouchableOpacity
                  onPress={changeToTimePicker}
                  style={[
                    commonStyle.textInput,
                    {
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <Text>{toTime && moment(toTime).format('LT')}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={toTimePickerVisible}
                  mode="time"
                  onConfirm={(value) => handleTimeConfirm(value, 'to')}
                  onCancel={changeToTimePicker}
                />
              </View>
              <View>
                {validationErrorMessage ? (
                  <Text style={commonStyle.inputfielderror}>
                    {validationErrorMessage}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
      {fromTime && toTime ? (
        <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
          <Button
            title="Save"
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={() => onSubmitSetTimeValue()}
          />
        </View>
      ) : null}
    </>
  );
};

export default BusinessHoursSelectTimeModal;
