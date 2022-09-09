import React, {Fragment, useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Body} from 'native-base';

import * as Progress from 'react-native-progress';
import {LeftArrowIos, LeftArrowAndroid} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import {useSelector} from 'react-redux';

import ActivityLoader from '../../components/ActivityLoader';
import AvailabilityDetails from '../../components/businessSetting/availablityDetails';
import {Get, Post, Put} from '../../api/apiAgent';
import global from '../../components/commonservices/toast';

const {width, height} = Dimensions.get('window');

import determineNextSetupStep from '../../utility/determineNextSetupStep';

const SetupAvailability = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [nextStep, setNextStep] = useState(null);

  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('IN AVAILABILITY. Progression Data: ', progressionData);
    setNextStep(determineNextSetupStep(6, progressionData));
  }, [progressionData]);

  const redirectUrlHandler = () => {
    navigation.navigate(nextStep ? nextStep : 'SetupContacts');
  };
  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', {availability: '1'})
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep ? nextStep : 'SetupContacts');
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
            <Text style={commonStyle.blackText16}>Profile setup. Step 6</Text>
          </Body>
          <View style={{alignSelf: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() =>
                // navigation.navigate(nextStep ? nextStep : 'SetupContacts')
                skipBtnHanler()
              }>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.6}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <AvailabilityDetails
          isUpdate={false}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
          progressionData={progressionData}
        />
      </Container>
    </Fragment>
  );
};

export default SetupAvailability;
