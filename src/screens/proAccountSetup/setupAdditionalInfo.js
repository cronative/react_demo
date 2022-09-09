import { useNavigation } from '@react-navigation/native';
import { Body, Container } from 'native-base';
import React, { Fragment, useState, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import AdditionalInfo from '../../components/businessSetting/additionalInfo';
import { LeftArrowAndroid, LeftArrowIos } from '../../components/icons';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import determineNextSetupStep from '../../utility/determineNextSetupStep';
import { Put } from '../../api/apiAgent';
// filesInterceptor();
const SetupAdditionalInfo = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [nextStep, setNextStep] = useState(null);
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const dispatch = useDispatch();
  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('IN ADDITIONAL INFO. Progression Data: ', progressionData);
    setNextStep(determineNextSetupStep(9, progressionData));
  }, [progressionData]);

  const redirectUrlHandler = () => {
    console.log('asdasdsad');
    navigation.navigate(nextStep ? nextStep : 'SetupFaq');
  };

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { additionalInfo: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep ? nextStep : 'SetupFaq');
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
      {loader ? <ActivityLoaderSolid /> : null}
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
            <Text style={commonStyle.blackText16}>Profile setup. Step 9</Text>
          </Body>
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() =>
                skipBtnHanler()
                // navigation.navigate(nextStep ? nextStep : 'SetupFaq')
              }>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.9}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <AdditionalInfo
          setKeyboardStatus={setKeyboardStatus}
          isUpdate={false}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
          progressionData={progressionData}
        />
      </Container>
    </Fragment>
  );
};

export default SetupAdditionalInfo;
