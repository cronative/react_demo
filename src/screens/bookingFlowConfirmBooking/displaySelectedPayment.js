import React from 'react';
import {Image, Text, View} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import {selectCardType} from '../../utility/booking';

const DisplaySelectedPayment = ({cardData, paymentMethod}) => {
  return (
    <>
      {!!cardData && !!cardData?.cardType ? (
        <View style={commonStyle.searchBarText}>
          <Image
            style={[commonStyle.paymentmethodicon, {marginRight: 10}]}
            source={selectCardType(cardData?.cardType)}
          />
          <Text style={[commonStyle.blackTextR]}>
            ****{cardData?.cardNumber?.substr(15, 4)}
          </Text>
        </View>
      ) : (
        <>
          {!paymentMethod && (
            <Text style={commonStyle.grayText16}>Choose payment method</Text>
          )}
          {paymentMethod === 1 && (
            <View style={commonStyle.searchBarText}>
              <Image
                style={[commonStyle.paymentmethodicon, {marginRight: 10}]}
                source={require('../../assets/images/coin.png')}
              />
              <Text style={commonStyle.blackTextR}>Pay in cash</Text>
            </View>
          )}
          {paymentMethod === 3 && (
            <View style={commonStyle.searchBarText}>
              <Image
                style={[commonStyle.paymentmethodicon, {marginRight: 10}]}
                source={require('../../assets/images/paypal.png')}
              />
              <Text style={commonStyle.blackTextR}>PayPal</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default DisplaySelectedPayment;
