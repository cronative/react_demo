import React, { Fragment, useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Body } from 'native-base';
import * as Progress from 'react-native-progress';
import { LeftArrowIos, LeftArrowAndroid } from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
import BusinessContacts from '../../components/businessSetting/businessContact';
import { Get, Put } from '../../api/apiAgent';
const { width, height } = Dimensions.get('window');
import { useSelector } from 'react-redux';
import determineNextSetupStep from '../../utility/determineNextSetupStep';

const SetupContacts = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState(false);

  const [nextStep, setNextStep] = useState(null);

  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('IN SETUP CONTACTS. Progression Data: ', progressionData)
    setNextStep(determineNextSetupStep(7, progressionData))
  }, [progressionData])

  const redirectUrlHandler = () => {
    navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
  };
  fetchData = () => {
    setLoader(true);
    Get('/user/profile', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          console.log('catlist', result);
          setUserDetails(result.data);
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
  }, []);



  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { contact: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
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
      {loader ? <ActivityLoader /> : null}
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
            <Text style={commonStyle.blackText16}>Profile setup. Step 7</Text>
          </Body>
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() => skipBtnHanler()}>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.7}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <BusinessContacts
          isUpdate={false}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
          userDetail={userDetails}
          progressionData={progressionData}
        />
      </Container>
    </Fragment>
  );
};

export default SetupContacts;
