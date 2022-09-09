import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {CircleCheckedBoxOutline, CircleCheckedBoxActive} from '../icons';
import {AvailabilitywindowData} from '../../utility/staticData';

import commonStyle from '../../assets/css/mainStyle';

const AvailabilitySelectModal = ({
  navigation,
  setTempAvailibilityWindowValue,
  availibilityWindowValue,
}) => {
  const [availabilitySelect, setAvailabilitySelect] = useState(
    availibilityWindowValue || null,
  );

  /**
   * This method will call on Business Name Select.
   */
  const availabilitySelectHelper = (index, value) => {
    setTempAvailibilityWindowValue(value);
    setAvailabilitySelect(value);
  };
  /**
   * #######################.
   */

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>
          Availability window
        </Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={availabilitySelect}
            onSelect={(index, value) => {
              availabilitySelectHelper(index, value);
            }}>
            {AvailabilitywindowData.map((item, index) => (
              <RadioButton
                key={index}
                style={commonStyle.setupradioButton}
                value={item.value}>
                <View style={commonStyle.radioCustomView}>
                  <Text style={commonStyle.blackTextR}>
                    {item.availabilitywindow}
                  </Text>
                  {availabilitySelect == item.value ? (
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
    </View>
  );
};

export default AvailabilitySelectModal;
