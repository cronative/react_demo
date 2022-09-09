import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Container, List, ListItem, Body, Left, Title } from 'native-base';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Button } from 'react-native-elements';
import {
  DotIcon,
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import { Put } from './../../api/apiAgent';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import EventEmitter from 'react-native-eventemitter';

const EditWithdrowalMethod = ({ navigation, route }) => {
  const [dataSelect, setDataSelect] = useState(null);
  const [indexSelect, setIndexSelect] = useState(null);
  const [stackStatus, setStackStatus] = useState(route?.params?.stack);
  const [loader, setLoader] = useState(false);

  // This methods is to set the payment index
  useEffect(() => {
    if (route.params.name === 'none') {
      setIndexSelect(null);
    } else if (route.params.name === 'paypal') {
      setIndexSelect(0);
    } else if (route.params.name === 'stripe') {
      setIndexSelect(1);
    }
  }, []);

  const radioSelectHelper = (index, value) => {
    setDataSelect(value);
    setIndexSelect(index);
    setLoader(true);

    let type;
    if (value === 0 || value === '0') {
      type = '3';
    } else {
      type = '2';
    }
    let body = {
      defaultWithdrawalType: type,
    };
    Put('/pro/payment/withdraw/default', body)
      .then((result) => {
        setLoader(false);
        if (result.status === 200 || result.status === '200') {
          global.showToast('Default withdrawal method changed', 'success');
          if (stackStatus === true) {
            navigation.navigate('Analytics');
          } else {
            setTimeout(() => {
              navigation.navigate('AccountSettings');
            }, 1000);
            setTimeout(() => {
              EventEmitter.emit('refreshPage');
            }, 1500);
          }
        }
        console.log('Result111 : ', result.data);
      })
      .catch((error) => {
        setLoader(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={commonStyle.mainContainer}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.headingwrap, commonStyle.mt15]}>
            <Text style={commonStyle.subheading}>
              Default withdrawal method
            </Text>
          </View>
          <View style={commonStyle.accountwrap}>
            <View style={commonStyle.accountcol}>
              <List style={[commonStyle.accountList]}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                  <Left
                    style={[
                      commonStyle.howdoseInfoCircle,
                      { alignSelf: 'flex-start', marginRight: 10 },
                    ]}>
                    <Image
                      style={commonStyle.paymentmethodicon}
                      source={require('../../assets/images/paypal.png')}
                    />
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <TouchableOpacity onPress={() => radioSelectHelper(0, 0)}>
                      <Text style={[commonStyle.subtextbold, commonStyle.mb1]}>
                        PayPal
                      </Text>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 5 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          You'll be redirected to the PayPal website
                        </Text>
                      </View>
                      <View style={commonStyle.paymentdot}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 5 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={[commonStyle.texttimeblack, commonStyle.mb1]}>
                          Paypal may charge additional fees for sending or withdrawing funds.
                        </Text>
                      </View>
                      <View style={commonStyle.paymentdot}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 5 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          Readyhubb does not take any commissions or fees on your payments
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Body>
                </ListItem>
              </List>
            </View>
            <View style={commonStyle.accountcol}>
              <List style={[commonStyle.accountList]}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                  <Left
                    style={[
                      commonStyle.howdoseInfoCircle,
                      { alignSelf: 'flex-start', marginRight: 10 },
                    ]}>
                    <Image
                      style={commonStyle.paymentmethodicon}
                      source={require('../../assets/images/debit-card-account.png')}
                    />
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <TouchableOpacity onPress={() => radioSelectHelper(1, 1)}>
                      <Text style={[commonStyle.subtextbold, commonStyle.mb1]}>
                        Debit card or Bank Account
                      </Text>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 5 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          You'll be redirected to the Stripe website
                        </Text>
                      </View>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 5 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          Stripe may charge additional fees for sending or withdrawing funds.
                        </Text>
                      </View>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 5 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          Readyhubb does not take any commissions or fees on your payments

                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Body>
                </ListItem>
              </List>
            </View>
            <RadioGroup
              size={0}
              thickness={0}
              color="#ffffff"
              activeColor="#ffffff"
              highlightColor="#ffffff"
              selectedIndex={indexSelect}
              onSelect={(index, value) => {
                radioSelectHelper(index, value);
              }}
              style={commonStyle.withdrowalmethodradio}>
              <RadioButton
                animation={'bounceIn'}
                isSelected={true}
                outerColor={'#ffffff'}
                innerColor={'#ffffff'}
                innerSize={0}
                style={[commonStyle.withdrowalradio1st]}
                value="0">
                {indexSelect == 0 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </RadioButton>
              <RadioButton
                animation={'bounceIn'}
                isSelected={true}
                outerColor={'#ffffff'}
                innerColor={'#ffffff'}
                innerSize={0}
                value="1">
                {indexSelect == 1 ? (
                  <CircleCheckedBoxActive />
                ) : (
                  <CircleCheckedBoxOutline />
                )}
              </RadioButton>
            </RadioGroup>
          </View>
        </ScrollView>
      </Container>
    </Fragment>
  );
};

export default EditWithdrowalMethod;
