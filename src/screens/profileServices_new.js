// import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {ScrollView, View, Text, StatusBar, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
// import { Container, Content, List, ListItem, Body, Left, Title, ScrollableTab, Tab, Tabs } from 'native-base';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
// import { Button } from 'react-native-elements';
// import Swiper from 'react-native-swiper'
// import { LeftArrowIos, LeftArrowAndroid, StarIcon, MapPointer } from '../components/icons';
// import {ServicesTab, ReviewsTab, InspirationTab, AboutTab, FaqTab} from '../components/tabs'
// import commonStyle from '../assets/css/mainStyle';

// const ProfileServices = () => {

//   const navigation = useNavigation();

//   // const [scrollOffset, setScrollOffset] = useState(100);
//   // const scrollViewRef = useRef(0);

//   // const handleOnScroll = event => {
//   //   console.log(event.nativeEvent.contentOffset.y);
//   //   const position=event.nativeEvent.contentOffset.y;
//   //   if(position==100){
//   //   setScrollOffset({isScroll:true});
//   //   }else{
//   //     setScrollOffset({isScroll:false});
//   //   }
// 	// };

//   return (
//     <Fragment>
//     <StatusBar backgroundColor="#F36A46"/>
//       <Container style={[commonStyle.mainContainer]}>
//       <KeyboardAwareScrollView>
//         <View>
//           <Swiper
//           dot={
//             <View style={commonStyle.dotsinactive}/>
//           }
//           activeDot={
//             <View style={commonStyle.dotsactive}/>
//           }
//           paginationStyle={{
//             bottom: 40
//           }}
//           style= {commonStyle.profileservicebannerwraper}
//           loop={false}
//           >
//             <View style={commonStyle.onboardingslide}>
//               <Image
//               style={commonStyle.profileservicebannerimg}
//               source={require('../assets/images/masonry/masonry-img-7.png')}
//               resizeMode="cover"
//               />
//             </View>
//             <View style={commonStyle.onboardingslide}>
//               <Image
//               style={commonStyle.profileservicebannerimg}
//               source={require('../assets/images/masonry/masonry-img-3.png')}
//               resizeMode="cover"
//               />
//             </View>
//             <View style={commonStyle.profileservicebannerimg}>
//               <Image
//               style={commonStyle.profileservicebannerimg}
//               source={require('../assets/images/masonry/masonry-img-7.png')}
//               resizeMode="cover"
//               />
//             </View>
//           </Swiper>
//           <View style={commonStyle.profileserviceheader}>
//               <TouchableOpacity style={commonStyle.profileserviceheaderback} onPress={() => navigation.goBack()}>
//               {Platform.OS === "ios"? <LeftArrowIos/> : <LeftArrowAndroid/>}
//               </TouchableOpacity>
//               <TouchableOpacity style={commonStyle.followbtn} activeOpacity={0.5}>
//                 <Text style={commonStyle.followbtnText}>Follow</Text>
//               </TouchableOpacity>
//           </View>
//         </View>
//         <View>
//             <View style={commonStyle.profileservicedetailsinfo}>
//               <View style={commonStyle.profileserviceUserRatingwrap}>
//                   <View style={commonStyle.profileserviceUserImgWrap}>
//                     <Image style={commonStyle.profileserviceUserImg} source={require("../assets/images/users/user-4.png")}/>
//                   </View>
//                   <TouchableHighlight style={[commonStyle.profileserviceratingbtn, commonStyle.shadow]}>
//                     <Text style={[commonStyle.blackText16, commonStyle.mb03]}> <StarIcon/> 5.0</Text>
//                   </TouchableHighlight>
//               </View>
//               <View style={commonStyle.featuredCardText}>
//                 <Text style={[commonStyle.subheading, commonStyle.mb05]}>The Glam Room</Text>
//                 <View style={commonStyle.categorytagsWrap}>
//                     <TouchableHighlight style={commonStyle.tagsOutline}>
//                       <Text style={commonStyle.filterBlackText}>In-person . Mobile</Text>
//                     </TouchableHighlight>
//                     <TouchableHighlight style={commonStyle.tagsOutline}>
//                       <Text style={commonStyle.categorytagsText}>Make Up</Text>
//                     </TouchableHighlight>
//                     <TouchableHighlight style={commonStyle.tagsOutline}>
//                       <Text style={commonStyle.categorytagsText}>Hair</Text>
//                     </TouchableHighlight>
//                     <TouchableHighlight style={commonStyle.tagsOutline}>
//                       <Text style={commonStyle.categorytagsText}>Nails</Text>
//                     </TouchableHighlight>
//                 </View>
//                 <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                 <View style={commonStyle.searchBarText}>
//                 <TouchableHighlight>
//                 <Text style={commonStyle.grayText14}><MapPointer/> 290 m. from you</Text>
//                 </TouchableHighlight>
//                 <Text style={commonStyle.dotSmall}> . </Text>
//                 <TouchableOpacity>
//                   <Text style={commonStyle.textorange14}>Show on Map</Text>
//                 </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//             <Tabs
//               locked={true}
//               renderTabBar={()=> <ScrollableTab style={[commonStyle.customScrollTabwrap]}/>}
//               prerenderingSiblingsNumber={5}
//               style={[commonStyle.tabsStyle, {borderRadius: 20}]}
//               tabContainerStyle={[commonStyle.tabsconStyle, {borderRadius: 20}]}
//               tabBarUnderlineStyle={commonStyle.tabBarUnderlineStyle}
//               >
//               <Tab heading="Services"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <ScrollView>
//                   <ServicesTab/>
//                 </ScrollView>
//               </Tab>
//               <Tab heading="Reviews"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <ScrollView>
//                   <ReviewsTab/>
//                 </ScrollView>
//               </Tab>
//               <Tab heading="Inspiration"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <ScrollView>
//                   <InspirationTab/>
//                 </ScrollView>
//               </Tab>
//               <Tab heading="About"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <ScrollView>
//                   <AboutTab/>
//                 </ScrollView>
//               </Tab>
//               <Tab heading="FAQ"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <ScrollView>
//                   <FaqTab/>
//                 </ScrollView>
//               </Tab>
//               </Tabs>

