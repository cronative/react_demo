import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {Container, List, ListItem, Body, Left, Title} from 'native-base';
import {Button} from 'react-native-elements';
import {
  RightAngle,
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {Get, Post} from '../api/apiAgent';
import global from '../components/commonservices/toast';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import EventEmitter from 'react-native-eventemitter';

const AnalyticsBalanceWithdrowalConfirmation = ({navigation, route}) => {
  // Declare the constant
  const [loader, setLoader] = useState(false);

  // This method is to change the payment methods
  const changeMethods = () => {
    if (route?.params?.method === 'PayPal') {
      navigation.navigate('EditWithdrowalMethod', {
        name: 'paypal',
        stack: true,
      });
    } else if (route?.params?.method === 'Stripe') {
      navigation.navigate('EditWithdrowalMethod', {
        name: 'stripe',
        stack: true,
      });
    } else {
      navigation.navigate('EditWithdrowalMethod', {name: 'none', stack: true});
    }
  };

  // This methos is to withdrawal the amount
  const withdrawlAmount = () => {
    if (route?.params?.method === 'PayPal') {
      setLoader(true);
      let postData = {
        amount: route?.params?.amount,
      };
      Post('/pro/payment/withdraw/initiate/paypal', postData)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            global.showToast(result.message, 'success');
            setTimeout(() => {
              navigation.navigate('Analytics');
            }, 1000);
            setTimeout(() => {
              EventEmitter.emit('refreshAnalysitPage');
            }, 1200);
          }
        })
        .catch((error) => {
          setLoader(false);
          if (
            error.response.data.status === 403 ||
            error.response.data.status === '403 '
          ) {
            global.showToast(error.response.data.message, 'error');
          }
          if (
            error.response.data.status === 500 ||
            error.response.data.status === '500'
          ) {
            global.showToast(
              'Something went wrong, please try after some times',
              'error',
            );
          }
        });
    } else if (route?.params?.method === 'Stripe') {
      setLoader(true);
      let postData = {
        amount: route?.params?.amount,
      };
      Post('/pro/payment/withdraw/initiate/stripe/transfer', postData)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            global.showToast(result.message, 'success');
            setTimeout(() => {
              navigation.navigate('Analytics');
            }, 1000);
            setTimeout(() => {
              EventEmitter.emit('refreshAnalysitPage');
            }, 1200);
          }
        })
        .catch((error) => {
          console.log('Message : ', error.response.data.message);
          setLoader(false);
          if (
            error.response.data.status === 403 ||
            error.response.data.status === '403 '
          ) {
            global.showToast(error.response.data.message, 'error');
          }
          if (
            error.response.data.status === 400 ||
            error.response.data.status === '400'
          ) {
            global.showToast(error.response.data.message, 'error');
          }
          if (
            error.response.data.status === 500 ||
            error.response.data.status === '500'
          ) {
            global.showToast(
              'Something went wrong, please try after some times',
              'error',
            );
          }
        });
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={commonStyle.mainContainer}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={commonStyle.categoriseListWrap}>
            <View
              style={[
                commonStyle.setupCardBox,
                {marginBottom: 30, marginTop: 10},
              ]}>
              <View style={[commonStyle.paymentMethodheading]}>
                <Text style={[commonStyle.subtextblack]}>
                  Withdrawal method
                </Text>
                <TouchableOpacity onPress={changeMethods}>
                  <Text style={[commonStyle.textorange14]}>Change method</Text>
                </TouchableOpacity>
              </View>
              <List
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  paddingBottom: 20,
                }}>
                <ListItem thumbnail style={commonStyle.switchAccountView}>
                  <Left style={commonStyle.howdoseInfoCircle}>
                    {route?.params?.method === 'PayPal' ? (
                      <Image
                        style={commonStyle.paymentmethodicon}
                        source={require('../assets/images/paypal.png')}
                      />
                    ) : (
                      <Image
                        style={commonStyle.paymentmethodicon}
                        source={require('../assets/images/debit-card-account.png')}
                      />
                    )}
                  </Left>
                  <Body style={commonStyle.switchAccountbody}>
                    <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                      {route?.params?.method}
                    </Text>
                    <Text style={commonStyle.grayText14}>
                      {route?.params?.email}
                    </Text>
                  </Body>
                </ListItem>
              </List>
              <View>
                <View style={[commonStyle.bookingdatewrap, commonStyle.mt15]}>
                  <Text style={commonStyle.grayText14} numberOfLines={1}>
                    Amount
                  </Text>
                  <Text style={[commonStyle.blackTextR]}>
                    ${route?.params?.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={[commonStyle.bookingdatewrap, commonStyle.mt15]}>
                  <Text style={commonStyle.grayText14} numberOfLines={1}>
                    Readyhubb 0% fee
                  </Text>
                  <Text style={[commonStyle.blackTextR]}>$0</Text>
                </View>
                <List
                  style={[
                    commonStyle.payinCashinfowrap,
                    commonStyle.mt2,
                    commonStyle.mb2,
                  ]}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                        <Image
                          source={require('../assets/images/payincashicon.png')}
                          style={commonStyle.payincashimg}
                          resizeMode={'contain'}
                        />
                      </Left>
                      <Body style={commonStyle.categoriseListBody}>
                        <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                          Readyhubb doesn't make any commissions on your
                          bookings and we don't charge any payment processing
                          fees. Your available balance reflects your income less
                          any transaction fees charged by stripe and paypal.
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List>
                <View style={commonStyle.dividerlinefull} />
              </View>
              <View style={[commonStyle.bookingdatewrap, commonStyle.mt15]}>
                <Text style={commonStyle.grayText14} numberOfLines={1}>
                  Total
                </Text>
                <Text style={[commonStyle.blackTextR]}>
                  ${route?.params?.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Withdraw balance"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={withdrawlAmount}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default AnalyticsBalanceWithdrowalConfirmation;
