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
import Modal from 'react-native-modal';
import {
  UncheckedBox,
  CheckedBox,
  CheckedBoxDisable,
  DownArrow,
} from '../../components/icons';
import { CancellationRuleModal } from '../../components/modal';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
const { width, height } = Dimensions.get('window');
import { Get, Post, Put } from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
const BusinessSettingsTermsOfPayment = () => {
  const navigation = useNavigation();

  const [isPayinCashChecked, setIsPayinCashChecked] = useState(true);
  const [isPayinAppChecked, setIsPayinAppChecked] = useState(false);
  const [isApplyDepositChecked, setIsApplyDepositChecked] = useState(false);

  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);
  const [serviceDescription, setServiceDescription] = useState('');

  const [isamountFocus, setIsamountFocus] = useState(false);
  const [isTaxFocus, setIsTaxFocus] = useState(false);
  const [amount, setAmount] = useState(null);
  const [tempCancelRule, setTempCancelRule] = useState(null);
  const [deposit, setDepositType] = useState(null);
  const [loader, setLoader] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [tax, setTax] = useState(null);
  const [otherPolicies, setOtherPolicies] = useState(''); //CR WORKS
  const [userSubscribedPlan, setUserSubscribedPlan] = useState({}); //CR WORKS

  const [inTrial, setInTrial] = useState(false);
  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  const onSelectCancellationRuleHandler = () => {
    console.log(tempCancelRule);
  };
  const fetchData = () => {
    setLoader(true);
    Get('/pro/payment-info', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          console.log('payment-info', result.data);
          //setbioData('gfghhhttutuy88868')
          setAmount(result.data.depositeAmount);
          setIsPayinCashChecked(result.data.payInCash == 1 ? true : false);
          setTempCancelRule(result.data.cancellationHours);
          setDepositType(result.data.depositType);
          setIsPayinAppChecked(result.data.payInApp == 1 ? true : false);
          setIsApplyDepositChecked(
            result.data.applyDeposite == 1 ? true : false,
          );
          setTax(result.data.tax);
          //CR WORKS
          setUserSubscribedPlan(result.data?.UserSubscribedPlan);
          setOtherPolicies(
            result?.data?.otherPolicies ? result?.data?.otherPolicies : '',
          );
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log('Image Error : ', error);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  useEffect(() => {
    fetchData();
    checkIfInTrial();
  }, []);
  const onSubmitHandler = () => {
    console.log('isPayinCashChecked', isPayinCashChecked);
    console.log('isPayinAppChecked', isPayinAppChecked);
    console.log('isApplyDepositChecked', isApplyDepositChecked);
    console.log('deposit', deposit);
    console.log('tempCancelRule', tempCancelRule);
    console.log('amount', amount);
    console.log('tax', tax);
    //console.log('call api')
    if ((deposit == 1 && amount < 0) || (deposit == 1 && amount > 100)) {
      global.showToast('Invalid percentage', 'error');
      return false;
    } else if (amount < 0) {
      global.showToast('Invalid amount ', 'error');
      return false;
    } else if (tax < 0) {
      global.showToast('Invalid tax percentage', 'error');
      return false;
    }
    setLoader(true);
    let payload = {
      availableWindow: 0,
      payInApp: isPayinAppChecked === false ? 0 : 1,
      payInCash: isPayinCashChecked === false ? 0 : 1,
      applyDeposite: isApplyDepositChecked === false ? 0 : 1,
      tax: tax ? Number(tax).toFixed(2) : '0',
    };
    if (isApplyDepositChecked) {
      payload['depositType'] = deposit ? deposit : 0;
      payload['depositeAmount'] = amount ? amount : '0';
      payload['cancellationHours'] = tempCancelRule ? tempCancelRule : 0;
    } else {
      payload['depositType'] = 0;
      payload['depositeAmount'] = '0';
      payload['cancellationHours'] = 0;
    }

    // if(userSubscribedPlan?.type == 2){
    payload['otherPolicies'] =
      otherPolicies.trim().length > 0 ? otherPolicies.trim() : '';
    // }
    console.log('PAYLOAD:', payload);
    Put('/pro/payment-info', payload)
      // Post('/pro/add-payment-terms', payload)
      .then((result) => {
        setLoader(false);
        if (result.status === 200 || result.status === 201) {
          console.log(result);

          global.showToast(result.message, 'success');
          navigation.goBack();
        } else {
          console.log('ERROR');
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const checkIfInTrial = () => {
    // setIsLoadingVerify(true);
    setLoader(true);
    Get('/pro/subcription-plan')
      .then((response) => {
        setLoader(false);
        if (response.data.type === 1) {
          setInTrial(true);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  /**
   * =======================.
   */

  /**
   * This method will call on Current Location Select.
   */
  const payInCashSelectHelper = () => {
    setIsPayinCashChecked(!isPayinCashChecked);
  };

  /**
   * This method will call on Current Location Select.
   */
  const payinAppSelectHelper = () => {
    setIsPayinAppChecked(!isPayinAppChecked);
    setIsApplyDepositChecked(false); // Apply deposit cant be checked if Pay In App is not checked
  };

  /**
   * This method will call on Current Location Select.
   */
  const applyDepositSelectHelper = () => {
    setIsApplyDepositChecked(!isApplyDepositChecked);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container
        style={[commonStyle.mainContainer, commonStyle.pb1, { paddingTop: 0 }]}>
        {loader ? <ActivityLoader /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap]}>
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
                  disabled={!!inTrial}
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                />
                {/* {!!inTrial ? (
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
                style={[
                  commonStyle.payInCashcheck,
                  { borderBottomWidth: 0, paddingBottom: 0 },
                ]}>
                <CheckBox
                  style={{ paddingVertical: 10 }}
                  onClick={() => payinAppSelectHelper()}
                  isChecked={isPayinAppChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  leftText={'Pay in app'}
                  leftTextStyle={
                    inTrial ? commonStyle.grayText16 : commonStyle.blackTextR
                  }
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                  disabled={inTrial}
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
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  autoCapitalize={'none'}
                  placeholder="0.00"
                  placeholderTextColor={'#939DAA'}
                />
                <Text style={commonStyle.prefixpercent}>%</Text>
              </View>
            </View>
            {isPayinAppChecked ? (
              <View style={[commonStyle.setupCardBox, { paddingTop: 0 }]}>
                <View style={[commonStyle.payInCashcheck]}>
                  <CheckBox
                    style={{ paddingVertical: 10 }}
                    onClick={() => applyDepositSelectHelper()}
                    isChecked={isApplyDepositChecked}
                    checkedCheckBoxColor={'#ff5f22'}
                    uncheckedCheckBoxColor={'#e6e7e8'}
                    leftText={'Apply deposit'}
                    leftTextStyle={commonStyle.blackTextR}
                    checkedImage={<CheckedBox />}
                    unCheckedImage={<UncheckedBox />}
                  />
                </View>
                <View style={commonStyle.mt2}>
                  <Text style={[commonStyle.grayText14]}>
                    By applying deposit, you’ll protect your business from
                    no-shows and late cancellations. A deposit will be charged
                    for both cash and in-app payments. Clients who select the
                    cash payment method will still be asked to pay a deposit
                    with a debit/credit card to secure their booking.
                  </Text>
                </View>
                {isApplyDepositChecked && (
                  <View>
                    <View style={commonStyle.mt2}>
                      <List style={commonStyle.payinCashinfowrap}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          <View style={commonStyle.serviceListtouch}>
                            <Left
                              style={{ marginRight: 8, alignSelf: 'flex-start' }}>
                              <Image
                                source={require('../../assets/images/payincashicon.png')}
                                style={commonStyle.payincashimg}
                                resizeMode={'contain'}
                              />
                            </Left>
                            <Body style={commonStyle.categoriseListBody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb05,
                                ]}>
                                Note that the “Pay in cash” option is
                                unavailable when the user needs to pay the full
                                price deposit
                              </Text>
                            </Body>
                          </View>
                        </ListItem>
                      </List>
                    </View>

                    <View style={commonStyle.mt2}>
                      <TouchableOpacity
                        style={commonStyle.dropdownselectmodal}
                        onPress={() => {
                          setVisibleModal('ChooseDepositValueDialog');
                          setAmount(0);
                        }}>
                        {deposit === '' || deposit === null ? (
                          <Text style={commonStyle.grayText16}>
                            Choose deposit value
                          </Text>
                        ) : null}
                        {/* <Text style={commonStyle.blackTextR}>3 miles</Text> */}
                        {deposit === 1 ? (
                          <Text style={commonStyle.blackTextR}>
                            Percentage of service cost
                          </Text>
                        ) : deposit === 2 ? (
                          <Text style={commonStyle.blackTextR}>
                            Fixed deposit
                          </Text>
                        ) : deposit === 3 ? (
                          <Text style={commonStyle.blackTextR}>Full price</Text>
                        ) : (
                          <Text style={commonStyle.blackTextR}></Text>
                        )}
                        <DownArrow />
                      </TouchableOpacity>

                      {deposit !== 3 ? (
                        <View
                          style={[
                            commonStyle.mt2,
                            {
                              borderBottomWidth: 1,
                              borderBottomColor: '#dcdcdc',
                              paddingBottom: 20,
                            },
                          ]}>
                          <Text
                            style={[
                              commonStyle.texttimeblack,
                              commonStyle.mb15,
                            ]}>
                            {deposit === 1 ? 'Percentage' : 'Amount'}
                          </Text>
                          <View>
                            <TextInput
                              style={[
                                commonStyle.textInput,
                                commonStyle.prefixInput,
                                isamountFocus && commonStyle.focusinput,
                              ]}
                              onFocus={() => setIsamountFocus(true)}
                              onChangeText={(text) => setAmount(text)}
                              value={amount}
                              keyboardType="number-pad"
                              autoCapitalize={'none'}
                              returnKeyType="done"
                              placeholder="Amount"
                              placeholderTextColor={'#939DAA'}
                            />
                            <Text style={commonStyle.prefixText}>
                              {deposit === 1 ? '%' : '$'}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text></Text>
                      )}
                    </View>

                    <View style={commonStyle.mt2}>
                      <Text
                        style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                        Cancellation rule
                      </Text>
                      <TouchableOpacity
                        style={commonStyle.dropdownselectmodal}
                        onPress={() => {
                          setVisibleModal('CancellationRuleDialog');
                        }}>
                        {tempCancelRule === null ? (
                          <Text style={commonStyle.grayText16}>
                            Choose value
                          </Text>
                        ) : null}
                        {tempCancelRule == -1 ? (
                          <Text style={commonStyle.blackTextR}>
                            Free Cancellation - Cancel anytime
                          </Text>
                        ) : (
                          <Text style={commonStyle.blackTextR}>
                            {tempCancelRule}{' '}
                            {tempCancelRule !== null ? 'hours' : ''}
                          </Text>
                        )}
                        <DownArrow />
                      </TouchableOpacity>
                    </View>
                    <View style={commonStyle.mt1}>
                      <Text style={[commonStyle.grayText14]}>
                        The client can cancel his booking in this period, if he
                        cancels the booking later, his deposit will not be
                        refunded
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : null}

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
                    isServiceDescriptionFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsServiceDescriptionFocus(true)}
                  onChangeText={(text) => setOtherPolicies(text)}
                  returnKeyType="done"
                  keyboardType="default"
                  autoCapitalize={'none'}
                  multiline={true}
                  numberOfLines={7}
                  maxLength={500}
                  value={otherPolicies}
                  blurOnSubmit={true}
                  onSubmitEditing={(e) => {
                    console.log('On Submit Editing');
                    e.target.blur();
                  }}
                />
                <Text style={commonStyle.textlength}>
                  {otherPolicies?.length}/500
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => onSubmitHandler()}
            //onPress={paymentHandler}
            />
          </View>
        </View>
      </Container>
      {/* Choose Deposit Value modal start */}
      <Modal
        isVisible={visibleModal === 'ChooseDepositValueDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
        swipeThreshold={50}
        swipeDirection="down"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.othersbottomModal}>
        <View>
          <View style={commonStyle.othersModal}>
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}
              onPress={() => {
                setVisibleModal({ visibleModal: null });
                setDepositType(2);
              }}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={{ width: 16, height: 16 }}
                  source={require('../../assets/images/doller.png')}
                  resizeMode={'contain'}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Fixed deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}
              onPress={() => {
                setVisibleModal({ visibleModal: null });
                setDepositType(1);
              }}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={{ width: 15, height: 15 }}
                  source={require('../../assets/images/percentages.png')}
                  resizeMode={'contain'}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>
                Percentage of service cost
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyle.searchBarText, { padding: 12 }]}
              onPress={() => {
                setVisibleModal({ visibleModal: null });
                setDepositType(3);
              }}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require('../../assets/images/credit-card-orange.png')}
                  resizeMode={'contain'}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Full price</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={commonStyle.modalcancle}
            activeOpacity={0.9}
            onPress={() => setVisibleModal({ visibleModal: null })}>
            <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Choose Deposit Value modal End */}

      {/* Cancellation Rule modal start */}
      <Modal
        isVisible={visibleModal === 'CancellationRuleDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <CancellationRuleModal
              tempCancelRule={tempCancelRule}
              setTempCancelRule={setTempCancelRule}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal({ visibleModal: null });
                onSelectCancellationRuleHandler();
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Cancellation Rule modal End */}
    </Fragment>
  );
};

export default BusinessSettingsTermsOfPayment;
