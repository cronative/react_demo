import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, ScrollableTab, Tab, Tabs} from 'native-base';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  BackHandler,
  Dimensions,
  Image,
  PermissionsAndroid,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import GetLocation from 'react-native-get-location';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {LeftArrowAndroid, LeftArrowIos} from '../../components/icons';
import {mainAPI} from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import global from '../../components/commonservices/toast';
import {
  AboutTab,
  FaqTab,
  InspirationForGuest,
  ProfileInspirationTab,
  ReviewsTab,
  ServicesTab,
} from '../../components/tabs';
import {professionalProfileDetailsRequest} from '../../store/actions/professionalProfileDetailsAction';
import ProfessionalPublicProfileTop from './professionalPublicProfileTop';
import {BookingFlowSignUpModal} from '../../components/modal';
import {useFocusEffect, useRoute} from '@react-navigation/native';
const {width, HEIGHT} = Dimensions.get('window');
const pageHeight = Dimensions.get('screen').height;
import {checkGracePeriodExpiry} from '../../utility/fetchGracePeriodData';

const ProfessionalPublicProfile = ({route, navigation, ...props}) => {
  // Get the current state
  const profileData = useSelector((state) => state.professionalDetails.details);
  // console.log('profileData', profileData);
  const loderStatus = useSelector((state) => state.professionalDetails.loader);
  const dispatch = useDispatch();
  const [coordinates, setCoordinates] = useState(null);
  const proId = route.params.proId || '';
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const tabs = ['services', 'reviews', 'inspiration', 'about', 'faq'];
  const [signupModal, setSignupModal] = useState(false);

  const [subscriptionStatus, setSubscriptionStatus] = useState(1);

  // Tabs height adjust handle
  // Start Change: Snehasish Das, Issues #1483, #1051, #1312
  /* Old: 
  const [height, setHeight] = useState({1:'',2:'',3:'',4:'',5:''}); 
  const [tabHeight, setTabHeight] = useState('auto'); 
  const onChangeTabValue = (event) => {
    // console.log(height);
    // console.log(height[(event.i)+1]);
    setTimeout(()=>{
      setTabHeight(Number(height[(event.i)+1]));
    },300)
    console.log('ddddddddddddddddddddddddddddddddddddddd');
  };
  */
  const [height, setHeight] = useState({1: 0, 2: 0, 3: 0, 4: 0, 5: 0});
  const [tabHeight, setTabHeight] = useState('auto');
  const [currentTab, setCurrentTab] = useState(0);
  const onChangeTabValue = (event) => {
    setCurrentTab(Number(event.i));
  };

  const myRef = useRef(null);

  const [dataSourceCords, setDataSourceCords] = useState([]);

  useEffect(() => {
    if (height[currentTab + 1] == 0) {
      setTabHeight('auto');
    } else {
      setTabHeight(height[currentTab + 1]);
    }
  }, [height, currentTab]);

  useEffect(() => {
    setSignupModal(false);
  }, [currentTab]);

  // End Change: Snehasish Das, Issues #1483, #1051, #1312

  useFocusEffect(
    useCallback(() => {
      // console.log('PRO IDDDDDDDDDDDDDDDD:', proId);
      dispatch(professionalProfileDetailsRequest({proId}));
      getLoginUserId();
      getLocation();
      setCurrentTab(0);
    }, [proId]),
  );

  useEffect(() => {
    // if (dispatch) dispatch({ type: 'SET_BOOKING_EDIT', payload: false });

    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log(route.params);
        goBack();
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, [dispatch]);

  const goBack = () => {
    if (!!route.params.doubleBack) {
      navigation.goBack();
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } else if (!!route.params.singleBack) {
      navigation.goBack();
    } else {
      navigation.navigate('Explore');
    }
  };

  const getLoginUserId = async () => {
    const loginUserId = (await AsyncStorage.getItem('userId')) || '';
    if (loginUserId == proId) {
      setIsOwnProfile(true);
    }
  };

  const getLocation = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        return getCurrentLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            // --
          }
        } catch (err) {}
      }
    };
    requestLocationPermission();
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setCoordinates(location);
      })
      .catch((error) => {
        const {code, message} = error;
      });
  };

  // const onChangeTab = (tab) => {
  //   const {i} = tab;
  //   switch (i) {
  //   }
  //   // console.log('index', index);
  // };

  const onMessage = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId == null) {
      setSignupModal(true);
      return;
    }

    mainAPI({
      url: '/user/ask',
      data: {
        // reservationId: bookingData?.data?.reservationDisplayId,
        proId: profileData.id,
      },
      methodType: 'post',
    })
      .then(({data}) => {
        console.log('User', profileData);
        dispatch({type: 'CLEAR_MESSAGE_DETAILS'});
        navigation.navigate('Inbox');
        setTimeout(() => {
          navigation.navigate('Inbox', {
            screen: 'InboxInner',
            params: {
              fromBookings: true,
              userType: '0',
              channelDetails: {proId: profileData?.id, User: profileData},
              loginId: userId,
              channelId: data?.channelId,
            },
          });
        }, 100);
      })
      .catch((error) => {
        const msg = error.response.data.message;
        setSignupModal(true);
        // global.showToast(msg ? msg : 'Something went wrong', 'error');
      });
  };

  const requestToBook = () => {
    if (subscriptionStatus === 0) {
      global.showToast(
        "You can't make bookings with this pro at this moment.",
        'error',
      );
      return false;
    }
    navigation.navigate('BookService', {
      proId: proId,
    });
  };

  useEffect(() => {
    console.log(
      'profileData Subscription Status: ',
      profileData?.ProMetas[0]?.subscriptionStatus,
    );
    if (profileData?.ProMetas?.length) {
      const subStatus = profileData?.ProMetas[0]?.subscriptionStatus;
      if (subStatus === 0 || subStatus === 2) {
        setSubscriptionStatus(0);
      } else {
        setSubscriptionStatus(1);
      }
    }
  }, [profileData]);

  useEffect(() => {
    autoScroll();

    // console.log('DataSourceCords', dataSourceCords[1]);
  }, [profileData, navigation]);

  const autoScroll = async () => {
    let navigationFromIndexToProPublicProfile = await AsyncStorage.getItem(
      'navigationFromIndexToProPublicProfile',
    );
    console.log('data is', navigationFromIndexToProPublicProfile);
    if (!!profileData && !!navigationFromIndexToProPublicProfile) {
      myRef.current?.scrollTo({
        x: 0,
        y: (pageHeight * 84) / 100,
        animated: true,
      });
      AsyncStorage.removeItem('navigationFromIndexToProPublicProfile');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loderStatus ? <ActivityLoaderSolid /> : null}
      <SafeAreaView
        style={[
          commonStyle.mainContainer,
          {height: Platform.OS === 'ios' ? '104%' : '100%', paddingTop: 0},
        ]}>
        <ScrollView showsVerticalScrollIndicator={false} ref={myRef}>
          {profileData ? (
            <ProfessionalPublicProfileTop
              isOwnProfile={isOwnProfile}
              myCoordinates={coordinates}
              goBack={goBack}
            />
          ) : null}
          {profileData ? (
            <View>
              <Tabs
                locked={true}
                style={[
                  commonStyle.tabsStyle,
                  {borderRadius: 20, height: tabHeight},
                ]}
                prerenderingSiblingsNumber={0}
                tabContainerStyle={[
                  commonStyle.tabsconStyle,
                  {borderRadius: 20},
                ]}
                onChangeTab={onChangeTabValue}
                renderTabBar={() => (
                  <ScrollableTab style={[commonStyle.customScrollTabwrap]} />
                )}
                //onChangeTab={onChangeTab}
                // prerenderingSiblingsNumber={1}
                tabBarUnderlineStyle={commonStyle.tabBarUnderlineStyle}>
                <Tab
                  heading="Services"
                  tabStyle={[commonStyle.inactivetabStyle]}
                  activeTabStyle={[commonStyle.activeTabStyle]}
                  textStyle={commonStyle.scrolltabtextStyle}
                  activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
                  <View
                    onLayout={(e) => {
                      setHeight({
                        ...height,
                        1: Number(e.nativeEvent.layout.height + 50),
                      });
                    }}>
                    {currentTab === 0 && (
                      <ServicesTab
                        isOwnProfile={isOwnProfile}
                        subscriptionStatus={subscriptionStatus}
                      />
                    )}
                  </View>
                </Tab>
                <Tab
                  heading="Reviews"
                  tabStyle={[commonStyle.inactivetabStyle]}
                  activeTabStyle={[commonStyle.activeTabStyle]}
                  textStyle={commonStyle.scrolltabtextStyle}
                  activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
                  <View
                    onLayout={(e) =>
                      setHeight({
                        ...height,
                        2: Number(e.nativeEvent.layout.height + 50),
                      })
                    }>
                    {currentTab === 1 && (
                      <ReviewsTab
                        proId={proId}
                        isOwnProfile={isOwnProfile}
                        currentTab={currentTab}
                      />
                    )}
                  </View>
                </Tab>

                <Tab
                  heading="Inspiration"
                  tabStyle={[commonStyle.inactivetabStyle]}
                  activeTabStyle={[commonStyle.activeTabStyle]}
                  textStyle={commonStyle.scrolltabtextStyle}
                  activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
                  <View
                    onLayout={(e) =>
                      setHeight({
                        ...height,
                        3: Number(e.nativeEvent.layout.height + 50),
                      })
                    }>
                    {/* <Text>Coming soon</Text> */}
                    {/* <InspirationTab /> */}
                    {/* <InspirationForGuest /> */}
                    {currentTab === 2 && (
                      <ProfileInspirationTab isOwnProfile={isOwnProfile} />
                    )}
                  </View>
                </Tab>
                <Tab
                  heading="About"
                  tabStyle={[commonStyle.inactivetabStyle]}
                  activeTabStyle={[commonStyle.activeTabStyle]}
                  textStyle={commonStyle.scrolltabtextStyle}
                  activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
                  <View
                    onLayout={(e) =>
                      setHeight({
                        ...height,
                        4: Number(e.nativeEvent.layout.height + 50),
                      })
                    }>
                    {currentTab === 3 && (
                      <>
                        <AboutTab
                          myCoordinates={coordinates ? coordinates : null}
                          isOwnProfile={isOwnProfile}
                          professionalId={proId}
                          onMessage={onMessage}
                        />
                        {signupModal && (
                          <BookingFlowSignUpModal
                            isVisible={signupModal}
                            setVisible={setSignupModal}
                            isAskAQuestion={true}
                            proId={proId}
                          />
                        )}
                      </>
                    )}
                  </View>
                </Tab>
                <Tab
                  heading="FAQ"
                  tabStyle={[commonStyle.inactivetabStyle]}
                  activeTabStyle={[commonStyle.activeTabStyle]}
                  textStyle={commonStyle.scrolltabtextStyle}
                  activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
                  <View
                    onLayout={(e) =>
                      setHeight({
                        ...height,
                        5: Number(e.nativeEvent.layout.height + 50),
                      })
                    }>
                    {currentTab === 4 && (
                      <>
                        <FaqTab
                          isOwnProfile={isOwnProfile}
                          faqData={
                            profileData && profileData.ProFaqs
                              ? profileData.ProFaqs
                              : null
                          }
                          ProMetas={
                            !!profileData && !!profileData.ProMetas
                              ? profileData.ProMetas[0]
                              : null
                          }
                          onMessage={onMessage}
                        />
                        {signupModal && (
                          <BookingFlowSignUpModal
                            isVisible={signupModal}
                            setVisible={setSignupModal}
                            isAskAQuestion={true}
                            proId={proId}
                          />
                        )}
                      </>
                    )}
                  </View>
                </Tab>
                {/*
                 */}
              </Tabs>
            </View>
          ) : null}
          {!profileData ? (
            <>
              <View
                // onLayout={(event) => {
                //   if (!!profileData) {
                //     const layout = event.nativeEvent.layout;
                //     dataSourceCords[1] = layout.y;
                //     setDataSourceCords(dataSourceCords);
                //     console.log(dataSourceCords);
                //     console.log('layout', layout);
                //     console.log('height:', layout.height);
                //     console.log('width:', layout.width);
                //     console.log('x:', layout.x);
                //     console.log('y:', layout.y);
                //   }
                // }}
                style={commonStyle.profileserviceheader}>
                <TouchableOpacity
                  style={commonStyle.profileserviceheaderback}
                  onPress={() => {
                    // navigation.goBack()
                    if (
                      !!route.params.inspireInner ||
                      !!route.params.fromBookingsPreviousInner ||
                      !!route.params.fromBookingsUpcomingInner
                    ) {
                      navigation.goBack();
                    }
                    // else if (!!route.params.fromBookingsPreviousInner) {
                    //   navigation.goB
                    // } else if (!!route.params.fromBookingsUpcomingInner) {

                    // }
                    else {
                      navigation.navigate('Explore');
                    }
                    return true;
                  }}>
                  {Platform.OS === 'ios' ? (
                    <LeftArrowIos />
                  ) : (
                    <LeftArrowAndroid />
                  )}
                </TouchableOpacity>
              </View>
              <View style={commonStyle.noMassegeWrap}>
                <Image
                  style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                  source={require('../../assets/images/no-review.png')}
                />
                <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                  Something went wrong!
                </Text>
              </View>
            </>
          ) : null}
        </ScrollView>
        {profileData && !isOwnProfile ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Book Now"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={requestToBook}
              />
            </View>
          </View>
        ) : null}
      </SafeAreaView>
      {/* ) : (
        <ActivityLoader />
      )} */}
    </Fragment>
  );
};

export default ProfessionalPublicProfile;
