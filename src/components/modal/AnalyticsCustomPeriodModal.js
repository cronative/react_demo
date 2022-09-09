import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import CalendarPicker from 'react-native-calendar-picker';
import {PreviousArrow, NextArrow, CheckedActiveHide, CheckedInactiveHide} from '../icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import CheckBox from '@react-native-community/checkbox';
import CheckBox from 'react-native-check-box'


import commonStyle from '../../assets/css/mainStyle';

const AnalyticsCustomPeriodModal = (props) => {


  const [selectedStartDate, setSelectedStartDate] = useState(props.date && props.date[0] || null);
  const [selectedEndDate, setSelectedEndDate] = useState(props.date && props.date[1] || null);


  const onDateChange = (date, type) => {
    //function to handle the date change
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
      props.setDateForFilter([selectedStartDate, date])
    } else {
      setSelectedEndDate(null);
      setSelectedStartDate(date);
      props.setDateForFilter([date, null])
    }
  };

  function disablePrevDates(startDate) {
  const startSeconds = Date.parse(startDate);
  return (date) => {
    return Date.parse(date) < startSeconds;
  }
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
  /**
   * #####################.
   */

  return (
    <View style={commonStyle.modalContent}>
        <View style={commonStyle.dialogheadingbg}>
            <Text style={[commonStyle.modalforgotheading]}>Custom Period</Text>
        </View>
        <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        minDate={new Date(2018, 1, 1)}
        maxDate={new Date(2050, 6, 3)}
        weekdays={['M','T','W','T','F','S','S']}
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
        previousTitle={<PreviousArrow/>}
        nextTitle={<NextArrow/>}
        todayBackgroundColor="#F36A46"
        selectedDayColor="#F36A46"
        selectedDayTextColor="#ffffff"
        scaleFactor={375}
        customDayHeaderStyles={customDayHeaderStylesCallback}
        textStyle={{
        fontFamily: 'SofiaPro',
        color: '#110F17',
        }}
        onDateChange={onDateChange}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        disabledDates={disablePrevDates(new Date())}
    />
    </View>
  );
};

export default AnalyticsCustomPeriodModal;
