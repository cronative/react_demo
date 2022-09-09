import React, { Fragment, useEffect, useCallback, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Keyboard,

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Body, Left } from 'native-base';
import * as Progress from 'react-native-progress';
import { LeftArrowIos, LeftArrowAndroid } from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
import ActivityLoader from '../../components/ActivityLoader';
import BusinessFaq from '../../components/businessSetting/businessFaq';
import { useSelector, useDispatch } from 'react-redux';
import { setNavigationValue, setupProgressionUpdate } from '../../store/actions';
import { Put } from '../../api/apiAgent';


const SetupFaq = () => {
  const navigation = useNavigation();
  const faqDetails = useSelector((state) => state.faqDetails);
  // const loader = useSelector((state) => state.faqDetails.loader);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    console.log('In FAQ.:  ', faqDetails);
  }, [faqDetails]);

  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );






  const redirectUrlHandler = () => {
    console.log("ON click skip")
    console.log(navigationValue);
    if (navigationValue == 4) {
      navigation.navigate('Bookings')

      // dispatch(setNavigationValue(4));
    } else {
      dispatch(setNavigationValue(4));
    }
    skipBtnHanler();
    // if (faqDetails?.proFaqData?.length) {
    //   if (!!progressionData) {
    //     const updatedProgression = progressionData.map((step) => {
    //       if (step.stepNo === 10) {
    //         return {...step, isCompleted: 1};
    //       }
    //       return step;
    //     });
    //     dispatch(setupProgressionUpdate(updatedProgression));
    //   }
    // }
    // navigation.navigate('SetupSubscription');
    // dispatch(setNavigationValue(4));
  };

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { proFaqs: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        // redirectUrlHandler()
        // navigation.navigate(nextStep ? nextStep : 'SetupAvailability');
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
            <Text style={commonStyle.blackText16}>Profile setup. Step 10</Text>
          </Body>
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() => {
                redirectUrlHandler();
              }}>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={10}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <BusinessFaq isUpdate={false} redirectUrlHandler={redirectUrlHandler} />

        {/* <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Create FAQ
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
              <List style={commonStyle.payinCashinfowrap}>
                <ListItem thumbnail style={commonStyle.categoriseListItem}>
                  <View style={commonStyle.serviceListtouch}>
                    <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                      <Image
                        source={require('../../assets/images/payincashicon.png')}
                        style={commonStyle.payincashimg}
                        resizeMode={'contain'}
                      />
                    </Left>
                    <Body style={commonStyle.categoriseListBody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                        Please do not forget to add a COVID-19 safety info
                      </Text>
                    </Body>
                  </View>
                </ListItem>
              </List>
            </View>

            <View style={[commonStyle.setupCardBox, {marginBottom: 30}]}>
              <Text style={commonStyle.subtextbold}>General FAQ</Text>
              {faqDetails &&
              faqDetails.proFaqData &&
              faqDetails.proFaqData.length
                ? faqDetails.proFaqData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={commonStyle.generalFaqList}
                      onPress={() => {
                        gotoDetailsPage(item);
                      }}>
                      <Text style={[commonStyle.blackTextR, {width: '90%'}]}>
                        {item.question}
                      </Text>
                      <TouchableHighlight>
                        <RightAngle />
                      </TouchableHighlight>
                    </TouchableOpacity>
                  ))
                : null}

              <View style={commonStyle.mt2}>
                <TouchableOpacity
                  style={[commonStyle.searchBarText, {alignSelf: 'flex-start'}]}
                  onPress={() => {
                    gotoDetailsPage(null);
                  }}>
                  <TouchableHighlight>
                    <Text
                      style={{
                        fontSize: 36,
                        fontFamily: 'SofiaPro-ExtraLight',
                        lineHeight: 36,
                        marginRight: 15,
                      }}>
                      +
                    </Text>
                  </TouchableHighlight>
                  <Text style={commonStyle.blackTextR}>Add a question</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save and Continue"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => onSubmitFaqData()}
            />
          </View>
        </View> */}
      </Container>
    </Fragment>
  );
};

export default SetupFaq;
