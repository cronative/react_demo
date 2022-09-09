import React, { Fragment, useState, useEffect, RefObject, useRef } from 'react';

import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import { TabActions, useNavigation } from '@react-navigation/native';
import {
  Container,
  Header,
  List,
  ListItem,
  Body,
  Left,
  Right,
} from 'native-base';
import CheckBox from 'react-native-check-box';
import { Button } from 'react-native-elements';
import {
  UncheckedBox,
  CheckedBox,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import { categoryListRequest, setNavigationValue } from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../../components/commonservices/toast';
import ActivityLoader from '../../components/ActivityLoader';
import * as Constant from '../../api/constant';
import EventEmitter from 'react-native-eventemitter';
import { Put } from '../../api/apiAgent';

const SignupCategories = () => {
  const navigation = useNavigation();


  const [showButton, setShowButton] = useState(false);
  const [categoriesItems, setCategoriesItems] = useState(null);

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
  const showBackButton = useSelector(
    (state) => state.navigationValueDetails.showClientSignupCategoryBackButton,
  );
  const dispatch = useDispatch();
  const categoryList = useSelector(
    (state) => state.categoryList.categoryListDetails,
  );
  // const loader = 
  // const [loader, setLoader] = useSelector((state) => state.categoryList.loader);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    dispatch(categoryListRequest());
  }, []);

  console.log({ showBackButton });

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, []);

  useEffect(() => {
    if (
      categoryList &&
      categoryList.status &&
      categoryList.status === 200 &&
      categoryList.data &&
      categoryList.data.rows
    ) {
      categoryList.data.rows.map((category, index) => {
        category.isChecked = false;
      });
      setCategoriesItems([...categoryList.data.rows]);
    }
  }, [categoryList]);

  const categoriesListOnSubmit = async () => {
    const categoryIds = categoriesItems
      .filter((eachCategory) => eachCategory.isChecked)
      .map((eachCategory) => {
        return eachCategory.id;
      });
    if (categoryIds.length > 0 && categoryIds.length < 8) {
      const categoryIdsJsonValue = JSON.stringify(categoryIds);
      await AsyncStorage.setItem('categoryIds', categoryIdsJsonValue);
      navigation.navigate('SignupGeolocation');
    } else {
      if (categoryIds.length > 0) {
        global.showToast('You can select at most 7 services', 'error');
      }
    }
  };

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('user/skip-step', { primaryCategories: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        navigation.navigate('SignupGeolocation')
        // navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
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
          {showBackButton ? (
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => {
                  dispatch(setNavigationValue(4));

                  EventEmitter.emit('SwitchProfile');
                }}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
          ) : null}
          <Body style={[commonStyle.headerbacktitle, { marginLeft: 35 }]}>
            <Image
              style={{ resizeMode: 'contain', width: 100 }}
              source={require('../../assets/images/logo.png')}
            />
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

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Choose categories you are interested in
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              {categoriesItems &&
                categoriesItems.map((item, index) => (
                  <List key={index} style={[commonStyle.categoriseList]}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <TouchableOpacity
                        style={commonStyle.serviceListtouch}
                        onPress={() => checkboxSelectHelper(item)}
                        activeOpacity={0.5}>
                        <Left style={commonStyle.categoriseListLeft}>
                          <View
                            style={[
                              commonStyle.accountlistavaterbg,
                              { backgroundColor: item.color },
                            ]}>
                            <Image
                              style={commonStyle.avatericon}
                              // defaultSource={require('../../assets/images/default.png')}
                              source={
                                item.logoUrl
                                  ? {
                                    uri: item.logoUrl,
                                  }
                                  : require('../../assets/images/default.png')
                              }
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
        </ScrollView>
        {showButton && (
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

export default SignupCategories;
