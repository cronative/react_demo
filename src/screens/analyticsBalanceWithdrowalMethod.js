import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert,
} from 'react-native';
import { Container, List, ListItem, Body, Left, Title } from 'native-base';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Button } from 'react-native-elements';
import {
  DotIcon,
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import { Get, Post } from '../api/apiAgent';
import {
  profileViewRequest,
  profileViewRequestClear,
} from '../store/actions/profileAction';
import { useSelector, useDispatch } from 'react-redux';
import global from '../components/commonservices/toast';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import { WebView } from 'react-native-webview';

const AnalyticsBalanceWithdrowalMethod = ({ navigation, route }) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [indexSelect, setIndexSelect] = useState();
  const [withdrawlType, setWithdrawlType] = useState(null);
  const [loader, setLoader] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [webViewURL, setWebViewURL] = useState(null);
  const [profEmail, setProfEmail] = useState(null);
  const [connectedMessage, setConnectedMessage] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(
    route?.params?.amount,
  );
  const radioSelectHelper = (index, value) => {
    setIndexSelect(index);
  };
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );

  // This method will call if default methods does not exist
  const addDefaultWithdrawalMethod = () => {
    global.showToast(
      "You don't have default withdrawal method, please add your default withdrawal method.",
      'error',
    );
    navigation.navigate('EditWithdrowalMethod', { name: 'none', stack: true });
  };

  // This method is to check the response
  const acountCreateSuccessOrFailure = () => {
    if (profEmail === null) {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
      return;
    } else {
      let postData = {
        email: profEmail,
      };
      Post('/pro/stripe/connect/standard', postData)
        .then((result) => {
          if (result.status === 200) {
            console.log('Okkk');
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            if (error.response.data.data.isPending === true) {
              global.showToast(
                'Stripe account has created, but your documents verification is on pending, so please submit the documents',
                'error',
              );
            } else {
              global.showToast(
                'You have successfully create and setup your stripe account',
                'success',
              );
              setModalVisibility(false);
            }
          }
        });
    }
  };

  // This function is to get the withdrawl method
  const defaultWithdrawlMethods = () => {
    setLoader(true);
    Get('/pro/payment/withdraw')
      .then((result) => {
        setLoader(false);
        if (result.status === 200 || result.status === '200') {
          if (
            result?.data?.defaultWithdrawalType !== 'null' ||
            result?.data?.defaultWithdrawalType !== null
          ) {
            setWithdrawlType(result.data.defaultWithdrawalType);
            if (
              result.data.defaultWithdrawalType === 2 ||
              result.data.defaultWithdrawalType === '2'
            ) {
              setIndexSelect(1);
            } else if (
              result.data.defaultWithdrawalType === 3 ||
              result.data.defaultWithdrawalType === '3'
            ) {
              setIndexSelect(0);
            } else {
              addDefaultWithdrawalMethod();
            }
          }
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  // This methos is for handle the response
  useEffect(() => {
    if (profileData && profileData.status == 200) {
      setProfEmail(profileData.data.email);
      dispatch(profileViewRequestClear());
    } else {
      dispatch(profileViewRequestClear());
    }
  }, [profileData]);

  // Load one time
  useEffect(() => {
    defaultWithdrawlMethods();
    dispatch(profileViewRequest());
  }, []);

  // This method is to check user stripe account does exist or not
  const stripeAccountCreation = () => {
    if (profEmail === null) {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
      return;
    } else {
      setLoader(true);
      let postData = {
        email: profEmail,
      };
      Post('/pro/stripe/connect/standard', postData)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            setConnectedMessage(true);
            let webviewUrl = result.data.accountLinks.url;
            setWebViewURL(webviewUrl);
            setTimeout(() => {
              setModalVisibility(true);
            }, 1000);
          } else if (result.status === 201) {
            setConnectedMessage(true);
            let webviewUrl = result.data.url;
            setWebViewURL(webviewUrl);
            setTimeout(() => {
              setModalVisibility(true);
            }, 1000);
          }
        })
        .catch((error) => {
          setLoader(false);
          if (
            error.response.data.status !== 500 ||
            error.response.data.status !== '500'
          ) {
            if (error.response.status === 403) {
              if (error.response.data.data.isPending === true) {
                global.showToast(
                  'Stripe account already created, but your documents verification is on pending, so please login and submit the documents',
                  'error',
                );
                if (modalVisibility !== true) {
                  setConnectedMessage(true);
                  let webviewUrl = error.response.data.data.url;
                  setWebViewURL(webviewUrl);
                  setTimeout(() => {
                    setModalVisibility(true);
                  }, 2000);
                }
              } else {
                navigation.navigate('AnalyticsBalanceWithdrowalConfirmation', {
                  email: profEmail,
                  method: indexSelect === 0 ? 'PayPal' : 'Stripe',
                  amount: withdrawalAmount,
                });
              }
            }
          }
        });
    }
  };

  // This method is to check user paypal account does exist or not
  const paypalAccountCreation = () => {
    if (profEmail === null) {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
      return;
    } else {
      navigation.navigate('AnalyticsBalanceWithdrowalConfirmation', {
        email: profEmail,
        method: indexSelect === 0 ? 'PayPal' : 'Stripe',
        amount: withdrawalAmount,
      });
    }
  };

  // This function is to get the response from the webview
  const handleResponse = (data) => {
    if (withdrawlType.toString() === '2') {
      acountCreateSuccessOrFailure();
      setConnectedMessage(false);
    } else if (withdrawlType.toString() === '3') {
      setConnectedMessage(false);
    } else {
      console.log('Data :', data);
      return;
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={commonStyle.mainContainer}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Webview start */}
          <View>
            <Modal
              visible={modalVisibility}
              onRequestClose={() => setModalVisibility(false)}>
              {connectedMessage === true ? (
                <View style={[commonStyle.headingwrap, commonStyle.mt15]}>
                  <Text style={commonStyle.subheading}>
                    Please wait, while we connect...
                  </Text>
                </View>
              ) : null}
              <WebView
                source={{ uri: webViewURL }}
                onNavigationStateChange={(data) => handleResponse(data)}
                injectedJavaScript={`document.f1.submit()`}
              />
            </Modal>
          </View>
          {/* Webview end */}
          <View style={[commonStyle.headingwrap, commonStyle.mt15]}>
            <Text style={commonStyle.subheading}>Choose withdrawal method</Text>
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
                      source={require('../assets/images/paypal.png')}
                    />
                  </Left>

                  <Body style={commonStyle.accountListBody}>
                    <TouchableOpacity onPress={() => radioSelectHelper(0, 0)}>
                      <Text style={[commonStyle.subtextbold, commonStyle.mb1]}>
                        PayPal
                      </Text>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 8 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          You'll be redirected to the PayPal website
                        </Text>
                      </View>
                      <View style={commonStyle.paymentdot}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 8 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          Paypal may charge additional fees for sending or withdrawing funds.
                        </Text>
                      </View>
                      <View style={commonStyle.paymentdot}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 8 }}>
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
                      source={require('../assets/images/debit-card-account.png')}
                    />
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <TouchableOpacity onPress={() => radioSelectHelper(1, 1)}>
                      <Text style={[commonStyle.subtextbold, commonStyle.mb1]}>
                        Debit card or Bank Account
                      </Text>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 8 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          You'll be redirected to the Stripe website
                        </Text>
                      </View>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 8 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          Stripe may charge{' '}
                          <Title style={commonStyle.textorange14}>
                            additional fees
                          </Title>{' '}
                          for sending and withdrawing funds.{' '}
                          {/* <Title style={commonStyle.textorange14}>
                            Don’t have a Stripe account?
                          </Title> */}
                        </Text>
                      </View>
                      <View style={[commonStyle.paymentdot, commonStyle.mb1]}>
                        <TouchableHighlight
                          style={{ marginRight: 8, marginTop: 8 }}>
                          <DotIcon />
                        </TouchableHighlight>
                        <Text style={commonStyle.texttimeblack}>
                          Readyhubb does not take any commissions or fees on your payments
                          <Title style={commonStyle.textorange14}>
                            Don’t have a Stripe account?
                          </Title>
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
                // disabled={indexSelect === 1 ? true : false}
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
                // disabled={indexSelect === 0 ? true : false}
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
        {indexSelect == 0 && (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Proceed to PayPal"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={paypalAccountCreation}
              />
            </View>
          </View>
        )}

        {indexSelect == 1 && (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Proceed to Stripe"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={stripeAccountCreation}
              />
            </View>
          </View>
        )}
      </Container>
    </Fragment>
  );
};

export default AnalyticsBalanceWithdrowalMethod;
