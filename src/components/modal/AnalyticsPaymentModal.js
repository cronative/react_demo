import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import commonStyle from '../../assets/css/mainStyle';
import {paymentMethods} from '../../utility/staticData';
import {CircleCheckedBoxActive, CircleCheckedBoxOutline} from '../icons';
import {Button} from 'react-native-elements';

const AnalyticsPaymentModal = ({
  paymentMethod,
  setPaymentMethod,
  setVisibleModal,
}) => {
  const [dataSelect, setDataSelect] = useState(null);

  const [paymentMethodLocal, setPaymentMethodLocal] = useState(
    paymentMethod || null,
  );

  /**
   * This method will call on Business Name Select.
   */
  const paymentMethodSelectHelper = (index, value) => {
    // setPaymentMethod(value);
    setPaymentMethodLocal(value);
    setDataSelect(index);
  };
  /**
   * #######################.
   */

  const onApply = () => {
    setPaymentMethod(paymentMethodLocal);
    setVisibleModal({visibleModal: null});
  };

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Payment type</Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <RadioGroup
            style={commonStyle.setupradioGroup}
            color="#ffffff"
            activeColor="#ffffff"
            highlightColor={'#ffffff'}
            selectedIndex={dataSelect}
            onSelect={(index, value) => {
              paymentMethodSelectHelper(index, value);
            }}>
            {paymentMethods.map((item, index) => (
              <RadioButton
                key={index}
                style={commonStyle.setupradioButton}
                value={item.value}>
                <View style={commonStyle.radioCustomView}>
                  <Text style={commonStyle.blackTextR}>{item.name}</Text>
                  {paymentMethodLocal == item.value ? (
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

      <View style={commonStyle.dividerlinefull} />
      <View style={commonStyle.typeofServiceFilterWrap}>
        <Button
          title="Save"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          onPress={onApply}
          disabled={!paymentMethodLocal}
        />
      </View>
    </View>
  );
};

export default AnalyticsPaymentModal;