//         </View>
//         </KeyboardAwareScrollView>
//           <View style={commonStyle.footerwrap}>
//             <View style={[commonStyle.footerbtn]}>
//               <Button
//               title="Request to book"
//               containerStyle={commonStyle.buttoncontainerothersStyle}
//               buttonStyle={commonStyle.commonbuttonStyle}
//               titleStyle={commonStyle.buttontitleStyle}
//               />
//             </View>
//           </View>
//         </Container>
//     </Fragment>
//   );
// };

// export default ProfileServices;

import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Container,
  Body,
  Header,
  List,
  ListItem as Item,
  ScrollableTab,
  Tab,
  TabHeading,
  Tabs,
  Title,
} from 'native-base';
import commonStyle from '../assets/css/mainStyle';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_HEIGHT = 250;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 50;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = 'rgba(85,186,255, 1)';
const FADED_THEME_COLOR = 'rgba(85,186,255, 0.8)';

const ProfileServicesNew = ({props}) => {
  // const [scrollOffset, setScrollOffset] = useState(100);
  // const scrollViewRef = useRef(0);

  // const handleOnScroll = event => {
  //   console.log(event.nativeEvent.contentOffset.y);
  //   const position=event.nativeEvent.contentOffset.y;
  //   if(position==100){
  //   setScrollOffset({isScroll:true});
  //   }else{
  //     setScrollOffset({isScroll:false});
  //   }
  // };

  // Tabs index count
  const [activeTabValue, setActiveTabValue] = useState(0);
  const onChangeTabValue = (event) => {
    console.log(event);
    setActiveTabValue(event.i);
  };

  // const heights = [500, 500];

  return (
    <Fragment>
      {/* <StatusBar backgroundColor="#F36A46"/> */}
      <Container>
        {/* <Animated.View style={{position: "absolute", width: "100%", backgroundColor: 'green', zIndex: 1}}>
          <Header style={{backgroundColor: "transparent"}} hasTabs>
            <Body>
            <Title>
              <Animated.Text style={{fontWeight: "bold"}}>
                Tab Parallax
              </Animated.Text>
            </Title>
            </Body>
          </Header>
        </Animated.View> */}
        <Animated.ScrollView>
          <Animated.View>
            <Animated.Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Moraine_Lake_17092005.jpg',
              }}
              style={{width: '100%', height: 400}}></Animated.Image>
          </Animated.View>
          <Tabs
            onChangeTab={(event) => onChangeTabValue(event)}
            // onChangeTab={({i}) => {
            //   setActiveTabValue({height: heights[i], activeTabValue: i})
            // }}
          >
            <Tab heading="Tab 1">
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
            </Tab>
            <Tab heading="Tab 2">
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
            </Tab>
            <Tab heading="Tab 3">
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Washington St, Bradford BD8 9QW
              </Text>
            </Tab>
          </Tabs>
        </Animated.ScrollView>
      </Container>
    </Fragment>
  );
};

