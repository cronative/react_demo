import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import CalendarPicker from 'react-native-calendar-picker';
import {
  PreviousArrow,
  NextArrow,
  CheckedActiveHide,
  CheckedInactiveHide,
} from '../icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import CheckBox from '@react-native-community/checkbox';
import CheckBox from 'react-native-check-box';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';

import commonStyle from '../../assets/css/mainStyle';
const { width, height } = Dimensions.get('window');

const SearchFilterModal = (props) => {
  // const [servicesFilterSelect, setServicesFilterSelect] = useState(null);
  const [multiSliderValue, setMultiSliderValue] = useState([0, 1500]);
  const [loader, setLoader] = useState(false);

  const [selectedStartDate, setSelectedStartDate] = useState(
    props.date &&
      props.date[0] &&
      props.date[1] &&
      props.date[1] !== 'Invalid date'
      ? props.date[0]
      : null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    props.date &&
      props.date[0] &&
      props.date[1] &&
      props.date[1] !== 'Invalid date'
      ? props.date[1]
      : null,
  );
  console.log('CALENDAR INIT. STARING DATE: ', selectedStartDate);
  console.log('CALENDAR INIT. ENDING DATE: ', selectedEndDate);

  // This method is for handle the loader
  const handleLoader = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  };

  /**
   * This method will call on Calendar.
   */
  const onDateChange = (date, type) => {
    //function to handle the date change
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
      props.setDateFilter([selectedStartDate, date]);
      props.setIsFilterOptionSelected(true);
    } else {
      setSelectedEndDate(null);
      setSelectedStartDate(date);
      props.setDateFilter([date, null]);
      props.setIsFilterOptionSelected(true);
    }
  };

  function disablePrevDates(startDate) {
    const startSeconds = Date.parse(startDate);
    return (date) => {
      return Date.parse(date) < startSeconds;
    };
  }

  const radioStyles = {
    radiofiltercolactive: {
      paddingTop: 2,
      paddingBottom: 5,
      paddingLeft: 2,
      paddingRight: 0,
      marginRight: 8,
      marginBottom: 8,
      width: 'auto',
      height: 32,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#E6E7E8',
      backgroundColor: '#F36A46',
      ...commonStyle.aligncenter,
    },
  };

  const clearAllFilters = () => {
    // for visuals
    // props.setDataSelect(null)
    props.setIsFilterOptionSelected(false);
    // setServicesFilterSelect(null)
    setMultiSliderValue([0, 1500]);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    props.setDateFilter(null);

    // for state
    // props.setTypeOfServiceFilter(null)
    props.setIsInPerson(false);
    props.setIsMobile(false);
    props.setIsVirtual(false);
    props.setIsAll(false);
    props.setPriceRangeFilter([
      props.initialPriceRange[0],
      props.initialPriceRange[1],
    ]);

    // setTimeout(props.refreshPage, 1000)
    props.closeModal();
    // props.refreshPage()
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
   * This method will call on price range slider.
   */
  const priceRangeHelper = (values) => {
    // props.setDataSelect(values[0])
    props.setIsFilterOptionSelected(true);
    props.setPriceRangeFilter(values);
    setMultiSliderValue(values);
  };

  return (
    <View style={commonStyle.modalContent}>
      {loader ? <ActivityLoaderSolid /> : null}
      <View style={commonStyle.dialogheadingbg}>
        <Text style={[commonStyle.modalforgotheading]}>Filters</Text>
        {props.isFilterOptionSelected != false && (
          <TouchableOpacity
            onPress={() => {
              clearAllFilters();
            }}>
            <Text style={commonStyle.clearfilterText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
          Type of services
        </Text>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
          <View>
            <CheckBox
              value={props.isAll}
              onValueChange={(newValue) => {
                props.setDataSelect(newValue)
                props.setIsAll(newValue)
              }} 
            />
            <Text>All</Text>
          </View>
          <View>
            <CheckBox
              value={props.isInPerson}
              onValueChange={(newValue) => {
                props.setDataSelect(newValue)
                props.setIsInPerson(newValue)
              }} 
            />
            <Text>In-Person</Text>
          </View>
          <View>
            <CheckBox
              value={props.isMobile}
              onValueChange={(newValue) => {
                props.setDataSelect(newValue)
                props.setIsMobile(newValue)
              }} 
            />
            <Text>Mobile</Text>
          </View>
          <View>
            <CheckBox
              value={props.isVirtual}
              onValueChange={(newValue) => {
                props.setDataSelect(newValue)
                props.setIsVirtual(newValue)
              }} 
            />
            <Text>Virtual</Text>
          </View>
        </View> */}
        <View style={commonStyle.filtercheck}>
          <View
            style={
              props.isAll == false
                ? commonStyle.filteruncheckcol
                : commonStyle.filtercheckcol
            }>
            <CheckBox
              // onClick={ () => AllServiceSelectHelper()}
              // isChecked={isAllServicesChecked}
              onClick={() => {
                props.setIsFilterOptionSelected(true);
                props.setIsInPerson(false);
                props.setIsMobile(false);
                props.setIsVirtual(false);
                props.setIsAll((previousIsAllState) => !previousIsAllState);
                handleLoader();
              }}
              isChecked={props.isAll}
              leftText={'All'}
              leftTextStyle={
                props.isAll == false
                  ? commonStyle.filtertextuncheck
                  : commonStyle.filtertextcheck
              }
              checkedImage={<CheckedActiveHide />}
              unCheckedImage={<CheckedInactiveHide />}
            />
            <Text
              style={
                props.isAll == false
                  ? commonStyle.textunchecksize
                  : commonStyle.textchecksize
              }>
              All
            </Text>
          </View>

          <View
            style={
              props.isInPerson == false
                ? commonStyle.filteruncheckcol
                : commonStyle.filtercheckcol
            }>
            <CheckBox
              // onClick={ () => InPersonServiceSelectHelper()}
              // isChecked={isInPersonServicesChecked}
              onClick={() => {
                console.log('Calling...', props.isInPerson);
                props.setIsFilterOptionSelected(true);
                props.setIsInPerson((prevInPersonState) => !prevInPersonState);
                handleLoader();
              }}
              isChecked={props.isAll}
              leftText={'In-Person'}
              leftTextStyle={
                props.isInPerson == false
                  ? commonStyle.filtertextuncheck
                  : commonStyle.filtertextcheck
              }
              checkedImage={<CheckedActiveHide />}
              unCheckedImage={<CheckedInactiveHide />}
            />
            <Text
              style={
                props.isInPerson == false
                  ? commonStyle.textunchecksize
                  : commonStyle.textchecksize
              }>
              In-Person
            </Text>
          </View>

          <View
            style={
              props.isMobile == false
                ? commonStyle.filteruncheckcol
                : commonStyle.filtercheckcol
            }>
            <CheckBox
              // onClick={ () => MobleServiceSelectHelper()}
              // isChecked={isMobileServicesChecked}
              onClick={() => {
                props.setIsFilterOptionSelected(true);
                props.setIsMobile((prevIsMobileState) => !prevIsMobileState);
                handleLoader();
              }}
              isChecked={props.isMobile}
              leftText={'Mobile'}
              leftTextStyle={
                props.isMobile == false
                  ? commonStyle.filtertextuncheck
                  : commonStyle.filtertextcheck
              }
              checkedImage={<CheckedActiveHide />}
              unCheckedImage={<CheckedInactiveHide />}
            />
            <Text
              style={
                props.isMobile == false
                  ? commonStyle.textunchecksize
                  : commonStyle.textchecksize
              }>
              Mobile
            </Text>
          </View>

          <View
            style={
              props.isVirtual == false
                ? commonStyle.filteruncheckcol
                : commonStyle.filtercheckcol
            }>
            <CheckBox
              // onClick={ () => VirtualServiceSelectHelper()}
              // isChecked={isVirtualServicesChecked}
              onClick={() => {
                props.setIsFilterOptionSelected(true);
                props.setIsVirtual((prevIsVirtualState) => !prevIsVirtualState);
                handleLoader();
              }}
              isChecked={props.isVirtual}
              leftText={'Virtual'}
              leftTextStyle={
                props.isVirtual == false
                  ? commonStyle.filtertextuncheck
                  : commonStyle.filtertextcheck
              }
              checkedImage={<CheckedActiveHide />}
              unCheckedImage={<CheckedInactiveHide />}
            />
            <Text
              style={
                props.isVirtual == false
                  ? commonStyle.textunchecksize
                  : commonStyle.textchecksize
              }>
              Virtual
            </Text>
          </View>
        </View>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
          Price Range
        </Text>
        <View style={commonStyle.priceamountwrap}>
          <Text style={commonStyle.minpricerange}>
            ${props.priceRange ? props.priceRange[0] : '0'} -{' '}
          </Text>
          <Text style={commonStyle.maxpricerange}>
            ${props.priceRange ? props.priceRange[1] : '1500'}+
          </Text>
        </View>
        <Text style={commonStyle.grayText14}>
          The average price - $
          {props.priceRange
            ? (props.priceRange[0] + props.priceRange[1]) / 2
            : '0'}
        </Text>
        <View>
          <View style={{ position: 'relative', top: 25 }}>
            <Image
              source={require('../../assets/images/price-range-graph.png')}
              style={commonStyle.pricegraph}
              resizeMode={'contain'}
            />
          </View>
          <MultiSlider
            values={[props.priceRange[0], props.priceRange[1]]}
            selectedStyle={commonStyle.pricesliderselectedStyle}
            unselectedStyle={commonStyle.pricesliderunselectedStyle}
            markerStyle={commonStyle.priceslidermarkerStyle}
            pressedMarkerStyle={commonStyle.pricesliderpressedMarkerStyle}
            containerStyle={commonStyle.priceslidercontainerStyle}
            touchDimensions={{
              height: 30,
              width: 30,
              borderRadius: 20,
              slipDisplacement: 30,
            }}
            sliderLength={width - 40}
            // onValuesChange={priceRangeHelper}
            onValuesChangeFinish={priceRangeHelper}
            min={props.initialPriceRange[0]}
            max={
              props.initialPriceRange[0] === props.initialPriceRange[1]
                ? props.initialPriceRange[1] + 1
                : props.initialPriceRange[1]
            }
            step={1}
            minMarkerOverlapDistance={5}
            snapped
          />
        </View>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
          Date & Time
        </Text>

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
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          disabledDates={disablePrevDates(new Date())}
        />
        {selectedStartDate && !selectedEndDate && (
          <Text style={{ color: 'red', fontSize: 12 }}>
            Please Select Ending Date
          </Text>
        )}
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
    </View>
  );
};

export default SearchFilterModal;
