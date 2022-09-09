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
import EventEmitter from 'react-native-eventemitter';
import { useSelector } from 'react-redux';
import { Get, Post, Put } from '../../api/apiAgent';
import global from '../../components/commonservices/toast';

const { width, height } = Dimensions.get('window');
import ServiceDetails from '../../components/businessSetting/serviceDeails';

import determineNextSetupStep from '../../utility/determineNextSetupStep';

const SetupService = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [nextStep, setNextStep] = useState(null);

  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('IN SETUP SERVICES. Progression Data: ', progressionData);
    setNextStep(determineNextSetupStep(5, progressionData));
  }, [progressionData]);

  const redirectUrlHandler = () => {
    skipBtnHanler();
    // navigation.navigate(nextStep ? nextStep : 'SetupAvailability');
  };

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { services: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep ? nextStep : 'SetupAvailability');
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
              onPress={() => {
                EventEmitter.emit('refreshServiceAdd');
                navigation.goBack();
              }}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={commonStyle.headerbacktitle}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 5</Text>
          </Body>
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={
                () =>
                  // navigation.navigate(nextStep ? nextStep : 'SetupAvailability')
                  skipBtnHanler()
              }>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.5}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <ServiceDetails
          isUpdate={false}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
          progressionData={progressionData}
        />
      </Container>
    </Fragment>
  );
};

export default SetupService;
