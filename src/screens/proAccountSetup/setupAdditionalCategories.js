import React, { Fragment, useState, useEffect } from 'react';
import {
  ScrollView,
  Dimensions,
  Platform,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Container, List, ListItem, Body, Left } from 'native-base';
import CheckBox from 'react-native-check-box';
import * as Progress from 'react-native-progress';
import { Button } from 'react-native-elements';
import { UncheckedBox, CheckedBox } from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
const { width } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import global from '../../components/commonservices/toast';
import ActivityLoader from '../../components/ActivityLoader';
import { Get, Post, Put } from '../../api/apiAgent';
import * as Constant from '../../api/constant';
import EventEmitter from 'react-native-eventemitter';
import {
  LeftArrowIos,
  LeftArrowAndroid,
  CloseIcon,
} from '../../components/icons';

import { setupProgressionUpdate } from '../../store/actions';
import determineNextSetupStep from '../../utility/determineNextSetupStep';

const SetupAdditionalCategories = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [showButton, setShowButton] = useState(false);
  const [categoriesItems, setCategoriesItems] = useState([]);
  const primaryCategoryId = route?.params?.primaryCategoryId || '0';
  const [loading, setLoading] = useState(false);
  const [isUpdateCategory, setIsUpdateCategory] = useState(false);

  const [nextStep, setNextStep] = useState(null);

  const categoryList = useSelector(
    (state) => state.categoryList.categoryListDetails,
  );
  const categoryLoading = useSelector((state) => state.categoryList.loader);
  const professionalStepReduxData = useSelector(
    (state) => state.professionSettingStepData.step3Data,
  );
  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  useEffect(() => {
    // if (professionalStepReduxData) {
    //   setShowButton(true);
    //   setIsUpdateCategory(true);
    //   additionalCategoryModification();
    // } else {
    getUploadedAdditionalCategory();
    // }

    // Refreshing the page
    EventEmitter.on('refreshAdditionalCategories', () => {
      console.log('EventEmitter On');
      getUploadedAdditionalCategory();
    });
  }, []);

  useEffect(() => {
    console.log(
      'In Additional Categories. Progression Data: ',
      progressionData,
    );
    setNextStep(determineNextSetupStep(3, progressionData));
  }, [progressionData]);

  useEffect(() => {
    console.log('Additional Cats. Next step is: ', nextStep);
  }, [nextStep]);
  const checkValueIsExistOrNot = (value, list = null) => {
    // let tempArray = list ? [...list] : [...professionalStepReduxData];
    // if (tempArray) {
    //   return tempArray.some((item) => value === item);
    // } else {
    //   return false;
    // }

    let tempArray = list ? [...list] : [];
    if (tempArray && tempArray.length) {
      return tempArray.some((item) => value === item);
    } else {
      return false;
    }
  };

  const checkboxSelectHelper = (item) => {
    const tempCategoryArray = [...categoriesItems];
    let index = tempCategoryArray.findIndex(
      (eachCategory) => eachCategory === item,
    );
    const tempItem = { ...item };
    tempItem.isChecked = !tempItem.isChecked;
    tempCategoryArray[index] = tempItem;
    setCategoriesItems([...tempCategoryArray]);

    const categorySelection = tempCategoryArray.filter(
      (eachCategory) => eachCategory.isChecked,
    );
    if (categorySelection.length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const categoriesListOnSubmit = async () => {
    let additionalCategoryIds = categoriesItems
      .filter((eachCategory) => eachCategory.isChecked)
      .map((eachCategory) => {
        return eachCategory.id;
      });
    dispatch({ type: 'PRO_SETTING_STEP3', value: additionalCategoryIds });
    if (additionalCategoryIds.length > 0) {
      additionalCategoryIds.push(primaryCategoryId);
      const payload = {
        categories: additionalCategoryIds,
        primaryCategoryId: primaryCategoryId,
      };


      Put('pro/skip-step', { additionalCategories: '1' })
        .then((result) => {
          setLoader(false);
          console.log('result is **', result);
          // navigation.navigate(nextStep);
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

      proStepSettingSubmit(payload);
    }
  };

  const proStepSettingSubmit = (data) => {
    setLoading(true);
    if (!isUpdateCategory) {
      Post('pro/add-categories', data)
        .then((result) => {
          setLoading(false);
          if (result.status === 201) {
            // storeValueIntoRedux(result.data);
            // global.showToast(result.message, 'success');

            if (!!progressionData) {
              const updatedProgression = progressionData.map((step) => {
                if (step.stepNo == 2 || step.stepNo == 3) {
                  return { ...step, isCompleted: 1 };
                }
                return step;
              });

              dispatch(setupProgressionUpdate(updatedProgression));
            }

            navigation.navigate(nextStep ? nextStep : 'SetupBusiness');
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoading(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    } else {
      Put('pro/add-categories', data)
        .then((result) => {
          setLoading(false);
          if (result.status === 201) {
            // storeValueIntoRedux(result.data);
            // global.showToast(result.message, 'success');
            navigation.navigate('SetupBusiness');
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoading(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    }
  };

  const additionalCategoryModification = (list = null) => {
    if (
      categoryList &&
      categoryList.status &&
      categoryList.status === 200 &&
      categoryList.data &&
      categoryList.data.rows
    ) {
      const additionalCategoryList = categoryList.data.rows
        .filter((eachCategory) => eachCategory.id !== primaryCategoryId)
        .map((category) => {
          category.isChecked = checkValueIsExistOrNot(category.id, list);
          return category;
        });
      setCategoriesItems([...additionalCategoryList]);
    }
  };

  const getUploadedAdditionalCategory = () => {
    setLoading(true);
    setIsUpdateCategory(false);
    Get('pro/additional-categories', '')
      .then((result) => {
        setLoading(false);
        if (result.status === 200 && result.data && result.data.length) {
          setIsUpdateCategory(true);
          const subCategoryData = result.data.map((category) => {
            return category.categoryId;
          });
          dispatch({ type: 'PRO_SETTING_STEP3', value: subCategoryData });
          setShowButton(true);
          additionalCategoryModification(subCategoryData);
        } else {
          additionalCategoryModification();
        }
      })
      .catch((error) => {
        additionalCategoryModification();
        setLoading(false);
      });
  };

  const skipBtnHandler = () => {
    let additionalCategoryIds = [];
    dispatch({ type: 'PRO_SETTING_STEP3', value: additionalCategoryIds });
    additionalCategoryIds.push(primaryCategoryId);
    const payload = {
      categories: additionalCategoryIds,
      primaryCategoryId: primaryCategoryId,
    };
    proStepSettingSubmit(payload);
    Put('pro/skip-step', { additionalCategories: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate(nextStep);
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
      {loading || categoryLoading ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View style={commonStyle.haederArrowback}>
            {/* <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity> */}
          </View>
          <Body style={commonStyle.headerbacktitle}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 3</Text>
          </Body>
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
            progress={0.3}
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
              Choose additional categories of services
            </Text>
          </View>
          <View style={[commonStyle.categoriseListWrap]}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              {categoriesItems &&
                categoriesItems.map((item, index) => (
                  <List key={index} style={[commonStyle.categoriseList]}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <TouchableOpacity
                        style={commonStyle.serviceListtouch}
                        activeOpacity={0.5}
                        onPress={() => checkboxSelectHelper(item)}>
                        <Left style={commonStyle.categoriseListLeft}>
                          <View
                            style={[
                              commonStyle.accountlistavaterbg,
                              { backgroundColor: item.color },
                            ]}>
                            <Image
                              style={commonStyle.avatericon}
                              defaultSource={require('../../assets/images/default.png')}
                              source={{
                                uri: item.logoUrl,
                              }}
                            />
                          </View>
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                          <Text
                            style={[commonStyle.blackTextR18, commonStyle.mb03]}
                            numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={[commonStyle.grayText16]}>
                            {item.description}
                          </Text>
                        </Body>
                        <View
                          style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            marginLeft: 10,
                          }}>
                          <CheckBox
                            onClick={() => checkboxSelectHelper(item)}
                            isChecked={item.isChecked}
                            checkedCheckBoxColor={'#ff5f22'}
                            uncheckedCheckBoxColor={'#e6e7e8'}
                            checkedImage={<CheckedBox />}
                            unCheckedImage={<UncheckedBox />}
                          />
                        </View>
                      </TouchableOpacity>
                    </ListItem>
                  </List>
                ))}
            </View>
          </View>
        </KeyboardAwareScrollView>
        {showButton && (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title="Save and Continue"
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              // onPress={() => navigation.navigate('SetupBusiness')}
              onPress={() => categoriesListOnSubmit()}
            />
          </View>
        )}
      </Container>
    </Fragment>
  );
};

export default SetupAdditionalCategories;