export default ProfileServicesNew;





// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Container, Content, List, ListItem, Body, Left, Title, ScrollableTab, Tab, Tabs } from 'native-base';
// import React, {Fragment, useEffect, useState} from 'react';
// import {
//   ScrollView,
//   FlatList,
//   BackHandler,
//   Image,
//   PermissionsAndroid,
//   StatusBar,
//   Text,
//   View,
//   TouchableOpacity,
//   TouchableHighlight
// } from 'react-native';
// import Pulse from 'react-native-pulse';
// import {Button} from 'react-native-elements';
// import GetLocation from 'react-native-get-location';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {useDispatch, useSelector} from 'react-redux';
// import { LeftArrowAndroid, LeftArrowIos, SmartPhone, MailBox, CommentBox, RightAngle, DirectionsIcon, StarIcon, MapPointer } from '../../components/icons';
// import {mainAPI} from '../../api/apiAgent';
// import commonStyle from '../../assets/css/mainStyle';
// import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
// import global from '../../components/commonservices/toast';
// import {AboutTab, FaqTab, ReviewsTab, ServicesTab} from '../../components/tabs';
// import {professionalProfileDetailsRequest} from '../../store/actions/professionalProfileDetailsAction';
// import ProfessionalPublicProfileTop from './professionalPublicProfileTop';
// import {AdditionalInstraFeedData, ServiceRecentViewData} from '../../utility/staticData';

// const ProfessionalPublicProfile = ({route, navigation, ...props}) => {
//   // Get the current state
//   const profileData = useSelector((state) => state.professionalDetails.details);
//   console.log('profileData', profileData);
//   const loderStatus = useSelector((state) => state.professionalDetails.loader);
//   const dispatch = useDispatch();
//   const [coordinates, setCoordinates] = useState(null);
//   const proId = route.params.proId || '';
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const tabs = ['services', 'reviews', 'inspiration', 'about', 'faq'];

//   // Tabs height adjust handle
//   const [height, setHeight] = useState({1:'',2:'',3:'',4:'',5:''}); 
//   const [tabHeight, setTabHeight] = useState('auto');
//   const onChangeTabValue = (event) => {
//     console.log('test aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
//     // console.log(height);
//     // console.log(height[event.i + 1]);
//     setTimeout(() => {
//       setTabHeight(Number(height[event.i + 1]));
//       console.log('test dddddddddddddddddddddddddddddddddddddddd');
//     },100);
//   };

//   useEffect(() => {
//     console.log('PRO IDDDDDDDDDDDDDDDD:', proId);
//     dispatch(professionalProfileDetailsRequest({proId}));
//     getLoginUserId();
//     getLocation();
//   }, [proId]);

//   useEffect(() => {
//     // if (dispatch) dispatch({ type: 'SET_BOOKING_EDIT', payload: false });

//     const backHandlerdata = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         navigation.navigate('Explore');
//         return true;
//       },
//     );

//     return () => backHandlerdata.remove();
//   }, [dispatch]);

//   const getLoginUserId = async () => {
//     const loginUserId = (await AsyncStorage.getItem('userId')) || '';
//     if (loginUserId == proId) {
//       setIsOwnProfile(true);
//     }
//   };

//   const getLocation = () => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'ios') {
//         return getCurrentLocation();
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Required',
//               message: 'This App needs to Access your location',
//             },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             getCurrentLocation();
//           } else {
//             // --
//           }
//         } catch (err) {}
//       }
//     };
//     requestLocationPermission();
//   };

//   const getCurrentLocation = () => {
//     GetLocation.getCurrentPosition({
//       enableHighAccuracy: true,
//       timeout: 15000,
//     })
//       .then((location) => {
//         setCoordinates(location);
//       })
//       .catch((error) => {
//         const {code, message} = error;
//       });
//   };

//   // const onChangeTab = (tab) => {
//   //   const {i} = tab;
//   //   switch (i) {
//   //   }
//   //   // console.log('index', index);
//   // };

//   const onMessage = async () => {
//     const userId = await AsyncStorage.getItem('userId');

