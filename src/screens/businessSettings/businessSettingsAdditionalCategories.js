import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  Dimensions,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Body, Left} from 'native-base';
import CheckBox from 'react-native-check-box';
import {Button} from 'react-native-elements';
import {UncheckedBox, CheckedBox} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import {
  additionalCategoryViewRequest,
  additionalCategoryViewRequestClear,
  additionalCategoryEditRequest,
  additionalCategoryEditRequestClear,
} from '../../store/actions/profileAction';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import global from '../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import DataError from '../../components/error/DataError';
import {Get} from '../../api/apiAgent';
// import {} from 'react-native-modal';
import circleWarningImg from '../../assets/images/warning.png';
import Modal from 'react-native-modal';
// import { Modal } from 'react-native-paper';

const BusinessSettingsAdditionalCategories = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [showButton, setShowButton] = useState(false);
  const [selectedAdditionalCat, setSelectedAdditionalCat] = useState([]);
  const additionalCatData = useSelector(
    (state) => state.profileReducer.additionalCatViewData,
  );
  const [mainCatName, setMainCatName] = useState('');
  const updateAdditionalCategory = useSelector(
    (state) => state.profileReducer.additionalCatUpdateData,
  );
  const [categoryList, setCategoryList] = useState([]);
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const [serviceAll, setServiceAll] = useState();
  const [errorAlert, setErrorMsg] = useState(null);

  // Get the category data
  const selectedMainCategoryId = async () => {
    Get('/pro/main-category').then((result) => {
      if (result.status === 200) {
        let data = result.data;
        if (data !== null || data !== 'null') {
          setMainCatName(data.categoryId);
        } else {
          global.showToast(
            'Please add main category first, after that add the additional category',
            'error',
          );
          navigation.navigate('BusinessSettingsMainCategories');
        }
      }
    });
  };

  // This function for fetching service related category
  const getServiceDetails = () => {
    Get('pro/services', '')
      .then((result) => {
        if (result.status === 200 && result.data && result.data.count) {
          setServiceAll(result.data.rows);
        }
      })
      .catch((error) => {
        console.log('Something wrong');
      });
  };

  // This function will call after click on check box
  const checkboxSelectHelper = (item) => {
    let categoryObj = serviceAll.find((i) => i.categoryId === item.id);
    if (!!categoryObj) {
      if (categoryObj.Services.length > 0) {
        setErrorMsg(
          'This Category can not be removed, as there are services listed under it. Please delete the services first.',
        );
        setTimeout(() => setErrorMsg(null), 4000);
      } else {
        item.isChecked = !item.isChecked;
      }
    } else {
      item.isChecked = !item.isChecked;
    }

    let checking = categoryList.find((items) => items.isChecked === true);
    if (checking !== undefined) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }

    setCategoryList([...categoryList]);
  };

  // Get the selected additional category data
  const selectedAdditionalCategoryId = async () => {
    let blankArray = [];
    Get('/pro/additional-categories').then((result) => {
      if (result.status === 200) {
        let data = result.data;
        if (data !== null || data !== 'null') {
          for (let index = 0; index < data.length; index++) {
            blankArray.push(data[index].categoryId);
          }
          setSelectedAdditionalCat(blankArray);
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    });
  };

  // This is a common function
  const mainFunction = () => {
    selectedMainCategoryId();
    selectedAdditionalCategoryId();
    getServiceDetails();
    setTimeout(() => {
      dispatch(additionalCategoryViewRequest());
    }, 1000);
  };

  // This function use for handle main category
  useEffect(() => {
    mainFunction();
  }, []);

  // This function use for handle main category
  useEffect(() => {
    if (additionalCatData && additionalCatData.status == 200) {
      dispatch(additionalCategoryViewRequestClear());
      if (additionalCatData.data.count > 0) {
        additionalCatData.data.rows.map((items) => {
          if (selectedAdditionalCat.length > 0) {
            if (selectedAdditionalCat.includes(items.id)) {
              items.isChecked = true;
            } else {
              items.isChecked = false;
            }
          }
        });
        setCategoryList(additionalCatData.data.rows);
      }
    } else if (additionalCatData && additionalCatData.status != 200) {
      dispatch(additionalCategoryViewRequestClear());
    }
  }, [additionalCatData, selectedAdditionalCat]);

  // Update category list
  const categoriesListOnSubmit = () => {
    let getCheckedDataId = [];
    for (let index = 0; index < categoryList.length; index++) {
      if (categoryList[index].isChecked === true) {
        getCheckedDataId.push(categoryList[index].id);
      }
    }
    if (getCheckedDataId.length > 0) {
      let selectedMainCat = [];
      selectedMainCat.push(mainCatName);
      let newArray = getCheckedDataId.concat(selectedMainCat);
      let obj = {
        categories: newArray,
        primaryCategoryId: mainCatName,
      };
      dispatch(additionalCategoryEditRequest(obj));
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // Update additional category handle
  useEffect(() => {
    if (updateAdditionalCategory && updateAdditionalCategory.status == 201) {
      dispatch(additionalCategoryEditRequestClear());
      global.showToast(updateAdditionalCategory.message, 'success');
      setTimeout(() => {
        navigation.navigate('BusinessSettings');
      }, 2000);
    } else if (
      updateAdditionalCategory &&
      updateAdditionalCategory.status != 201
    ) {
      if (
        updateAdditionalCategory.response.data.message !== null &&
        updateAdditionalCategory.response.data.message !== ''
      ) {
        global.showToast(
          updateAdditionalCategory.response.data.message,
          'error',
        );
        dispatch(additionalCategoryEditRequestClear());
      }
    }
  });

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container
        style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading]}>
              Additional categories of services
            </Text>
          </View>
          <View style={[commonStyle.categoriseListWrap, commonStyle.mt1]}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              {categoryList &&
                categoryList.map((item, index) => (
                  <View key={index}>
                    {mainCatName !== item.id ? (
                      <List style={[commonStyle.categoriseList]}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          <TouchableOpacity
                            style={commonStyle.serviceListtouch}
                            activeOpacity={1}>
                            <Left style={commonStyle.categoriseListLeft}>
                              <View
                                style={[
                                  commonStyle.accountlistavaterbg,
                                  {
                                    backgroundColor: item.color
                                      ? item.color
                                      : '#FFEBCE',
                                  },
                                ]}>
                                <Image
                                  style={commonStyle.avatericon}
                                  defaultSource={require('../../assets/images/default.png')}
                                  source={{uri: item.logoUrl}}
                                />
                              </View>
                            </Left>
                            <Body style={commonStyle.categoriseListBody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR18,
                                  commonStyle.mb05,
                                ]}
                                numberOfLines={1}>
                                {item.name ? item.name : ''}
                              </Text>
                              <Text style={[commonStyle.grayText16]}>
                                {item.noOfProfessionals
                                  ? item.noOfProfessionals + " pro's"
                                  : "0 pro's"}
                              </Text>
                            </Body>
                            <View
                              style={{
                                alignSelf: 'center',
                                alignItems: 'center',
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
                    ) : null}
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
        {updateAdditionalCategory &&
        updateAdditionalCategory.data.count === 0 ? (
          <DataError />
        ) : null}
        {showButton && (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title="Save"
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => categoriesListOnSubmit()}
            />
          </View>
        )}
      </Container>

      <Modal
        visible={!!errorAlert}
        onRequestClose={() => {
          setErrorMsg(null);
        }}
        onBackdropPress={() => {
          setErrorMsg(null);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
                {paddingHorizontal: 30},
              ]}>
              You can’t remove this category
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              {errorAlert}
            </Text>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default BusinessSettingsAdditionalCategories;
