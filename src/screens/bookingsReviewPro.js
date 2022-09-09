import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Footer, List, ListItem, Body, Left} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import Stars from 'react-native-stars';
import commonStyle from '../assets/css/mainStyle';
const {width, height} = Dimensions.get('window');
import global from '../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {Get, Post} from '../api/apiAgent';
import EventEmitter from 'react-native-eventemitter';
const BookingsReviewPro = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  let blankImageData = [];
  const [defaultRating, setDefaultRating] = useState(0);
  const [isLeaveCommentFocus, setIsLeaveCommentFocus] = useState(false);
  const [leaveComment, setLeaveComment] = useState('');
  const [dataSelect, setDataSelect] = useState(null);
  const [priceRangeFilterSelect, setPriceRangeFilterSelect] = useState(null);
  const [isCustomAmountChecked, setIsCustomAmountChecked] = useState(false);
  const [isamountFocus, setIsamountFocus] = useState(false);
  const [amount, setAmount] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState([]);
  const [loderStatus, setLoderStatus] = useState(false);
  const [servicesFilterSelect, setServicesFilterSelect] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const reviewRatingRes = useSelector(
    (state) => state.profileReducer.userRatingReviewData,
  );

  const leaveAReview = () => {
    let selectAmount;
    if (leaveComment.trim() === '') {
      global.showToast('Please write a comment', 'error');
      return;
    }

    let reviewData = {
      proid: route?.params?.proId.toString(),
      reservationId: route?.params?.bookingId.toString(),
      content: leaveComment,
      rating: defaultRating,
    };
    setLoderStatus(true);
    Post('user/reviews', reviewData)
      .then((result) => {
        console.log('Review Result : ', result);
        if (result.status == 200) {
          let reviewId = result?.data?.id;
          if (selectAmount > 0) {
            addTipForPrefessional(
              route?.params?.bookingId,
              selectAmount,
              reviewId,
            );
          } else if (selectAmount == 0) {
            if (reviewPhoto.length > 0) {
              addPhotoOrVideo(reviewId);
            } else {
              setLoderStatus(false);
              global.showToast(result.message, 'success');
              setTimeout(() => {
                navigation.navigate('BookingsPreviousInner', {
                  bookingId: route?.params?.bookingId,
                  fromNotificationList: false,
                });
              }, 1000);
              setTimeout(() => {
                EventEmitter.emit('refreshPage');
              }, 1200);
            }
          } else {
            setLoderStatus(false);
            global.showToast(result.message, 'success');
            setTimeout(() => {
              navigation.navigate('BookingsPreviousInner', {
                bookingId: route?.params?.bookingId,
                fromNotificationList: false,
              });
            }, 1000);
            setTimeout(() => {
              EventEmitter.emit('refreshPage');
            }, 1200);
          }
        }
      })
      .catch((error) => {
        setLoderStatus(false);
        if (error.response.data.status == 500) {
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        }
      });
  };

  // This method is to add the tip to professional
  const addTipForPrefessional = (reservationId, tipAmount, reviewId) => {
    let tipData = {
      reservationId: reservationId,
      amount: tipAmount,
    };
    console.log('Tip Data : ', tipData);
    Post('/user/booking-pay-tip', tipData)
      .then((result) => {
        setLoderStatus(false);
        console.log('Tip Result : ', result.data);
        if (result.status == 200) {
          if (reviewPhoto.length > 0) {
            addPhotoOrVideo(reviewId);
          } else {
            setLoderStatus(false);
            global.showToast('Review added successfully', 'success');
            setTimeout(() => {
              navigation.navigate('BookingsPreviousInner', {
                bookingId: route?.params?.bookingId,
                fromNotificationList: false,
              });
            }, 1000);
            setTimeout(() => {
              EventEmitter.emit('refreshPage');
            }, 1200);
          }
        }
      })
      .catch((error) => {
        if (reviewPhoto.length > 0) {
          addPhotoOrVideo(reviewId);
        } else {
          setLoderStatus(false);
          let errorMsg =
            error.response.data.status == 403
              ? 'Cannot pay tip. Please write a review first'
              : error.response.data.status == 500
              ? 'Something went wrong, please try after some times'
              : '';
          global.showToast(errorMsg, 'error');
        }
      });
  };

  // This method is to add the photo or video
  const addPhotoOrVideo = (reviewId) => {
    const formData = new FormData();
    formData.append('reviewId', reviewId);
    formData.append(
      'resourceType',
      selectedMediaType === 0 ? 'image' : 'video',
    );
    reviewPhoto.map((imageData) => {
      formData.append('reviewFile', imageData);
    });
    setLoderStatus(true);
    console.log('FormData : ', formData);
    dispatch(userRatingReviewRequest(formData));
  };

  // This is the response of review and rating response
  useEffect(() => {
    if (reviewRatingRes && reviewRatingRes.status == 200) {
      console.log('Success : ', reviewRatingRes);
      setLoderStatus(false);
      dispatch(userRatingReviewRequestClear());
      global.showToast('Review added successfully', 'success');
      setTimeout(() => {
        navigation.navigate('BookingsPreviousInner', {
          bookingId: route?.params?.bookingId,
          fromNotificationList: false,
        });
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1200);
    } else if (reviewRatingRes && reviewRatingRes.status != 200) {
      if (
        reviewRatingRes.response.data.message !== null &&
        reviewRatingRes.response.data.message !== ''
      ) {
        global.showToast(reviewRatingRes.response.data.message, 'error');
        setLoderStatus(false);
        dispatch(userRatingReviewRequestClear());
      } else {
        setLoderStatus(false);
        dispatch(userRatingReviewRequestClear());
      }
    }
  }, [reviewRatingRes]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {/*  { loderStatus ? <ActivityLoaderSolid /> : null } */}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.leaveReviewwrap}>
            <View>
              <View style={commonStyle.clientProfilebox}>
                <Image
                  style={commonStyle.clientProfileimg}
                  source={{uri: route?.params?.image}}
                />
              </View>
            </View>
            <View style={[commonStyle.mt2, commonStyle.mb3]}>
              <Text
                style={[
                  commonStyle.modalforgotheading,
                  commonStyle.textCenter,
                  commonStyle.mb1,
                ]}>
                {route?.params?.proName}
              </Text>
              <Text
                style={[
                  commonStyle.grayText14,
                  commonStyle.textCenter,
                  commonStyle.mb15,
                ]}>
                {route?.params?.proAddress}
              </Text>
              <TouchableHighlight
                style={[commonStyle.outlintextbtn, {alignSelf: 'center'}]}>
                <Text style={commonStyle.categorytagsText}>
                  {route?.params?.serviceName}
                </Text>
              </TouchableHighlight>
              <View style={commonStyle.mt3}>
                <Stars
                  half={false}
                  default={defaultRating}
                  update={(val) => {
                    setDefaultRating(val);
                  }}
                  spacing={10}
                  starSize={32}
                  count={5}
                  fullStar={require('../assets/images/starFilled.png')}
                  emptyStar={require('../assets/images/starEmpty.png')}
                />
              </View>
            </View>
            <View style={commonStyle.dividerlinefull} />
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={commonStyle.horizontalPadd}>
              <View style={commonStyle.mb03}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Add a tip for {route?.params?.proName}{' '}
                </Text>
              </View>

              <View style={commonStyle.dividerlinefull} />
              <View style={[commonStyle.mb2, commonStyle.mt2]}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Leave a comment
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isLeaveCommentFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsLeaveCommentFocus(true)}
                  onChangeText={(text) => setLeaveComment(text)}
                  returnKeyType="done"
                  autoCapitalize={'none'}
                  multiline={true}
                  numberOfLines={7}
                  maxLength={500}
                  blurOnSubmit={true}
                  onSubmitEditing={(e) => {
                    console.log('On Submit Editing');
                    e.target.blur();
                  }}
                />
                <Text style={commonStyle.textlength}>0/500</Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Leave a review"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={leaveAReview}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default BookingsReviewPro;
