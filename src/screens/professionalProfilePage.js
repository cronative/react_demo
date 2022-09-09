// import React, {Fragment, useState, useEffect} from 'react';
// import {
//   ScrollView,
//   Platform,
//   FlatList,
//   View,
//   Text,
//   StatusBar,
//   ImageBackground,
//   Image,
//   TouchableOpacity,
//   TouchableHighlight,
// } from 'react-native';
// import {List, ListItem, Body, Left, Container, Tabs, Tab, ScrollableTab} from 'native-base';
// import {SearchBar, Button} from 'react-native-elements';
// import {SearchIcon, CloseIcon, StarIcon, MapPointer} from '../components/icons';
// import {
//   ServiceData,
// } from '../utility/staticData';
// import { Get } from '../api/apiAgent';


// import commonStyle from '../assets/css/mainStyle';

// const ProfessionalProfilePage = ({navigation, route}) => {
//   const [search, setSearch] = useState('');
//   const [data, setData] = useState(null);

//   const updateSearch = (search) => {
//     setSearch({search});
//   };

//   useEffect(() => {
//     console.log('PARAMS:', route.params)
//     Get('https://staging.uiplonline.com:3077/api/user/professional-details/' + route.params.proId)
//     .then(response => {
//       setData(response);
//     })
//     .catch(err => console.log(err))
//   },[])

//   useEffect(() => {console.log('FETCHED DATA:',data)}, [data])

//   const api = 'https://staging.uiplonline.com:3077/api/user/professional-details/:proId' 


//   return (
//     <Fragment>
//       <StatusBar backgroundColor="#F36A46" />
//       {/* <ImageSlider images={slidingImages} /> */}
//       <View style={[commonStyle.featuredCardContent, {marginTop:50, backgroundColor: 'pink', borderTopStartRadius: 30, borderTopEndRadius: 30} ]}>
//         <View style={commonStyle.featuredCardRatingRow}>
//           <View style={commonStyle.featuredUserImgWrap}>
//             <Image
//               style={commonStyle.featuredUserImg}
//               source={ServiceData[0].serviceUserAvater}
//             />
//           </View>
//           <TouchableHighlight
//             style={[
//               commonStyle.ratingWhitebtn,
//               commonStyle.shadow,
//             ]}>
//             <Text
//               style={[commonStyle.blackText16, commonStyle.mb03]}>
//               {' '}
//               <StarIcon /> {ServiceData[0].rating}
//             </Text>
//           </TouchableHighlight>
//         </View>
//         <View style={commonStyle.featuredCardText}>
//           <Text
//             style={[commonStyle.subtextblack, commonStyle.mb05]}>
//             {ServiceData[0].serviceTitle}
//           </Text>
//           <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
//             {ServiceData[0].serviceAddress}
//           </Text>
//           <TouchableHighlight>
//             <Text style={commonStyle.grayText14}>
//               {' '}
//               <MapPointer /> {ServiceData[0].distance}. from you
//             </Text>
//           </TouchableHighlight>
//         </View>
//       </View>
//       <View>
//         <Container style={[commonStyle.mainContainer]}>
//           <Tabs
//             renderTabBar={() => (
//               <ScrollableTab style={commonStyle.customScrollTab} />
//             )}
//             prerenderingSiblingsNumber={2}
//             style={commonStyle.tabsStyle}
//             tabContainerStyle={commonStyle.tabsconStyle}
//             tabBarUnderlineStyle={commonStyle.tabBarUnderlineStyle}>
//             <Tab 
//               heading="Services"
//               tabStyle={[
//                 commonStyle.inactivetabStyle,
//                 commonStyle.tabbookingposions1,
//               ]}
//               activeTabStyle={[
//                 commonStyle.activeTabStyle,
//                 commonStyle.tabbookingposions1,
//               ]}
//               textStyle={commonStyle.textStyle}
//               activeTextStyle={commonStyle.activeTextStyle}
//               />
//             <Tab 
//               heading="Reviews"
//               tabStyle={[
//                 commonStyle.inactivetabStyle,
//                 commonStyle.tabbookingposions1,
//               ]}
//               activeTabStyle={[
//                 commonStyle.activeTabStyle,
//                 commonStyle.tabbookingposions1,
//               ]}
//               textStyle={commonStyle.textStyle}
//               activeTextStyle={commonStyle.activeTextStyle}
//               >
//               <ServiceList />
//             </Tab>
//             {/* <Tab heading="Reviews">
//               <Reviews />
//             </Tab>
//             <Tab heading="Inspiration">
//               <Inspiration />
//             </Tab>
//             <Tab heading="About">
//               <About />
//             </Tab>
//             <Tab heading="FAQ">
//               <FAQ />
//             </Tab> */}
//           </Tabs>
//         </Container>
//       </View>
//       <ScrollView style={commonStyle.mainContainer}>
//         {/* Featured FlatList Start  */}
//         {/* <View style={commonStyle.featuredListWrap}>
//           <View style={commonStyle.headingWrap}>
//             <Text style={[commonStyle.subheadingOrange, commonStyle.mr08]}>
//               Featured
//             </Text>
//             <Text style={commonStyle.subheading}>pro’s</Text>
//           </View>
//           <FlatList
//             horizontal
//             style={commonStyle.groupflatlist}
//             ItemSeparatorComponent={() => <View style={{marginRight: -26}} />}
//             showsHorizontalScrollIndicator={false}
//             data={ServiceData}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item, index}) => (
//               <TouchableOpacity activeOpacity={0.8}>
//                 <View style={commonStyle.featuredCard}>
//                   <Image
//                     defaultSource={require('../assets/images/default.png')}
//                     source={item.servicebanner}
//                     style={commonStyle.featuredCardImg}
//                   />
//                   <View style={commonStyle.featuredCardContent}>
//                     <View style={commonStyle.featuredCardRatingRow}>
//                       <View style={commonStyle.featuredUserImgWrap}>
//                         <Image
//                           style={commonStyle.featuredUserImg}
//                           source={item.serviceUserAvater}
//                         />
//                       </View>
//                       <TouchableHighlight
//                         style={[
//                           commonStyle.ratingWhitebtn,
//                           commonStyle.shadow,
//                         ]}>
//                         <Text
//                           style={[commonStyle.blackText16, commonStyle.mb03]}>
//                           {' '}
//                           <StarIcon /> {item.rating}
//                         </Text>
//                       </TouchableHighlight>
//                     </View>
//                     <View style={commonStyle.featuredCardText}>
//                       <Text
//                         style={[commonStyle.subtextblack, commonStyle.mb05]}>
//                         {item.serviceTitle}
//                       </Text>
//                       <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
//                         {item.serviceAddress}
//                       </Text>
//                       <TouchableHighlight>
//                         <Text style={commonStyle.grayText14}>
//                           {' '}
//                           <MapPointer /> {item.distance}. from you
//                         </Text>
//                       </TouchableHighlight>
//                     </View>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         </View> */}
//         {/* Featured FlatList End  */}
//       </ScrollView>
//     </Fragment>
//   );
// };

// export default ProfessionalProfilePage;
