import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Left, Body, Title} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, SearchBar} from 'react-native-elements';
import * as Progress from 'react-native-progress';
import {RightAngle, StarIcon, StarIconLarge} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {
  userOwnReviewRatingRequest,
  userOwnReviewRatingRequestClear
} from '../store/actions/reviewsAction';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import ReadMore from 'react-native-read-more-text';
import Stars from 'react-native-stars';

const ProfileRatingReviews = (props) => {

  // Declare the constant
  const naviagtion = useNavigation();
  const dispatch = useDispatch();
  const [ avgRating, setAvgRating ] = useState(props.route.params.avgRatings);
  const [ maxNumber, setMaxNumber ] = useState(1);
  const reviewRatingData = useSelector((state) => state.reviewsReducer.userOwnRatingReviewData);
  const loderStatus = useSelector((state) => state.reviewsReducer.loader);

  // This function will load once
  useEffect(() => {
    dispatch(userOwnReviewRatingRequest());
  },[]);

  // This function is to handle the own review and rating data
  useEffect(() => {
    if(reviewRatingData && reviewRatingData.status == 200){
      let blankArray = [];
        blankArray.push(reviewRatingData?.data?.Rating5Persons);
        blankArray.push(reviewRatingData?.data?.Rating4Persons);
        blankArray.push(reviewRatingData?.data?.Rating3Persons);
        blankArray.push(reviewRatingData?.data?.Rating2Persons);
        blankArray.push(reviewRatingData?.data?.Rating1Persons);
      if(blankArray.length > 0){
        let maxNum = Math.max.apply(Math, blankArray);
        if(maxNum != 0){
          setMaxNumber(maxNum);
        }else{
          setMaxNumber(1);
        }
      }
      dispatch(userOwnReviewRatingRequestClear());
      }else if(reviewRatingData && reviewRatingData.status != 200){
        dispatch(userOwnReviewRatingRequestClear());
      }
  }, [reviewRatingData]);


  // function that will replace the Read more label
  const _renderTruncatedFooter = (handlePress) => {
    return (
      <TouchableOpacity onPress={handlePress} style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginStart: -4}}>
        <Title style={commonStyle.textorange}>
          Read more
        </Title>
      </TouchableOpacity>
    );
  }
 
  // function that will replace the Hide label
  const _renderRevealedFooter = (handlePress) => {
    return (
      <TouchableOpacity onPress={handlePress} style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginStart: -4}}>
        <Title style={commonStyle.textorange}>
        Read less
        </Title>
      </TouchableOpacity>
    );
  }
 
  // callback function to know when the component is ready
  const _handleTextReady = () => {
    console.log('Getting...');
  }


  return (

    console.log('Avarage Rating : ', avgRating),
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
      { loderStatus ? <ActivityLoaderSolid /> : null }
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.categoriseListWrap, commonStyle.mt2]}>
            <View style={[commonStyle.setupCardBox]}>
              <View style={commonStyle.ratingReviewRow}>
                <View style={[commonStyle.ratingReviewCol, commonStyle.bRight]}>
                  <View style={{paddingRight: 20}}>
                    <Text
                      style={[commonStyle.textheading, commonStyle.textCenter]}>
                      { reviewRatingData && reviewRatingData?.data?.avgRatingPersons ? 
                      reviewRatingData?.data?.avgRatingPersons : '0' }
                    </Text>
                    <View
                      style={[
                        commonStyle.starIconWrap,
                        commonStyle.mt1,
                        commonStyle.mb1,
                      ]}>
                      <Stars
                        display={avgRating}
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
                      style={[commonStyle.grayText14, commonStyle.textCenter]}>
                        { reviewRatingData && reviewRatingData?.data?.totalNumberOfPerson > 0 ? 
                         `based on ${reviewRatingData?.data?.totalNumberOfPerson} reviews` : null}
                      
                    </Text>
                  </View>
                </View>
                <View style={commonStyle.ratingReviewCol}>
                  <View style={commonStyle.ratingprecessWrap}>
                    <Text style={commonStyle.texttimeblack}>5</Text>
                    <TouchableHighlight style={{marginLeft: 4}}>
                      <StarIcon />
                    </TouchableHighlight>
                    <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                      <Progress.Bar
                        progress={
                          reviewRatingData && 
                          reviewRatingData?.data?.Rating5Persons != 0 ? 
                          1.00 : 0
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
                      { reviewRatingData && reviewRatingData?.data?.Rating5Persons } </Text>
                  </View>
                  <View style={commonStyle.ratingprecessWrap}>
                    <Text style={commonStyle.texttimeblack}>4</Text>
                    <TouchableHighlight style={{marginLeft: 4}}>
                      <StarIcon />
                    </TouchableHighlight>
                    <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                      <Progress.Bar
                        progress={
                          reviewRatingData && 
                          reviewRatingData?.data?.Rating4Persons != 0 ? 
                          0.80 : 0
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
                      { reviewRatingData && reviewRatingData?.data?.Rating4Persons }
                    </Text>
                  </View>
                  <View style={commonStyle.ratingprecessWrap}>
                    <Text style={commonStyle.texttimeblack}>3</Text>
                    <TouchableHighlight style={{marginLeft: 4}}>
                      <StarIcon />
                    </TouchableHighlight>
                    <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                      <Progress.Bar
                        progress={
                          reviewRatingData && 
                          reviewRatingData?.data?.Rating3Persons != 0 ? 
                          0.60 : 0
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
                      { reviewRatingData && reviewRatingData?.data?.Rating3Persons }
                    </Text>
                  </View>
                  <View style={commonStyle.ratingprecessWrap}>
                    <Text style={commonStyle.texttimeblack}>2</Text>
                    <TouchableHighlight style={{marginLeft: 4}}>
                      <StarIcon />
                    </TouchableHighlight>
                    <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                      <Progress.Bar
                        progress={
                          reviewRatingData && 
                          reviewRatingData?.data?.Rating2Persons != 0 ? 
                          0.40 : 0
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
                      { reviewRatingData && reviewRatingData?.data?.Rating2Persons }
                    </Text>
                  </View>
                  <View style={commonStyle.ratingprecessWrap}>
                    <Text style={commonStyle.texttimeblack}>1</Text>
                    <TouchableHighlight style={{marginLeft: 4}}>
                      <StarIcon />
                    </TouchableHighlight>
                    <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                      <Progress.Bar
                        progress={
                          reviewRatingData && 
                          reviewRatingData?.data?.Rating1Persons != 0 ? 
                          0.20 : 0
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
                      { reviewRatingData && reviewRatingData?.data?.Rating1Persons }
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
              <View>
                {
                  reviewRatingData && reviewRatingData?.data?.reviews?.map((eachReview, index)=>(
                    <List key={index} style={commonStyle.reviewslist}>
                      <ListItem
                        thumbnail
                        style={[commonStyle.switchAccountView, commonStyle.mb15]}>
                        <Left style={commonStyle.reviewsAvaterwrap}>
                          {
                            eachReview?.pro?.profileImage != null ? (
                              <Image
                                style={commonStyle.reviewsAvaterImg}
                                source={{uri: eachReview?.pro?.profileImage}}
                              />
                            ) : (
                              <Image
                                style={commonStyle.reviewsAvaterImg}
                                source={require('../assets/images/default-user.png')}
                              />
                            )
                          }
                        </Left>
                        <Body style={commonStyle.switchAccountbody}>
                          <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            { eachReview?.proMeta?.businessName }
                          </Text>
                          <Text style={commonStyle.grayText14} numberOfLines={1}>
                            {  moment(eachReview?.createdAt).format('LL') }
                          </Text>
                        </Body>
                        <TouchableOpacity
                          style={[commonStyle.ratingPoints, {marginLeft: 10}]}>
                          <StarIcon />
                          <Text style={[commonStyle.text14bold, {marginLeft: 4}]}>
                            {  eachReview?.ProRating?.rating != 0 ? eachReview?.ProRating?.rating+'.0' : '0.0'}
                          </Text>
                        </TouchableOpacity>
                      </ListItem>
                      <TouchableHighlight style={commonStyle.outlintextbtn}>
                        <Text style={commonStyle.categorytagsText}>
                          { eachReview?.booking?.bookedService?.name }
                        </Text>
                      </TouchableHighlight>
                      {
                        eachReview?.content ? (
                          <View style={commonStyle.mt1}>
                            <ReadMore
                              numberOfLines={2}
                              renderTruncatedFooter={_renderTruncatedFooter}
                              renderRevealedFooter={_renderRevealedFooter}
                              onReady={_handleTextReady}>
                              <Text style={commonStyle.blackTextR}>
                               { eachReview?.content } 
                              </Text>
                            </ReadMore>
                            </View>
                        ) : null
                      }
                    </List>
                  ))
                }
                {/* <List style={commonStyle.reviewslist}>
                  <ListItem
                    thumbnail
                    style={[commonStyle.switchAccountView, commonStyle.mb15]}>
                    <Left style={commonStyle.reviewsAvaterwrap}>
                      <Image
                        style={commonStyle.reviewsAvaterImg}
                        defaultSource={require('../assets/images/default.png')}
                        source={require('../assets/images/users/user-9.png')}
                      />
                    </Left>
                    <Body style={commonStyle.switchAccountbody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                        Anna Devis
                      </Text>
                      <Text style={commonStyle.grayText14} numberOfLines={1}>
                        Sep 23, 2020
                      </Text>
                    </Body>
                    <TouchableOpacity
                      style={[commonStyle.ratingPoints, {marginLeft: 10}]}>
                      <StarIcon />
                      <Text style={[commonStyle.text14bold, {marginLeft: 4}]}>
                        5.0
                      </Text>
                    </TouchableOpacity>
                  </ListItem>
                  <TouchableHighlight style={commonStyle.outlintextbtn}>
                    <Text style={commonStyle.categorytagsText}>
                      Bridal Trial MakeUp & Hairdo
                    </Text>
                  </TouchableHighlight>
                </List> */}
                {/* <List style={commonStyle.reviewslist}>
                  <ListItem
                    thumbnail
                    style={[commonStyle.switchAccountView, commonStyle.mb15]}>
                    <Left style={commonStyle.reviewsAvaterwrap}>
                      <Image
                        style={commonStyle.reviewsAvaterImg}
                        defaultSource={require('../assets/images/default.png')}
                        source={require('../assets/images/users/user-2.png')}
                      />
                    </Left>
                    <Body style={commonStyle.switchAccountbody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                        Lola Brawn
                      </Text>
                      <Text style={commonStyle.grayText14} numberOfLines={1}>
                        Oct 7, 2020
                      </Text>
                    </Body>
                    <TouchableOpacity
                      style={[commonStyle.ratingPoints, {marginLeft: 10}]}>
                      <StarIcon />
                      <Text style={[commonStyle.text14bold, {marginLeft: 4}]}>
                        5.0
                      </Text>
                    </TouchableOpacity>
                  </ListItem>
                  <TouchableHighlight style={commonStyle.outlintextbtn}>
                    <Text style={commonStyle.categorytagsText}>
                      Bridal MakeUp
                    </Text>
                  </TouchableHighlight>
                  <View style={commonStyle.mt1}>
                    <Text style={commonStyle.blackTextR}>
                      Nice deco and staff were friendly too. No hard selling
                      before or during treatment.{' '}
                    </Text>
                  </View>
                </List> */}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    </Fragment>
  );
};

export default ProfileRatingReviews;
