import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
  PreviousArrow,
  NextArrow,
} from '../icons';
import {Button} from 'react-native-elements';

import commonStyle from '../../assets/css/mainStyle';

const StatisticsServicesModal = (props) => {
  const [servicesPopularitySelect, setServicesPopularitySelect] = useState(
    props.pieType,
  );

  const [tempPieType, setTempPieType] = useState(1); //type of pie chart (catyegory/servies). can be 1 or 2. 1=category pie,2=services pie

  /**
   * This method will call on Business Name Select.
   */
  const ServicesPopularitySelectHelper = (index, value) => {
    setServicesPopularitySelect(value);
  };
  /**
   * #######################.
   */

  const onApplyPieTypeHandler = () => {
    props.setPieType(tempPieType);
    props.setVisibleModal({visibleModal: null});
  };

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>
          Services popularity by
        </Text>
      </View>

      <View style={commonStyle.mt1}>
        <View style={commonStyle.mb2}>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={servicesPopularitySelect}
            onSelect={(index, value) => {
              ServicesPopularitySelectHelper(index, value);
              setTempPieType(value);
            }}>
            <RadioButton style={commonStyle.setupradioButton} value="1">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>Category</Text>
                {servicesPopularitySelect == 1 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
            <RadioButton style={commonStyle.setupradioButton} value="2">
              <View style={commonStyle.radioCustomView}>
                <Text style={commonStyle.blackTextR}>Services</Text>
                {servicesPopularitySelect == 2 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </View>
            </RadioButton>
          </RadioGroup>
        </View>
      </View>
      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <Button
          title="Apply"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          disabled={!servicesPopularitySelect}
          onPress={() => {
            onApplyPieTypeHandler();
          }}
        />
      </View>
    </View>
  );
};

export default StatisticsServicesModal;
