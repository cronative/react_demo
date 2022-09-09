import { Body, Left, List, ListItem } from 'native-base';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import commonStyle from '../../assets/css/mainStyle';
import {
  CircleCheckedBoxActive, CircleCheckedBoxOutline
} from '../icons';

const BookingFlowPaymentMethodModal = ({ navigation }) => {
  const [dataSelect, setDataSelect] = useState(null);
  const [paymentMethodSelect, setPaymentMethodSelect] = useState(0);

  const paymentMethodSelectHelper = (index, value) => {
    console.log('index', index, value);
    setDataSelect(value);
    setPaymentMethodSelect(index);
  };

  return (
    <View style={[commonStyle.modalContent, { height: 400, backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }]}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          { borderBottomWidth: 0, paddingBottom: 10 },
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Payment method</Text>
      </View>
      <View style={[commonStyle.typeofServiceFilterWrap, commonStyle.mb05, { height: 400 }]}>
        <RadioGroup
          style={commonStyle.setupradioGroup}
          color="#ffffff"
          activeColor="#ffffff"
          highlightColor={'#ffffff'}
          selectedIndex={paymentMethodSelect}
          onSelect={paymentMethodSelectHelper}>
          <RadioButton style={commonStyle.setupradioButton} value="0">
            <View
              style={
                paymentMethodSelect == 0
                  ? commonStyle.radiocustomizeborderactive
                  : commonStyle.radiocustomizeborder
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/mastercard.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>****0001</Text>
              </View>
              <TouchableHighlight>
                {paymentMethodSelect == 0 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </TouchableHighlight>
            </View>
          </RadioButton>
          <RadioButton style={[commonStyle.setupradioButton]} value="1">
            <View
              style={
                paymentMethodSelect == 1
                  ? commonStyle.radiocustomizeborderactive
                  : commonStyle.radiocustomizeborder
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/coin.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Pay in cash</Text>
              </View>
              <TouchableHighlight>
                {paymentMethodSelect == 1 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </TouchableHighlight>
            </View>
            {paymentMethodSelect == 1 ? (
              <View style={commonStyle.paymentmethodinfoview}>
                <List style={commonStyle.paymentmethodInfobg}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Left style={{ marginRight: 8, alignSelf: 'flex-start' }}>
                        <Image
                          source={require('../../assets/images/payincashicon.png')}
                          style={commonStyle.payincashimg}
                          resizeMode={'contain'}
                        />
                      </Left>
                      <Body style={commonStyle.categoriseListBody}>
                        <Text
                          style={[commonStyle.blackTextR, commonStyle.mb05]}>
                          You need to add a credit or debit card to use the "Pay in cash"
                          option. Pro charges a deposit of $10 ahead, the rest
                          will be collected in-store after your booking.
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List>
              </View>
            ) : null}
          </RadioButton>
          <RadioButton style={commonStyle.setupradioButton} value="2">
            <View
              style={
                paymentMethodSelect == 2
                  ? commonStyle.radiocustomizeborderactive
                  : commonStyle.radiocustomizeborder
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/ios.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>ApplePay</Text>
              </View>
              <TouchableHighlight>
                {paymentMethodSelect == 2 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </TouchableHighlight>
            </View>
          </RadioButton>
          <RadioButton style={commonStyle.setupradioButton} value="3">
            <View
              style={
                paymentMethodSelect == 3
                  ? commonStyle.radiocustomizeborderactive
                  : commonStyle.radiocustomizeborder
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/credit-card.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Pay with Credit/Debit card</Text>
              </View>
              <TouchableHighlight>
                {paymentMethodSelect == 3 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </TouchableHighlight>
            </View>
          </RadioButton>
          <RadioButton style={commonStyle.setupradioButton} value="4">
            <View
              style={
                paymentMethodSelect == 4
                  ? commonStyle.radiocustomizeborderactive
                  : commonStyle.radiocustomizeborder
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/paypal.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>PayPal</Text>
              </View>
              <TouchableHighlight>
                {paymentMethodSelect == 4 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </TouchableHighlight>
            </View>
          </RadioButton>
        </RadioGroup>
      </View>
    </View>
  );
};

export default BookingFlowPaymentMethodModal;