//     mainAPI({
//       url: '/user/ask',
//       data: {
//         // reservationId: bookingData?.data?.reservationDisplayId,
//         proId: profileData.id,
//       },
//       methodType: 'post',
//     })
//       .then(({data}) => {
//         console.log('User', profileData);
//         navigation.navigate('Inbox', {
//           screen: 'InboxInner',
//           params: {
//             userType: '0',
//             channelDetails: {proId: profileData?.id, User: profileData},
//             loginId: userId,
//             channelId: data?.channelId,
//           },
//         });
//       })
//       .catch((error) => {
//         const msg = error.response.data.message;
//         global.showToast(msg ? msg : 'Something went wrong', 'error');
//       });
//   };
//   console.log('profile', profileData);
//   return (
//     <Fragment>
//       <StatusBar backgroundColor="#F36A46" />
//       {loderStatus ? <ActivityLoaderSolid /> : null}
//       <Container style={[commonStyle.mainContainer]}>
//         <ScrollView>
//           {profileData ? (
//             <ProfessionalPublicProfileTop
//               isOwnProfile={isOwnProfile}
//               myCoordinates={coordinates}
//             />
//           ) : null}
//           {profileData ? (
//             <View>
//                             <Tabs
//               onChangeTab={onChangeTabValue}
//               locked={true}
//               renderTabBar={()=> <ScrollableTab style={[commonStyle.customScrollTabwrap]}/>}
//               prerenderingSiblingsNumber={5}
//               style={[commonStyle.tabsStyle, {borderRadius: 20, height: tabHeight}]}
//               tabContainerStyle={[commonStyle.tabsconStyle, {borderRadius: 20, height: tabHeight}]}
//               tabBarUnderlineStyle={commonStyle.tabBarUnderlineStyle}
//               >
//               <Tab heading="Services"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <View onLayout={(e)=> setHeight({...height,1:Number(e.nativeEvent.layout.height+50)})}>
//                 <View style={commonStyle.mt2}>
//                     <View style={[commonStyle.setupCardBox]}>
//                       <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>Bio</Text>
//                       <View style={commonStyle.termswrap}>
//                         <Text style={commonStyle.blackTextR}>I’m a mobile business and I have been doing makeup for years. I have worked at retail makeup location but decided to build my cliente further than just the people I know. My goal is to showcase makeup that everyone feels sitting in my... <Title style={commonStyle.textorange}>Read more</Title></Text>
//                       </View>
//                       <View>
//                         <List style={[commonStyle.mt15]}>
//                           <ListItem thumbnail style={commonStyle.accountListitem}>
//                           <Left style={[commonStyle.howdoseInfoCircle, {alignSelf: 'center', marginRight: 10}]}>
//                               <Image style={{width: 16, height: 16,}} resizeMode={'contain'} source={require('../../assets/images/link.png')}/>
//                             </Left>
//                             <Body style={[commonStyle.accountListBody, {alignSelf: 'center'}]}>
//                               <Text style={[commonStyle.blackTextR]}>facebook.com/gloria-dallas</Text>
//                             </Body>
//                           </ListItem>
//                         </List>
//                         <List style={[commonStyle.mt15]}>
//                           <ListItem thumbnail style={commonStyle.accountListitem}>
//                           <Left style={[commonStyle.howdoseInfoCircle, {alignSelf: 'center', marginRight: 10}]}>
//                               <Image style={{width: 16, height: 16,}} resizeMode={'contain'} source={require('../../assets/images/link.png')}/>
//                             </Left>
//                             <Body style={[commonStyle.accountListBody, {alignSelf: 'center'}]}>
//                               <Text style={[commonStyle.blackTextR]}>pinterest.com/gloria-dallas</Text>
//                             </Body>
//                           </ListItem>
//                         </List>
//                       </View>
//                     </View>
//                     <View style={[commonStyle.setupCardBox]}>
//                       <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>Contact & Business hours</Text>
//                       <View>
//                             <List style={commonStyle.contactwaylist}>
//                                 <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                   <Left>
//                                     <SmartPhone/>
//                                   </Left>
//                                   <Body style={commonStyle.switchAccountbody}>
//                                   <Text style={commonStyle.blackTextR}>+44 445 349 867</Text>
//                                   </Body>
//                                   <TouchableOpacity style={{marginLeft: 10}}>
//                                     <Text style={commonStyle.clearfilterText}>Call</Text>
//                                   </TouchableOpacity>
//                                 </ListItem>
//                             </List>
//                             <List style={commonStyle.contactwaylist}>
//                                 <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                   <Left>
//                                     <MailBox/>
//                                   </Left>
//                                   <Body style={commonStyle.switchAccountbody}>
//                                   <Text style={commonStyle.blackTextR}>glamroom@gmail.com</Text>
//                                   </Body>
//                                   <TouchableOpacity style={{marginLeft: 10}}>
//                                     <Text style={commonStyle.clearfilterText}>Write</Text>
//                                   </TouchableOpacity>
//                                 </ListItem>
//                             </List>
//                             <List style={commonStyle.contactwaylist}>
//                                 <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                   <Left>
//                                     <CommentBox/>
//                                   </Left>
//                                   <Body style={commonStyle.switchAccountbody}>
//                                   <Text style={commonStyle.blackTextR}>Ask a question</Text>
//                                   <Text style={commonStyle.grayText14} numberOfLines={1}>Usually responds within 3 hours</Text>
//                                   </Body>
//                                   <TouchableOpacity style={{marginLeft: 10}}>
//                                     <RightAngle/>
//                                   </TouchableOpacity>
//                                 </ListItem>
//                             </List>
//                       </View>
//                         <View style={commonStyle.mt1}>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.grayText16}>Sun</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.grayText16}>Day off</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.textorange}>Mon</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.blackTextR}>12:00 pm - 8:00 pm</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.textorange}>Tue</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.blackTextR}>12:00 pm - 9:00 pm</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.textorange}>Wed</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.blackTextR}>12:00 pm - 9:00 pm</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.textorange}>Thu</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.blackTextR}>12:00 pm - 8:00 pm</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.textorange}>Fri</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.blackTextR}>12:00 pm - 10:00 pm</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                           <List style={commonStyle.weektimelist}>
//                               <ListItem thumbnail style={commonStyle.switchAccountView}>
//                                 <Left style={{width: 60}}>
//                                   <Text style={commonStyle.grayText16}>Sat</Text>
//                                 </Left>
//                                 <Body style={commonStyle.switchAccountbody}>
//                                 <Text style={commonStyle.grayText16}>Day off</Text>
//                                 </Body>
//                               </ListItem>
//                           </List>
//                       </View>
//                     </View>
//                     <View style={[commonStyle.setupCardBox]}>
//                       <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>Location</Text>
//                         <View style={commonStyle.setupbusinessmapwrap}>
//                           <Image
//                                 style={commonStyle.setupbusinessmap}
//                                 source={require('../../assets/images/dammy-map-2.png')}
//                             />

