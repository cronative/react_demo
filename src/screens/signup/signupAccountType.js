import {Container} from 'native-base';
import React, {Fragment, useState, useEffect, useCallback, useRef} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import commonStyle from '../../assets/css/mainStyle';
import logo from '../../assets/images/logo.png';
import {
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../../components/icons';
const {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setNavigationValue} from '../../store/actions';
import {clearInitialNavigationRoute} from '../../store/actions/nagationAction';
import {useFocusEffect} from '@react-navigation/native';

const SignupAccountType = ({navigation}) => {
  const dispatch = useDispatch();
  const [dataSelect, setDataSelect] = useState(null);
  const [indexSelect, setIndexSelect] = useState(null);
  const referCodeUserType = useSelector(
    (state) => state.auth.referralCodeUserType,
  );
  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );
  const initialNav = useSelector(
    (state) => state.navigationValueDetails.initialNav,
  );
  const scrollViewRef = useRef();

  const radioSelectHelper = (index, value) => {
    setDataSelect(value);
    setIndexSelect(index);
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true});
    }, 750);
  };

  // useEffect(() => {
  //   if (!!indexSelect) {
  //     scrollViewRef.current.scrollToEnd({animated: true});
  //   }
  // }, [indexSelect]);

  useFocusEffect(
    useCallback(() => {
      const backHandlerdata = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          redirectToExplore();
          return true;
        },
      );
      return () => backHandlerdata.remove();
    }, []),
  );

  useEffect(() => {
    if (referCodeUserType != null) {
      if (referCodeUserType == 'client') {
        setDataSelect('client account');
        setIndexSelect('0');
      } else {
        setDataSelect('professional account');
        setIndexSelect('1');
      }
    }
  }, [referCodeUserType]);

  useEffect(() => {
    if (!!initialNav) {
      dispatch(clearInitialNavigationRoute());
    }
  }, [initialNav]);

  const redirectToExplore = async () => {
    console.log('navigationValue: ', navigationValue);
    await AsyncStorage.setItem('isCompleteOnboarding', '1');
    await AsyncStorage.setItem('isClickedExplore', '1');
    console.log('navigationValue: ', navigationValue);
    if (navigationValue !== 4) {
      dispatch(setNavigationValue(4));
    } else {
      navigation.navigate('Explore');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View
            style={[
              commonStyle.clientsearchback,
              {top: Platform.OS === 'ios' ? 5 : 5, zIndex: 10},
            ]}>
            <TouchableOpacity
              style={commonStyle.haederback}
              onPress={() => redirectToExplore()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <View style={commonStyle.headerlogo}>
            <Image source={logo} style={commonStyle.logo} />
          </View>
        </View>

        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={commonStyle.headingwrap}>
            <Text style={commonStyle.textheading}>Welcome to</Text>
            <Text style={[commonStyle.textheading, commonStyle.colorOrange]}>
              Readyhubb!
            </Text>
            <Text style={[commonStyle.grayText16, commonStyle.mt2]}>
              Please choose your account type
            </Text>
          </View>

          <View style={[commonStyle.accountwrap]}>
            <RadioGroup
              style={commonStyle.accountTypeRadioGroup}
              size={0}
              thickness={0}
              color="#ffffff"
              activeColor="#ffffff"
              highlightColor={'#ffffff'}
              selectedIndex={indexSelect}
              onSelect={(index, value) => {
                radioSelectHelper(index, value);
              }}>
              <RadioButton
                style={commonStyle.accountTypeRadio}
                animation={'bounceIn'}
                isSelected={true}
                outerColor={'#be1e2d'}
                innerColor={'#be1e2d'}
                innerSize={0}
                value={'client account'}>
                <View style={[commonStyle.accountList, {width: width - 40}]}>
                  <View
                    style={[
                      commonStyle.categoriseList,
                      {paddingHorizontal: 0},
                    ]}>
                    <View
                      style={[
                        commonStyle.serviceListtouch,
                        {width: width - 55},
                      ]}>
                      <View
                        style={[
                          commonStyle.accountlistavaterbg,
                          {backgroundColor: '#FFF6DF', marginRight: 15},
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          defaultSource={require('../../assets/images/default.png')}
                          source={require('../../assets/images/signup/account-avater-1.png')}
                        />
                      </View>
                      <View
                        style={[
                          commonStyle.categoriseListBody,
                          {width: '60%'},
                        ]}>
                        <Text
                          style={[commonStyle.blackText16, commonStyle.mb1]}
                          numberOfLines={1}>
                          Client account
                        </Text>
                        <Text style={[commonStyle.grayText14]}>
                          Discover and book services, find professionals in your
                          area and virtually. Make secure payments and keep
                          track of your appointments.
                        </Text>
                      </View>
                      <View
                        style={{marginLeft: Platform.OS === 'ios' ? 15 : 5}}>
                        {indexSelect == 0 ? (
                          <CircleCheckedBoxActive />
                        ) : (
                          <CircleCheckedBoxOutline />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </RadioButton>
              <RadioButton
                style={commonStyle.accountTypeRadio}
                animation={'bounceIn'}
                isSelected={true}
                outerColor={'#be1e2d'}
                innerColor={'#be1e2d'}
                innerSize={0}
                value={'professional account'}>
                <View style={[commonStyle.accountList, {width: width - 40}]}>
                  <View
                    style={[
                      commonStyle.categoriseList,
                      {paddingHorizontal: 0},
                    ]}>
                    <View
                      style={[
                        commonStyle.serviceListtouch,
                        {width: width - 55},
                      ]}>
                      <View
                        style={[
                          commonStyle.accountlistavaterbg,
                          {backgroundColor: '#EDDFFF', marginRight: 15},
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          defaultSource={require('../../assets/images/default.png')}
                          source={require('../../assets/images/signup/account-avater-2.png')}
                        />
                      </View>
                      <View
                        style={[
                          commonStyle.categoriseListBody,
                          {width: '60%'},
                        ]}>
                        <Text
                          style={[commonStyle.blackText16, commonStyle.mb1]}
                          numberOfLines={1}>
                          Professional account
                        </Text>
                        <Text style={[commonStyle.grayText14]}>
                          List your services, manage your booking calendar, keep
                          track of your payments and stay up to date with all
                          aspects of your service business.
                        </Text>
                      </View>
                      <View
                        style={{marginLeft: Platform.OS === 'ios' ? 15 : 5}}>
                        {indexSelect == 1 ? (
                          <CircleCheckedBoxActive />
                        ) : (
                          <CircleCheckedBoxOutline />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </RadioButton>
            </RadioGroup>
          </View>

          {indexSelect != null && (
            <View style={[commonStyle.mb0, commonStyle.mt2]}>
              <Button
                title="Continue"
                containerStyle={commonStyle.buttoncontainerStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() =>
                  navigation.navigate('Signup', {user_type: dataSelect})
                }
              />
            </View>
          )}
        </ScrollView>

        <View style={[commonStyle.termswrap, commonStyle.mtb30]}>
          <Text style={[commonStyle.grayText18, commonStyle.mrsmall]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={commonStyle.blackText16}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </Fragment>
  );
};

export default SignupAccountType;
