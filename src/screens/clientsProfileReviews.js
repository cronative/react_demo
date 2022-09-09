import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  List,
  ListItem,
  Left,
  Body,
  Title,
  ScrollableTab,
  Tab,
  Tabs,
} from 'native-base';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import {
  StarIcon,
  StarIconLarge,
  SendIcon,
  LeftArrowIos,
  LeftArrowAndroid,
  ClockIcon,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import Stars from 'react-native-stars';

import {useSelector, useDispatch} from 'react-redux';
import {
  clientReviewsSelfRequest,
  clientReviewsSelfClear,
  clientReviewsOthersRequest,
  clientReviewsOthersClear,
} from '../store/actions/clientProfileDetailsAction';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';

const ClientsProfileReviews = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ratingData = route.params.ratingData;
  const [activeTabValue, setActiveTabValue] = useState(0);

  const self_reviews = useSelector(
    (state) => state.clientProfileDetailsReducer.self_reviews,
  );
  const others_reviews = useSelector(
    (state) => state.clientProfileDetailsReducer.others_reviews,
  );
  const loderStatus = useSelector(
    (state) => state.clientProfileDetailsReducer.loader,
  );
  const status = useSelector(
    (state) => state.clientProfileDetailsReducer.status,
  );

  const onChangeTabValue = (event) => {
    setActiveTabValue(event.i);
  };

  useEffect(() => {
    // let obj = { 'customerId' : 6 }
    let obj = {customerId: route.params.customerId};
    dispatch(clientReviewsSelfRequest(obj));
    dispatch(clientReviewsOthersRequest(obj));

    return () => {
      dispatch(clientReviewsSelfClear());
      dispatch(clientReviewsOthersClear());
    };
  }, []);

  useEffect(() => {
    console.log('SELF REVIEWS: ', self_reviews);
    console.log('OTHERS REVIEWS: ', others_reviews);
  }, [self_reviews, others_reviews]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loderStatus ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={[commonStyle.headerbacktitle, {marginLeft: -40}]}>
            <Text style={commonStyle.blackText16}>
              {route.params.clientName ? route.params.clientName : 'Client'}’s
              rating and reviews
            </Text>
          </Body>
        </View>
        <View style={[commonStyle.categoriseListWrap, commonStyle.mt2]}>
          <View style={[commonStyle.setupCardBox]}>
            <View style={commonStyle.ratingReviewRow}>
              <View style={[commonStyle.ratingReviewCol, commonStyle.bRight]}>
                <View style={{paddingRight: 20}}>
                  <Text
                    style={[commonStyle.textheading, commonStyle.textCenter]}>
                    {ratingData &&
                    ratingData.avgRatingPersons &&
                    ratingData.avgRatingPersons !== 'NaN'
                      ? Number(ratingData.avgRatingPersons).toFixed(1)
                      : 'N/A'}
                  </Text>
                  <View
                    style={[
                      commonStyle.starIconWrap,
                      commonStyle.mt1,
                      commonStyle.mb1,
                    ]}>
                    {ratingData &&
                    ratingData.avgRatingPersons &&
                    ratingData.avgRatingPersons !== 'NaN' ? (
                      <Stars
                        display={Number(ratingData.avgRatingPersons)}
                        spacing={8}
                        count={5}
                        starSize={20}
                        fullStar={require('../assets/images/starFilled.png')}
                        emptyStar={require('../assets/images/starEmpty.png')}
                      />
                    ) : null}
                  </View>
                  <Text
                    style={[commonStyle.grayText14, commonStyle.textCenter]}>
                    based on{' '}
                    {ratingData.totalNumberOfProfessionals
                      ? ratingData.totalNumberOfProfessionals
                      : 0}{' '}
                    reviews
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
                        ratingData.Rating5Persons &&
                        ratingData.totalNumberOfProfessionals
                          ? ratingData.Rating5Persons /
                            ratingData.totalNumberOfProfessionals
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
                    {ratingData.Rating5Persons ? ratingData.Rating5Persons : 0}
                  </Text>
                </View>
                <View style={commonStyle.ratingprecessWrap}>
                  <Text style={commonStyle.texttimeblack}>4</Text>
                  <TouchableHighlight style={{marginLeft: 4}}>
                    <StarIcon />
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                    <Progress.Bar
                      progress={
                        ratingData.Rating4Persons &&
                        ratingData.totalNumberOfProfessionals
                          ? ratingData.Rating4Persons /
                            ratingData.totalNumberOfProfessionals
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
                    {ratingData.Rating4Persons ? ratingData.Rating4Persons : 0}
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
                        ratingData.Rating3Persons &&
                        ratingData.totalNumberOfProfessionals
                          ? ratingData.Rating3Persons /
                            ratingData.totalNumberOfProfessionals
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
                    {ratingData.Rating3Persons ? ratingData.Rating3Persons : 0}
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
                        ratingData.Rating2Persons &&
                        ratingData.totalNumberOfProfessionals
                          ? ratingData.Rating2Persons /
                            ratingData.totalNumberOfProfessionals
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
                    {ratingData.Rating2Persons ? ratingData.Rating2Persons : 0}
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
                        ratingData.Rating1Persons &&
                        ratingData.totalNumberOfProfessionals
                          ? ratingData.Rating1Persons /
                            ratingData.totalNumberOfProfessionals
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
                  {console.log('Rating Data', ratingData.Rating1Persons)}
                  <Text style={commonStyle.filterBlackText}>
                    {ratingData.Rating1Persons ? ratingData.Rating1Persons : 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingVertical: 5,
            position: 'absolute',
            top: Platform.OS === 'ios' ? 325 : 290,
            zIndex: 9,
          }}>
          <Text style={commonStyle.subtextbold}>Reviews</Text>
        </View>
        <Tabs
          loacked={true}
          // onChangeTab={(event) => onChangeTabValue(event)}
          renderTabBar={() => (
            <ScrollableTab style={[commonStyle.inboxScrollTab]} />
          )}
          prerenderingSiblingsNumber={2}
          style={commonStyle.inboxtabsStyle}
          tabContainerStyle={commonStyle.inboxtabsconStyle}
          tabBarUnderlineStyle={[
            commonStyle.inboxtabBarUnderlineStyle,
            activeTabValue === 0
              ? {marginStart: Platform.OS === 'ios' ? 138 : 26}
              : {marginStart: Platform.OS === 'ios' ? 66 : 32},
          ]}>
          <Tab
            heading="My reviews"
            tabStyle={[
              commonStyle.inboxinactivetabStyle,
              commonStyle.inboxtabposions1,
              {right: -115},
            ]}
            activeTabStyle={[
              commonStyle.inboxactiveTabStyle,
              commonStyle.inboxtabposions1,
              {right: -115},
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb3]}>
                <View>
                  {self_reviews &&
                  self_reviews.rows &&
                  self_reviews.count > 0 ? (
                    <>
                      {self_reviews.rows.map((selfReviewItem, index) => (
                        <List
                          key={index}
                          style={[commonStyle.reviewslist, {marginTop: 0}]}>
                          <ListItem
                            thumbnail
                            style={[
                              commonStyle.switchAccountView,
                              commonStyle.mb15,
                            ]}>
                            <Left style={commonStyle.reviewsAvaterwrap}>
                              <Image
                                style={commonStyle.reviewsAvaterImg}
                                defaultSource={require('../assets/images/default-user.png')}
                                source={
                                  selfReviewItem.professional &&
                                  selfReviewItem.professional.profileImage
                                    ? {
                                        uri: selfReviewItem.professional
                                          .profileImage,
                                      }
                                    : require('../assets/images/default-user.png')
                                }
                              />
                            </Left>
                            <Body style={commonStyle.switchAccountbody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb05,
                                ]}>
                                {selfReviewItem.professional &&
                                selfReviewItem.professional.userName
                                  ? selfReviewItem.professional.userName
                                  : '-'}
                              </Text>
                              <Text
                                style={commonStyle.grayText14}
                                numberOfLines={1}>
                                {selfReviewItem && selfReviewItem.createdAt
                                  ? moment(selfReviewItem.createdAt).format(
                                      'll',
                                    )
                                  : '-'}
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
                                {selfReviewItem.ProRating &&
                                selfReviewItem.ProRating.rating
                                  ? Number(
                                      selfReviewItem.ProRating.rating,
                                    ).toFixed(1)
                                  : 0}
                              </Text>
                            </TouchableOpacity>
                          </ListItem>
                          <TouchableHighlight style={commonStyle.outlintextbtn}>
                            <Text style={commonStyle.categorytagsText}>
                              {selfReviewItem.Reservation &&
                              selfReviewItem.Reservation.Service &&
                              selfReviewItem.Reservation.Service.name
                                ? selfReviewItem.Reservation.Service.name
                                : '-'}
                            </Text>
                          </TouchableHighlight>
                          <View style={commonStyle.mt1}>
                            <Text style={commonStyle.blackTextR}>
                              {selfReviewItem.content
                                ? selfReviewItem.content
                                : '-'}
                            </Text>
                          </View>
                        </List>
                      ))}
                    </>
                  ) : (
                    <View
                      style={[
                        commonStyle.noMassegeWrap,
                        {height: '100%', marginTop: 10},
                      ]}>
                      <Image
                        style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                        source={require('../assets/images/no-review.png')}
                      />
                      <Text
                        style={[
                          commonStyle.grayText16,
                          commonStyle.textCenter,
                        ]}>
                        No reviews yet
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </Tab>
          <Tab
            heading="Other reviews"
            tabStyle={[
              commonStyle.inboxinactivetabStyle,
              commonStyle.inboxtabposions2,
            ]}
            activeTabStyle={[
              commonStyle.inboxactiveTabStyle,
              commonStyle.inboxtabposions2,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb3]}>
                <View>
                  {/* <List style={[commonStyle.reviewslist, {marginTop: 0}]}>
                    <ListItem thumbnail style={[commonStyle.switchAccountView, commonStyle.mb15]}>
                      <Left style={commonStyle.reviewsAvaterwrap}>
                      <Image style={commonStyle.reviewsAvaterImg} defaultSource={require('../assets/images/default.png')} source={require('../assets/images/users/user-1.png')}/>
                      </Left>
                      <Body style={commonStyle.switchAccountbody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>Riri Geller</Text>
                      <Text style={commonStyle.grayText14} numberOfLines={1}>Oct 7, 2020</Text>
                      </Body>
                      <TouchableOpacity style={[commonStyle.ratingPoints, {marginLeft: 10}]}>
                        <StarIcon/>
                        <Text style={[commonStyle.text14bold, {marginLeft: 4}]}>5.0</Text>
                      </TouchableOpacity>
                    </ListItem>
                    <TouchableHighlight style={commonStyle.outlintextbtn}>
                      <Text style={commonStyle.categorytagsText}>Evening MakeUp</Text>
                    </TouchableHighlight>
                    <View style={commonStyle.mt1}>
                      <Text style={commonStyle.blackTextR}>Jessica is responsible and punctual client!</Text>
                    </View>
                  </List> */}
                  {others_reviews &&
                  others_reviews.rows &&
                  others_reviews.count > 0 ? (
                    <>
                      {others_reviews.rows.map((selfReviewItem, index) => (
                        <List
                          key={index}
                          style={[commonStyle.reviewslist, {marginTop: 0}]}>
                          <ListItem
                            thumbnail
                            style={[
                              commonStyle.switchAccountView,
                              commonStyle.mb15,
                            ]}>
                            <Left style={commonStyle.reviewsAvaterwrap}>
                              <Image
                                style={commonStyle.reviewsAvaterImg}
                                defaultSource={require('../assets/images/default-user.png')}
                                source={
                                  selfReviewItem.professional &&
                                  selfReviewItem.professional.profileImage
                                    ? {
                                        uri: selfReviewItem.professional
                                          .profileImage,
                                      }
                                    : require('../assets/images/default-user.png')
                                }
                              />
                            </Left>
                            <Body style={commonStyle.switchAccountbody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb05,
                                ]}>
                                {selfReviewItem.professional &&
                                selfReviewItem.professional.userName
                                  ? selfReviewItem.professional.userName
                                  : '-'}
                              </Text>
                              <Text
                                style={commonStyle.grayText14}
                                numberOfLines={1}>
                                {selfReviewItem.ProRating &&
                                selfReviewItem.ProRating.createdAt
                                  ? moment(
                                      selfReviewItem.ProRating.createdAt,
                                    ).format('L')
                                  : '-'}
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
                                {selfReviewItem.ProRating &&
                                selfReviewItem.ProRating.rating
                                  ? Number(
                                      selfReviewItem.ProRating.rating,
                                    ).toFixed(1)
                                  : 0}
                              </Text>
                            </TouchableOpacity>
                          </ListItem>
                          <TouchableHighlight style={commonStyle.outlintextbtn}>
                            <Text style={commonStyle.categorytagsText}>
                              {selfReviewItem.Reservation &&
                              selfReviewItem.Reservation.Service &&
                              selfReviewItem.Reservation.Service.name
                                ? selfReviewItem.Reservation.Service.name
                                : '-'}
                            </Text>
                          </TouchableHighlight>
                          <View style={commonStyle.mt1}>
                            <Text style={commonStyle.blackTextR}>
                              {selfReviewItem.content
                                ? selfReviewItem.content
                                : '-'}
                            </Text>
                          </View>
                        </List>
                      ))}
                    </>
                  ) : (
                    <View
                      style={[
                        commonStyle.noMassegeWrap,
                        {height: '100%', marginTop: 10},
                      ]}>
                      <Image
                        style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                        source={require('../assets/images/no-review.png')}
                      />
                      <Text
                        style={[
                          commonStyle.grayText16,
                          commonStyle.textCenter,
                        ]}>
                        No reviews yet
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    </Fragment>
  );
};

export default ClientsProfileReviews;
