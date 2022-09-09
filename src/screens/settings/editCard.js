import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Body, Left, Title} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import {TextInputMask} from 'react-native-masked-text';
import CheckBox from 'react-native-check-box';
import {UncheckedBox, CheckedBox} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import EventEmitter from 'react-native-eventemitter';
import {
  updateCardRequest,
  updateCardRequestClear,
  deleteCardRequest,
  deleteCardRequestClear,
} from './../../store/actions/profileAction';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {NAME_CHARECTER_PATTERN} from '../../utility/commonRegex';
import moment from 'moment';

const editCard = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const cardId = route?.params?.card_id;
  const [isNameOnCardFocus, setIsNameOnCardFocus] = useState(false);
  const [nameOnCard, setNameOnCard] = useState(route.params.name_on_card);
  const [isCardNumberFocus, setIsCardNumberFocus] = useState(false);
  const [cardNumber, setCardNumber] = useState(route.params.card_number);
  const [isExpirationDateFocus, setIsExpirationDateFocus] = useState(false);
  const [expirationDate, setExpirationDate] = useState(
    route.params.expiration_date,
  );
  const [formValidate, setFormValidate] = useState(true);
  const [isCvcNumberFocus, setIsCvcNumberFocus] = useState(false);
  const [cvcNumber, setCvcNumber] = useState('');
  const [isCardSaveDefaultChecked, setIsCardSaveDefaultChecked] = useState(
    route.params.is_default == 1 ? true : false,
  );
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
  const updatecardDatas = useSelector(
    (state) => state.profileReducer.updateCardData,
  );
  const deleteCardDatas = useSelector(
    (state) => state.profileReducer.deleteCardData,
  );
  const loderStatus = useSelector((state) => state.profileReducer.loader);

  // This function will call once the current state will change
  useEffect(() => {
    if (nameOnCard.trim().length > 0 && expirationDate.length == 5) {
      let defaultCard = route.params.is_default == 1 ? true : false;
      if (
        nameOnCard === route.params.name_on_card &&
        expirationDate === route.params.expiration_date &&
        isCardSaveDefaultChecked === defaultCard
      ) {
        setFormValidate(true);
      } else {
        setFormValidate(false);
      }
    } else {
      setFormValidate(true);
    }
  }, [
    nameOnCard,
    cardNumber,
    expirationDate,
    cvcNumber,
    isCardSaveDefaultChecked,
  ]);

  // Default card set
  const CardSaveDefaultSelectHelper = () => {
    setIsCardSaveDefaultChecked(!isCardSaveDefaultChecked);
  };

  // This function will call after submit the form data
  const submitupdateCardData = () => {
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
              let obj = {
                cardId: cardId,
                name: nameOnCard,
                expirationDate: expirationDate,
                isDefault: isCardSaveDefaultChecked === true ? 1 : undefined,
              };
              dispatch(updateCardRequest(obj));
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

  // This is the response of update card
  useEffect(() => {
    if (updatecardDatas === 'Something went wrong') {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
      setFormValidate(true);
      dispatch(updateCardRequestClear());
    }
    if (
      updatecardDatas &&
      updatecardDatas.status == 200 &&
      updatecardDatas !== 'Something went wrong'
    ) {
      setIsExpirationDateFocus(false);
      setFormValidate(true);
      dispatch(updateCardRequestClear());
      global.showToast('Card updated successfully', 'success');
      setTimeout(() => {
        navigation.navigate('AccountSettings');
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1500);
    } else if (
      updatecardDatas &&
      updatecardDatas.status != 200 &&
      updatecardDatas !== 'Something went wrong'
    ) {
      if (
        updatecardDatas.response.data.message !== null &&
        updatecardDatas.response.data.message !== ''
      ) {
        global.showToast(updatecardDatas.response.data.message, 'error');
        setFormValidate(false);
        dispatch(updateCardRequestClear());
      }
    }

    // Deletes card response handle
    if (deleteCardDatas && deleteCardDatas.status == 200) {
      dispatch(deleteCardRequestClear());
      global.showToast('Card deleted successfully', 'success');
      setTimeout(() => {
        navigation.navigate('AccountSettings');
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1500);
    } else if (deleteCardDatas && deleteCardDatas.status != 200) {
      if (
        deleteCardDatas.response.data.message !== null &&
        deleteCardDatas.response.data.message !== ''
      ) {
        global.showToast(deleteCardDatas.response.data.message, 'error');
        dispatch(deleteCardRequestClear());
      }
    }
  });

  // Delete card details
  const deleteCardData = () => {
    if (cardId !== null) {
      let obj = {
        id: cardId,
      };
      dispatch(deleteCardRequest(obj));
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // Clogout request confirmation
  const confirmDeleteCard = () => {
    Alert.alert(
      '',
      'Are you sure, you want to delete this card details?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteCardData()},
      ],
      {cancelable: false},
    );
  };

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
                // editable={false}
                selectTextOnFocus={false}
                onChangeText={(text) => setNameOnCard(text)}
                value={nameOnCard}
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
                disabled={true}
                options={{
                  obfuscated: false,
                  issuer: 'visa-or-mastercard',
                }}
                onFocus={() => setIsCardNumberFocus(true)}
                editable={false}
                selectTextOnFocus={false}
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
              />
            </View>
            {/* <View style={commonStyle.mb2}>
                <View style={commonStyle.commRow}>
                  <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                      <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>Expiration date</Text>
                      <TextInputMask
                      style={[
                        commonStyle.textInput,
                        isExpirationDateFocus && commonStyle.focusinput,
                      ]}
                      options={{
                        format: 'MM/YYYY'
                      }}
                      onFocus={() => setIsExpirationDateFocus(true)}
                      onChangeText={(text) => setExpirationDate(text)}
                      type={'datetime'}
                      value={expirationDate}
                      returnKeyType="next"
                      autoCapitalize={'none'}
                      keyboardType="number-pad"
                      placeholder='MM/YYYY'
                      placeholderTextColor={'#939DAA'}
                      maxLength={7}
                    />
                  </View>
                  <View style={[commonStyle.CommCol6, {paddingLeft: 5}]}>
                      <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>CVC</Text>
                      <TextInputMask
                        style={[
                          commonStyle.textInput,
                          isCvcNumberFocus && commonStyle.focusinput,
                        ]}
                        type={'only-numbers'}
                        value={cvcNumber}
                        editable={false} 
                        selectTextOnFocus={false}
                        onFocus={() => setIsCvcNumberFocus(true)}
                        onChangeText={(text) => setCvcNumber(text)}
                        returnKeyType="done"
                        autoCapitalize={'none'}
                        keyboardType="number-pad"
                        placeholder='***'
                        placeholderTextColor={'#939DAA'}
                        maxLength={3}
                        secureTextEntry={true}
                      />
                  </View>
                </View>
              </View> */}
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
                disabled={route.params.is_default == 1}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              disabled={formValidate}
              title="Update card"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              disabledStyle={commonStyle.commondisabledbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              disabledTitleStyle={commonStyle.buttontitleStyle}
              onPress={submitupdateCardData}
            />
            <TouchableOpacity
              style={commonStyle.pbt15}
              onPress={confirmDeleteCard}>
              <Text style={commonStyle.blackText16}>Delete card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default editCard;
