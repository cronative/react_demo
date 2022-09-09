import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import CheckBox from 'react-native-check-box';
import commonStyle from '../../assets/css/mainStyle';
import {ArrowUp, CheckedBox, UncheckedBox} from '../../components/icons';
import {formattedServiceDuration} from '../../utility/booking';

const AddBookingServicesModal = ({
  servicesData,
  selectedServices,
  setServices,
  setVisibleModal,
}) => {
  const navigation = useNavigation();
  const isAdded = (item) => {
    return !!selectedServices.find((s) => s.id === item.id);
  };

  const serviceSelected = (item, categoryColor) => {
    setServices({...item, categoryColor: categoryColor});
  };

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Select service</Text>
        <Text
          style={[commonStyle.grayText16]}
          onPress={() => setVisibleModal(null)}>
          Cancel
        </Text>
      </View>

      {servicesData?.rows?.map((category) =>
        category?.Services?.length > 0 ? (
          <View style={commonStyle.mt1} key={category.categoryId}>
            <View style={commonStyle.selectservicecategory}>
              <View style={commonStyle.searchBarText}>
                <Text
                  style={[
                    commonStyle.dotLarge,
                    {backgroundColor: category.categoryColor, marginLeft: 6},
                  ]}>
                  .
                </Text>
                <Text style={commonStyle.blackTextR}>
                  {category.categoryName}
                </Text>
              </View>
              <TouchableOpacity>
                <ArrowUp />
              </TouchableOpacity>
            </View>
            {category?.Services?.map((item, index) =>
              item.type != 2 ? (
                <TouchableOpacity
                  onPress={() => serviceSelected(item, category.categoryColor)}
                  key={index}
                  style={[commonStyle.selectserviceWrap]}>
                  <View style={[commonStyle.businessHoursarea]}>
                    <View style={{flexShrink: 1}}>
                      <CheckBox
                        isChecked={isAdded(item)}
                        style={{paddingRight: 10}}
                        checkedCheckBoxColor={'#ff5f22'}
                        uncheckedCheckBoxColor={'#e6e7e8'}
                        checkedImage={<CheckedBox />}
                        unCheckedImage={<UncheckedBox />}
                        onClick={() =>
                          serviceSelected(item, category.categoryColor)
                        }
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <View>
                        <Text style={[commonStyle.blackTextR]}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={[commonStyle.searchBarText]}>
                        <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>
                          ·
                        </Text>
                        <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>
                          {formattedServiceDuration(item)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text style={commonStyle.grayText16}>${item.amount}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <></>
              ),
            )}

            <View style={commonStyle.dividerlinefull} />
          </View>
        ) : null,
      )}
    </View>
  );
};

export default AddBookingServicesModal;