//                             <View style={[commonStyle.setupbusinessmapPointer, commonStyle.pulseposion]}>
//                             <Pulse color='#ffffff' numPulses={3} diameter={100} speed={20} duration={2000} />
//                               <View style={commonStyle.grolocationPointer} />
//                             </View>

//                             <TouchableOpacity style={commonStyle.directionsbtn} activeOpacity={0.5}>
//                               <DirectionsIcon/>
//                               <Text style={[commonStyle.blackText16, commonStyle.ml1]}>Directions</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View style={commonStyle.mt2}>
//                           <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>31 Glenelg St, South Brisbane</Text>
//                           <TouchableHighlight>
//                           <Text style={commonStyle.grayText14}> <MapPointer/> 140 m. from you</Text>
//                           </TouchableHighlight>
//                         </View>
//                     </View>
//                 </View>
//                 </View>
//               </Tab>
//               <Tab heading="Reviews"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <View onLayout={(e)=> setHeight({...height,2:Number(e.nativeEvent.layout.height+50)})}>
//                   {/* <ReviewsTab/> */}
//                   <View style={commonStyle.mt2}>
//                   <View style={[commonStyle.setupCardBox, {paddingHorizontal: 0}]}>
//                     <TouchableOpacity activeOpacity={1} style={[commonStyle.sortAreaWrap, commonStyle.mb2, commonStyle.horizontalPadd]}>
//                       <Image style={commonStyle.socialIcon} source={require('../../assets/images/instagramm.png')}/>
//                       <Text style={[commonStyle.subtextblack, commonStyle.ml1]}>Instagram feed</Text>
//                     </TouchableOpacity>
//                     <FlatList
//                       horizontal
//                       style={commonStyle.mb05}
//                       ItemSeparatorComponent={() => <View style={{marginRight: -26}}/>}
//                       showsHorizontalScrollIndicator={false}
//                       data={AdditionalInstraFeedData}
//                       keyExtractor={(item, index) => index.toString()}
//                       renderItem={({ item, index }) => (
//                         <TouchableOpacity key={index} activeOpacity={.8}>
//                           <View style={commonStyle.instrafeedImgwrap}>
//                           <Image defaultSource={require('../../assets/images/default.png')} source={item.InstraFeedAvater} style= {commonStyle.instrafeedImg} />
//                           </View>
//                         </TouchableOpacity>
//                         )}
//                       />
//                   </View>
//                   <View style={[commonStyle.setupCardBox, {paddingHorizontal: 0, paddingBottom: 5}]}>
//                     <TouchableOpacity activeOpacity={1} style={[commonStyle.sortAreaWrap, commonStyle.mb2, commonStyle.horizontalPadd]}>
//                       <Text style={[commonStyle.subtextblack]}>Similiar professionals</Text>
//                     </TouchableOpacity>
//                     <FlatList
//                       horizontal
//                       ItemSeparatorComponent={() => <View style={{marginRight: -26}}/>}
//                       showsHorizontalScrollIndicator={false}
//                       data={ServiceRecentViewData}
//                       keyExtractor={(item, index) => index.toString()}
//                       renderItem={({ item, index }) => (
//                         <TouchableOpacity key={index} activeOpacity={.8}>
//                           <View style={[commonStyle.othersServiceCard]}>
//                           <Image defaultSource={require('../../assets/images/default.png')} source={item.servicebanner} style= {commonStyle.othersServiceCardImg} />
//                           <View style={commonStyle.othersServiceCardContent}>
//                           <View style={commonStyle.featuredCardRatingRow}>
//                               <View style={commonStyle.featuredUserImgWrap}>
//                                 <Image style={commonStyle.featuredUserImg} source={item.serviceUserAvater}/>
//                               </View>
//                               <TouchableHighlight style={[commonStyle.ratingWhitebtn, commonStyle.shadow]}>
//                                 <Text style={[commonStyle.blackText16, commonStyle.mb03]}> <StarIcon/> {item.rating}</Text>
//                               </TouchableHighlight>
//                           </View>
//                           <View style={commonStyle.featuredCardText}>
//                             <Text style={[commonStyle.blackText16, commonStyle.mb05]}>{item.serviceTitle}</Text>
//                             <Text style={[commonStyle.grayText14, commonStyle.mb1]}>{item.serviceAddress}</Text>
//                             <TouchableHighlight>
//                             <Text style={commonStyle.grayText14}> <MapPointer/> {item.distance}. from you</Text>
//                             </TouchableHighlight>
//                           </View>
//                           </View>
//                           </View>
//                         </TouchableOpacity>
//                         )}
//                       />
//                   </View>
//                   </View>
//                 </View>
//               </Tab>
//               <Tab heading="Inspiration"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <View onLayout={(e)=> setHeight({...height,3:Number(e.nativeEvent.layout.height+50)})}>
//                   {/* <InspirationTab/> */}
//                   <View style={commonStyle.mt2}>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text>HHHHHHHHHHHHH</Text>
//                   </View>
//                 </View>
//               </Tab>
//               <Tab heading="About"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <View onLayout={(e)=> setHeight({...height,4:Number(e.nativeEvent.layout.height+50)})}>
//                   {/* <InspirationTab/> */}
//                   <View style={commonStyle.mt2}>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text>HHHHHHHHHHHHH</Text>
//                   </View>
//                 </View>
//               </Tab>
//               <Tab heading="FAQ"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}
//               >
//                 <View onLayout={(e)=> setHeight({...height,5:Number(e.nativeEvent.layout.height+50)})}>
//                   {/* <InspirationTab/> */}
//                   <View>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text>HHHHHHHHHHHHH</Text>
//                   </View>
//                 </View>
//               </Tab>
//               </Tabs> 
//             </View>
//           ) : null}
//           {!profileData ? (
//            <> 
//             <View style={commonStyle.profileserviceheader}>
//             <TouchableOpacity
//               style={commonStyle.profileserviceheaderback}
//               onPress={() => navigation.goBack()}>
//               {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
//             </TouchableOpacity>
//           </View>
//             <View style={commonStyle.noMassegeWrap}>
//               <Image
//                 style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
//                 source={require('../../assets/images/no-review.png')}
//               />
//               <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
//                 Something went wrong!
//               </Text>
//             </View>
//             </>
//           ) : null}
//         </ScrollView>
//         {profileData ? (
//           <View style={commonStyle.footerwrap}>
//             <View style={[commonStyle.footerbtn]}>
//               <Button
//                 title="Request to book"
//                 containerStyle={commonStyle.buttoncontainerothersStyle}
//                 buttonStyle={commonStyle.commonbuttonStyle}
//                 titleStyle={commonStyle.buttontitleStyle}
//               />
//             </View>
//           </View>
//         ) : null}
//       </Container>
//       {/* ) : (
//         <ActivityLoader />
//       )} */}
//     </Fragment>
//   );
// };

