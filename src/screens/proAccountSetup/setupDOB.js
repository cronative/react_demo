import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Platform,
  BackHandler,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Body, Container } from 'native-base';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import commonStyle from '../../assets/css/mainStyle';
const { width, height } = Dimensions.get('window');
import DatePicker from 'react-native-datepicker';
// import DatePicker from 'react-native-date-picker';
import global from '../../components/commonservices/toast';
import ActivityLoader from '../../components/ActivityLoader';
import { Get, Post, Put } from '../../api/apiAgent';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import {
  setNavigationValue,
  setOnboardingValue,
  setupProgressionUpdate,
} from '../../store/actions';
import determineNextSetupStep from '../../utility/determineNextSetupStep';
import { LeftArrowAndroid, LeftArrowIos } from '../../components/icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SetupDOB = ({ navigation }) => {
  let ageLimit = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18),
  );
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateOfBirthForSave, setDateOfBirthForSave] = useState(null);
  const [loader, setLoader] = useState(false);

  const [nextStep, setNextStep] = useState(null);

  const dispatch = useDispatch();
  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  const onSubmitHandler = async () => {
    if (dateOfBirthForSave) {
      const payload = {
        dateOfBirth: moment(dateOfBirthForSave).format('YYYY-MM-DD'),
      };
      proDobAdd(payload);
    }
  };

  // const setNavigationRoute = async () => {
  //   await AsyncStorage.setItem('shouldNavigate', 'SetupDOB');
  // };'

  useEffect(() => {
    setLastStep();
  }, []);

  const setLastStep = async () => {
    try {
      let res = await Put('/user/step-update', { lastStep: 1 });
      console.log('setup last step res', res);
    } catch (err) {
      console.log('setup last step err', err);
    }
  };

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        console.log("ODODO");
        // if (!hasUnsavedChanges) {
        //   // If we don't have unsaved changes, then we don't need to do anything
        //   return;
        // }
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Are you sure?',
          'Confirm switch to your Readyhubb client account',
          [
            {
              text: 'Cancel',
              style: 'default',

              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              // onPress: () => navigation.dispatch(e.data.action),
              onPress: () => { },
            },
            {
              text: 'Ok',
              style: 'default',
              onPress: () => {
                handleSwitchToClientAccount();
              },
            },
          ],
        );
      }),
    [navigation],
  );

  const handleSwitchToClientAccount = async () => {
    // await AsyncStorage.removeItem('shouldNavigate');

    // navigation.navigate('SetupDOB');

    Post('common/switch', {})
      .then(async (result) => {
        if (result.status === 200) {
          let data = result.data;
          console.log(result)
          if (data.categories === 0 || data.location === 0) {
            dispatch({ type: 'USER_TYPE_STATUS', status: 0 });
            dispatch({
              type: 'SET_CLIENT_LANDING_PAGE',
              value: 'SignupCategories',
            });
            dispatch({ type: 'SET_NAVIGATION_VALUE', value: 2 });
          } else {
            dispatch(setOnboardingValue(1));
            dispatch(setNavigationValue(4));
          }
        }
        // await AsyncStorage.setItem('userType', '0');
        // dispatch({ type: 'USER_TYPE_STATUS', status: '0' });
        // dispatch(setNavigationValue(2));
      })
      .catch((error) => {
        console.log("error >>>>> ", error);
      });
  };

  const showBackAlert = () => {
    console.log("BACK")
    Alert.alert(
      'Are you sure?',
      'Confirm switch to your Readyhubb client account',
      [
        {
          text: 'Cancel',
          style: 'default',

          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          // onPress: () => navigation.dispatch(e.data.action),
          onPress: () => { },
        },
        {
          text: 'Ok',
          style: 'default',
          onPress: () => {
            handleSwitchToClientAccount();
          },
        },
      ],
    );
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    console.log('IN DOB. Progression Data: ', progressionData);
    setNextStep(determineNextSetupStep(1, progressionData));
  }, [progressionData]);

  useEffect(() => {
    console.log('DOB. Next step is: ', nextStep);
  }, [nextStep]);

  const proDobAdd = (data) => {
    console.log(data);
    setLoader(true);
    Put('pro/add-dob', data)
      .then((result) => {
        console.log(result);
        setLoader(false);
        if (result.status === 201) {
          if (!!progressionData) {
            const updatedProgression = progressionData.map((step) => {
              if (step.stepNo === 1) {
                return { ...step, isCompleted: 1 };
              }
              return step;
            });
            dispatch(setupProgressionUpdate(updatedProgression));
          }

          navigation.navigate(nextStep ? nextStep : 'SetupMainCategories');
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        console.log(
          error.response && error.response.data && error.response.data.message,
        );
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

  const getUserDetails = () => {
    setLoader(true);
    Get('user/profile', '')
      .then((result) => {
        console.log('result', result);
        setLoader(false);
        if (result.status === 200 && result.data.dateOfBirth) {
          setDateOfBirth(
            result.data && result.data.dateOfBirth
              ? new Date(result.data && result.data.dateOfBirth)
              : null,
          );
          setDateOfBirthForSave(
            result.data && result.data.dateOfBirth
              ? new Date(result.data && result.data.dateOfBirth)
              : null,
          );
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const setDOBPikeTime = (date) => {
    if (date.includes('/')) {
      let tempDate = date.split('/');
      let dateFormat = `${tempDate[2]}-${tempDate[1]}-${tempDate[0]}`;
      setDateOfBirthForSave(dateFormat);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandlerdata = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.goBack();
          return true;
        },
      );

      return () => backHandlerdata.remove();
    }, []),
  );

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoader /> : null}
      <Container
        style={[
          commonStyle.mainContainer,
          { paddingTop: Platform.OS === 'ios' ? 25 : 0 },
        ]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => {
                // navigation.goBack()
                showBackAlert();
              }}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body
            style={[
              commonStyle.headerbacktitle,
              {
                marginLeft: -20,
              },
            ]}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 1</Text>
          </Body>
        </View>
        <View>
          <Progress.Bar
            progress={0.1}
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
              Add your Date of Birth
            </Text>
            <Text style={[commonStyle.grayText16, commonStyle.mb2]}>
              We need to make sure that you are over 18 y.o.
            </Text>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Date of Birth
              </Text>
              <DatePicker
                placeholder={
                  <Text style={commonStyle.grayText16}>Select date</Text>
                }
                style={[
                  commonStyle.textInput,
                  commonStyle.focusinput,
                  { width: width - 40 },
                ]}
                date={dateOfBirth}
                mode="date"
                maxDate={ageLimit}
                format="DD/MM/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateInput: {
                    marginLeft: 0,
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    paddingLeft: 0,
                    paddingTop: 8,
                  },
                  dateText: {
                    fontSize: 14,
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                  },
                  btnTextText: {
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  },
                  btnTextConfirm: {
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  },
                  btnTextCancel: {
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  },
                  placeholderText: {
                    fontFamily: 'SofiaPro',
                    fontSize: 14,
                    color: '#8c8c8c',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                }}
                onDateChange={(date) => {
                  setDateOfBirth(date);
                  setDOBPikeTime(date);
                }}
              />
              {/* <DatePicker
                placeholder={
                  <Text style={commonStyle.grayText16}>Select date</Text>
                }
                style={[
                  commonStyle.textInput,
                  commonStyle.focusinput,
                  {width: width - 40},
                ]}
                date={dateOfBirth}
                mode="date"
                maxDate={ageLimit}
                format="DD/MM/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateInput: {
                    marginLeft: 0,
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    paddingLeft: 0,
                    paddingTop: 8,
                  },
                  dateText: {
                    fontSize: 14,
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                  },
                  btnTextText: {
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  },
                  btnTextConfirm: {
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  },
                  btnTextCancel: {
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  },
                  placeholderText: {
                    fontFamily: 'SofiaPro',
                    fontSize: 14,
                    color: '#8c8c8c',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                }}
                onDateChange={(date) => {
                  setDateOfBirth(date);
                  setDOBPikeTime(date);
                }}
              /> */}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          {dateOfBirth && (
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Save and Continue"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => onSubmitHandler()}
              />
            </View>
          )}
        </View>
      </Container>
    </Fragment>
  );
};

export default SetupDOB;
