import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {
  Body,
  Container,
  List,
  ListItem,
  ScrollableTab,
  Tab,
  Tabs,
} from 'native-base';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  RefreshControl,
  Image,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';
// import { ScrollView } from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PTRView from 'react-native-pull-to-refresh';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import {
  clearPreviousBookingListRequest,
  clearUpcomingBookingListRequest,
  previousBookingListRequest,
  upcomingBookingListRequest,
} from '../store/actions/bookingAction';
import {
  profileViewRequest,
  profileViewRequestClear,
} from '../store/actions/profileAction';
import {fromtoToService} from '../utility/booking';

const Bookings = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  // Tabs index count
  const [activeTabValue, setActiveTabValue] = useState(0);
  const onChangeTabValue = (event) => {
    console.log(event);
    setActiveTabValue(event.i);
  };

  // Declare the dispatch variable
  const dispatch = useDispatch();

  // Get the current state
  const upcomingBookingList = useSelector(
    (state) => state.bookingReducer.upcomingBookingListDetails,
  );
  const previousBookingList = useSelector(
    (state) => state.bookingReducer.previousBookingListDetails,
  );
  const loderStatus = useSelector((state) => state.bookingReducer.loader);
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );

  // Dispatch the event so that we can get the list of bookings
  // useEffect(() => {

  // }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(profileViewRequest());
      dispatch(upcomingBookingListRequest());
      dispatch(previousBookingListRequest());
    }, []),
  );

  // This methos is for handle the response
  useEffect(() => {
    if (profileData && profileData.status == 200) {
      dispatch(profileViewRequestClear());
    } else {
      dispatch(profileViewRequestClear());
    }
  }, [profileData]);

  // Clear the dispatch event
  useEffect(() => {
    if (upcomingBookingList && upcomingBookingList.status == 200) {
      dispatch(clearUpcomingBookingListRequest());
    } else if (upcomingBookingList && upcomingBookingList.status != 200) {
      if (
        upcomingBookingList.response.data.message !== null &&
        upcomingBookingList.response.data.message !== ''
      ) {
        dispatch(clearUpcomingBookingListRequest());
      }
    }

    if (previousBookingList && previousBookingList.status == 200) {
      dispatch(clearPreviousBookingListRequest());
    } else if (previousBookingList && previousBookingList.status != 200) {
      if (
        previousBookingList.response.data.message !== null &&
        previousBookingList.response.data.message !== ''
      ) {
        dispatch(clearPreviousBookingListRequest());
      }
    }
  }, []);

  // Get the date of desire format
  const getDateFormat = (requestDate) => {
    let desireFormat = moment(`${requestDate}`).format('DD MMM YYYY');
    return desireFormat;
  };

  const timeFormat = (date, time) => {
    console.log('date time', date, time);
    if (date !== null && time !== null) {
      //Start Change: Snehasish Das Issues #1619
      /* Old:
      let dateFormat = moment(`${date}T${time}Z`)
        .utc()
        .local()
        .format('dddd, DD MMM YYYY [at] hh:mm a');
      */
      let dateFormat = moment(`${date}T${time}.000Z`).format('DD MMM YYYY');
      //End Change: Snehasish Das Issues #1619
      return dateFormat;
    }
  };

  // This function is to refresh the page
  const refreshPage = () => {
    dispatch(profileViewRequest());
    dispatch(upcomingBookingListRequest());
    dispatch(previousBookingListRequest());
  };

  useEffect(() => {
    console.log('Upcoming Booking List: ', upcomingBookingList?.data?.rows[0]);
    console.log('Previous Booking List: ', previousBookingList?.data?.rows[0]);
  }, [upcomingBookingList, previousBookingList]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <View style={[commonStyle.fromwrap]}>
          <Text style={[commonStyle.textheading]}>Bookings</Text>
        </View>
        <Tabs
          renderTabBar={() => (
            <ScrollableTab style={commonStyle.customScrollTab} />
          )}
          onChangeTab={(event) => onChangeTabValue(event)}
          prerenderingSiblingsNumber={2}
          style={commonStyle.tabsStyle}
          tabContainerStyle={commonStyle.tabsconStyle}
          tabBarUnderlineStyle={[
            commonStyle.tabBarUnderlineStyle,
            activeTabValue === 0
              ? {marginStart: Platform.OS === 'ios' ? -19 : 0}
              : {marginStart: Platform.OS === 'ios' ? -119 : 0},
          ]}>
          <Tab
            heading="Upcoming"
            tabStyle={[
              commonStyle.inactivetabStyle,
              commonStyle.tabbookingposions1,
            ]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabbookingposions1,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshPage}
                />
              }>
              {upcomingBookingList !== null &&
              upcomingBookingList.data.count === 0 ? (
                <View style={commonStyle.noBookingWrap}>
                  <Image
                    style={commonStyle.nobookingsimg}
                    source={require('../assets/images/no-bookings-img.png')}
                  />
                  <Text
                    style={[
                      commonStyle.subtextbold,
                      commonStyle.textCenter,
                      commonStyle.mb1,
                    ]}>
                    No upcoming bookings
                  </Text>
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    Have fun making some! Any booking you make will show up here
                  </Text>
                  <TouchableOpacity
                    style={[commonStyle.commonOrangeButton, commonStyle.mt3]}
                    activeOpacity={0.5}
                    onPress={() => {
                      // Start Change: Snehasish Das, Issue #1620
                      navigation.navigate('Explore');
                      setTimeout(() => {
                        navigation.navigate('GlobalSearch', {
                          fromBookings: true,
                        });
                      }, 10);
                      // End Change: Snehasish Das, Issue #1620
                    }}>
                    <Text
                      style={[
                        commonStyle.buttontitleStyle,
                        commonStyle.textCenter,
                      ]}>
                      Search nearby
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={commonStyle.horizontalPadd}>
                  <Text style={[commonStyle.grayText16, commonStyle.mb2]}>
                    You have{' '}
                    {upcomingBookingList !== null &&
                    upcomingBookingList.data.count
                      ? upcomingBookingList.data.count
                      : 0}{' '}
                    upcoming bookings
                  </Text>
                  {upcomingBookingList !== null &&
                    upcomingBookingList.data.rows.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={commonStyle.bookingCardBox}
                        activeOpacity={0.5}
                        onPress={() => {
                          console.log('booking id:', item.id);
                          navigation.navigate('BookingsUpcomingInner', {
                            bookingId: item.id,
                            notificationBookingId: null,
                            fromNotificationList: false,
                            ProMeta: {
                              ProMetas: [
                                upcomingBookingList?.data?.rows[index].ProMeta,
                              ],
                            },
                          });
                        }}>
                        <View style={commonStyle.bookingdateUserwrap}>
                          <View style={commonStyle.bookingdatewrap}>
                            <Text
                              style={commonStyle.blackTextR18}
                              numberOfLines={1}>
                              {timeFormat(item.date, item.time)}
                            </Text>

                            {item.isConfirmed == 0 &&
                            item.status == 1 &&
                            item.isCanceled == 0 ? (
                              <TouchableHighlight
                                style={[
                                  commonStyle.bookingStatusbtn,
                                  commonStyle.pendingStatusbtn,
                                ]}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  Pending
                                </Text>
                              </TouchableHighlight>
                            ) : null}

                            {item.isConfirmed == 1 &&
                            item.status == 2 &&
                            item.isCanceled == 0 ? (
                              <TouchableHighlight
                                style={[
                                  commonStyle.bookingStatusbtn,
                                  commonStyle.ongoingStatusbtn,
                                ]}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  Ongoing
                                </Text>
                              </TouchableHighlight>
                            ) : null}

                            {item.isConfirmed == 1 &&
                            item.isCanceled == 0 &&
                            item.status == 1 ? (
                              <TouchableHighlight
                                style={[
                                  commonStyle.bookingStatusbtn,
                                  commonStyle.confirmStatusbtn,
                                ]}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  Confirmed
                                </Text>
                              </TouchableHighlight>
                            ) : null}

                            {item.isCanceled == 0 && item.status == 4 ? (
                              <TouchableHighlight
                                style={[
                                  commonStyle.bookingStatusbtn,
                                  commonStyle.noshowStatusbtn,
                                ]}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  No-show
                                </Text>
                              </TouchableHighlight>
                            ) : null}

                            {item.isConfirmed == 1 &&
                            item.status == 5 &&
                            item.isCanceled == 0 ? (
                              <TouchableHighlight
                                style={[
                                  commonStyle.bookingStatusbtn,
                                  commonStyle.noshowStatusbtn,
                                ]}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  Cash not recieved
                                </Text>
                              </TouchableHighlight>
                            ) : null}

                            {item.isCanceled == 1 &&
                            item.status == 6 &&
                            item.isCanceled == 0 ? (
                              <TouchableHighlight
                                style={[
                                  commonStyle.bookingStatusbtn,
                                  commonStyle.noshowStatusbtn,
                                ]}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  Incomplete
                                </Text>
                              </TouchableHighlight>
                            ) : null}
                          </View>

                          <View style={commonStyle.bookingUserwrap}>
                            <View style={commonStyle.bookingUserAvaterwrap}>
                              <Image
                                style={commonStyle.bookingUserAvaterImg}
                                source={
                                  item?.pro?.profileImage
                                    ? {uri: item?.pro?.profileImage}
                                    : require('../assets/images/default-user.png')
                                }
                              />
                            </View>
                            <Text
                              style={commonStyle.grayText16}
                              numberOfLines={1}>
                              {item?.ProMeta?.businessName}
                            </Text>
                          </View>
                        </View>
                        <View style={commonStyle.bookingdateUserwrap}>
                          <List style={[commonStyle.pt2]}>
                            <ListItem
                              style={[
                                commonStyle.commListitem,
                                commonStyle.mb05,
                              ]}>
                              <Body>
                                <Text style={commonStyle.blackTextR}>
                                  {item?.ReservedServiceMeta?.name}
                                </Text>
                              </Body>
                              <TouchableHighlight
                                style={{
                                  alignSelf: 'flex-start',
                                  alignItems: 'flex-start',
                                }}>
                                <Text style={commonStyle.grayText16}>
                                  {fromtoToService(
                                    item?.date,
                                    item?.time,
                                    item?.duration,
                                    0,
                                    item?.ReservedServiceMeta
                                      ?.extraTimeDuration,
                                  )}
                                </Text>
                              </TouchableHighlight>
                            </ListItem>
                          </List>
                        </View>
                        <View
                          style={[commonStyle.horizontalPadd, commonStyle.pt2]}>
                          <View
                            style={[
                              commonStyle.bookingdatewrap,
                              commonStyle.mb05,
                            ]}>
                            <Text
                              style={commonStyle.blackTextR}
                              numberOfLines={1}>
                              Total
                            </Text>
                            <Text
                              style={[
                                commonStyle.blackText16,
                                commonStyle.colorOrange,
                              ]}>
                              $
                              {item.amount
                                ? (
                                    +item.amount + (!!item.tax ? +item.tax : 0)
                                  ).toFixed(2)
                                : '0.00'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </ScrollView>
          </Tab>
          <Tab
            heading="Previous"
            tabStyle={[
              commonStyle.inactivetabStyle,
              commonStyle.tabbookingposions2,
            ]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabbookingposions2,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshPage}
                />
              }>
              {previousBookingList !== null &&
              previousBookingList.data.count === 0 ? (
                <View style={commonStyle.noBookingWrap}>
                  <Image
                    style={commonStyle.nobookingsimg}
                    source={require('../assets/images/no-bookings-img.png')}
                  />
                  <Text
                    style={[
                      commonStyle.subtextbold,
                      commonStyle.textCenter,
                      commonStyle.mb1,
                    ]}>
                    No previous bookings
                  </Text>
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    Have fun making some! Any booking you make will show up here
                  </Text>
                  <TouchableOpacity
                    style={[commonStyle.commonOrangeButton, commonStyle.mt3]}
                    activeOpacity={0.5}
                    onPress={() => {
                      // Start Change: Snehasish Das, Issue #1620
                      navigation.navigate('Explore', {
                        screen: 'GlobalSearch',
                        params: {fromBookings: true},
                      });
                      // End Change: Snehasish Das, Issue #1620
                    }}>
                    <Text
                      style={[
                        commonStyle.buttontitleStyle,
                        commonStyle.textCenter,
                      ]}>
                      Search nearby
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={commonStyle.horizontalPadd}>
                  <Text />
                  {previousBookingList !== null &&
                    previousBookingList.data.rows.map((item, index) => (
                      <View style={commonStyle.bookingCardBox}>
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.5}
                          onPress={() =>
                            navigation.navigate('BookingsPreviousInner', {
                              bookingId: item.id,
                              fromNotificationList: false,
                              ProMeta: {
                                ProMetas: [
                                  previousBookingList?.data?.rows[index]
                                    .ProMeta,
                                ],
                              },
                              isLeaveAReview:
                                item.status == 3 &&
                                item.isConfirmed == 1 &&
                                item.isCanceled == 0 &&
                                item.reviewRating?.userReviews?.length == 0,
                            })
                          }>
                          <View style={commonStyle.bookingdateUserwrap}>
                            <View style={commonStyle.bookingdatewrap}>
                              <Text
                                style={commonStyle.blackTextR18}
                                numberOfLines={1}>
                                {timeFormat(item.date, item.time)}
                              </Text>

                              {item.status == 3 &&
                              item.isConfirmed == 1 &&
                              item.isCanceled == 0 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.completedStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Completed
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.isCanceled == 1 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.cancelledStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Cancelled
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.status == 4 && item.isCanceled == 0 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.noshowStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    No-show
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.isConfirmed == 1 &&
                              item.isCanceled == 0 &&
                              item.status == 1 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.confirmStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Confirmed
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.isConfirmed == 0 &&
                              item.isCanceled == 0 &&
                              item.status == 1 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.pendingStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Pending
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.isConfirmed == 1 &&
                              item.isCanceled == 0 &&
                              item.status == 2 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.ongoingStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Ongoing
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.isConfirmed == 1 &&
                              item.status == 5 &&
                              item.isCanceled == 0 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.noshowStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Cash not recieved
                                  </Text>
                                </TouchableHighlight>
                              ) : null}

                              {item.isConfirmed == 1 &&
                              item.status == 6 &&
                              item.isCanceled == 0 ? (
                                <TouchableHighlight
                                  style={[
                                    commonStyle.bookingStatusbtn,
                                    commonStyle.noshowStatusbtn,
                                  ]}>
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Incomplete
                                  </Text>
                                </TouchableHighlight>
                              ) : null}
                            </View>
                            <View style={commonStyle.bookingUserwrap}>
                              <View style={commonStyle.bookingUserAvaterwrap}>
                                <Image
                                  style={commonStyle.bookingUserAvaterImg}
                                  source={
                                    item?.pro?.profileImage
                                      ? {uri: item?.pro?.profileImage}
                                      : require('../assets/images/default-user.png')
                                  }
                                />
                              </View>
                              <Text
                                style={commonStyle.grayText16}
                                numberOfLines={1}>
                                {item?.ProMeta?.businessName}
                              </Text>
                            </View>
                            <Text
                              style={commonStyle.grayText16}
                              numberOfLines={1}>
                              {item.bookingsUserName}
                            </Text>
                          </View>
                          <View style={commonStyle.bookingdateUserwrap}>
                            <List style={[commonStyle.pt2]}>
                              <ListItem
                                style={[
                                  commonStyle.commListitem,
                                  commonStyle.mb05,
                                ]}>
                                <Body>
                                  <Text style={commonStyle.blackTextR}>
                                    {item?.ReservedServiceMeta?.name}
                                  </Text>
                                </Body>
                                <TouchableHighlight>
                                  <Text style={commonStyle.grayText16}>
                                    {fromtoToService(
                                      item?.date,
                                      item?.time,
                                      item?.duration,
                                      0,
                                      item?.ReservedServiceMeta
                                        ?.extraTimeDuration,
                                    )}
                                  </Text>
                                </TouchableHighlight>
                              </ListItem>
                            </List>
                          </View>
                          <View
                            style={[
                              commonStyle.horizontalPadd,
                              commonStyle.pt2,
                            ]}>
                            <View
                              style={[
                                commonStyle.bookingdatewrap,
                                commonStyle.mb05,
                              ]}>
                              <Text
                                style={commonStyle.blackTextR}
                                numberOfLines={1}>
                                Total
                              </Text>
                              <Text
                                style={[
                                  commonStyle.blackText16,
                                  commonStyle.colorOrange,
                                ]}>
                                $
                                {item.amount
                                  ? (
                                      +item.amount +
                                      (!!item.tax ? +item.tax : 0)
                                    ).toFixed(2)
                                  : '0.00'}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        {item.status == 3 &&
                        item.isConfirmed == 1 &&
                        item.isCanceled == 0 &&
                        item.reviewRating?.userReviews?.length == 0 ? (
                          <Button
                            title="Leave a review"
                            containerStyle={
                              commonStyle.buttoncontainerothersStyle
                            }
                            buttonStyle={{
                              width: '90%',
                              marginLeft: 16,
                              height: 50,
                              borderRadius: 12,
                              backgroundColor: '#F36A46',
                            }}
                            titleStyle={commonStyle.buttontitleStyle}
                            onPress={() =>
                              navigation.navigate(
                                'BookingsPreviousInnerLeaveReview',
                                {
                                  userType: 'customer',
                                  bookingData: item,
                                },
                              )
                            }
                          />
                        ) : null}
                      </View>
                    ))}
                </View>
              )}
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    </Fragment>
  );
};

export default Bookings;
