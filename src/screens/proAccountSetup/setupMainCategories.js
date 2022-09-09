import React, { Fragment, useState, useEffect } from 'react';
import {
  ScrollView,
  Dimensions,
  Platform,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { Body, Container } from 'native-base';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
} from '../../components/icons';
import ActivityLoader from '../../components/ActivityLoader';
import commonStyle from '../../assets/css/mainStyle';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import {
  categoryListRequest,
  trialExpireCheckRequest,
} from '../../store/actions';
import { Get, Post, Put } from '../../api/apiAgent';
import * as Constant from '../../api/constant';
import { LeftArrowAndroid, LeftArrowIos } from '../../components/icons';

import { setupProgressionUpdate } from '../../store/actions';
import determineNextSetupStep from '../../utility/determineNextSetupStep';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetupMainCategories = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [categoriesItems, setCategoriesItems] = useState(null);
  const [mainCategorySelectedId, setMainCategorySelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const categoryList = useSelector(
    (state) => state.categoryList.categoryListDetails,
  );
  const loader = useSelector((state) => state.categoryList.loader);

  const professionalStepReduxData = useSelector(
    (state) => state.professionSettingStepData.step2Data,
  );

  useEffect(() => {
    if (
      categoryList &&
      categoryList.status &&
      categoryList.status === 200 &&
      categoryList.data &&
      categoryList.data.rows
    ) {
      setCategoriesItems([...categoryList.data.rows]);
    } else {
      dispatch(categoryListRequest());
    }
  }, [categoryList]);

  useEffect(() => {
    if (professionalStepReduxData) {
      setMainCategorySelectedId(professionalStepReduxData);
    } else {
      getUploadedMainCategory();
    }
  }, []);

  // const setNavigationRoute = async () => {
  //   await AsyncStorage.setItem('shouldNavigate', 'SetupMainCategories');
  // };

  // useEffect(() => {
  //   setNavigationRoute();
  // }, []);

  // const startTrial = (mainCategorySelectedId) => {
  //   setLoading(true);
  //   Post('/pro/start-trial')
  //     .then(async (result) => {
  //       setLoading(false);
  //       if (result.status === 200) {
  //         console.log(',mm');
  //         global.showToast('Your trial has started from today', 'success');
  //         dispatch(trialExpireCheckRequest());
  //         await AsyncStorage.removeItem('shouldNavigate');
  //         navigation.navigate('SetupSubscription', {
  //           primaryCategoryId: mainCategorySelectedId,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       dispatch(trialExpireCheckRequest());
  //       if (
  //         error?.response?.data?.status === 403 ||
  //         error?.response?.data?.status === '403'
  //       ) {
  //         console.log('error', error);
  //       }
  //       console.log('error1', error);
  //     });
  // };

  const categoriesListOnSubmit = async () => {
    skipBtnHanler();
    try {
      if (mainCategorySelectedId) {
        setLoading(true);
        console.log('check');
        dispatch({ type: 'PRO_SETTING_STEP2', value: mainCategorySelectedId });
        let lastStepRes = await Put('/user/step-update', { lastStep: -1 });
        // const result = await Post('/pro/start-trial');
        const result = await Post('/pro/setup-paid-account');
        dispatch({ type: 'USER_TYPE_STATUS', status: 1 });

        // await AsyncStorage.removeItem('shouldNavigate');
        setLoading(false);
        // if (result.status === 200) {

        // global.showToast('Your trial has started from today', 'success');
        dispatch(trialExpireCheckRequest());
        // await AsyncStorage.removeItem('shouldNavigate');

        // }
        // navigation.navigate('SetupAdditionalCategories', {
        //   primaryCategoryId: mainCategorySelectedId,
        // });
      }
    } catch (error) {
      setLoading(false);
      dispatch(trialExpireCheckRequest());
      if (
        error?.response?.data?.status === 403 ||
        error?.response?.data?.status === '403'
      ) {
        console.log('error', error);
      }
      console.log('satyam', JSON.stringify(error?.response, null, 2));
      console.log('error1', error);
    } finally {
      navigation.navigate('SetupSubscription', {
        primaryCategoryId: mainCategorySelectedId,
      });
    }

  };

  const skipBtnHanler = () => {
    console.log('***');
    // setLoader(true);
    Put('pro/skip-step', { primaryCategory: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep ? nextStep : 'SetupFaq');
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

  const mainCategorySelectHelper = (value) => {
    setMainCategorySelectedId(value);
  };

  const getUploadedMainCategory = () => {
    setLoading(true);
    Get('pro/main-category', '')
      .then((result) => {
        setLoading(false);
        if (result.status === 200) {
          setMainCategorySelectedId(result.data && result.data.categoryId);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader || loading ? <ActivityLoader /> : null}

      <Container
        style={[
          commonStyle.mainContainer,
          { paddingTop: Platform.OS === 'ios' ? 40 : 0 },
        ]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View style={commonStyle.haederArrowback}>
            {navigation?.canGoBack() ? (
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => {
                  navigation?.goBack();
                  // showBackAlert();
                }}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
          <Body
            style={[
              commonStyle.headerbacktitle,
              {
                marginLeft: -20,
              },
            ]}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 2</Text>
          </Body>
        </View>
        <View>
          <Progress.Bar
            progress={0.2}
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
            <Text style={[commonStyle.subheading, commonStyle.mb05]}>
              Choose main category of services
            </Text>
          </View>

          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              <RadioGroup
                style={commonStyle.setupradioGroup}
                color="#ffffff"
                activeColor="#ffffff"
                highlightColor={'#ffffff'}
                selectedIndex={mainCategorySelectedId}
                onSelect={(index, value) => {
                  mainCategorySelectHelper(value);
                }}>
                {categoriesItems &&
                  categoriesItems.map((item, index) => (
                    <RadioButton
                      key={index}
                      style={commonStyle.setupradioButton}
                      value={item.id}>
                      <View style={[commonStyle.radiojustify]}>
                        <View
                          style={[
                            commonStyle.categoriseList,
                            commonStyle.wfull,
                          ]}>
                          <View
                            style={[
                              commonStyle.categoriseListItem,
                              commonStyle.wfull,
                            ]}>
                            <View
                              style={[
                                commonStyle.serviceListtouch,
                                commonStyle.wfull,
                              ]}>
                              <View
                                style={[
                                  commonStyle.accountlistavaterbg,
                                  { backgroundColor: item.color },
                                ]}>
                                <Image
                                  style={commonStyle.avatericon}
                                  defaultSource={require('../../assets/images/default-user.png')}
                                  source={{
                                    uri: item.logoUrl,
                                  }}
                                />
                              </View>
                              <View
                                style={[
                                  commonStyle.categoriseListBody,
                                  { width: '70%' },
                                ]}>
                                <Text
                                  style={[
                                    commonStyle.blackTextR18,
                                    commonStyle.mb03,
                                  ]}
                                  numberOfLines={1}>
                                  {item.name}
                                </Text>
                                <Text style={[commonStyle.grayText16]}>
                                  {item.description}
                                </Text>
                              </View>
                              <View style={commonStyle.radiobtncircle}>
                                {mainCategorySelectedId === item.id ? (
                                  <CircleCheckedBoxActive />
                                ) : (
                                  <CircleCheckedBoxOutline />
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </RadioButton>
                  ))}
              </RadioGroup>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {mainCategorySelectedId && (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title="Save and Continue"
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => categoriesListOnSubmit()}
            />
          </View>
        )}
      </Container>
    </Fragment>
  );
};

export default SetupMainCategories;
