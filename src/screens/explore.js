import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Fragment, useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import GetLocation from 'react-native-get-location';
import Swiper from 'react-native-swiper';
import {useDispatch, useSelector} from 'react-redux';
import {Get, Post} from '../api/apiAgent';
import * as Constant from '../api/constant';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {CloseIcon, MapPointer, SearchIcon, StarIcon} from '../components/icons';
import {
  profileViewRequest,
  profileViewRequestClear,
} from '../store/actions/profileAction';
import {OnboardingStyles} from '../utility/styles';
import {setNavigationValue, setOnboardingValue} from '../store/actions';
import {BANNER_BASE_URL} from '../api/constant';
import {clearCustomNavFromLogin} from '../store/actions/nagationAction';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

console.log('BANNER URL IS: ', BANNER_BASE_URL);

const Explore = ({navigation}) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [catList, setCatList] = useState(false);
  const [catListDefault, setCatListDefalt] = useState(false);
  const [topRatedPro, setTopRatedPro] = useState(false);
  const [popHair, setPopHair] = useState(false);
  const [popNail, setPopNail] = useState(false);
  const [proProfessional, setProProfessional] = useState(false);
  const [recentViewProduct, setRecentViewProduct] = useState(false);
  const [banner, setBanner] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [location, setLocation] = useState([null, null]);
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );
  const [bannerIndex, setBannerIndex] = useState(0);
  const isFocused = useIsFocused();

  const [allSectionEmpty, setAllSectionEmpty] = useState(false);
  const updateSearch = (search) => {
    setSearch({search});
  };
  const [startSwiper, setSwiper] = useState(false);

  const navigationContainer = useSelector(
    (state) => state.navigationValueDetails.tempRoutes,
  );

  const routeProId = useSelector(
    (state) => state?.navigationValueDetails?.proId,
  );

  useEffect(() => {
    if (!!routeProId) {
      setTimeout(() => {
        navigation.navigate('ProfessionalPublicProfile', {
          proId: routeProId,
          singleBack: true,
          doubleBack: false,
        });
        dispatch(clearCustomNavFromLogin());
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (
      topRatedPro?.length == 0 &&
      popHair?.length == 0 &&
      popNail?.length == 0 &&
      proProfessional?.length == 0 &&
      recentViewProduct?.length == 0
    ) {
      // console.log('ALL EMPTY TRUE')
      setAllSectionEmpty(true);
    } else {
      // console.log('ALL EMPTY FALSE')
      // console.log('top', topRatedPro)
      // console.log('hair', popHair)
      // console.log('nail', popNail)
      // console.log('featured', proProfessional)
      // console.log('recent', recentViewProduct)
      setAllSectionEmpty(false);
    }
  }, [topRatedPro, popHair, popNail, proProfessional, recentViewProduct]);

  useEffect(() => {
    if (navigationContainer?.child?.routeName == 'BookService') {
      setTimeout(() => {
        navigation.navigate('BookService', {
          proId: navigationContainer?.child?.params?.proId,
          serviceId: navigationContainer?.child?.params?.serviceId,
        });
        dispatch({type: 'CLEAR_NAVIGATION_ROUTE'});
      }, 500);
    }
  }, []);

  useEffect(() => {
    dispatch(profileViewRequest());
  }, []);

  // This methos is for handle the response
  useEffect(() => {
    if (profileData && profileData.status == 200) {
      dispatch(profileViewRequestClear());
    } else {
      dispatch(profileViewRequestClear());
    }
  }, [profileData]);

  const fetchRecentView = (lat = null, long = null) => {
    console.log(
      'recent url:',
      `user/recently-viewed?page=1&records=10${
        lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
      }`,
    );
    Get(
      `user/recently-viewed?page=1&records=10${
        lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
      }`,
      '',
    )
      .then((result) => {
        console.log('recent data:', result?.data?.rows);
        if (result.status === 200) {
          console.log('RECENTLY DATA: ', result.data.rows);
          setRecentViewProduct(result.data.rows);
        } else {
          // global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    Get('/user/list-preferred-categories?page=1&records=7', '')
      .then((result) => {
        if (result.status === 200 && result?.data?.rows?.length) {
          setCatList(result.data.rows);
        } else {
          fetchDefaultCategories();
        }
      })
      .catch((error) => {
        fetchDefaultCategories();
        console.log(error);
      });
  };

  const fetchDefaultCategories = () => {
    Get('user/list-categories?isPopular=1&page=1&records=7')
      .then((result) => {
        setCatListDefalt(result.data.rows);
      })
      .catch((err) => {
        console.log('Error while trying to fetch categories');
      });
  };

  const checkIsUserLogin = async () => {
    let token = await AsyncStorage.getItem('accessToken');
    let isValidForLogin = await AsyncStorage.getItem('isValidForLogin');
    if (token && isValidForLogin) {
      fetchRecentView(location.latitude, location.longitude);
    } else {
      console.log('Not coming');
    }
  };
  const fetchData = (lat = null, long = null) => {
    // setLoader(true);

    Get(
      `user/top-rated-professionals?records=10${
        lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
      }`,
    )
      .then((result) => {
        //setLoader(false);
        if (result.status === 200) {
          if (result.data.rows.length > 9) {
            setTopRatedPro(result.data.rows.slice(0, 10));
          } else {
            setTopRatedPro(result.data.rows);
          }
        }
        //&latitude=${lat}&longitude=${long}
        console.log(
          'pop url:',
          `/user/popular-professionals?records=10&type=hair${
            lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
          }`,
        );
        return Get(
          `/user/popular-professionals?records=10&type=hair${
            lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
          }`,
        );
      })
      .then((result) => {
        // setLoader(false);
        console.log('pop data:', result?.data?.rows);
        if (result.status === 200) {
          if (result.data.rows.length > 9) {
            setPopHair(result.data.rows.slice(0, 10));
          } else {
            setPopHair(result.data.rows);
          }
        }
        //&latitude=${lat}&longitude=${long}
        return Get(
          `/user/popular-professionals?records=10&type=nails${
            lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
          }`,
        );
      })
      .then((result) => {
        //setLoader(false);
        if (result.status === 200) {
          if (result.data.rows.length > 9) {
            setPopNail(result.data.rows.slice(0, 10));
          } else {
            setPopNail(result.data.rows);
          }
        }
        return Get(
          `/user/list-featured-professionals${
            lat && long ? '?latitude=' + lat + '&longitude=' + long : ''
          }`,
        );
      })
      .then((result) => {
        if (result.status == 200) {
          if (result.data.rows.length > 9) {
            setProProfessional(result.data.rows.slice(0, 10));
          } else {
            setProProfessional(result.data.rows);
          }
        }
        // return Get(`user/recently-viewed?page=1&records=10${lat && long ? '&latitude=' + lat + '&longitude=' + long : ''}`);
        // return Get(`/user/banners`);
        return Get(`/user/fetch-banner?pageName=home&country=usa`);
      })
      // .then((result) => {
      //   // if (result.status === 200) setProProfessional(result.data.rows);

      //   ///api/user/banners
      //   // return Get(`/user/list-featured-professionals`);
      //   // return Get(`/user/banners`);
      // })
      // .then((result) => {
      //   setLoader(false);
      //   if (result.status === 200) setRecentViewProduct(result.data.rows);

      //   ///api/user/banners
      //   return Get(`/user/banners`);
      // })
      .then((result) => {
        setLoader(false);
        console.log('BANNER DATA: ', result);
        if (result.status === 200) setBanner(result.data);
        setTimeout(() => {
          setSwiper(true);
        }, 1000);
      })
      .catch((error) => {
        setLoader(false);
        console.log('Status : ', error.response.data.status);
        if (error?.response?.data?.status != 401) {
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              'Something went wrong',
            'error',
          );
        }
      });
  };

  const getLatLong = () => {
    setLoader(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setLocation([location.latitude, location.longitude]);
        fetchData(location.latitude, location.longitude);
        fetchRecentView(location.latitude, location.longitude);
      })
      .catch((error) => {
        setLoader(false);
        const {code, message} = error;
        fetchData();
        fetchRecentView();
      });
  };

  useEffect(() => {
    getLatLong();
  }, [isFocused]);

  const tabPress = async (professionalId) => {
    const userType = await AsyncStorage.getItem('userType');
    if (userType == null) {
      // dispatch(setNavigationValue(1));
      console.log('tabPress******,', await AsyncStorage.getItem('accessToken'));
      navigation.navigate('ProfessionalPublicProfile', {
        proId: professionalId,
        singleBack: true,
        doubleBack: false,
      });
    } else {
      navigation.navigate('ProfessionalPublicProfile', {
        proId: professionalId,
        singleBack: true,
        doubleBack: false,
      });
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      <SafeAreaView
        style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={getLatLong} />
          // }>
        >
          <View style={commonStyle.expolreBanner}>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('GlobalSearch')}>
                <SearchBar
                  onChangeText={updateSearch}
                  value={search}
                  // onPress={() => navigation.navigate('GlobalSearch')}
                  onFocus={() => navigation.navigate('GlobalSearch')}
                  showSoftInputOnFocus={false}
                  searchIcon={<SearchIcon />}
                  clearIcon={<CloseIcon />}
                  autoFocus={false}
                  placeholder="What are you looking for?"
                  placeholderTextColor={'#110F17'}
                  containerStyle={{
                    backgroundColor: '#ECEDFF',
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    width: '100%',
                    paddingTop: Platform.OS === 'ios' ? 20 : 15,
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}
                  inputStyle={{
                    backgroundColor: '#ffffff',
                    color: '#110F17',
                    fontFamily: 'SofiaPro',
                  }}
                  inputContainerStyle={{
                    paddingRight: 0,
                    paddingLeft: 10,
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    borderBottomWidth: 1,
                    borderWidth: 1,
                    borderColor: '#ffffff',
                  }}
                  style={{
                    fontSize: 14,
                    fontFamily: 'SofiaPro',
                    backgroundColor: '#fff',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: width,
                height: Platform.OS === 'ios' ? height : 355,
              }}>
              {banner ? (
                <View style={{width: width}}>
                  <View style={commonStyle.exploreBannerRow}>
                    <View
                      style={[commonStyle.exploreBannerCol, commonStyle.mt4]}>
                      <Text
                        style={[commonStyle.textheading, {fontSize: 24}]}
                        numberOfLines={5}
                        // numberOfLines={banner.length}
                      >
                        {banner?.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          // navigation.navigate('GlobalSearch'),
                          //   setTimeout(() => {
                          //     navigation.navigate('SearchMapView', {
                          //       selectedCategory: item.Category.id,
                          //       selectedCategoryName: item.Category.name,
                          //     });
                          //   }, 100);
                          navigation.navigate('GlobalSearch');
                        }}
                        style={[
                          commonStyle.commonOrangeButton,
                          commonStyle.mt15,
                        ]}
                        activeOpacity={0.5}>
                        <Text
                          style={[
                            commonStyle.buttontitleStyle,
                            commonStyle.textCenter,
                          ]}>
                          Search nearby
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[commonStyle.exploreBannerCol]}>
                      {banner.appUrl ? (
                        <Image
                          style={commonStyle.exploreBannerImg}
                          source={{
                            uri: `${BANNER_BASE_URL}/${banner.appUrl}`,
                          }}
                        />
                      ) : (
                        <Image
                          style={commonStyle.exploreBannerImg}
                          source={require('../assets/images/default-new.png')}
                        />
                      )}
                    </View>
                  </View>
                </View>
              ) : (
                <></>
              )}
            </View>
          </View>

          {catList && (
            <View style={commonStyle.radiusTopWrap}>
              <View style={[commonStyle.exploreCategoryRow, commonStyle.mt15]}>
                {catList.map((item, index) => (
                  <View key={index} style={commonStyle.exploreCategoryCol}>
                    {index < 7 ? (
                      <View
                        style={[commonStyle.mb15, {alignSelf: 'center'}]}
                        onPress={() => {
                          Post('/user/recentlyViewCategories', {
                            categoryId: item.Category.id,
                          })
                            .then((response) => {})
                            .catch((error) => {});
                          navigation.navigate('SearchMapView', {
                            selectedCategory: item.Category.id,
                            selectedCategoryName: item.Category.name,
                          });
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {
                            Post('/user/recentlyViewCategories', {
                              categoryId: item.Category.id,
                            })
                              .then((response) => {})
                              .catch((error) => {});
                            navigation.navigate('SearchMapView', {
                              selectedCategory: item.Category.id,
                              selectedCategoryName: item.Category.name,
                            });
                          }}
                          style={[
                            commonStyle.accountlistavaterbg,
                            commonStyle.mrl,
                            {backgroundColor: item.Category.color},
                          ]}>
                          {item.Category.logoUrl == null ||
                          item.Category.logoUrl == '' ? (
                            <Image
                              style={commonStyle.avatericon}
                              defaultSource={require('../assets/images/default-new.png')}
                              source={item.categoriesImg}
                            />
                          ) : (
                            <Image
                              style={commonStyle.avatericon}
                              source={
                                item.Category.logoUrl == null
                                  ? require('../assets/images/gift-box.png')
                                  : {
                                      uri: item.Category.logoUrl,
                                    }
                              }
                            />
                          )}
                        </TouchableOpacity>
                        <Text
                          style={[
                            commonStyle.texttimeblack,
                            commonStyle.textCenter,
                            commonStyle.mt1,
                          ]}>
                          {item.Category.name}
                        </Text>
                      </View>
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                ))}
                {catList && (
                  <View style={commonStyle.exploreCategoryCol}>
                    <View style={[commonStyle.mb15, {alignSelf: 'center'}]}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('AllCategories')}
                        activeOpacity={0.5}
                        style={[
                          commonStyle.accountlistavaterbg,
                          commonStyle.mrl,
                          {backgroundColor: '#EEF2F5'},
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/categories-icon/plus.png')}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                          commonStyle.mt1,
                        ]}
                        numberOfLines={1}>
                        More
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Category List (Default admin panel) */}
          {!catList && catListDefault && catListDefault?.length ? (
            <View style={commonStyle.radiusTopWrap}>
              <View style={[commonStyle.exploreCategoryRow, commonStyle.mt15]}>
                {catListDefault.map((item, index) => (
                  <View key={index} style={commonStyle.exploreCategoryCol}>
                    {index < 7 ? (
                      <View
                        style={[
                          commonStyle.mb15,
                          {
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}
                        onPress={() => {
                          Post('/user/recentlyViewCategories', {
                            categoryId: item.id,
                          })
                            .then((response) => {})
                            .catch((error) => {});
                          navigation.navigate('SearchMapView', {
                            selectedCategory: item.id,
                            selectedCategoryName: item.name,
                          });
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {
                            Post('/user/recentlyViewCategories', {
                              categoryId: item.id,
                            })
                              .then((response) => {})
                              .catch((error) => {});
                            navigation.navigate('SearchMapView', {
                              selectedCategory: item.id,
                              selectedCategoryName: item.name,
                            });
                          }}
                          style={[
                            commonStyle.accountlistavaterbg,
                            commonStyle.mrl,
                            {backgroundColor: item.color},
                          ]}>
                          {item.logoUrl == null || item.logoUrl == '' ? (
                            <Image
                              style={commonStyle.avatericon}
                              defaultSource={require('../assets/images/default-new.png')}
                              source={item.categoriesImg}
                            />
                          ) : (
                            <Image
                              style={commonStyle.avatericon}
                              source={
                                item.logoUrl == null
                                  ? require('../assets/images/gift-box.png')
                                  : {
                                      uri: item.logoUrl,
                                    }
                              }
                            />
                          )}
                        </TouchableOpacity>
                        <Text
                          style={[
                            commonStyle.texttimeblack,
                            commonStyle.textCenter,
                            commonStyle.mt1,
                            {marginRight: '8%'},
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                ))}
                {catListDefault && catListDefault?.length ? (
                  <View style={commonStyle.exploreCategoryCol}>
                    <View style={[commonStyle.mb15, {alignSelf: 'center'}]}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('AllCategories')}
                        activeOpacity={0.5}
                        style={[
                          commonStyle.accountlistavaterbg,
                          commonStyle.mrl,
                          {backgroundColor: '#EEF2F5'},
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/categories-icon/plus.png')}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                          commonStyle.mt1,
                        ]}
                        numberOfLines={1}>
                        More
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {/* Featured FlatList Start  */}
          {proProfessional.length > 0 ? (
            <View style={commonStyle.featuredListWrap}>
              <View style={commonStyle.headingWrap}>
                <Text
                  style={[commonStyle.subheadingOrange, commonStyle.mr08]}
                  // onPress={() => navigation.navigate('ProfileServicesNew')}
                >
                  Featured
                </Text>
                <Text style={commonStyle.subheading}>pro’s</Text>
              </View>
              <FlatList
                horizontal
                style={commonStyle.groupflatlist}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={proProfessional}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => tabPress(item.id)}>
                    <View style={commonStyle.featuredCard}>
                      <Image
                        // defaultSource={require('../assets/images/default-new.png')}
                        // source={require('../assets/images/default-new.png')}
                        source={
                          item.ProResources && item.ProResources.length
                            ? {
                                uri: item.ProResources[0].url,
                              }
                            : require('../assets/images/default-new.png')
                        }
                        style={commonStyle.featuredCardImg}
                      />
                      <View style={commonStyle.featuredCardContent}>
                        <View style={commonStyle.featuredCardRatingRow}>
                          <View style={commonStyle.featuredUserImgWrap}>
                            {/* profileImage */}

                            {item.profileImage ? (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={
                                  item.profileImage == null
                                    ? require('../assets/images/default-new.png')
                                    : {
                                        uri: item.profileImage,
                                      }
                                }
                              />
                            ) : (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={require('../assets/images/default-new.png')}
                              />
                            )}
                          </View>
                          <TouchableHighlight
                            style={[
                              commonStyle.ratingWhitebtn,
                              commonStyle.shadow,
                            ]}>
                            <Text
                              style={[
                                commonStyle.blackText16,
                                commonStyle.mb03,
                              ]}>
                              {' '}
                              <StarIcon />{' '}
                              {item.ratings
                                ? Number(item.ratings).toFixed(1)
                                : '0'}
                            </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={commonStyle.featuredCardText}>
                          <Text
                            style={[commonStyle.subtextblack, commonStyle.mb05]}
                            numberOfLines={1}>
                            {item.ProMetas &&
                            item.ProMetas[0] &&
                            item.ProMetas[0].businessName
                              ? item.ProMetas[0].businessName
                              : 'N/A'}
                          </Text>
                          <Text
                            style={[commonStyle.grayText16, commonStyle.mb1]}
                            numberOfLines={2}>
                            {item.ProMetas &&
                              item.ProMetas[0].address &&
                              item.ProMetas[0].address}
                            {/* {item.ProMetas &&
                            item.ProMetas[0].country &&
                            item.ProMetas[0].country +
                              ', ' +
                              item.ProMetas[0].city} */}
                          </Text>
                          {item.ProMetas &&
                          item.ProMetas[0] &&
                          item.ProMetas[0].distance ? (
                          <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center'}}>
                            <MapPointer />
                            <Text style={[commonStyle.grayText14, {marginStart: 5, marginTop: 2}]} numberOfLines={1}>
                            {Number(item.ProMetas[0].distance).toFixed(2)}miles from you
                            </Text>
                          </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          {/* Featured FlatList End  */}

          {/* Top rated FlatList Start  */}
          {topRatedPro.length > 0 ? (
            <View style={commonStyle.topRatedListWrap}>
              <View style={commonStyle.viewAllheadingWrap}>
                <Text style={[commonStyle.subheading, commonStyle.mr08]}>
                  Top rated
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ExploreViewAllRated', {
                      type: 'top_rated',
                      location: location,
                    })
                  }>
                  <Text style={commonStyle.grayText16}>View all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                style={commonStyle.groupflatlist}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={topRatedPro}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => tabPress(item.id)}>
                    <View style={commonStyle.featuredCard}>
                      <Image
                        style={commonStyle.featuredCardImg}
                        source={
                          item.ProResources && item.ProResources.length
                            ? {
                                uri: item.ProResources[0].url,
                              }
                            : require('../assets/images/default-new.png')
                        }
                      />
                      <View style={commonStyle.featuredCardContent}>
                        <View style={commonStyle.featuredCardRatingRow}>
                          <View style={commonStyle.featuredUserImgWrap}>
                            {item.profileImage ? (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={
                                  item.profileImage == null
                                    ? require('../assets/images/default-new.png')
                                    : {
                                        uri: item.profileImage,
                                      }
                                }
                              />
                            ) : (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={require('../assets/images/default-new.png')}
                              />
                            )}
                          </View>
                          <TouchableHighlight
                            style={[
                              commonStyle.ratingWhitebtn,
                              commonStyle.shadow,
                            ]}>
                            <Text
                              style={[
                                commonStyle.blackText16,
                                commonStyle.mb03,
                              ]}>
                              {' '}
                              <StarIcon />{' '}
                              {item.ratings
                                ? Number(item.ratings).toFixed(1)
                                : '0'}
                            </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={commonStyle.featuredCardText}>
                          <Text
                            style={[commonStyle.subtextblack, commonStyle.mb05]}
                            numberOfLines={1}>
                            {item.ProMetas &&
                            item.ProMetas[0] &&
                            item.ProMetas[0].businessName &&
                            item.ProMetas[0].businessName
                              ? item.ProMetas[0].businessName
                              : item.username}
                          </Text>
                          <Text
                            style={[commonStyle.grayText16, commonStyle.mb1]}
                            numberOfLines={2}>
                            {/* {item.ProMetas[0] && item.ProMetas[0].country
                            ? item.ProMetas[0].country
                            : '' + ' '}
                          {item.ProMetas[0] && item.ProMetas[0].city
                            ? item.ProMetas[0].city
                            : '' + ' '} */}
                            {item.ProMetas &&
                            item.ProMetas[0] &&
                            item.ProMetas[0].address
                              ? item.ProMetas[0].address
                              : ''}
                          </Text>
                          {item.distance ? (
                            <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center'}}>
                              <MapPointer />
                              <Text style={[commonStyle.grayText14, {marginStart: 5, marginTop: 2}]} numberOfLines={1}>
                                {Number(item.distance).toFixed(2)}miles from you
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          {/* Top rated FlatList End  */}

          {/* Recently viewed FlatList Start  */}
          {recentViewProduct.length > 0 ? (
            <View style={[commonStyle.exploreCommListWrap, {paddingTop: 0}]}>
              {recentViewProduct && recentViewProduct.length > 0 ? (
                <View style={commonStyle.headingWrap}>
                  <Text style={[commonStyle.subheading, commonStyle.mr08]}>
                    Recently viewed
                  </Text>
                </View>
              ) : (
                <Text></Text>
              )}
              <FlatList
                horizontal
                style={commonStyle.groupflatlist}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={recentViewProduct}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    //Start Change: Snehasish Das, Issue #1783
                    onPress={() => tabPress(item.ProfessionalId)}
                    //End Change: Snehasish Das, Issue #1783
                  >
                    <View style={commonStyle.othersServiceCard}>
                      {item.professionals &&
                      item.professionals.ProResources &&
                      item.professionals.ProResources[0] &&
                      item.professionals.ProResources[0].url ? (
                        <Image
                          style={commonStyle.othersServiceCardImg}
                          source={
                            item.professionals.ProResources[0].url == null
                              ? require('../assets/images/default-new.png')
                              : {
                                  uri: item.professionals.ProResources[0].url,
                                }
                          }
                        />
                      ) : (
                        <Image
                          style={commonStyle.othersServiceCardImg}
                          source={require('../assets/images/default-new.png')}
                        />
                      )}
                      <View style={commonStyle.othersServiceCardContent}>
                        <View style={commonStyle.featuredCardRatingRow}>
                          <View style={commonStyle.featuredUserImgWrap}>
                            {item.professionals &&
                            item.professionals.profileImage ? (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={
                                  item.professionals.profileImage == null
                                    ? require('../assets/images/default-new.png')
                                    : {
                                        uri: item.professionals.profileImage,
                                      }
                                }
                              />
                            ) : (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={require('../assets/images/default-new.png')}
                              />
                            )}
                          </View>
                          <TouchableHighlight
                            style={[
                              commonStyle.ratingWhitebtn,
                              commonStyle.shadow,
                            ]}>
                            <Text
                              style={[
                                commonStyle.blackText16,
                                commonStyle.mb03,
                              ]}>
                              {' '}
                              <StarIcon />{' '}
                              {item?.professionals?.ratings
                                ? Number(item.professionals.ratings).toFixed(1)
                                : '0'}
                            </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={commonStyle.featuredCardText}>
                          <Text
                            style={[commonStyle.blackText16, commonStyle.mb05]}
                            numberOfLines={1}>
                            {item.professionals &&
                            item.professionals.ProMetas &&
                            item.professionals.ProMetas[0] &&
                            item.professionals.ProMetas[0].businessName
                              ? item.professionals.ProMetas[0].businessName
                              : item.username}
                          </Text>
                          <Text
                            style={[commonStyle.grayText14, commonStyle.mb1]}
                            numberOfLines={2}>
                            {/* {item.ProMetas[0] && item.ProMetas[0].country
                            ? item.ProMetas[0].country
                            : '' + ' '}
                          {item.ProMetas[0] && item.ProMetas[0].city
                            ? item.ProMetas[0].city
                            : '' + ' '} */}
                            {item.professionals &&
                            item.professionals.ProMetas &&
                            item.professionals.ProMetas[0] &&
                            item.professionals.ProMetas[0].address
                              ? item.professionals.ProMetas[0].address
                              : ''}
                            {/* {item.professionals && item.professionals.ProMetas && 
                          item.professionals.ProMetas[0] && 
                          item.professionals.ProMetas[0].address
                            ? item.professionals.ProMetas[0].address
                            : ''} */}
                          </Text>
                          {item.professionals &&
                          item.professionals.ProMetas &&
                          item.professionals.ProMetas[0] &&
                          item.professionals.ProMetas[0].distance ? (
                            <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center'}}>
                            <MapPointer />
                            <Text style={[commonStyle.grayText14, {marginStart: 5, marginTop: 2}]} numberOfLines={1}>
                                {Number(
                                  item.professionals.ProMetas[0].distance,
                                ).toFixed(2)}
                                miles from you
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          {/* Recently viewed FlatList End  */}

          {/* Popular in Hair FlatList Start  */}
          {popHair.length > 0 ? (
            <View style={[commonStyle.exploreCommListWrap, {paddingTop: 0}]}>
              {popHair && popHair.length > 0 ? (
                <View style={commonStyle.viewAllheadingWrap}>
                  <Text style={[commonStyle.subheading, commonStyle.mr08]}>
                    Popular in Hair
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ExploreViewAllRated', {
                        type: 'popular_in_hair',
                        location: location,
                      })
                    }>
                    <Text style={commonStyle.grayText16}>View all</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text></Text>
              )}
              <FlatList
                horizontal
                style={commonStyle.groupflatlist}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={popHair}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => tabPress(item.id)}>
                    <View style={commonStyle.othersServiceCard}>
                      <Image
                        style={commonStyle.othersServiceCardImg}
                        source={
                          item.ProResources && item.ProResources.length
                            ? {
                                uri: item.ProResources[0].url,
                              }
                            : require('../assets/images/default-new.png')
                        }
                      />
                      <View style={commonStyle.othersServiceCardContent}>
                        <View style={commonStyle.featuredCardRatingRow}>
                          <View style={commonStyle.featuredUserImgWrap}>
                            {item.profileImage ? (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={
                                  item.profileImage == null
                                    ? require('../assets/images/default-new.png')
                                    : {
                                        uri: item.profileImage,
                                      }
                                }
                              />
                            ) : (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={require('../assets/images/default-new.png')}
                              />
                            )}
                          </View>
                          <TouchableHighlight
                            style={[
                              commonStyle.ratingWhitebtn,
                              commonStyle.shadow,
                            ]}>
                            <Text
                              style={[
                                commonStyle.blackText16,
                                commonStyle.mb03,
                              ]}>
                              {' '}
                              <StarIcon />{' '}
                              {item.ratings
                                ? Number(item.ratings).toFixed(1)
                                : '0'}
                            </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={commonStyle.featuredCardText}>
                          <Text
                            style={[commonStyle.blackText16, commonStyle.mb05]}
                            numberOfLines={1}>
                            {item.ProMetas &&
                            item.ProMetas[0] &&
                            item.ProMetas[0].businessName &&
                            item.ProMetas[0].businessName
                              ? item.ProMetas[0].businessName
                              : item.username}
                          </Text>
                          <Text
                            style={[commonStyle.grayText14, commonStyle.mb1]}
                            numberOfLines={2}>
                            {item.ProMetas &&
                              item.ProMetas[0]?.address &&
                              item.ProMetas[0]?.address}
                          </Text>
                          {item.distance ? (
                            <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center'}}>
                              <MapPointer />
                              <Text style={[commonStyle.grayText14, {marginStart: 5, marginTop: 2}]} numberOfLines={1}>
                                    {Number(item.distance).toFixed(2)}miles from you
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          {/* Popular in Hair FlatList End  */}

          {/* Popular in Nails FlatList Start  */}
          {popNail.length > 0 ? (
            <View style={[commonStyle.exploreCommListWrap, {paddingTop: 0}]}>
              {popNail && popNail.length > 0 ? (
                <View style={commonStyle.viewAllheadingWrap}>
                  <Text style={[commonStyle.subheading, commonStyle.mr08]}>
                    Popular in Nails
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ExploreViewAllRated', {
                        type: 'popular_in_nail',
                        location: location,
                      })
                    }>
                    <Text style={commonStyle.grayText16}>View all</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text></Text>
              )}
              <FlatList
                horizontal
                style={commonStyle.groupflatlist}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={popNail}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => tabPress(item.id)}>
                    <View style={commonStyle.othersServiceCard}>
                      <Image
                        style={commonStyle.othersServiceCardImg}
                        source={
                          item.ProResources && item.ProResources.length
                            ? {
                                uri: item.ProResources[0].url,
                              }
                            : require('../assets/images/default-new.png')
                        }
                      />
                      <View style={commonStyle.othersServiceCardContent}>
                        <View style={commonStyle.featuredCardRatingRow}>
                          <View style={commonStyle.featuredUserImgWrap}>
                            {item.profileImage ? (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={
                                  item.profileImage == null
                                    ? require('../assets/images/default-new.png')
                                    : {
                                        uri: item.profileImage,
                                      }
                                }
                              />
                            ) : (
                              <Image
                                style={commonStyle.featuredUserImg}
                                source={require('../assets/images/default-new.png')}
                              />
                            )}
                          </View>
                          <TouchableHighlight
                            style={[
                              commonStyle.ratingWhitebtn,
                              commonStyle.shadow,
                            ]}>
                            <Text
                              style={[
                                commonStyle.blackText16,
                                commonStyle.mb03,
                              ]}>
                              {' '}
                              <StarIcon />{' '}
                              {item.ratings
                                ? Number(item.ratings).toFixed(1)
                                : '0'}
                            </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={commonStyle.featuredCardText}>
                          <Text
                            style={[commonStyle.blackText16, commonStyle.mb05]}
                            numberOfLines={1}>
                            {item.ProMetas &&
                            item.ProMetas[0] &&
                            item.ProMetas[0].businessName &&
                            item.ProMetas[0].businessName
                              ? item.ProMetas[0].businessName
                              : item.username}
                          </Text>
                          <Text
                            style={[commonStyle.grayText14, commonStyle.mb1]}
                            numberOfLines={2}>
                            {item.ProMetas &&
                              item.ProMetas[0].address &&
                              item.ProMetas[0].address}
                          </Text>
                          {item.distance ? (
                            <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center'}}>
                              <MapPointer />
                              <Text style={[commonStyle.grayText14, {marginStart: 5, marginTop: 2}]} numberOfLines={1}>
                                {Number(item.distance).toFixed(2)}miles from you
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}
          {/* Popular in Nails FlatList End  */}

          {/* ALL SECTIONS EMPTY Start */}
          {allSectionEmpty ? (
            <View style={commonStyle.noMassegeWrap}>
              <Image
                style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                source={require('../assets/images/no-review.png')}
              />
              <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                No Professionals nearby
              </Text>
            </View>
          ) : (
            <></>
          )}
          {/* ALL SECTIONS EMPTY End */}
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  ...OnboardingStyles,
});

export default Explore;