// export default ProfessionalPublicProfile;













// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Container, ScrollableTab, Tab, Tabs} from 'native-base';
// import React, {Fragment, useEffect, useState} from 'react';
// import {
//   BackHandler,
//   Image,
//   PermissionsAndroid,
//   StatusBar,
//   Text,
//   View,
// } from 'react-native';
// import {Button} from 'react-native-elements';
// import GetLocation from 'react-native-get-location';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {useDispatch, useSelector} from 'react-redux';
// import {mainAPI} from '../../api/apiAgent';
// import commonStyle from '../../assets/css/mainStyle';
// import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
// import global from '../../components/commonservices/toast';
// import {AboutTab, FaqTab, ReviewsTab, ServicesTab} from '../../components/tabs';
// import {professionalProfileDetailsRequest} from '../../store/actions/professionalProfileDetailsAction';
// import ProfessionalPublicProfileTop from './professionalPublicProfileTop';

// const ProfessionalPublicProfile = ({route, navigation, ...props}) => {
//   // Get the current state
//   const profileData = useSelector((state) => state.professionalDetails.details);
//   //console.log('profileData', profileData);
//   const loderStatus = useSelector((state) => state.professionalDetails.loader);
//   const dispatch = useDispatch();
//   const [coordinates, setCoordinates] = useState(null);
//   const proId = route.params.proId || '';
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const tabs = ['services', 'reviews', 'inspiration', 'about', 'faq'];

