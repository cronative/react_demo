import {useNavigation} from '@react-navigation/native';
import {Body, Container, Left, List, ListItem} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Button} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInputMask} from 'react-native-masked-text';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import global from '../components/commonservices/toast';
import {CheckedBox, UncheckedBox} from '../components/icons';
import {
  addcardRequest,
  addcardRequestClear,
  listCardRequest,
} from '../store/actions';
import {getCardType, selectCardType} from '../utility/booking';

const BookingFlowAddCard = ({route}) => {
  const isCash = route?.params?.isCash;
  const preDeposite = route?.params?.preDeposite;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isNameOnCardFocus, setIsNameOnCardFocus] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const [isCardNumberFocus, setIsCardNumberFocus] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [isExpiryDateFocused, setExpiryDateFocused] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [isCvcNumberFocus, setIsCvcNumberFocus] = useState(false);
  const [cvcNumber, setCvcNumber] = useState('');
  const [isCardSaveDefaultChecked, setIsCardSaveDefaultChecked] =
    useState(false);
  const [cvcHolder, setCvcHolder] = useState('');

  const updateCvc = (text) => {
    let value = '';
    if (!!text) {
      setCvcNumber(text);
      for (let i = 0; i < text.length; i++) {
        value = value + '*';
      }
      setCvcHolder(value);
    } else {
      setCvcHolder('');
      setCvcNumber(text);
    }
  };

  const addcardDatas = useSelector((state) => state.profileReducer.addCardData);
  const loderStatus = useSelector((state) => state.profileReducer.loader);

  const CardSaveDefaultSelectHelper = () => {
    setIsCardSaveDefaultChecked(!isCardSaveDefaultChecked);
  };

  const onSaveCard = () => {
    let error = null;

    if (nameOnCard.length < 1) {
      global.showToast('Name on the card is required', 'error');
    } else if (cardNumber === '' || cardNumber.length < 19) {
      global.showToast('Please enter a valid card number', 'error');
    } else if (cvcNumber === '' || cvcNumber.length < 3) {
      global.showToast('Please enter a valid cvc', 'error');
    } else if (expiryDate === '' || expiryDate.length < 5) {
      global.showToast('Please enter a valid expiry date', 'error');
    }

    if (error) {
      global.showToast(error, 'error');
    } else {
      let cardObj = {
        name: nameOnCard,
        number: cardNumber,
        expirationDate: expiryDate,
        cvv: cvcNumber,
        isDefault: isCardSaveDefaultChecked ? 1 : 0,
      };
      dispatch(addcardRequest(cardObj));
    }
  };

  useEffect(() => {
    if (addcardDatas && addcardDatas.status == 200) {
      setIsNameOnCardFocus(false);
      setNameOnCard('');
      setIsCardNumberFocus(false);
      setCardNumber('');
      setExpiryDateFocused(false);
      setExpiryDate('');
      setIsCvcNumberFocus(false);
      setCvcNumber('');
      dispatch(addcardRequestClear());
      dispatch(listCardRequest());

      global.showToast('Card added successfully', 'success');
      navigation.navigate('ConfirmBooking');
    } else if (addcardDatas && addcardDatas.status != 200) {
      if (
        addcardDatas.response?.data?.message !== null &&
        addcardDatas.response?.data?.message !== ''
      ) {
        dispatch(addcardRequestClear());
      }
    }
  }, [addcardDatas, dispatch]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.horizontalPadd}>
            {!!preDeposite && preDeposite != '' && (
              <View style={[commonStyle.mb2, commonStyle.mt1]}>
                <List style={commonStyle.payinCashinfowrap}>
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
                        {!!isCash ? (
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            Only a partial payment is due now - This booking
                            requires a deposit of {preDeposite}. You'll lose
                            your deposit in case of a late cancellation or
                            no-show.
                          </Text>
                        ) : (
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            You'll not pay the full price ahead. This booking
                            requires a deposit of {preDeposite}. You'll lose
                            your deposit in case of a late cancellation or
                            no-show.
                          </Text>
                        )}
                      </Body>
                    </View>
                  </ListItem>
                </List>
                {/* Check development phase */}
                {/* <List style={commonStyle.payinCashinfowrap}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <View style={commonStyle.serviceListtouch}>
                        <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                          <Image source={require('../assets/images/payincashicon.png')} style={commonStyle.payincashimg} resizeMode={'contain'}/>
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                        <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                        You need to add a credit or debit card to use the "Pay in cash" option. Pro charges a deposit of $10 ahead, the rest will be collected in-store after your booking. You'll lose your deposit in case of a late cancellation or no-show.</Text>
                        </Body>
                      </View>
                    </ListItem>
                  </List> */}
              </View>
            )}
            <View style={[commonStyle.mb2, commonStyle.acceptcardrow]}>
              <View style={commonStyle.mb1}>
                <Text style={[commonStyle.grayText14, commonStyle.mr08]}>
                  We accept cards:
                </Text>
              </View>
              <View style={commonStyle.acceptCardwrap}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((cardType) => {
                  return (
                    <Image
                      key={cardType}
                      source={selectCardType(cardType)}
                      style={commonStyle.acceptCardimg}
                      resizeMode={'contain'}
                    />
                  );
                })}
              </View>
            </View>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Name on card
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  isNameOnCardFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsNameOnCardFocus(true)}
                onChangeText={(text) => setNameOnCard(text)}
                value={nameOnCard}
                returnKeyType="next"
                autoCapitalize={'none'}
              />
            </View>
            <View style={commonStyle.mb2}>
              <View style={commonStyle.cardViewWrapper}>
                <Text style={[commonStyle.texttimeblack]}>Card number</Text>
                {!!cardNumber && (
                  <Image
                    source={selectCardType(getCardType(cardNumber))}
                    style={commonStyle.acceptCardimg}
                    resizeMode={'contain'}
                  />
                )}
              </View>
              <TextInputMask
                style={[
                  commonStyle.textInput,
                  isCardNumberFocus && commonStyle.focusinput,
                ]}
                options={{
                  obfuscated: false,
                  issuer: 'visa-or-mastercard',
                }}
                onFocus={() => setIsCardNumberFocus(true)}
                onChangeText={(text) => setCardNumber(text)}
                type={'credit-card'}
                value={cardNumber}
                returnKeyType="next"
                autoCapitalize={'none'}
                keyboardType="number-pad"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                placeholderTextColor={'#939DAA'}
                maxLength={19}
              />
            </View>
            <View style={commonStyle.mb2}>
              <View style={commonStyle.commRow}>
                <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    Expiration date
                  </Text>
                  <TextInputMask
                    style={[
                      commonStyle.textInput,
                      isExpiryDateFocused && commonStyle.focusinput,
                    ]}
                    options={{
                      format: 'MM/YY',
                    }}
                    onFocus={() => setExpiryDateFocused(true)}
                    onChangeText={(text) => setExpiryDate(text)}
                    type={'datetime'}
                    value={expiryDate}
                    returnKeyType="next"
                    autoCapitalize={'none'}
                    keyboardType="number-pad"
                    placeholder="MM/YY"
                    placeholderTextColor={'#939DAA'}
                    maxLength={5}
                  />
                </View>
                <View style={[commonStyle.CommCol6, {paddingLeft: 5}]}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    CVC
                  </Text>
                  <TextInputMask
                    style={[
                      commonStyle.textInput,
                      isCvcNumberFocus && commonStyle.focusinput,
                    ]}
                    type={'only-numbers'}
                    value={cvcNumber}
                    onFocus={() => setIsCvcNumberFocus(true)}
                    onChangeText={(text) => setCvcNumber(text)}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    keyboardType="number-pad"
                    placeholder="***"
                    placeholderTextColor={'#939DAA'}
                    maxLength={3}
                    secureTextEntry={true}
                  />
                </View>
              </View>
            </View>
            <View style={commonStyle.mb4}>
              <CheckBox
                style={{paddingVertical: 10}}
                onClick={() =>
                  setIsCardSaveDefaultChecked(!isCardSaveDefaultChecked)
                }
                isChecked={isCardSaveDefaultChecked}
                checkedCheckBoxColor={'#ff5f22'}
                uncheckedCheckBoxColor={'#e6e7e8'}
                rightText={'Save as default'}
                rightTextStyle={commonStyle.blackTextR}
                checkedImage={<CheckedBox />}
                unCheckedImage={<UncheckedBox />}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save card"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              disabledStyle={commonStyle.commondisabledbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              disabledTitleStyle={commonStyle.buttontitleStyle}
              onPress={onSaveCard}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default BookingFlowAddCard;
