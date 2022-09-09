import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
  PreviousArrow,
  NextArrow,
} from '../icons';

import commonStyle from '../../assets/css/mainStyle';

const CancellationRuleModal = ({
  navigation,
  tempCancelRule,
  setTempCancelRule,
}) => {
  const [dataSelect, setDataSelect] = useState(null);
  const [cancellationRuleSelect, setCancellationRule] = useState(
    tempCancelRule || null,
  );

  /**
   * This method will call on Business Name Select.
   */
  const CancellationRuleHelper = (index, value) => {
    //setDataSelect(value);
    setCancellationRule(value);
    setTempCancelRule(value);
    console.log(value);
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
        <Text style={[commonStyle.modalforgotheading]}>Cancellation rule</Text>
      </View>

      <View style={commonStyle.mt1}>
        <View style={commonStyle.mb2}>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={cancellationRuleSelect}
            onSelect={(index, value) => {
              CancellationRuleHelper(index, value);
            }}>
            <RadioButton style={commonStyle.setupradioButton} value="-1">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>
                  Free Cancellation - Cancel anytime
                </Text>
                {cancellationRuleSelect == -1 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
            <RadioButton style={commonStyle.setupradioButton} value="12">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>12 hours</Text>
                {cancellationRuleSelect == 12 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
            <RadioButton style={commonStyle.setupradioButton} value="24">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>24 hours</Text>
                {cancellationRuleSelect == 24 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
            <RadioButton style={commonStyle.setupradioButton} value="36">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>36 hours</Text>
                {cancellationRuleSelect == 36 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
            <RadioButton style={commonStyle.setupradioButton} value="48">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>48 hours</Text>
                {cancellationRuleSelect == 48 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
          </RadioGroup>
        </View>
      </View>
    </View>
  );
};

export default CancellationRuleModal;
