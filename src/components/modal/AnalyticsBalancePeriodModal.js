import moment from 'moment';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {analyticsStatsPeriodTypes} from '../../utility/staticData';
import CalendarPicker from 'react-native-calendar-picker';
import {
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
  PreviousArrow,
  NextArrow,
} from '../icons';
import {Button} from 'react-native-elements';

const AnalyticsPeriodSelectionModal = ({
  periodType,
  setPeriodType,
  fromTime,
  setFromTime,
  toTime,
  setToTime,
  radioIndex,
  setRadioIndex,
  setVisibleModal,
}) => {
  const [fromtimePickerVisible, setFromTimePickerVisible] = useState(false);
  const [toTimePickerVisible, setToTimePickerVisible] = useState(false);
  const [error, setError] = useState(null);
  const [radioSelectedIndex, setRadioSelectedIndex] = useState(
    Number(radioIndex) || 0,
  );
  const [localPeriodType, setLocalPeriodType] = useState(periodType);
  const [localFromTime, setLocalFromTime] = useState(fromTime);
  const [localToTime, setLocalToTime] = useState(toTime);

  const onPeriodTypeChangeHandler = (index, value) => {
    setLocalPeriodType(value);
    setRadioSelectedIndex(index);
    if (value != 3) {
      setLocalFromTime(null);
      setLocalToTime(null);
    }
  };

  console.log(
    'IN MODAL. PERIOD TYPE: ',
    periodType,
    setPeriodType,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    radioIndex,
  );

  function disableFutureDates(startDate) {
    const beginDate = Date.parse(startDate);
    return (date) => {
      return Date.parse(date) > beginDate;
    };
  }

  const customDayHeaderStylesCallback = () => {
    return {
      textStyle: {
        color: '#110F17',
        fontFamily: 'SofiaPro',
        fontSize: 16,
      },
    };
  };

  const onDateChange = (date, type) => {
    if (date) {
      if (type === 'END_DATE') {
        setLocalToTime(date);
      } else {
        setLocalFromTime(date);
        setLocalToTime(null);
      }
    }
  };

  const clearDates = () => {
    setLocalFromTime(null);
    setLocalToTime(null);
  };

  const ApplyClicked = () => {
    setRadioIndex(radioSelectedIndex);
    setPeriodType(localPeriodType);
    if (localPeriodType === 3) {
      setFromTime(localFromTime);
      setToTime(localToTime);
    }
    setVisibleModal(null);
  };

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Period</Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={radioSelectedIndex}
            onSelect={(index, value) => {
              onPeriodTypeChangeHandler(index, value);
            }}>
            {analyticsStatsPeriodTypes.map((item, index) => (
              <RadioButton
                key={index}
                style={commonStyle.setupradioButton}
                value={item.value}>
                <View style={commonStyle.radioCustomView}>
                  <Text style={commonStyle.blackTextR}>{item.name}</Text>
                  {radioSelectedIndex == index ? (
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

      {localPeriodType === 3 && (
        <View style={commonStyle.typeofServiceFilterWrap}>
          <View style={commonStyle.mb2}>
            <View style={commonStyle.commRow}>
              <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  From
                </Text>
                <TouchableOpacity
                  onPress={() => setFromTimePickerVisible(true)}>
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      fromtimePickerVisible && commonStyle.focusinput,
                    ]}
                    onChangeText={(text) => setLocalFromTime(text)}
                    editable={false}
                    placeholder="DD/MM/YYY"
                    value={
                      localFromTime ? moment(localFromTime).format('ll') : ''
                    }
                    onTouchStart={() => setFromTimePickerVisible(true)}
                  />
                </TouchableOpacity>
              </View>
              <View style={[commonStyle.CommCol6, {paddingLeft: 5}]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  To
                </Text>
                <TouchableOpacity onPress={() => setToTimePickerVisible(true)}>
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      toTimePickerVisible && commonStyle.focusinput,
                    ]}
                    onChangeText={(text) => setLocalToTime(text)}
                    placeholder="DD/MM/YYY"
                    value={localToTime ? moment(localToTime).format('ll') : ''}
                    editable={false}
                    onTouchStart={() => setToTimePickerVisible(true)}
                  />
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            {localFromTime || localToTime ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginTop: 10,
                }}>
                <TouchableOpacity onPress={clearDates}>
                  <Text style={commonStyle.clearfilterText}>Clear Dates</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={commonStyle.mt2}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={new Date(2018, 1, 1)}
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
                selectedStartDate={localFromTime}
                selectedEndDate={localToTime}
                previousTitle={<PreviousArrow />}
                nextTitle={<NextArrow />}
                todayBackgroundColor="#fff"
                todayTextStyle={{
                  color: '#F36A46',
                }}
                selectedDayColor="#FFE8E2"
                selectedRangeStartStyle={{
                  backgroundColor: Colors.orange,
                }}
                selectedRangeStartTextStyle={{
                  color: '#fff',
                }}
                selectedRangeEndStyle={{
                  backgroundColor: Colors.orange,
                }}
                selectedRangeEndTextStyle={{
                  color: '#fff',
                }}
                scaleFactor={375}
                customDayHeaderStyles={customDayHeaderStylesCallback}
                textStyle={{
                  fontFamily: 'SofiaPro',
                  color: '#110F17',
                }}
                onDateChange={onDateChange}
                allowBackwardRangeSelect={true}
                disabledDates={disableFutureDates(new Date())}
              />
            </View>
          </View>
        </View>
      )}

      {error && (
        <Text style={{color: '#f00', alignItems: 'center'}}>{error}</Text>
      )}

      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <Button
          title="Apply"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          disabled={
            localPeriodType === 3 && (!localFromTime || !localToTime || !!error)
          }
          onPress={() => ApplyClicked()}
        />
      </View>
    </View>
  );
};

export default AnalyticsPeriodSelectionModal;