//    // Tabs height adjust handle
//    const [height, setHeight] = useState({1:'',2:'',3:'',4:'',5:''}); 
//    const [tabHeight, setTabHeight] = useState('auto'); 
//    const onChangeTabValue = (event) => {
//      console.log(height);
//      // console.log(height[(event.i)+1]);
//      setTimeout(()=>{
//        setTabHeight(Number(height[(event.i)+1]));
//      },500)
//      console.log('ddddddddddddddddddddddddddddddddddddddd');
//    };

//   useEffect(() => {
//     // console.log('PRO IDDDDDDDDDDDDDDDD:', proId);
//     dispatch(professionalProfileDetailsRequest({proId}));
//     getLoginUserId();
//     getLocation();
//   }, [proId]);

//   useEffect(() => {
//     // if (dispatch) dispatch({ type: 'SET_BOOKING_EDIT', payload: false });

//     const backHandlerdata = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         navigation.navigate('Explore');
//         return true;
//       },
//     );

//     return () => backHandlerdata.remove();
//   }, [dispatch]);

//   const getLoginUserId = async () => {
//     const loginUserId = (await AsyncStorage.getItem('userId')) || '';
//     if (loginUserId == proId) {
//       setIsOwnProfile(true);
//     }
//   };

//   const getLocation = () => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'ios') {
//         return getCurrentLocation();
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Required',
//               message: 'This App needs to Access your location',
//             },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             getCurrentLocation();
//           } else {
//             // --
//           }
//         } catch (err) {}
//       }
//     };
//     requestLocationPermission();
//   };

//   const getCurrentLocation = () => {
//     GetLocation.getCurrentPosition({
//       enableHighAccuracy: true,
//       timeout: 15000,
//     })
//       .then((location) => {
//         setCoordinates(location);
//       })
//       .catch((error) => {
//         const {code, message} = error;
//       });
//   };

//   // const onChangeTab = (tab) => {
//   //   const {i} = tab;
//   //   switch (i) {
//   //   }
//   //   // console.log('index', index);
//   // };

//   const onMessage = async () => {
//     const userId = await AsyncStorage.getItem('userId');

