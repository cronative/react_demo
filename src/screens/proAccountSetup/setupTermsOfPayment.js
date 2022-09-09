import React, { Fragment, useState, useEffect, RefObject, useRef } from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Footer, List, ListItem, Body, Left } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from 'react-native-check-box';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { Get, Put } from '../../api/apiAgent';
import {
  UncheckedBox,
  CheckedBox,
  CheckedBoxDisable,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import { termOfPaymentSetup } from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux';
import global from '../../components/commonservices/toast';
import ActivityLoader from '../../components/ActivityLoader';
import InstagramLogin from 'react-native-instagram-login';
const { width, height } = Dimensions.get('window');

import { setupProgressionUpdate } from '../../store/actions';
import determineNextSetupStep from '../../utility/determineNextSetupStep';


const SetupTermsOfPayment = () => {
  const navigation = useNavigation();
  const [isPayinCashChecked, setIsPayinCashChecked] = useState(true);
  const [isPayinAppChecked, setIsPayinAppChecked] = useState(false);
  const [isApplyDepositChecked, setIsApplyDepositChecked] = useState(false);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const termOfPayment = useSelector(
    (state) => state.professionalProfileSetupReducer.termOfPaymentDetails,
  );

  const [isTaxFocus, setIsTaxFocus] = useState(false);
  const [tax, setTax] = useState(null);

  const [nextStep, setNextStep] = useState(null);

  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('IN TERMS OF PAYMENT. Progression Data: ', progressionData);
    setNextStep(determineNextSetupStep(8, progressionData));
  }, [progressionData]);

  //use  effect

  /*  useEffect(() => {
     console.log('termOfPayment', termOfPayment);
     if (termOfPayment) {
       if (termOfPayment.status === 201) {
         navigation.navigate('SetupAdditionalInfo', {
           someParam: '',
         });
         global.showToast(termOfPayment.message, termOfPayment.status ===201?'success':'error');
        }
        else if(termOfPayment.message) {
         // console.log(termOfPayment.message)
         
           console.log('failed')
           global.showToast(termOfPayment.message, termOfPayment.status ===201?'success':'error');
         }
         
          
        
 
 
      }
   }, [termOfPayment]); */

  const payInCashSelectHelper = () => {
    setIsPayinCashChecked(!isPayinCashChecked);
  };

  const payinAppSelectHelper = () => {
    setIsPayinAppChecked(!isPayinAppChecked);
  };

  const applyDepositSelectHelper = () => {
    setIsApplyDepositChecked(!isApplyDepositChecked);
  };
  const paymentHandler = () => {
    console.log('payin cash', isPayinCashChecked);
    console.log('payin app', isPayinAppChecked);
    console.log('payin deposit', isApplyDepositChecked);
    console.log('tax', tax);

    if (tax < 0 || tax > 100) {
      global.showToast(
        'Invalid tax percentage. Must be between 0 and 100',
        'error',
      );
      return false;
    }
    const payload = {
      payInCash: isPayinCashChecked == true ? 1 : 0,
      payInApp: isPayinAppChecked == true ? 1 : 0,
      applyDeposit: isApplyDepositChecked == true ? 1 : 0,
      // depositType: 2,
      depositType: 0,
      depositAmount: '0',
      cancellationHours: 0,
      otherPolicies:
        otherPolicies.trim().length > 0 ? otherPolicies.trim() : '',
      tax: tax ? Number(tax).toFixed(2) : '0',
    };
    console.log('otherPolicies', otherPolicies);
    dispatch(termOfPaymentSetup(payload));
    navigation.navigate('SetupAdditionalInfo');
  };

  useEffect(() => {
    console.log('TERMS OF PAYMENT FOUND DATA: ', termOfPayment);
    if (termOfPayment) {
      if (!!progressionData) {
        const updatedProgression = progressionData.map((step) => {
          if (step.stepNo === 8) {
            return { ...step, isCompleted: 1 };
          }
          return step;
        });
        dispatch(setupProgressionUpdate(updatedProgression));
      }

      navigation.navigate(nextStep ? nextStep : 'SetupAdditionalInfo');
    }
  }, [termOfPayment]);

  const [
    isOthersPoliciesDescriptionFocus,
    setIsOthersPoliciesDescriptionFocus,
  ] = useState(false);
  const [othersPoliciesDescription, setOthersPoliciesDescription] =
    useState('');
  const [otherPolicies, setOtherPolicies] = useState(''); //CR WORKS

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { paymentTerms: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep ? nextStep : 'SetupAdditionalInfo');
      })
      .catch((error) => {
        console.log('error', error);
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {/*  {termOfPayment.loader ? <ActivityLoader /> : null} */}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={commonStyle.headerbacktitle}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 8</Text>
          </Body>

          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() =>
                skipBtnHanler()
                // navigation.navigate(nextStep ? nextStep : 'SetupAdditionalInfo')
              }>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.8}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Terms of payment
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox]}>
              <View style={[commonStyle.payInCashcheck, { paddingTop: 0 }]}>
                <CheckBox
                  style={{ paddingVertical: 10 }}
                  onClick={() => payInCashSelectHelper()}
                  isChecked={isPayinCashChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  leftText={'Pay in cash'}
                  leftTextStyle={commonStyle.blackTextR}
                  disabled={true}
                  checkedImage={<CheckedBoxDisable />}
                  unCheckedImage={<UncheckedBox />}
                />
                {/* {isPayinCashChecked == 1 ? (
                  <View style={[commonStyle.mt1, commonStyle.mb1]}>
                    <List style={commonStyle.payinCashinfowrap}>
                      <ListItem
                        thumbnail
                        style={commonStyle.categoriseListItem}>
                        <View style={commonStyle.serviceListtouch}>
                          <Left
                            style={{marginRight: 8, alignSelf: 'flex-start'}}>
                            <Image
                              source={require('../../assets/images/payincashicon.png')}
                              style={commonStyle.payincashimg}
                              resizeMode={'contain'}
                            />
                          </Left>
                          <Body style={commonStyle.categoriseListBody}>
                            <Text
                              style={[commonStyle.blackTextR, commonStyle.mb1]}>
                              The “Pay in app” option is unavailable during your
                              free trial period. You’ll be able to accept online
                              payments made via debit/credit card once you
                              activate your subscription.
                            </Text>
                          </Body>
                        </View>
                      </ListItem>
                    </List>
                  </View>
                ) : null} */}
              </View>
              <View
                style={[commonStyle.payInCashcheck, { borderBottomWidth: 0 }]}>
                <CheckBox
                  style={{ paddingVertical: 10 }}
                  onClick={() => payinAppSelectHelper()}
                  isChecked={isPayinAppChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  leftText={'Pay in app'}
                  leftTextStyle={commonStyle.grayText16}
                  checkedImage={<CheckedBox />}
                  disabled={true}
                  unCheckedImage={<UncheckedBox />}
                />
              </View>

              <View>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Tax Percentage
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    commonStyle.prefixInput,
                    isTaxFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsTaxFocus(true)}
                  onChangeText={(text) => setTax(text)}
                  value={tax}
                  returnKeyType="done"
                  autoCapitalize={'none'}
                  placeholder="0.00"
                  placeholderTextColor={'#939DAA'}
                />
                <Text style={commonStyle.prefixpercent}>%</Text>
              </View>
            </View>
            <View
              style={[
                commonStyle.setupCardBox,
                { paddingTop: 0, marginBottom: 30 },
              ]}>
              <View style={[commonStyle.payInCashcheck]}>
                <CheckBox
                  style={{ paddingVertical: 10 }}
                  onClick={() => applyDepositSelectHelper()}
                  isChecked={isApplyDepositChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  leftText={'Apply deposit'}
                  leftTextStyle={commonStyle.grayText16}
                  checkedImage={<CheckedBox />}
                  disabled={true}
                  unCheckedImage={<UncheckedBox />}
                />
              </View>
              <View style={commonStyle.mt2}>
                <Text style={[commonStyle.grayText14, { opacity: 0.4 }]}>
                  By applying deposit, you’ll protect your business from
                  no-shows and late cancellations. A deposit will be charged for
                  both cash and in-app payments. Clients who select the cash
                  payment method will still be asked to pay a deposit with a
                  debit/credit card to secure their booking.
                </Text>
              </View>
            </View>

            <View style={[commonStyle.setupCardBox]}>
              <Text style={commonStyle.subtextbold}>Other policies</Text>
              <View style={commonStyle.mt15}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Your business - your rules, add any additional booking terms
                  and conditions below (it's optional)
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isOthersPoliciesDescriptionFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsOthersPoliciesDescriptionFocus(true)}
                  onChangeText={(text) => setOtherPolicies(text)}
                  returnKeyType="done"
                  keyboardType="default"
                  autoCapitalize={'none'}
                  multiline={true}
                  numberOfLines={6}
                  maxLength={500}
                  value={otherPolicies}
                  blurOnSubmit={true}
                  onSubmitEditing={(e) => {
                    console.log('On Submit Editing');
                    e.target.blur();
                  }}
                />
                <Text style={commonStyle.textlength}>
                  {otherPolicies.length}/500
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save and Continue"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              // onPress={() => navigation.navigate('SetupAdditionalInfo')}
              onPress={paymentHandler}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default SetupTermsOfPayment;
