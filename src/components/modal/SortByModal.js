import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {CircleCheckedBoxOutline, CircleCheckedBoxActive} from '../icons';
import {SortByData} from '../../utility/staticData';

import commonStyle from '../../assets/css/mainStyle';

const SortByModal = (props) => {
  console.log('SORT PROPS', props)
  const [sortBySelect, setSortBySelect] = useState(props.sort || null);

  /**
   * This method will call on Business Name Select.
   */
  const SortBySelectHelper = (index, value) => {
    setSortBySelect(value);
    props.setSort(value)
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
        <Text style={[commonStyle.modalforgotheading]}>Sort by</Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={sortBySelect}
            onSelect={(index, value) => {
              SortBySelectHelper(index, value);
            }}>
            {SortByData.map((item, index) => (
              <RadioButton
                key={index}
                style={commonStyle.setupradioButton}
                value={item.value}>
                <View style={commonStyle.radioCustomView}>
                  <Text style={commonStyle.blackTextR}>{item.sortbyTitle}</Text>
                  {sortBySelect == item.value ? (
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

export default SortByModal;
