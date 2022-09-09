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
import {
  Container,
  Header,
  List,
  ListItem,
  Body,
  Left,
  Right,
} from 'native-base';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {Button} from 'react-native-elements';
import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
const {width, height} = Dimensions.get('window');
import {
  maincategoryviewRequest,
  maincategoryviewRequestClear,
  mainCategoryEditRequest,
  mainCategoryEditRequestClear,
} from '../../store/actions/profileAction';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import global from '../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {Get} from '../../api/apiAgent';
import RNModal from 'react-native-modal';
import circleWarningImg from '../../assets/images/warning.png';

const BusinessSettingsMainCategories = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [showButton, setShowButton] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState();
  const [additionalCategory, setAdditionalCategory] = useState([]);
  const [initialCat, setInitialCat] = useState();
  const [newSelectedCatData, setNewSelectedCatData] = useState(null);
  const mainCatData = useSelector(
    (state) => state.profileReducer.mainCatViewData,
  );
  const updateCateData = useSelector(
    (state) => state.profileReducer.mainCatUpdateData,
  );
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const [serviceAll, setServiceAll] = useState();
  const [errorAlert, setErrorMsg] = useState(null);

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
          setAdditionalCategory(blankArray);
        }
      }
    });
  };

  // Get the category data
  const selectedMainCategoryId = async () => {
    Get('/pro/main-category').then((result) => {
      if (result.status === 200) {
        let data = result.data;
        if (data !== null || data !== 'null') {
          setSelectedCatName(data.categoryId);
          setInitialCat(data.categoryId);
          setNewSelectedCatData(data.categoryId);
          setShowButton(true);
        } else {
          setShowButton(false);
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

  // This method will call after select the category
  const getSelectedIndexData = (index, value) => {
    let categoryObj = serviceAll?.find(
      (i) => i?.categoryId === selectedCatName,
    );
    // let addtionalCatObj = serviceAll.find(i => i.categoryId === value.id && value.id !== selectedCatName)
    // if(!!addtionalCatObj){
    //   setErrorMsg(
    //     'You can not select it. It is already in additional category.',
    //     );
    //     setTimeout(() => setErrorMsg(null), 4000);
    // }
    if (!!categoryObj) {
      if (categoryObj?.Services?.length > 0) {
        setErrorMsg(
          'This Category can not be removed, as there are services listed under it. Please delete the services first.',
        );
        // setTimeout(() => setErrorMsg(null), 1500);
      } else {
        setSelectedCatName(value.id);
        setNewSelectedCatData(value.id);
        setShowButton(true);
      }
    } else {
      setSelectedCatName(value.id);
      setNewSelectedCatData(value.id);
      setShowButton(true);
    }
  };

  // This is a common function
  const mainFunction = () => {
    selectedMainCategoryId();
    selectedAdditionalCategoryId();
    getServiceDetails();
    setTimeout(() => {
      dispatch(maincategoryviewRequest());
    }, 1000);
  };

  // This function use for handle main category
  useEffect(() => {
    mainFunction();
  }, []);

  // This function use for handle main category
  useEffect(() => {
    if (mainCatData && mainCatData.status == 200) {
      setTimeout(() => {
        dispatch(maincategoryviewRequestClear());
      }, 1000);
    } else if (mainCatData && mainCatData.status != 200) {
      setTimeout(() => {
        dispatch(maincategoryviewRequestClear());
        setBlankArray([]);
      }, 1000);
    }
  }, [mainCatData]);

  // Update main category handle
  useEffect(() => {
    if (updateCateData && updateCateData.status == 201) {
      dispatch(mainCategoryEditRequestClear());
      global.showToast(updateCateData.message, 'success');
      setTimeout(() => {
        navigation.navigate('BusinessSettings');
      }, 2000);
    } else if (updateCateData && updateCateData.status != 201) {
      if (
        updateCateData.response.data.message !== null &&
        updateCateData.response.data.message !== ''
      ) {
        global.showToast(updateCateData.response.data.message, 'error');
        dispatch(mainCategoryEditRequestClear());
      }
    }
  }, [updateCateData]);

  // Update category list
  const categoriesListOnSubmit = () => {
    if (newSelectedCatData !== initialCat) {
      let selectedMainCat = [];
      selectedMainCat.push(newSelectedCatData);
      let newArray = selectedMainCat.concat(additionalCategory);
      let obj = {
        primaryCategoryId: newSelectedCatData,
        categories: newArray,
      };
      console.log('Submitted Obj :', obj);
      dispatch(mainCategoryEditRequest(obj));
    } else {
      global.showToast('Sorry, you can not update same category', 'error');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container
        style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading]}>
              Main category of services
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              <RadioGroup
                style={commonStyle.setupradioGroup}
                color="#ffffff"
                activeColor="#ffffff"
                highlightColor={'#ffffff'}
                onSelect={(index, value) => {
                  getSelectedIndexData(index, value);
                }}>
                {mainCatData &&
                  mainCatData.data.count > 0 &&
                  mainCatData.data.rows.map((eachcategory, index) => (
                    <RadioButton
                      style={commonStyle.setupradioButton}
                      value={eachcategory}
                      key={index}>
                      <View style={commonStyle.radiojustify}>
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
                                  {
                                    backgroundColor: eachcategory.color
                                      ? eachcategory.color
                                      : '#FFEBCE',
                                  },
                                ]}>
                                <Image
                                  style={commonStyle.avatericon}
                                  defaultSource={require('../../assets/images/default.png')}
                                  source={{uri: eachcategory.logoUrl}}
                                />
                              </View>
                              <View style={commonStyle.categoriseListBody}>
                                <Text
                                  style={[
                                    commonStyle.blackTextR18,
                                    commonStyle.mb03,
                                  ]}
                                  numberOfLines={1}>
                                  {eachcategory.name ? eachcategory.name : ''}
                                </Text>
                                <Text style={[commonStyle.grayText16]}>
                                  {eachcategory.noOfProfessionals
                                    ? eachcategory.noOfProfessionals + " pro's"
                                    : "0 pro's"}
                                </Text>
                              </View>
                              <View style={commonStyle.radiobtncircle}>
                                {eachcategory.id === selectedCatName ? (
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
        </ScrollView>
        {mainCatData && mainCatData.data.count === 0 ? <DataError /> : null}
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

      <RNModal
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
      </RNModal>
    </Fragment>
  );
};

export default BusinessSettingsMainCategories;
