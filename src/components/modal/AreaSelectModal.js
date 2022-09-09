import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {CircleCheckedBoxOutline, CircleCheckedBoxActive} from '../icons';
import {AreaCoverData} from '../../utility/staticData';

import commonStyle from '../../assets/css/mainStyle';

const AreaSelectModal = (props) => {
  console.log('props', props);
  // const [dataSelect, setDataSelect] = useState(null);
  const [areaCoverSelect, setAreaCoverSelect] = useState(
    props.mileageCoverOriginal || null,
  );

  /**
   * This method will call on Business Name Select.
   */
  const AreaCoverSelectHelper = (index, value) => {
    console.log(index, value);
    // setDataSelect(value);
    setAreaCoverSelect(value);
    props.onSelectAreaValue(AreaCoverData[index]);
  };
  /**
   * #######################.so
   */

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>The area I cover</Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={areaCoverSelect}
            onSelect={(index, value) => {
              AreaCoverSelectHelper(index, value);
            }}>
            {AreaCoverData.map((item, index) => (
              <RadioButton
                key={index}
                style={commonStyle.setupradioButton}
                value={item.value}>
                <View style={commonStyle.radioCustomView}>
                  <Text style={commonStyle.blackTextR}>
                    {item.coverAreaDistance}
                  </Text>
                  {areaCoverSelect == item.value ? (
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

export default AreaSelectModal;