//     mainAPI({
//       url: '/user/ask',
//       data: {
//         // reservationId: bookingData?.data?.reservationDisplayId,
//         proId: profileData.id,
//       },
//       methodType: 'post',
//     })
//       .then(({data}) => {
//         console.log('User', profileData);
//         navigation.navigate('Inbox', {
//           screen: 'InboxInner',
//           params: {
//             userType: '0',
//             channelDetails: {proId: profileData?.id, User: profileData},
//             loginId: userId,
//             channelId: data?.channelId,
//           },
//         });
//       })
//       .catch((error) => {
//         const msg = error.response.data.message;
//         global.showToast(msg ? msg : 'Something went wrong', 'error');
//       });
//   };
//   console.log('profile', profileData);
//   return (
//     <Fragment>
//       <StatusBar backgroundColor="#F36A46" />
//       {loderStatus ? <ActivityLoaderSolid /> : null}
//       <Container style={[commonStyle.mainContainer]}>
//         <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
//           {/* {profileData ? (
//             <ProfessionalPublicProfileTop
//               isOwnProfile={isOwnProfile}
//               myCoordinates={coordinates}
//             />
//           ) : null} */}
//           <View>
//           <Image
//               source={{uri: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Moraine_Lake_17092005.jpg"}}
//               style={{width: '100%', height: 400}}>
//             </Image>
//           </View>
//           {profileData ? (
//             <View>
//               <Tabs
//                 locked={true}
//                 onChangeTab={onChangeTabValue}
//                 renderTabBar={() => (
//                   <ScrollableTab style={[commonStyle.customScrollTabwrap]} />
//                 )}
//                 // onChangeTab={onChangeTab}
//                 // prerenderingSiblingsNumber={1}
//                 style={[
//                   commonStyle.tabsStyle,
//                   {borderRadius: 20, height: tabHeight},
//                 ]}
//                 tabContainerStyle={[
//                   commonStyle.tabsconStyle,
//                   {borderRadius: 20, height: tabHeight},
//                 ]}
//                 tabBarUnderlineStyle={commonStyle.tabBarUnderlineStyle}>
//                 <Tab
//                   heading="Services"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
//                   <View onLayout={(e)=> setHeight({...height,1:Number(e.nativeEvent.layout.height+100)})}>
//                     <View>
//                     {/* <ServicesTab isOwnProfile={isOwnProfile} /> */}
//                     <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text>HHHHHHHHHHHHH</Text>
//                   </View>
//                   </View>
//                 </Tab>
//                 <Tab
//                   heading="Reviews"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
//                   <View onLayout={(e)=> setHeight({...height,2:Number(e.nativeEvent.layout.height+100)})}>
//                     {/* <ReviewsTab proId={proId} isOwnProfile={isOwnProfile} /> */}
//                     <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   </View>
//                 </Tab>

//                 <Tab
//                   heading="Inspiration"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
//                   <View onLayout={(e)=> setHeight({...height,3:Number(e.nativeEvent.layout.height+80)})}>
//                     <View>
//                     <Text>Coming soon</Text>
//                     <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text>Coming soon</Text>
//                     <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                     <Text>Coming soon</Text>
//                     <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                     <Text>Coming soon</Text>
//                     <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   </View>
//                     {/* <InspirationTab /> */}
//                   </View>
//                 </Tab>
//                 <Tab
//                   heading="About"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
//                   <View onLayout={(e)=> setHeight({...height,4:Number(e.nativeEvent.layout.height+100)})}>
//                   <View>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   </View>  
//                     {/* <AboutTab
//                       myCoordinates={coordinates ? coordinates : null}
//                       isOwnProfile={isOwnProfile}
//                       professionalId={proId}
//                       onMessage={onMessage}
//                     /> */}
//                   </View>
//                 </Tab>
//                 <Tab
//                   heading="FAQ"
//                   tabStyle={[commonStyle.inactivetabStyle]}
//                   activeTabStyle={[commonStyle.activeTabStyle]}
//                   textStyle={commonStyle.scrolltabtextStyle}
//                   activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
//                   <View onLayout={(e)=> setHeight({...height,5:Number(e.nativeEvent.layout.height+100)})}>
//                   <View>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>Washington St, Bradford BD8 9QW</Text>
//                   </View>                      
//                   {/* <FaqTab
//                       isOwnProfile={isOwnProfile}
//                       // faqData={
//                       //   profileData && profileData.ProFaqs
//                       //     ? profileData.ProFaqs
//                       //     : null
//                       // }
//                       // ProMetas={
//                       //   profileData && profileData.ProMetas
//                       //     ? profileData.ProMetas[0]
//                       //     : null
//                       // }
//                       onMessage={onMessage}
//                     /> */}
//                   </View>
//                 </Tab>
//                 {/*
//                  */}
//               </Tabs>
//             </View>
//           ) : null}
//           {!profileData ? (
//             <View style={commonStyle.noMassegeWrap}>
//               <Image
//                 style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
//                 source={require('../../assets/images/no-review.png')}
//               />
//               <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
//                 Something went wrong!
//               </Text>
//             </View>
//           ) : null}
//         </KeyboardAwareScrollView>
//         {profileData ? (
//           <View style={commonStyle.footerwrap}>
//             <View style={[commonStyle.footerbtn]}>
//               <Button
//                 title="Request to book"
//                 containerStyle={commonStyle.buttoncontainerothersStyle}
//                 buttonStyle={commonStyle.commonbuttonStyle}
//                 titleStyle={commonStyle.buttontitleStyle}
//               />
//             </View>
//           </View>
//         ) : null}
//       </Container>
//       {/* ) : (
//         <ActivityLoader />
//       )} */}
//     </Fragment>
//   );
// };

// export default ProfessionalPublicProfile;
