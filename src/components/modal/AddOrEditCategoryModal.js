import { useFocusEffect } from '@react-navigation/native';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import { Left, Right } from 'native-base';
import ColorPalette from 'react-native-color-palette';
import { Button, Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Post, Put } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
import global from '../commonservices/toast';
import { CheckedIconActive } from '../icons';
const { width, height } = Dimensions.get('window');
const palletteColors = [
  '#4498DF',
  '#FF9589',
  '#828FE6',
  '#EF574A',
  '#FF835B',
  '#EDC14B',
  '#397E49',
  '#586CD7',
  '#A24BC5',
  '#868686',
  '#5DB37E',
  '#FDD7C2',
  '#F5F1E7',
  '#D8EBCF',
  '#CAE5BC',
  '#D4E5A1',
  '#C7E4CE',
  '#ABE0E4',
  '#FFE1EB',
  '#BCE2D7',
  '#D9F1FD',
  '#BFDFF6',
  '#C6D7E1',
  '#C6E9E3',
  '#C1C5E8',
  '#FFE1E9',
  '#DEDDEF',
  '#E9D1E1',
  '#F7BDCB',
  '#FEBE8E',
  '#FFEAAB',
  '#C4F0F1',
];
const AddOrEditCategoryModal = ({
  navigation,
  categoryInfoDetails,
  addOrUpdateCategoryHandler,
  scrollViewRef,
  handleOnScroll,
  setKeyboardStatus,
  closeModel
}) => {
  const [isCategoryNameFocus, setIsCategoryNameFocus] = useState(false);
  const [categoryName, setCategoryName] = useState(
    (categoryInfoDetails && categoryInfoDetails.categoryName) || '',
  );
  const [selectedColor, setSelectedColor] = useState(
    (categoryInfoDetails && categoryInfoDetails.categoryColor) || '',
  );
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        console.log('Keyboard is being visible');
        setKeyboardStatus(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        console.log('Keyboard is being hidden');
        setKeyboardStatus(0);
      });

      return () => {
        setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  const submitCategoryDetails = () => {
    const postdata = {
      name: categoryName,
      color: selectedColor,
    };
    setLoader(true);
    if (categoryInfoDetails && categoryInfoDetails.categoryName) {
      postdata.id = categoryInfoDetails.id;
      Put('pro/custom-category', postdata)
        .then((result) => {
          console.log('res', result);
          setLoader(false);
          if (result.status === 200) {
            addOrUpdateCategoryHandler();
          } else {
            global.showToast(result.message || 'Something went wrong', 'error');
          }
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
    } else {
      postdata.orderArrange = 7;
      Post('pro/custom-category', postdata)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            addOrUpdateCategoryHandler();
          } else {
            global.showToast(result.message || 'Something went wrong', 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
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

  return (
    <Fragment>

      {/* {loader ? <ActivityLoader /> : null} */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={10}
        ref={scrollViewRef}
        onScroll={handleOnScroll}>
        {/* <View>
          <Right
            style={{
              marginRight: 20,
              alignSelf: 'flex-end',
            }}>
            <Icon
              type="ionicon"
              name="md-close"
              style={{
                // right: 5,
                top: 5,
              }}
              onPress={() => closeModel()}
            />
          </Right>
        </View> */}
        <View style={commonStyle.modalContent}>
          <View
            style={[
              commonStyle.dialogheadingbg,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}>
            <Text style={[commonStyle.modalforgotheading]}>
              {categoryInfoDetails && categoryInfoDetails.categoryName
                ? 'Update Category'
                : 'Add new category'}
            </Text>
          </View>

          <View style={commonStyle.typeofServiceFilterWrap}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Name of category
                </Text>
                <TextInput
                  defaultValue={categoryName}
                  style={[
                    commonStyle.textInput,
                    isCategoryNameFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsCategoryNameFocus(true)}
                  onChangeText={(text) => setCategoryName(text)}
                  autoFocus={true}
                  returnKeyType="done"
                  autoCapitalize={'none'}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={commonStyle.mb2}>
              <ColorPalette
                onChange={(color) => setSelectedColor(color)}
                value={selectedColor}
                colors={palletteColors}
                title={'Appointment color'}
                titleStyles={commonStyle.colorPlatetitleStyles}
                icon={<CheckedIconActive />}
              />
            </View>

            {/* {categoryName.length>0 ?
            <View style={commonStyle.footerwrap}>
              <View style={[commonStyle.footerbtn]}>
                <Button
                title="Save"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                />
              </View>
            </View>
            : null}  */}
          </View>
          {categoryName && selectedColor ? (
            <>
              <View style={commonStyle.dividerlinefull} />
              <View style={commonStyle.typeofServiceFilterWrap}>
                <Button
                  disabled={loader}
                  title={
                    categoryInfoDetails && categoryInfoDetails.categoryName
                      ? 'Update'
                      : 'Save'
                  }
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.commonbuttonStyle}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => submitCategoryDetails()}
                />
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default AddOrEditCategoryModal;
