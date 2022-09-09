import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Left, Body, Title} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
import {
  ReplayAngle,
  StarIcon,
  StarIconLarge,
  SendIcon,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import moment from 'moment';
import ReadMore from 'react-native-read-more-text';
import Stars from 'react-native-stars';
import {Get, Post} from '../api/apiAgent';
import ImageView from 'react-native-image-viewing';

const PrefessionalProfileRatingReviews = (props) => {
  // Declare the constant
  const navigation = useNavigation();
  const {avgRatings} = props.route.params;
  const [maxNumber, setMaxNumber] = useState(1);
  const [reviewData, setReviewData] = useState([]);
  const [ratingData, setRatingData] = useState(null);
  const [loderStatus, setLoderStatus] = useState(false);
  const [isReplyinputFocus, setIsReplyinputFocus] = useState(false);
  const [replyinput, setReplyinput] = useState('');

  const [imgViewerData, setImgViewerData] = useState(null);
  const [imgViewerCurrentIndex, setImgViewerCurrentIndex] = useState(null);
  const [visible, setIsVisible] = useState(false);

  // This function will load once
  useEffect(() => {
    setLoderStatus(true);
    mainFunction();
  }, []);

  // This methos is to work basically as common function
  const mainFunction = () => {
    getReview();
    getRating();
  };

  // This method is to get the professional review details
  const getReview = () => {
    Get('pro/rating-reviews')
      .then(({data}) => {
        setLoderStatus(false);
        setReviewData(data);
      })
      .catch((error) => {
        setLoderStatus(false);
      });
  };

  // This method is to get the professional rating details
  const getRating = () => {
    Get('pro/ratings')
      .then(({data}) => {
        setRatingData(data);
        if (data) {
          let sortArray = [];
          sortArray.push(data?.Rating5Persons);
          sortArray.push(data?.Rating4Persons);
          sortArray.push(data?.Rating3Persons);
          sortArray.push(data?.Rating2Persons);
          sortArray.push(data?.Rating1Persons);
          if (sortArray.length > 0) {
            let maxNum = Math.max.apply(Math, sortArray);
            if (maxNum != 0) {
              setMaxNumber(maxNum);
            } else {
              setMaxNumber(1);
            }
          }
        }
      })
      .catch((error) => {});
  };

  // function that will replace the Read more label
  const _renderTruncatedFooter = (handlePress) => {
    return (
      <TouchableOpacity onPress={handlePress} style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginStart: -4}}>
        <Title style={commonStyle.textorange}>Read more</Title>
      </TouchableOpacity>
    );
  };

  // function that will replace the Hide label
  const _renderRevealedFooter = (handlePress) => {
    return (
      <TouchableOpacity onPress={handlePress} style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginStart: -4}}>
        <Title style={commonStyle.textorange}>Read less</Title>
      </TouchableOpacity>
    );
  };

  // callback function to know when the component is ready
  const _handleTextReady = () => {
    console.log('Getting...');
  };

  // This method is to used for save the professional comment
  const saveProfessionalComment = (eachReview) => {
    if (replyinput.trim().length > 500) {
      global.showToast(
        'Message should not be greater than 500 characters',
        'error',
      );
      return false;
    }
    let postData = {
      reservationId: eachReview.reservationId,
      reviewType: eachReview.reviewType,
      customerId: eachReview.customerId,
      content: replyinput,
    };
    setLoderStatus(true);
    Post('/pro/reviews', postData)
      .then((result) => {
        if (result.status === 200) {
          global.showToast(result.message, 'success');
        }
        setIsReplyinputFocus(false);
        setReplyinput('');
        mainFunction();
      })
      .catch((error) => {
        setLoderStatus(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  const reviewImagePressHandler = (ProResources, imgIndex) => {
    console.log(ProResources);
    const imgUrls = ProResources.map((item) => {
      if (item.resourceType == 'image') return {uri: item.url};
    });
    setImgViewerData(imgUrls);
    setImgViewerCurrentIndex(imgIndex);
    setIsVisible(true);
  };

  return (
    console.log('Ratinggggggggggggg : ', JSON.stringify(reviewData)),
    (
      <Fragment>
        <StatusBar backgroundColor="#F36A46" />
        <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
          {loderStatus ? <ActivityLoaderSolid /> : null}
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={[commonStyle.categoriseListWrap, commonStyle.mt2]}>
              <View style={[commonStyle.setupCardBox]}>
                <View style={commonStyle.ratingReviewRow}>
                  <View
                    style={[commonStyle.ratingReviewCol, commonStyle.bRight]}>
                    <View style={{paddingRight: 20}}>
                      <Text
                        style={[
                          commonStyle.textheading,
                          commonStyle.textCenter,
                        ]}>
                        {ratingData && ratingData?.avgRatingPersons
                          ? ratingData?.avgRatingPersons
                          : '0'}
                      </Text>
                      <View
                        style={[
                          commonStyle.starIconWrap,
                          commonStyle.mt1,
                          commonStyle.mb1,
                        ]}>
                        <Stars
                          display={avgRatings}
                          spacing={7}
                          starSize={20}
                          count={5}
                          disabled={true}
                          fullStar={require('../assets/images/starFilled.png')}
                          emptyStar={require('../assets/images/starEmpty.png')}
                          halfStar={require('../assets/images/starHalf.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.grayText14,
                          commonStyle.textCenter,
                        ]}>
                        {ratingData && ratingData?.totalNumberOfPerson > 0
                          ? `based on ${ratingData?.totalNumberOfPerson} reviews`
                          : null}
                      </Text>
                    </View>
                  </View>
                  <View style={commonStyle.ratingReviewCol}>
                    <View style={commonStyle.ratingprecessWrap}>
                      <Text style={commonStyle.texttimeblack}>5</Text>
                      <TouchableHighlight style={{marginLeft: 4}}>
                        <StarIcon />
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{marginLeft: 8, marginRight: 8}}>
                        <Progress.Bar
                          progress={
                            ratingData && ratingData?.Rating5Persons != 0
                              ? 1.0
                              : 0
                          }
                          width={80}
                          color="#F36A46"
                          unfilledColor="#ECEDEE"
                          borderColor="transparent"
                          borderWidth={0}
                          borderRadius={0}
                          height={3}
                        />
                      </TouchableHighlight>
                      <Text style={commonStyle.filterBlackText}>
                        {ratingData && ratingData?.Rating5Persons}
                      </Text>
                    </View>
                    <View style={commonStyle.ratingprecessWrap}>
                      <Text style={commonStyle.texttimeblack}>4</Text>
                      <TouchableHighlight style={{marginLeft: 4}}>
                        <StarIcon />
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{marginLeft: 8, marginRight: 8}}>
                        <Progress.Bar
                          progress={
                            ratingData && ratingData?.Rating4Persons != 0
                              ? 0.8
                              : 0
                          }
                          width={80}
                          color="#F36A46"
                          unfilledColor="#ECEDEE"
                          borderColor="transparent"
                          borderWidth={0}
                          borderRadius={0}
                          height={3}
                        />
                      </TouchableHighlight>
                      <Text style={commonStyle.filterBlackText}>
                        {ratingData && ratingData?.Rating4Persons}
                      </Text>
                    </View>
                    <View style={commonStyle.ratingprecessWrap}>
                      <Text style={commonStyle.texttimeblack}>3</Text>
                      <TouchableHighlight style={{marginLeft: 4}}>
                        <StarIcon />
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{marginLeft: 8, marginRight: 8}}>
                        <Progress.Bar
                          progress={
                            ratingData && ratingData?.Rating3Persons != 0
                              ? 0.6
                              : 0
                          }
                          width={80}
                          color="#F36A46"
                          unfilledColor="#ECEDEE"
                          borderColor="transparent"
                          borderWidth={0}
                          borderRadius={0}
                          height={3}
                        />
                      </TouchableHighlight>
                      <Text style={commonStyle.filterBlackText}>
                        {ratingData && ratingData?.Rating3Persons}
                      </Text>
                    </View>
                    <View style={commonStyle.ratingprecessWrap}>
                      <Text style={commonStyle.texttimeblack}>2</Text>
                      <TouchableHighlight style={{marginLeft: 4}}>
                        <StarIcon />
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{marginLeft: 8, marginRight: 8}}>
                        <Progress.Bar
                          progress={
                            ratingData && ratingData?.Rating2Persons != 0
                              ? 0.4
                              : 0
                          }
                          width={80}
                          color="#F36A46"
                          unfilledColor="#ECEDEE"
                          borderColor="transparent"
                          borderWidth={0}
                          borderRadius={0}
                          height={3}
                        />
                      </TouchableHighlight>
                      <Text style={commonStyle.filterBlackText}>
                        {ratingData && ratingData?.Rating2Persons}
                      </Text>
                    </View>
                    <View style={commonStyle.ratingprecessWrap}>
                      <Text style={commonStyle.texttimeblack}>1</Text>
                      <TouchableHighlight style={{marginLeft: 4}}>
                        <StarIcon />
                      </TouchableHighlight>
                      <TouchableHighlight
                        style={{marginLeft: 8, marginRight: 8}}>
                        <Progress.Bar
                          progress={
                            ratingData && ratingData?.Rating1Persons != 0
                              ? 0.2
                              : 0
                          }
                          width={80}
                          color="#F36A46"
                          unfilledColor="#ECEDEE"
                          borderColor="transparent"
                          borderWidth={0}
                          borderRadius={0}
                          height={3}
                        />
                      </TouchableHighlight>
                      <Text style={commonStyle.filterBlackText}>
                        {ratingData && ratingData?.Rating1Persons}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.setupCardBox]}>
                <View>
                  <Text style={[commonStyle.subtextbold, commonStyle.pr2]}>
                    Reviews
                  </Text>
                </View>

                {reviewData &&
                  reviewData?.map((eachReview, index) => (
                    <View key={index}>
                      <View>
                        <List style={commonStyle.reviewslist}>
                          <ListItem
                            thumbnail
                            style={[
                              commonStyle.switchAccountView,
                              commonStyle.mb15,
                            ]}>
                            <Left style={commonStyle.reviewsAvaterwrap}>
                              {eachReview[0]?.customer?.profileImage != null ? (
                                <Image
                                  style={commonStyle.reviewsAvaterImg}
                                  source={{
                                    uri: eachReview[0]?.customer?.profileImage,
                                  }}
                                />
                              ) : (
                                <Image
                                  style={commonStyle.reviewsAvaterImg}
                                  source={require('../assets/images/default-user.png')}
                                />
                              )}
                            </Left>
                            <Body style={commonStyle.switchAccountbody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb05,
                                ]}>
                                {eachReview[0]?.customer?.userName}
                              </Text>
                              <Text
                                style={commonStyle.grayText14}
                                numberOfLines={1}>
                                {moment(eachReview[0]?.createdAt).format('LL')}
                              </Text>
                            </Body>
                            <TouchableOpacity
                              style={[
                                commonStyle.ratingPoints,
                                {marginLeft: 10},
                              ]}>
                              <StarIcon />
                              <Text
                                style={[
                                  commonStyle.text14bold,
                                  {marginLeft: 4},
                                ]}>
                                {eachReview[0]?.customerRating?.rating
                                  ? eachReview[0]?.customerRating?.rating
                                  : '0.0'}
                              </Text>
                            </TouchableOpacity>
                          </ListItem>
                          <TouchableHighlight style={commonStyle.outlintextbtn}>
                            <Text style={commonStyle.categorytagsText}>
                              {eachReview[0]?.booking?.bookedService?.name}
                            </Text>
                          </TouchableHighlight>
                          {eachReview[0]?.content ? (
                            <View style={commonStyle.mt1}>
                              <ReadMore
                                numberOfLines={2}
                                renderTruncatedFooter={_renderTruncatedFooter}
                                renderRevealedFooter={_renderRevealedFooter}
                                onReady={_handleTextReady}>
                                <Text style={commonStyle.blackTextR}>
                                  {eachReview[0]?.content}
                                </Text>
                              </ReadMore>
                            </View>
                          ) : null}
                          {eachReview[0]?.resource.length > 0 ? (
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              style={{marginTop: 10}}>
                              {eachReview[0]?.resource?.map((items, index) => (
                                <TouchableOpacity
                                  onPress={() =>
                                    reviewImagePressHandler(
                                      eachReview[0].resource,
                                      index,
                                    )
                                  }
                                  style={[commonStyle.reviewuploadedpicWrap]}
                                  key={index}>
                                  {items.resourceType == 'image' && (
                                    <Image
                                      source={{uri: items.url}}
                                      style={commonStyle.reviewuploadedpic}
                                    />
                                  )}
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          ) : null}

                          {eachReview.length == 1 ? (
                            <View style={commonStyle.mt15}>
                              <TextInput
                                style={[
                                  commonStyle.replyTextInput,
                                  isReplyinputFocus && commonStyle.focusinput,
                                ]}
                                onFocus={() => setIsReplyinputFocus(true)}
                                onChangeText={(text) => setReplyinput(text)}
                                returnKeyType="done"
                                autoCapitalize={'none'}
                                placeholder="Reply"
                                multiline={true}
                                numberOfLines={7}
                                maxLength={500}
                                placeholderTextColor={'#939DAA'}
                                blurOnSubmit={true}
                                onSubmitEditing={(e) => {
                                  console.log('On Submit Editing');
                                  e.target.blur();
                                }}
                              />
                              {replyinput.trim().length > 0 ? (
                                <TouchableOpacity
                                  style={commonStyle.sendicon}
                                  onPress={() =>
                                    saveProfessionalComment(eachReview[0])
                                  }>
                                  <SendIcon />
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          ) : null}

                          {eachReview.length > 1 ? (
                            <View style={{paddingLeft: 45, marginTop: 20}}>
                              <TouchableHighlight
                                style={{
                                  position: 'absolute',
                                  top: -8,
                                  left: 24,
                                }}>
                                <ReplayAngle />
                              </TouchableHighlight>
                              <ListItem
                                thumbnail
                                style={[
                                  commonStyle.switchAccountView,
                                  commonStyle.mb1,
                                ]}>
                                <Left style={commonStyle.reviewsAvaterwrap}>
                                  {eachReview[1]?.pro?.profileImage != null ? (
                                    <Image
                                      style={commonStyle.reviewsAvaterImg}
                                      source={{
                                        uri: eachReview[1]?.pro?.profileImage,
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      style={commonStyle.reviewsAvaterImg}
                                      source={require('../assets/images/default-user.png')}
                                    />
                                  )}
                                </Left>
                                <Body style={commonStyle.switchAccountbody}>
                                  <Text
                                    style={[
                                      commonStyle.blackTextR,
                                      commonStyle.mb05,
                                    ]}>
                                    {eachReview[1]?.proMeta?.businessName}
                                  </Text>
                                  <Text
                                    style={commonStyle.grayText14}
                                    numberOfLines={1}>
                                    {moment(eachReview[1]?.createdAt).format(
                                      'LL',
                                    )}
                                  </Text>
                                </Body>
                              </ListItem>

                              {eachReview[0]?.content ? (
                                <TouchableHighlight>
                                  <View style={commonStyle.mt1}>
                                    <ReadMore
                                      numberOfLines={2}
                                      renderTruncatedFooter={
                                        _renderTruncatedFooter
                                      }
                                      renderRevealedFooter={
                                        _renderRevealedFooter
                                      }
                                      onReady={_handleTextReady}>
                                      <Text style={commonStyle.blackTextR}>
                                        {eachReview[1]?.content}
                                      </Text>
                                    </ReadMore>
                                  </View>
                                </TouchableHighlight>
                              ) : null}
                            </View>
                          ) : null}
                        </List>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Container>
        <ImageView
          images={imgViewerData}
          imageIndex={imgViewerCurrentIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </Fragment>
    )
  );
};

export default PrefessionalProfileRatingReviews;
