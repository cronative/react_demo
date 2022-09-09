import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Body, Left, Title} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import {TextInputMask} from 'react-native-masked-text';
import CheckBox from 'react-native-check-box';
import {UncheckedBox, CheckedBox} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import {
  addcardRequest,
  addcardRequestClear,
} from './../../store/actions/profileAction';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {NAME_CHARECTER_PATTERN} from '../../utility/commonRegex';
import EventEmitter from 'react-native-eventemitter';
import moment from 'moment';

const addCard = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [isNameOnCardFocus, setIsNameOnCardFocus] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const [isCardNumberFocus, setIsCardNumberFocus] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [isExpirationDateFocus, setIsExpirationDateFocus] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [formValidate, setFormValidate] = useState(true);
  const [isCvcNumberFocus, setIsCvcNumberFocus] = useState(false);
  const [cvcNumber, setCvcNumber] = useState('');
  const addcardDatas = useSelector((state) => state.profileReducer.addCardData);
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const cardsList = useSelector(
    (state) => state.profileReducer.listCardData,
  )?.data;
  const [cvcHolder, setCvcHolder] = useState('');

  const updateCvc = (text) => {
    setCvcNumber(text);
    // let value = '';
    // if (!!text) {
    //   for (let i = 0; i < text.length; i++) {
    //     value = value + '*';
    //   }
    //   setCvcHolder(value);
    // } else {
    //   setCvcHolder('');
    // }
  };
  const [isCardSaveDefaultChecked, setIsCardSaveDefaultChecked] =
    useState(false);

  // This function will call once the current state will change
  useEffect(() => {
    console.log('addCard called');
    if (
      nameOnCard.trim().length > 0 &&
      cardNumber.length > 17 &&
      expirationDate.length == 5
    ) {
      if (cvcNumber.length == 3 || cvcNumber.length == 4) {
        setFormValidate(false);
      } else {
        setFormValidate(true);
      }
    } else {
      setFormValidate(true);
    }
  }, [nameOnCard, cardNumber, expirationDate, cvcNumber]);

  // This function will call after submit the form data
  const submitAddCardData = () => {
    if (NAME_CHARECTER_PATTERN.test(nameOnCard)) {
      if (cardNumber.length > 17) {
        if (expirationDate.length == 5) {
          let ExpirationSplit = expirationDate.split('/');
          if (
            parseInt(ExpirationSplit[0]) < 1 ||
            parseInt(ExpirationSplit[0]) > 12
          ) {
            global.showToast('Unformated expiration date', 'error');
          } else {
            var year = moment().format('YY');
            if (parseInt(ExpirationSplit[1]) < year) {
              global.showToast('Unformated expiration date', 'error');
            } else {
              if (cvcNumber.length == 3 || cvcNumber.length == 4) {
                let obj = {
                  name: nameOnCard,
                  number: cardNumber,
                  expirationDate: expirationDate,
                  isDefault:
                    isCardSaveDefaultChecked === true || cardsList?.length === 0
                      ? 1
                      : 0,
                  cvv: cvcNumber,
                };
                dispatch(addcardRequest(obj));
              } else {
                setFormValidate(false);
                global.showToast('Invalid cvc number', 'error');
              }
            }
          }
        } else {
          setFormValidate(false);
          global.showToast('Unformated expiration date', 'error');
        }
      } else {
        setFormValidate(false);
        global.showToast('Unformated card number', 'error');
      }
    } else {
      setFormValidate(false);
      global.showToast('Unformatted card name', 'error');
    }
  };

  // Defalut card selection
  const CardSaveDefaultSelectHelper = () => {
    setIsCardSaveDefaultChecked(!isCardSaveDefaultChecked);
  };

  // This is the response of add card
  useEffect(() => {
    if (addcardDatas === 'Something went wrong') {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
      setFormValidate(false);
      dispatch(addcardRequestClear());
    }
    if (
      addcardDatas &&
      addcardDatas.status == 200 &&
      addcardDatas !== 'Something went wrong'
    ) {
      setIsNameOnCardFocus(false);
      setNameOnCard('');
      setIsCardNumberFocus(false);
      setCardNumber('');
      setIsExpirationDateFocus(false);
      setExpirationDate('');
      setIsCvcNumberFocus(false);
      setCvcNumber('');
      setIsCardSaveDefaultChecked(false);
      setFormValidate(true);
      dispatch(addcardRequestClear());
      global.showToast('Card added successfully', 'success');
      setTimeout(() => {
        navigation.navigate('AccountSettings');
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1500);
    } else if (
      addcardDatas &&
      addcardDatas.status != 200 &&
      addcardDatas !== 'Something went wrong'
    ) {
      if (
        addcardDatas.response.data.message !== null &&
        addcardDatas.response.data.message !== ''
      ) {
        global.showToast(addcardDatas.response.data.message, 'error');
        setFormValidate(false);
        dispatch(addcardRequestClear());
      }
    }
  });

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.horizontalPadd}>
            <View style={[commonStyle.mb2, commonStyle.mt1]}>
              <TouchableOpacity
                activeOpacity={1}
                style={commonStyle.acceptCardwrap}>
                <Text style={[commonStyle.grayText14, commonStyle.mr08]}>
                  We accept all types of cards:
                </Text>
                {/* <Image source={require('../../assets/images/visa.png')} style={commonStyle.acceptCardimg} resizeMode={'contain'}/>
                    <Image source={require('../../assets/images/mastercard.png')} style={commonStyle.acceptCardimg} resizeMode={'contain'}/>  */}
              </TouchableOpacity>
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
                placeholder="Enter new name"
                returnKeyType="next"
                autoCapitalize={'none'}
              />
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Card number
              </Text>
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
                      isExpirationDateFocus && commonStyle.focusinput,
                    ]}
                    options={{
                      format: 'MM/YY',
                    }}
                    onFocus={() => setIsExpirationDateFocus(true)}
                    onChangeText={(text) => setExpirationDate(text)}
                    type={'datetime'}
                    value={expirationDate}
                    returnKeyType="next"
                    autoCapitalize={'none'}
                    keyboardType="number-pad"
                    placeholder="MM/YY"
                    placeholderTextColor={'#939DAA'}
                    maxLength={5}
                    // secureTextEntry
                  />
                </View>
                <View style={[commonStyle.CommCol6, {paddingLeft: 5}]}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    CVC
                  </Text>
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isCvcNumberFocus && commonStyle.focusinput,
                    ]}
                    type={'only-numbers'}
                    value={cvcNumber}
                    onFocus={() => setIsCvcNumberFocus(true)}
                    onChangeText={(text) => setCvcNumber(text)}
                    returnKeyType="done"
                    // autoCapitalize={'none'}
                    secureTextEntry={true}
                    keyboardType="number-pad"
                    placeholder="****"
                    placeholderTextColor={'#939DAA'}
                    maxLength={4}
                  />
                </View>
              </View>
            </View>
            <View style={commonStyle.mb4}>
              <CheckBox
                style={{paddingVertical: 10}}
                onClick={() => CardSaveDefaultSelectHelper()}
                isChecked={isCardSaveDefaultChecked}
                checkedCheckBoxColor={'#ff5f22'}
                uncheckedCheckBoxColor={'#e6e7e8'}
                rightText={'Default payment method'}
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
              disabled={formValidate}
              title="Save card"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              disabledStyle={commonStyle.commondisabledbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              disabledTitleStyle={commonStyle.buttontitleStyle}
              onPress={submitAddCardData}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default addCard;
