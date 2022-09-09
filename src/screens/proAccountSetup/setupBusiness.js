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

const { width, height } = Dimensions.get('window');
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import ActivityLoader from '../../components/ActivityLoader';
import BusinessDetails from '../../components/businessSetting/businessDetails';
import EventEmitter from 'react-native-eventemitter';
import { useSelector } from 'react-redux';

import determineNextSetupStep from '../../utility/determineNextSetupStep';

import { Get, Post, Put } from '../../api/apiAgent';

const SetupBusiness = ({ route }) => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [locationLoader, setLocationLoader] = useState(false);

  const [nextStep, setNextStep] = useState(null);

  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('IN SET UP YOUR BUSINESS. Progression Data: ', progressionData);
    setNextStep(determineNextSetupStep(4, progressionData));
  }, [progressionData]);

  const redirectUrlHandler = (data) => {
    navigation.navigate(nextStep ? nextStep : 'SetupService');
  };

  const skipBtnHandler = () => {
    Put('pro/skip-step', { businessDetails: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep);
      })
      .catch((error) => {
        console.log(' ERRORRR>>>>>>>>>>>>>', error);
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
      {loader ? <ActivityLoaderSolid /> : null}
      {locationLoader ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => {
                EventEmitter.emit('refreshAdditionalCategories');
                navigation.goBack();
              }}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={commonStyle.headerbacktitle}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 4</Text>
          </Body>
          {/* NO LONGER SKIPPABLE */}
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() => skipBtnHandler()}>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.4}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>
        <BusinessDetails
          isUpdate={false}
          setLoader={setLoader}
          setLocationLoader={setLocationLoader}
          redirectUrlHandler={redirectUrlHandler}
          progressionData={progressionData}
        />
      </Container>
    </Fragment>
  );
};

export default SetupBusiness;
