import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {
  Body,
  Container,
  Left,
  List,
  ListItem,
  ScrollableTab,
  Tab,
  Tabs,
} from 'native-base';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from 'react-native';
import {Button, Badge} from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import PTRView from 'react-native-pull-to-refresh';
import {useDispatch} from 'react-redux';
import {Get, Post, Put} from '../api/apiAgent';
import commonStyle, {Colors} from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
// import {getTwilioToken} from '../utility/commonService';
import {useFocusEffect} from '@react-navigation/core';
import {Client} from 'twilio-chat';
import {refreshBottomTabAction} from '../store/actions/nagationAction';
import {checkGracePeriodExpiry} from '../utility/fetchGracePeriodData';

const Inbox = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [messageList, setMessageList] = useState(null);
  const [notificationList, setNotificationList] = useState(null);
  const [activeTabValue, setActiveTabValue] = useState(0);
  const [userType, setUserType] = useState(0);
  const [loginId, setLoginId] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [chatListMessage, setChatListMessage] = useState(null);
  const [refreshMessage, setRefreshMessage] = useState(false);
  const [refreshNoti, setRefreshNoti] = useState(false);
  const [thisMonth, setThisMonth] = useState('');
  const [olderMonth, setOlderMonth] = useState('');

  const [userProfileImage, setUserProfileImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      moment.relativeTimeThreshold('m');
      getUserTypeByStorage();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (activeTabValue === 0) {
        setNotificationList([]);
        getMessageList();
      } else {
        setMessageList([]);
        getNotificationList();
      }

      return () => {
        setNotificationList([]);
        setMessageList([]);
      };
    }, [activeTabValue]),
  );

  const onChangeTabValue = (event) => {
    setActiveTabValue(event.i);
  };

  useFocusEffect(
    useCallback(() => {
      checkGracePeriodExpiry()
        .then((isGracePeriodExpired) => {
          console.log('isGracePeriodExpired **', isGracePeriodExpired);
          if (isGracePeriodExpired) {
            navigation.navigate('TrialFinished');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, []),
  );

  // const createTwilioToken = async () => {
  //   let returnToken = await getTwilioToken(loginId);
  //   setTwilioToken(returnToken);
  // };

  // useEffect(() => {
  //   EventEmitter.on('refreshChatList', () => {
  //     getMessageList();
  //   });
  // }, []);

  useEffect(() => {
    if (activeTabValue === 1) {
      let anyUnreadNotification = false;
      if (
        notificationList?.currentMonthNotifications &&
        notificationList?.currentMonthNotifications?.length > 0
      ) {
        anyUnreadNotification =
          notificationList?.currentMonthNotifications[0].isRead === 'unread'
            ? true
            : false;
      }
      if (
        !anyUnreadNotification &&
        notificationList?.olderNotifications &&
        notificationList?.olderNotifications?.length > 0
      ) {
        anyUnreadNotification =
          notificationList?.olderNotifications[0].isRead === 'unread'
            ? true
            : false;
      }

      if (anyUnreadNotification) {
        markAllNotificationsAsRead();
      }
    }
  }, [activeTabValue, notificationList]);

  const getNotificationList = () => {
    setLoader(true);
    Get('user/notifications', '')
      .then((result) => {
        setNotificationMessage(result.message);
        setLoader(false);
        if (
          result.status === 200 &&
          result.data &&
          ((result.data.olderNotifications &&
            result.data.olderNotifications.length) ||
            (result.data.currentMonthNotifications &&
              result.data.currentMonthNotifications.length))
        ) {
          setNotificationList(result.data);
          console.log(
            result.data.currentMonthNotifications.find(
              (m) => m.notificationType === 'extraChargesOfBooking',
            ),
          );
          if (
            result?.data?.olderNotifications &&
            result.data.olderNotifications.length > 0
          ) {
            const oldNoti = result.data.olderNotifications.find(
              (eachNotification) =>
                (userType == 0 &&
                  (eachNotification.userType == 0 ||
                    eachNotification.userType == 2)) ||
                (userType == 1 &&
                  (eachNotification.userType == 1 ||
                    eachNotification.userType == 2)),
            );
            setOlderMonth(oldNoti);
          }
          if (
            result?.data?.currentMonthNotifications &&
            result.data.currentMonthNotifications.length > 0
          ) {
            const newNoti = result.data.currentMonthNotifications.find(
              (eachNotification) =>
                (userType == 0 &&
                  (eachNotification.userType == 0 ||
                    eachNotification.userType == 2)) ||
                (userType == 1 &&
                  (eachNotification.userType == 1 ||
                    eachNotification.userType == 2)),
            );
            console.log('new noti ***', newNoti);
            setThisMonth(newNoti);
          }
        }
      })
      .catch((error) => {
        setNotificationMessage(result.message);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (!!notificationList?.currentMonthNotifications) {
      const eachNotification = notificationList.currentMonthNotifications[0];

      console.log('***', userType, '\n', '******', eachNotification);
    }
  }, [notificationList]);

  const getMessageList = async () => {
    setLoader(true);
    let userType = await AsyncStorage.getItem('userType');
    let loginId = await AsyncStorage.getItem('userId');
    Get('user/chats-list', '')
      .then(async (result) => {
        // setLoader(false);
        setChatListMessage(result.message);
        setRefreshMessage(false);
        if (result.status === 200 && result.data && result.data.length) {
          let returnData = result.data.map((eachItem, index) => {
            if (userType == 1) {
              let findBlockDetails = eachItem.User.ChatBlockLists.filter(
                (eachItem) => eachItem.proId == loginId,
              );

              eachItem.isBlockedUser =
                findBlockDetails && findBlockDetails.length;
            } else {
              let findBlockDetails = eachItem.ProMeta.ChatBlockLists.filter(
                (eachItem) => eachItem.customerId == loginId,
              );

              eachItem.isBlockedUser =
                findBlockDetails && findBlockDetails.length;
            }
            return eachItem;
          });

          // console.log('return data is', JSON.stringify(returnData));

          setMessageList(returnData);
          setUnreadCount(returnData.length);
          setLoader(false);
        } else {
          setMessageList([]);
          setLoader(false);
        }
      })
      .catch((error) => {
        setChatListMessage(result.message);
        setLoader(false);
      });
  };

  const setUnreadCount = async (messageList) => {
    let newMessageList = await Promise.all(
      messageList.map(async (eachItem) => {
        let count = await setUpTwilio(eachItem.channelId);
        eachItem.unreadMessageCount = count;
        console.log('Fetched Count: ', count);
        return eachItem;
      }),
    );
    console.log('Count Fetching Done', JSON.stringify(newMessageList));
    setMessageList(newMessageList);
  };

  const setUpTwilio = (channelId) => {
    let twilioChannel;
    console.log('Entering');
    return new Promise((resolve, reject) => {
      Post('user/chat-identity', '')
        .then(async (result) => {
          if (result.status === 200) {
            try {
              let twilioToken = result.data.token;
              let client = await Client.create(twilioToken);
              let channel = await client.getChannelByUniqueName(channelId);
              if (channel.channelState.status !== 'joined') {
                channel = await channel.join();
              }
              resolve(await channel.getUnconsumedMessagesCount());
            } catch (error) {
              resolve(0);
            }
          } else {
            resolve(0);
          }
        })
        .catch((error) => {
          resolve(0);
        });
    });
  };

  const getUserTypeByStorage = async () => {
    let userType = await AsyncStorage.getItem('userType');
    let userId = await AsyncStorage.getItem('userId');
    let profileImage = await AsyncStorage.getItem('image');

    setUserType(userType);
    setLoginId(userId);
    setUserProfileImage(profileImage);
  };

  const onTabNotificationHandler = async (notification) => {
    if (userType != 1) {
      switch (notification.notificationType) {
        case 'successPayment':
        case 'faliurePayment':
        case 'confirmBooking':
        case 'rescheduleBookingConfirm':
        case 'bookingReminder':
        case 'rescheduleBooking':
        case 'rescheduleBookingRejection':
        case 'rescheduleRequestByPro':
          navigation.navigate('Bookings');
          setTimeout(() => {
            navigation.navigate('Bookings', {
              screen: 'BookingsUpcomingInner',
              params: {
                notificationBookingId: !!notification.metas.id
                  ? undefined
                  : notification.metas.orderDisplayId,
                fromNotificationList: true,
                bookingId: !!notification.metas.id
                  ? notification.metas.id
                  : undefined,
              },
            });
          }, 100);
          break;

        case 'completeBooking':
          // if (notification.isRead == 'read')
          navigation.navigate('Bookings');
          setTimeout(() => {
            navigation.navigate('Bookings', {
              screen: 'BookingsPreviousInner',
              params: {
                bookingId: notification.metas.id,
                fromNotificationList: true,
              },
            });
          }, 100);
          break;
        // else return;

        case 'changePassword':
          console.log('Change Password');
          break;

        default:
          navigation.navigate('Bookings');
          setTimeout(() => {
            navigation.navigate('Bookings', {
              screen: 'BookingsPreviousInner',
              params: {
                bookingId: notification.metas.id,
                fromNotificationList: true,
              },
            });
          }, 100);
      }
    } else {
      switch (notification.notificationType) {
        case 'confirmBooking':
        case 'rescheduleBooking':
        case 'completeBooking':
          navigation.navigate('Bookings');
          setTimeout(() => {
            navigation.navigate('Booking', {
              screen: 'bookingsProInner',
              params: {
                orderDisplayId: !!notification.metas.reservationDisplayId
                  ? undefined
                  : notification.metas.orderDisplayId,
                fromNotificationList: true,
                rowId: !!notification.metas.reservationDisplayId
                  ? notification.metas.reservationDisplayId
                  : undefined,
              },
            });
          }, 100);
          break;

        case 'changePassword':
          console.log('Change Password');
          break;

        // if (notification.isRead == 'read')
        //   navigation.navigate('Booking', {
        //     screen: 'bookingsProInner',
        //     params: { rowId: notification.metas.reservationDisplayId },
        //   });
        // else return;

        default:
          navigation.navigate('Bookings');
          setTimeout(() => {
            navigation.navigate('Booking', {
              screen: 'bookingsProInner',
              params: {
                rowId: notification.metas.reservationDisplayId,
                fromNotificationList: true,
              },
            });
          }, 100);
      }
    }
  };
  const onSubmitNotificationCTAHandler = async (type, details) => {
    if (type === 'confirm' || type === 'cancel') {
      resheduleApiCalling(type, details.metas.id, details.id);
    } else if (type === 'review') {
      if (userType == 1) {
        navigation.navigate('Bookings');
        setTimeout(() => {
          navigation.navigate('Booking', {
            screen: 'bookingsProInner',
            params: {
              rowId: details.metas.reservationDisplayId,
              fromNotificationList: true,
            },
          });
        }, 100);
      }

      navigation.navigate('Bookings');
      setTimeout(() => {
        navigation.navigate('Bookings', {
          screen: 'BookingsPreviousInner',
          params: {bookingId: details.metas.id, fromNotificationList: true},
        });
      }, 100);

      await Put(`user/is-read/${details.id}`).then(() => {
        getNotificationList();
      });
    } else if (
      type === 'extraChargesAccepted' ||
      type === 'extraChargesRejected'
    ) {
      console.log(details);
      Post('user/booking-extraCharge-consent', {
        reservationExtraChargesId: details?.metas?.reservationExtraChargesId,
        accepted: type === 'extraChargesAccepted' ? 1 : 0,
      })
        .then((response) => {
          global.showToast(
            `Extra charge request successfully ${
              type === 'extraChargesAccepted' ? 'accepted' : 'rejected'
            }.`,
            'success',
          );
          refreshNotification();
          // navigation.navigate('Booking', {
          //   screen: 'bookingsProInner',
          //   params: {
          //     rowId: details.metas.reservationDisplayId,
          //     fromNotificationList: true,
          //   },
          // });
        })
        .catch((err) => {
          console.log({err});
          global.showToast('Something went wrong.', 'error');
        });
    } else {
      await Put(`user/is-read/${details.id}`).then(() => {
        getNotificationList();
      });
    }
  };

  const resheduleApiCalling = (type, reservationId, notificationId) => {
    let postData = {
      reservationId: parseInt(reservationId),
      accepted: type == 'confirm' ? 1 : 0,
    };
    setLoader(true);
    Post(
      `${userType == '1' ? 'pro' : 'user'}/booking-reschedule-consent`,
      postData,
    )
      .then(async (result) => {
        setLoader(false);
        if (result.status === 200 || result.status === 201) {
          global.showToast(result.message, 'success');
        } else {
          global.showToast(result.message, 'error');
        }
        getNotificationList();
      })
      .catch(async (error) => {
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
        getNotificationList();
      });
  };

  const refreshNotification = () => {
    getNotificationList();
  };

  const onPressInboxUserHandler = (eachMessage) => {
    dispatch({type: 'CLEAR_MESSAGE_DETAILS'});
    navigation.navigate('InboxInner', {
      fromBookings: false,
      channelId: eachMessage.channelId,
      userType: userType,
      loginId: loginId,
      channelDetails: eachMessage,
      isBlockedUser: eachMessage.isBlockedUser,
    });
  };

  const messageRefreshOnPull = () => {
    setRefreshMessage(true);
    getMessageList();
  };

  const markAllNotificationsAsRead = async () => {
    await Put(`user/is-read`).then(() => {
      // this will refresh the notification list with all the notifications being 'read'
      // using setTimeout so the user can have some time to see the notifications as 'unread'
      //before they change to 'read'
      setTimeout(() => {
        getNotificationList();
        dispatch(refreshBottomTabAction(true));
      }, 500);
      // getNotificationList();
    });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer]}>
        <View
          style={{
            paddingLeft: 20,
            marginTop: Platform.OS === 'ios' ? 35 : 2,
            paddingVertical: 5,
            position: 'absolute',
            zIndex: 9,
          }}>
          <Text style={commonStyle.textheading}>Inbox</Text>
        </View>
        <Tabs
          renderTabBar={() => (
            <ScrollableTab style={[commonStyle.inboxScrollTab]} />
          )}
          // initialPage={1}
          // page={1}
          initialPage={activeTabValue}
          onChangeTab={(event) => onChangeTabValue(event)}
          prerenderingSiblingsNumber={2}
          style={[commonStyle.inboxtabsStyle]}
          tabContainerStyle={commonStyle.inboxtabsconStyle}
          tabBarUnderlineStyle={[
            commonStyle.inboxtabBarUnderlineStyle,
            activeTabValue === 0
              ? {marginStart: Platform.OS === 'ios' ? 126 : 0}
              : {marginStart: Platform.OS === 'ios' ? 36 : 0},
          ]}>
          <Tab
            heading="Messages"
            tabStyle={[
              commonStyle.inboxinactivetabStyle,
              commonStyle.inboxtabposions1,
            ]}
            activeTabStyle={[
              commonStyle.inboxactiveTabStyle,
              commonStyle.inboxtabposions1,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <>
              {/* <View style={{ width: 10, height: 10, backgroundColor: 'red', borderRadius: 10, position: 'absolute', left: 0, top: -70 }} /> */}
              {activeTabValue === 0 && messageList && messageList.length ? (
                <View style={commonStyle.mt2}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={messageList}
                    ListHeaderComponent={
                      <View
                        style={[commonStyle.mb15, commonStyle.horizontalPadd]}>
                        <Text style={commonStyle.grayText16}>
                          Recent messages
                        </Text>
                      </View>
                    }
                    renderItem={(eachMessage, index) => {
                      if (
                        eachMessage?.item?.ProMeta?.userId !==
                        eachMessage?.item?.User?.id
                      ) {
                        return (
                          <List
                            key={index}
                            style={[
                              commonStyle.inboxnotificationlist,
                              {marginLeft: 20, marginRight: 20},
                            ]}>
                            <ListItem
                              thumbnail
                              style={commonStyle.switchAccountView}>
                              <TouchableOpacity
                                style={commonStyle.accountListFlex}
                                activeOpacity={0.4}
                                onPress={() =>
                                  onPressInboxUserHandler(eachMessage.item)
                                }>
                                <Left style={commonStyle.inboxUserAvaterwrap}>
                                  <Image
                                    style={commonStyle.inboxUserAvaterImg}
                                    defaultSource={require('../assets/images/default.png')}
                                    source={
                                      userType == '1'
                                        ? eachMessage.item?.User?.profileImage
                                          ? {
                                              uri: eachMessage.item?.User
                                                ?.profileImage,
                                            }
                                          : require('../assets/images/default-user.png')
                                        : eachMessage.item?.ProMeta?.profile
                                            ?.profileImage
                                        ? {
                                            uri: eachMessage.item?.ProMeta
                                              ?.profile?.profileImage,
                                          }
                                        : require('../assets/images/default-user.png')
                                    }
                                  />
                                </Left>
                                <Body style={commonStyle.switchAccountbody}>
                                  <Text style={commonStyle.blackTextR}>
                                    {userType == '1'
                                      ? eachMessage.item?.User &&
                                        eachMessage.item?.User?.userName
                                      : eachMessage.item?.ProMeta &&
                                        eachMessage.item?.ProMeta?.businessName}
                                  </Text>
                                  <Text
                                    style={commonStyle.grayText14}
                                    numberOfLines={1}>
                                    {eachMessage.item?.lastMessage == null
                                      ? 'Image'
                                      : eachMessage.item?.lastMessage}
                                  </Text>
                                </Body>
                                <View
                                  style={{
                                    marginLeft: 10,
                                    alignSelf: 'flex-start',
                                    alignItems: 'flex-end',
                                  }}>
                                  <Text style={commonStyle.categorytagsText}>
                                    {/* eachMessage.item?.lastMessageWasAt ||
                                    eachMessage.item?.createdAt, */}
                                    {moment(
                                      eachMessage.item?.updatedAt,
                                    ).fromNow()}
                                  </Text>
                                  {eachMessage?.item?.unreadMessageCount >
                                    0 && (
                                    <Badge
                                      status="success"
                                      containerStyle={{}}
                                      badgeStyle={{
                                        marginTop: 18,
                                        backgroundColor: Colors.orange,
                                      }}
                                    />
                                  )}
                                </View>
                              </TouchableOpacity>
                            </ListItem>
                          </List>
                        );
                      }
                    }}
                    onRefresh={messageRefreshOnPull}
                    refreshing={refreshMessage}
                  />
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      onRefresh={messageRefreshOnPull}
                      refreshing={refreshMessage}
                    />
                  }>
                  <View style={commonStyle.noMassegeWrap}>
                    <Image
                      style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                      source={require('../assets/images/no-massege-img.png')}
                    />
                    <Text
                      style={[commonStyle.grayText16, commonStyle.textCenter]}>
                      {'No message yet'}
                    </Text>
                  </View>
                </ScrollView>
              )}
            </>
          </Tab>

          <Tab
            heading="Notifications"
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  onRefresh={refreshNotification}
                  refreshing={refreshNoti}
                />
              }>
              {notificationList &&
              ((notificationList.olderNotifications &&
                notificationList.olderNotifications.length) ||
                (notificationList.currentMonthNotifications &&
                  notificationList.currentMonthNotifications.length)) ? (
                <View style={[commonStyle.horizontalPadd, commonStyle.mb3]}>
                  {notificationList.currentMonthNotifications &&
                  notificationList.currentMonthNotifications.length ? (
                    <View style={commonStyle.mt2}>
                      {!!thisMonth && (
                        <View style={commonStyle.mb15}>
                          <Text style={commonStyle.grayText16}>This month</Text>
                        </View>
                      )}

                      {notificationList.currentMonthNotifications.map(
                        (eachNotification, index) =>
                          (userType !== '1' &&
                            (eachNotification.userType == 0 ||
                              eachNotification.userType == 2)) ||
                          (userType !== '0' &&
                            (eachNotification.userType == 1 ||
                              eachNotification.userType == 2)) ? (
                            <List
                              key={index}
                              style={commonStyle.inboxnotificationlist}>
                              <ListItem
                                thumbnail
                                style={commonStyle.switchAccountView}>
                                <TouchableOpacity
                                  style={commonStyle.accountListFlex}
                                  activeOpacity={0.4}
                                  onPress={() =>
                                    onTabNotificationHandler(eachNotification)
                                  }>
                                  <Left style={commonStyle.inboxUserAvaterwrap}>
                                    {/* <Image
                                        style={commonStyle.inboxUserAvaterImg}
                                        defaultSource={require('../assets/images/default.png')}
                                        source={require('../assets/images/users/user-1.png')}
                                      /> */}
                                    <Image
                                      // style={commonStyle.inboxUserAvaterImg}
                                      style={
                                        eachNotification.notificationImage
                                          ? commonStyle.inboxUserAvaterImg
                                          : [
                                              commonStyle.inboxUserAvaterImg,
                                              {
                                                width: 24,
                                                height: 24,
                                                resizeMode: 'contain',
                                              },
                                            ]
                                      }
                                      // defaultSource={require('../assets/images/default.png')}
                                      // source={require('../assets/images/users/user-4.png')}
                                      source={
                                        eachNotification.notificationImage
                                          ? {
                                              uri: eachNotification.notificationImage,
                                            }
                                          : require('../assets/images/notification-default.png')
                                      }
                                    />
                                  </Left>
                                  <Body style={commonStyle.switchAccountbody}>
                                    <Text
                                      style={[
                                        commonStyle.texttimeblack,
                                        // eachNotification.isRead === 'unread'
                                        //   ? {
                                        //       color: Colors.theamblack,
                                        //       // fontFamily: 'SofiaPro-Bold',
                                        //     }
                                        //   : {color: Colors.theamblack},
                                      ]}>
                                      {eachNotification.body}
                                      {/* You have a booking tomorrow at 11am! ✨ */}
                                    </Text>
                                  </Body>
                                  <View
                                    style={{
                                      marginLeft: 5,
                                      width: 60,
                                      alignSelf: 'flex-start',
                                      alignItems: 'flex-end',
                                    }}>
                                    <Text
                                      style={[
                                        commonStyle.categorytagsText,
                                        {textAlign: 'center', fontSize: 10},
                                      ]}>
                                      {moment(
                                        eachNotification.createdAt,
                                      ).fromNow()}
                                      {/* {eachNotification.createdAt} */}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </ListItem>
                              {eachNotification.notificationType ===
                                'completeBooking' &&
                                eachNotification.isRead === 'unread' && (
                                  <Button
                                    title="Leave a review"
                                    containerStyle={[
                                      commonStyle.buttoncontainerothersStyle,
                                      commonStyle.mt2,
                                    ]}
                                    buttonStyle={
                                      commonStyle.changePassModalbutton
                                    }
                                    titleStyle={commonStyle.buttontitleStyle}
                                    onPress={() =>
                                      onSubmitNotificationCTAHandler(
                                        'review',
                                        eachNotification,
                                      )
                                    }
                                  />
                                )}

                              {userType != '1' &&
                                eachNotification.notificationType ===
                                  'confirmBooking' &&
                                eachNotification.isRead === 'unread' && (
                                  <Button
                                    title="OK"
                                    containerStyle={[
                                      commonStyle.buttoncontainerothersStyle,
                                      commonStyle.mt2,
                                    ]}
                                    buttonStyle={
                                      commonStyle.changePassModalbutton
                                    }
                                    titleStyle={commonStyle.buttontitleStyle}
                                    onPress={() =>
                                      onSubmitNotificationCTAHandler(
                                        'ok',
                                        eachNotification,
                                      )
                                    }
                                  />
                                )}

                              {((userType == '1' &&
                                eachNotification.notificationType ===
                                  'rescheduleBooking') ||
                                (userType == '0' &&
                                  eachNotification.notificationType ===
                                    'rescheduleRequestByPro')) &&
                                eachNotification?.rescheduleMeta
                                  ?.confirmationStatus === 0 && (
                                  <View
                                    style={[
                                      commonStyle.buttonRow,
                                      commonStyle.mt1,
                                    ]}>
                                    <View
                                      style={[
                                        commonStyle.buttonCol,
                                        {marginBottom: 0},
                                      ]}>
                                      <Button
                                        title="Confirm"
                                        containerStyle={
                                          commonStyle.buttoncontainerothersStyle
                                        }
                                        buttonStyle={
                                          commonStyle.buttonStylehalf
                                        }
                                        titleStyle={
                                          commonStyle.buttontitleStyle
                                        }
                                        onPress={() =>
                                          onSubmitNotificationCTAHandler(
                                            'confirm',
                                            eachNotification,
                                          )
                                        }
                                      />
                                    </View>
                                    <View
                                      style={[
                                        commonStyle.buttonCol,
                                        {marginBottom: 0},
                                      ]}>
                                      <Button
                                        title="Cancel"
                                        containerStyle={
                                          commonStyle.buttoncontainerothersStyle
                                        }
                                        buttonStyle={[
                                          commonStyle.buttonStylehalf,
                                          commonStyle.lightorang,
                                        ]}
                                        titleStyle={[
                                          commonStyle.buttontitleStyle,
                                          commonStyle.colorOrange,
                                        ]}
                                        onPress={() =>
                                          onSubmitNotificationCTAHandler(
                                            'cancel',
                                            eachNotification,
                                          )
                                        }
                                      />
                                    </View>
                                  </View>
                                )}
                              {eachNotification.notificationType ===
                                'extraChargesOfBooking' &&
                                eachNotification?.reservationExtraCharges
                                  ?.status == 0 && (
                                  <>
                                    <Button
                                      title="Confirm"
                                      containerStyle={[
                                        commonStyle.buttoncontainerothersStyle,
                                        commonStyle.mt2,
                                      ]}
                                      buttonStyle={
                                        commonStyle.changePassModalbutton
                                      }
                                      titleStyle={commonStyle.buttontitleStyle}
                                      onPress={() =>
                                        onSubmitNotificationCTAHandler(
                                          'extraChargesAccepted',
                                          eachNotification,
                                        )
                                      }
                                    />
                                    <Button
                                      title="Cancel"
                                      containerStyle={[
                                        commonStyle.buttoncontainerothersStyle,
                                        commonStyle.mt2,
                                      ]}
                                      buttonStyle={
                                        commonStyle.changePassModalbutton
                                      }
                                      titleStyle={commonStyle.buttontitleStyle}
                                      onPress={() =>
                                        onSubmitNotificationCTAHandler(
                                          'extraChargesRejected',
                                          eachNotification,
                                        )
                                      }
                                    />
                                  </>
                                )}
                            </List>
                          ) : null,
                        // <Text>No Notification to show</Text>
                      )}
                    </View>
                  ) : null}

                  {notificationList.olderNotifications &&
                  notificationList.olderNotifications.length ? (
                    <View style={commonStyle.mt2}>
                      {!!olderMonth && (
                        <View style={commonStyle.mb15}>
                          <Text
                            style={commonStyle.grayText16}
                            onPress={() => console.log(userType, '****')}>
                            Old notifications
                          </Text>
                        </View>
                      )}

                      {notificationList.olderNotifications.map(
                        (eachNotification, index) => (
                          <>
                            {(userType == 0 &&
                              (eachNotification.userType == 0 ||
                                eachNotification.userType == 2)) ||
                            (userType == 1 &&
                              (eachNotification.userType == 2 ||
                                eachNotification.userType == 1)) ? (
                              <List
                                key={index}
                                style={commonStyle.inboxnotificationlist}>
                                <ListItem
                                  thumbnail
                                  style={commonStyle.switchAccountView}>
                                  <TouchableOpacity
                                    style={commonStyle.accountListFlex}
                                    activeOpacity={0.4}
                                    onPress={() =>
                                      onTabNotificationHandler(eachNotification)
                                    }>
                                    <Left
                                      style={commonStyle.inboxUserAvaterwrap}>
                                      <Image
                                        style={
                                          eachNotification.notificationImage
                                            ? commonStyle.inboxUserAvaterImg
                                            : [
                                                commonStyle.inboxUserAvaterImg,
                                                {
                                                  width: 24,
                                                  height: 24,
                                                  resizeMode: 'contain',
                                                },
                                              ]
                                        }
                                        // defaultSource={require('../assets/images/default.png')}
                                        // source={require('../assets/images/users/user-4.png')}
                                        source={
                                          eachNotification.notificationImage
                                            ? {
                                                uri: eachNotification.notificationImage,
                                              }
                                            : require('../assets/images/notification-default.png')
                                        }
                                      />
                                    </Left>
                                    <Body style={commonStyle.switchAccountbody}>
                                      <Text
                                        style={[
                                          commonStyle.texttimeblack,
                                          // eachNotification.isRead === 'unread'
                                          //   ? {fontWeight: '700'}
                                          //   : {color: Colors.textgray},
                                        ]}>
                                        {eachNotification.body}
                                      </Text>
                                    </Body>
                                    <View
                                      style={{
                                        marginLeft: 5,
                                        width: 60,
                                        alignSelf: 'flex-start',
                                        alignItems: 'flex-end',
                                      }}>
                                      <Text
                                        style={[
                                          commonStyle.categorytagsText,
                                          {textAlign: 'center', fontSize: 10},
                                        ]}>
                                        {moment(
                                          eachNotification.createdAt,
                                        ).fromNow()}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </ListItem>
                                {eachNotification.notificationType ===
                                  'completeBooking' &&
                                  eachNotification.isRead === 'unread' && (
                                    <Button
                                      title="Leave a review"
                                      containerStyle={[
                                        commonStyle.buttoncontainerothersStyle,
                                        commonStyle.mt2,
                                      ]}
                                      buttonStyle={
                                        commonStyle.changePassModalbutton
                                      }
                                      titleStyle={commonStyle.buttontitleStyle}
                                      onPress={() =>
                                        onSubmitNotificationCTAHandler(
                                          'review',
                                          eachNotification,
                                        )
                                      }
                                    />
                                  )}

                                {userType != '1' &&
                                  eachNotification.notificationType ===
                                    'confirmBooking' &&
                                  eachNotification.isRead === 'unread' && (
                                    <Button
                                      title="OK"
                                      containerStyle={[
                                        commonStyle.buttoncontainerothersStyle,
                                        commonStyle.mt2,
                                      ]}
                                      buttonStyle={
                                        commonStyle.changePassModalbutton
                                      }
                                      titleStyle={commonStyle.buttontitleStyle}
                                      onPress={() =>
                                        onSubmitNotificationCTAHandler(
                                          'ok',
                                          eachNotification,
                                        )
                                      }
                                    />
                                  )}

                                {((userType == '1' &&
                                  eachNotification.notificationType ===
                                    'rescheduleBooking') ||
                                  (userType == '0' &&
                                    eachNotification.notificationType ===
                                      'rescheduleRequestByPro')) &&
                                  eachNotification?.rescheduleMeta
                                    ?.confirmationStatus === 0 && (
                                    <View
                                      style={[
                                        commonStyle.buttonRow,
                                        commonStyle.mt1,
                                      ]}>
                                      <View
                                        style={[
                                          commonStyle.buttonCol,
                                          {marginBottom: 0},
                                        ]}>
                                        <Button
                                          title="Confirm"
                                          containerStyle={
                                            commonStyle.buttoncontainerothersStyle
                                          }
                                          buttonStyle={
                                            commonStyle.buttonStylehalf
                                          }
                                          titleStyle={
                                            commonStyle.buttontitleStyle
                                          }
                                          onPress={() =>
                                            onSubmitNotificationCTAHandler(
                                              'confirm',
                                              eachNotification,
                                            )
                                          }
                                        />
                                      </View>
                                      <View
                                        style={[
                                          commonStyle.buttonCol,
                                          {marginBottom: 0},
                                        ]}>
                                        <Button
                                          title="Cancel"
                                          containerStyle={
                                            commonStyle.buttoncontainerothersStyle
                                          }
                                          buttonStyle={[
                                            commonStyle.buttonStylehalf,
                                            commonStyle.lightorang,
                                          ]}
                                          titleStyle={[
                                            commonStyle.buttontitleStyle,
                                            commonStyle.colorOrange,
                                          ]}
                                          onPress={() =>
                                            onSubmitNotificationCTAHandler(
                                              'cancel',
                                              eachNotification,
                                            )
                                          }
                                        />
                                      </View>
                                    </View>
                                  )}
                                {eachNotification.notificationType ===
                                  'extraChargesOfBooking' &&
                                  eachNotification?.reservationExtraCharges
                                    ?.status == 0 && (
                                    <>
                                      <Button
                                        title="Confirm"
                                        containerStyle={[
                                          commonStyle.buttoncontainerothersStyle,
                                          commonStyle.mt2,
                                        ]}
                                        buttonStyle={
                                          commonStyle.changePassModalbutton
                                        }
                                        titleStyle={
                                          commonStyle.buttontitleStyle
                                        }
                                        onPress={() =>
                                          onSubmitNotificationCTAHandler(
                                            'extraChargesAccepted',
                                            eachNotification,
                                          )
                                        }
                                      />
                                      <Button
                                        title="Cancel"
                                        containerStyle={[
                                          commonStyle.buttoncontainerothersStyle,
                                          commonStyle.mt2,
                                        ]}
                                        buttonStyle={
                                          commonStyle.changePassModalbutton
                                        }
                                        titleStyle={
                                          commonStyle.buttontitleStyle
                                        }
                                        onPress={() =>
                                          onSubmitNotificationCTAHandler(
                                            'extraChargesRejected',
                                            eachNotification,
                                          )
                                        }
                                      />
                                    </>
                                  )}
                              </List>
                            ) : null}
                          </>
                        ),
                      )}
                    </View>
                  ) : null}
                </View>
              ) : (
                <View style={commonStyle.noMassegeWrap}>
                  <Image
                    style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                    source={require('../assets/images/no-massege-img.png')}
                  />
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    {/* {notificationMessage || 'No Notifications yet'} */}
                    {'No notification yet'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    </Fragment>
  );
};

export default Inbox;
