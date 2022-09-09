import {useNavigation} from '@react-navigation/native';
import {Container, ScrollableTab, Tab, Tabs} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-swiper';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import {
  LeftArrowAndroid,
  LeftArrowIos,
  MapPointer,
  StarIcon,
} from '../components/icons';
import {
  AboutTab,
  InspirationTab,
  ReviewsTab,
  ServicesTab,
} from '../components/tabs';
import {professionalProfileDetailsRequest} from '../store/actions/professionalProfileDetailsAction';

const ProfileServices = ({route}) => {
  // Tabs height adjust handle
  const [height, setHeight] = useState({1: '', 2: '', 3: '', 4: '', 5: ''});
  const [tabHeight, setTabHeight] = useState('auto');
  const onChangeTabValue = (event) => {
    // console.log(height);
    // console.log(height[(event.i)+1]);
    setTimeout(() => {
      setTabHeight(Number(height[event.i + 1]));
    }, 300);
    console.log('ddddddddddddddddddddddddddddddddddddddd');
  };

  // Get the current state
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalProfileDetailsReducer.data,
  );
  const loderStatus = useSelector(
    (state) => state.professionalProfileDetailsReducer.loader,
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [typeTags, setTypeTags] = useState([]);

  useEffect(() => {
    // Fetch details
    // console.log('PARAMS:', route.params)
    let obj = {proId: route.params.proId};
    dispatch(professionalProfileDetailsRequest(obj));

    // Clear the dispatcher after 2 sec
    // setTimeout(() => {
    //   dispatch(professionalProfileDetailsClear());
    // }, 2000);
  }, []);

  useEffect(() => {
    if (
      professionalProfileDetailsData &&
      professionalProfileDetailsData.status === 200
    ) {
      let mainData = professionalProfileDetailsData.data;
      let cats = professionalProfileDetailsData.data.ProCategories.map(
        (cat) => cat.Category.name,
      );
      setData(mainData);
      setCategories(cats);
      let types = [];
      if (professionalProfileDetailsData.data.ProMetas[0].inPersonType === 1) {
        types.push('In-Person');
      }
      if (professionalProfileDetailsData.data.ProMetas[0].mobileType === 1) {
        types.push('Mobile');
      }
      if (professionalProfileDetailsData.data.ProMetas[0].inPersonType === 1) {
        types.push('Virtual');
      }
      setTypeTags(types);
    } else {
      if (
        professionalProfileDetailsData &&
        professionalProfileDetailsData.status !== 200
      ) {
        global.showToast(professionalProfileDetailsData.message, 'error');
      }
    }
  }, [professionalProfileDetailsData]);

  // useEffect(() => {
  //   console.log("DATA CHANGED. NEW DATA: ", data)
  // }, [data])

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {data ? (
        <Container style={[commonStyle.mainContainer]}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View>
              {data.resources.length > 0 ? (
                <Swiper
                  dot={<View style={commonStyle.dotsinactive} />}
                  activeDot={<View style={commonStyle.dotsactive} />}
                  paginationStyle={{
                    bottom: 40,
                  }}
                  style={commonStyle.profileservicebannerwraper}
                  loop={false}>
                  {data.resources.map((img, index) => (
                    <View style={commonStyle.onboardingslide}>
                      <Image
                        style={commonStyle.profileservicebannerimg}
                        source={{uri: data.resources[index].url}}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </Swiper>
              ) : (
                <Image
                  style={commonStyle.profileservicebannerimg}
                  source={require('../assets/images/default-new.png')}
                  resizeMode="cover"
                />
              )}
              <View style={commonStyle.profileserviceheader}>
                <TouchableOpacity
                  style={commonStyle.profileserviceheaderback}
                  onPress={() => navigation.goBack()}>
                  {Platform.OS === 'ios' ? (
                    <LeftArrowIos />
                  ) : (
                    <LeftArrowAndroid />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={commonStyle.followbtn}
                  activeOpacity={0.5}>
                  <Text style={commonStyle.followbtnText}>Follow</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={commonStyle.profileservicedetailsinfo}>
                <View style={commonStyle.profileserviceUserRatingwrap}>
                  <View style={commonStyle.profileserviceUserImgWrap}>
                    {data.profileImage ? (
                      <Image
                        style={commonStyle.profileserviceUserImg}
                        source={{uri: data.profileImage}}
                      />
                    ) : (
                      <Image
                        style={commonStyle.profileserviceUserImg}
                        source={require('../assets/images/default-new.png')}
                      />
                    )}
                  </View>
                  <TouchableHighlight
                    style={[
                      commonStyle.profileserviceratingbtn,
                      commonStyle.shadow,
                    ]}>
                    <Text style={[commonStyle.blackText16, commonStyle.mb03]}>
                      {' '}
                      <StarIcon />{' '}
                      {data.ratings ? Number(data.ratings).toFixed(1) : 'NA'}
                    </Text>
                  </TouchableHighlight>
                </View>
                <View style={commonStyle.featuredCardText}>
                  <Text style={[commonStyle.subheading, commonStyle.mb05]}>
                    {data.ProMetas[0].businessName}
                  </Text>
                  <View style={commonStyle.categorytagsWrap}>
                    <TouchableHighlight style={commonStyle.tagsOutline}>
                      <Text style={commonStyle.filterBlackText}>
                        {typeTags.join(' . ')}
                      </Text>
                    </TouchableHighlight>
                    {categories.map((cat) => (
                      <TouchableHighlight style={commonStyle.tagsOutline}>
                        <Text style={commonStyle.categorytagsText}>{cat}</Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                    {data.ProMetas[0].address}
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <TouchableHighlight>
                      <Text style={commonStyle.grayText14}>
                        <MapPointer /> 290 miles from you
                      </Text>
                    </TouchableHighlight>
                    <Text style={commonStyle.dotSmall}> . </Text>
                    <TouchableOpacity>
                      <Text style={commonStyle.textorange14}>Show on Map</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Tabs
                locked={true}
                onChangeTab={onChangeTabValue}
                renderTabBar={() => (
                  <ScrollableTab style={[commonStyle.customScrollTabwrap]} />
                )}
                prerenderingSiblingsNumber={5}
                style={[
                  commonStyle.tabsStyle,
                  {borderRadius: 20, height: tabHeight},
                ]}
                tabContainerStyle={[
                  commonStyle.tabsconStyle,
                  {borderRadius: 20, height: tabHeight},
                ]}
                tabBarUnderlineStyle={commonStyle.tabBarUnderlineStyle}>
                <Tab
                  heading="Services"
                  tabStyle={[commonStyle.inactivetabStyle]}
                  activeTabStyle={[commonStyle.activeTabStyle]}
                  textStyle={commonStyle.scrolltabtextStyle}
                  activeTextStyle={commonStyle.scrolltabactiveTextStyle}>
                  <View
                    onLayout={(e) =>
                      setHeight({
                        ...height,
                        1: Number(e.nativeEvent.layout.height + 100),
                      })
                    }>
                    {/* <ServicesTab/> */}
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
                    <Text>HHHHHHHHHHHHH</Text>
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
                        2: Number(e.nativeEvent.layout.height + 100),
                      })
                    }>
                    <ReviewsTab proId={route.params.proId} />
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
                        3: Number(e.nativeEvent.layout.height + 100),
                      })
                    }>
                    <InspirationTab />
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
                        4: Number(e.nativeEvent.layout.height + 100),
                      })
                    }>
                    <AboutTab />
                    {/* <Text>ABOUT TAB</Text> */}
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
                        5: Number(e.nativeEvent.layout.height + 100),
                      })
                    }>
                    {/* <FaqTab/> */}
                    <Text>FAQ</Text>
                  </View>
                </Tab>
              </Tabs>
            </View>
          </KeyboardAwareScrollView>
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Book Now"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
              />
            </View>
          </View>
        </Container>
      ) : null}
    </Fragment>
  );
};

export default ProfileServices;
