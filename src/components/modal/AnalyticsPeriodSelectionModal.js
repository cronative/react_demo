import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalendarPicker from 'react-native-calendar-picker';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {analyticsStatsPeriodTypes} from '../../utility/staticData';
import {
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
  PreviousArrow,
  NextArrow,
} from '../icons';
import {Button} from 'react-native-elements';

const AnalyticsPeriodSelectionModal = ({
  focussedSection,
  periodType,
  // setPeriodType,
  fromTime,
  toTime,
  range,
  radioIndex,
  // customDates,
  customDateErrorFlag,
  setCustomDateErrorFlag,
  onApplyTimeSelectionModal,
}) => {
  const [fromtimePickerVisible, setFromTimePickerVisible] = useState(false);
  const [toTimePickerVisible, setToTimePickerVisible] = useState(false);
  const [error, setError] = useState(null);

  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  // const [fromTimeProps, setFromTimeProps] = useState({});
  // const [toTimeProps, setToTimeProps] = useState({});

  const [fromTimeTemp, setFromTimeTemp] = useState(fromTime);
  const [toTimeTemp, setToTimeTemp] = useState(toTime);
  const [periodTypeTemp, setPeriodTypeTemp] = useState(periodType);
  const [radioSelectedIndex, setRadioSelectedIndex] = useState(
    Number(radioIndex) || 0,
  );

  useEffect(() => {
    setPeriodTypeTemp(range);
  }, [range]);

  useEffect(() => {
    let minDate = null;
    let maxDate = null;
    if (focussedSection == 'upcoming') {
      minDate = new Date(); // today

      let oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      maxDate = oneYearFromNow;

      setMinDate(minDate);
      setMaxDate(maxDate);
    } else if (
      focussedSection == 'profileViews' ||
      focussedSection == 'inspire_posts' ||
      focussedSection == 'inspire_saves'
    ) {
      let tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

      minDate = tenYearsAgo;
      maxDate = new Date();

      setMinDate(tenYearsAgo);
      setMaxDate(maxDate);
    } else {
      setMinDate(new Date(2018, 1, 1));
      setMaxDate(new Date(2050, 6, 3));
    }
  }, [focussedSection]);

  useEffect(() => {
    if (
      fromTimeTemp &&
      toTimeTemp &&
      fromTimeTemp != 'Invalid date' &&
      toTimeTemp != 'Invalid date'
    ) {
      // setFromTimeProps({ date: fromTimeTemp })
      // setToTimeProps({ date: toTimeTemp })

      if (customDateErrorFlag) setCustomDateErrorFlag(false);
    }
  }, [fromTimeTemp, toTimeTemp]);

  const onDateChange = (date, type) => {
    if (date) {
      if (type === 'END_DATE') {
        setToTimeTemp(date);
      } else {
        setFromTimeTemp(date);
        setToTimeTemp(null);
      }
    }
  };

  const onPeriodTypeChangeHandler = (index, value) => {
    setPeriodTypeTemp(value);
    setRadioSelectedIndex(index);
    if (value != 3) {
      setFromTimeTemp(null);
      setToTimeTemp(null);
    }
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

  const clearDates = () => {
    // setFromTime(null);
    // setToTime(null);
    setFromTimeTemp(null);
    setToTimeTemp(null);
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
                  {/* {periodType == item.value ? (
                    <CircleCheckedBoxActive />
                  ) : (
                    <CircleCheckedBoxOutline />
                  )} */}
                </View>
              </RadioButton>
            ))}
          </RadioGroup>
        </View>
      </View>

      {periodTypeTemp === 3 && (
        <View style={commonStyle.typeofServiceFilterWrap}>
          <View style={commonStyle.mb2}>
            <View style={commonStyle.commRow}>
              <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  From
                </Text>
                <TouchableOpacity
                // onPress={() => showFromTimePicker(true)}
                >
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      fromtimePickerVisible && commonStyle.focusinput,
                    ]}
                    editable={false}
                    placeholder="DD/MM/YYY"
                    value={
                      fromTimeTemp ? moment(fromTimeTemp).format('ll') : ''
                    }
                    // onTouchStart={() => showFromTimePicker(true)}
                  />
                </TouchableOpacity>
              </View>
              <View style={[commonStyle.CommCol6, {paddingLeft: 5}]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  To
                </Text>
                <TouchableOpacity
                // onPress={() => showToTimePicker(true)}
                >
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      toTimePickerVisible && commonStyle.focusinput,
                    ]}
                    placeholder="DD/MM/YYY"
                    value={toTimeTemp ? moment(toTimeTemp).format('ll') : ''}
                    editable={false}
                    // onTouchStart={() => showToTimePicker(true)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {fromTimeTemp || toTimeTemp ? (
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
                minDate={minDate}
                maxDate={maxDate}
                // minDate={new Date(2018, 1, 1)}
                // maxDate={new Date(2050, 6, 3)}
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
                selectedStartDate={fromTimeTemp ? fromTimeTemp : null}
                selectedEndDate={toTimeTemp ? toTimeTemp : null}
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
              />
            </View>
            {customDateErrorFlag ? (
              <Text style={commonStyle.inputfielderror}>
                Please Select both Starting and Ending Dates
              </Text>
            ) : null}
            <View></View>
          </View>
        </View>
      )}

      {periodTypeTemp == 3 && error && (
        <Text style={{color: '#f00', alignItems: 'center'}}>{error}</Text>
      )}

      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <Button
          title="Apply"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          onPress={() => {
            onApplyTimeSelectionModal(periodTypeTemp, fromTimeTemp, toTimeTemp);
          }}
          disabled={
            !periodTypeTemp ||
            (periodTypeTemp == 3 && !fromTimeTemp) ||
            (periodTypeTemp == 3 && !toTimeTemp)
          }
        />
      </View>
    </View>
  );
};

export default AnalyticsPeriodSelectionModal;
