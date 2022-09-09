import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import CalendarPicker from 'react-native-calendar-picker';
import {PreviousArrow, NextArrow} from '../icons';

import commonStyle from '../../assets/css/mainStyle';

const BookingFlowDateTimeModal = ({navigation}) => {
  const [dataSelect, setDataSelect] = useState(null);
  const [servicesFilterSelect, setServicesFilterSelect] = useState(null);
  const [priceRangeFilterSelect, setPriceRangeFilterSelect] = useState(null);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  /**
   * This method will call on Calendar.
   */
  const onDateChange = (date, type) => {
    //function to handle the date change
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedEndDate(null);
      setSelectedStartDate(date);
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
  /**
   * #####################.
   */

  /**
   * This method will call on Service Fillter Select.
   */
  const servicesFilterSelectHelper = (index, value) => {
    setDataSelect(value);
    setServicesFilterSelect(index);
  };

  /**
   * This method will call on Price Range Select.
   */
  const priceRangeFilterSelectHelper = (index, value) => {
    setDataSelect(value);
    setPriceRangeFilterSelect(index);
  };

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Date & Time</Text>
      </View>
      <View style={[commonStyle.typeofServiceFilterWrap, commonStyle.mb15]}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={false}
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
          previousTitle={<PreviousArrow />}
          nextTitle={<NextArrow />}
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
        />
        {/* <View style={commonStyle.mt1}>
          <Text style={commonStyle.blackTextR18}>
            Selected Start Date :
          </Text>
          <Text style={commonStyle.grayText14}>
            {selectedStartDate ? selectedStartDate.toString() : ''}
          </Text>
          <Text style={commonStyle.blackTextR18}>
            Selected End Date :
          </Text>
          <Text style={commonStyle.grayText14}>
            {selectedEndDate ? selectedEndDate.toString() : ''}
          </Text>
        </View> */}
      </View>
      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View style={commonStyle.notimeslotsWrap}>
          <View style={commonStyle.noslotsclendariconbg}>
            <Image
              style={commonStyle.noslotsclendarimg}
              source={require('../../assets/images/calender-img.png')}
            />
          </View>
          <Text style={[commonStyle.blackTextR, commonStyle.textCenter]}>
            There’re no available slots in this day. You can join the waitlist
          </Text>
        </View>

        {/* TIME SLOTS RADIO BUTTON  */}

        {/* <View>
              <RadioGroup
								style={commonStyle.filtergroup}
								color='#ffffff'
								activeColor='#F36A46'
								highlightColor={'#F36A46'}                  
                selectedIndex={servicesFilterSelect}                  
                  onSelect={(index, value) => {
                    servicesFilterSelectHelper(index, value);
                  }}
              >
                  <RadioButton
									style={commonStyle.radiofiltercol}
                  value='0'
                  >
                  <Text style={servicesFilterSelect == 0 ? commonStyle.radiofiltertextactive : commonStyle.radiofiltertext}>10am</Text>
                  </RadioButton>
                  <RadioButton
                  	style={commonStyle.radiofiltercol}
                    value='1'
                  >
                  <Text style={servicesFilterSelect == 1 ? commonStyle.radiofiltertextactive : commonStyle.radiofiltertext}>11am</Text>
                  </RadioButton>
                  <RadioButton
                  	style={commonStyle.radiofiltercol}
                    value='2'
                  >
                  <Text style={servicesFilterSelect == 2 ? commonStyle.radiofiltertextactive : commonStyle.radiofiltertext}>2:30pm</Text>
                  </RadioButton>
                  <RadioButton
                  	style={commonStyle.radiofiltercol}
                    value='3'
                  >
                  <Text style={servicesFilterSelect == 3 ? commonStyle.radiofiltertextactive : commonStyle.radiofiltertext}>3pm</Text>
                  </RadioButton>
            </RadioGroup>
          </View> */}
      </View>
    </View>
  );
};

export default BookingFlowDateTimeModal;
