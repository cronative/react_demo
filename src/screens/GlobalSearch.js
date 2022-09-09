import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  Text,
  StyleSheet,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, Header, List, ListItem, Left, Body} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {
  SearchIcon,
  SendIconOrange,
  CloseIcon,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../components/icons';
import GooglePlacesInput from '../components/GooglePlacesInput';
import commonStyle from '../assets/css/mainStyle';
import {Get, Post} from '../api/apiAgent';
import GetLocation from 'react-native-get-location';
import Geolocation from '@react-native-community/geolocation';
import {ScrollView} from 'react-native-gesture-handler';

navigator.geolocation = require('@react-native-community/geolocation');

const GlobalSearch = ({route}) => {
  const navigation = useNavigation();

  let timer;
  const [search, setSearch] = useState('');
  const [recentCategories, setRecentCategories] = useState([]);
  const [recentPros, setRecentPros] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [pickedLocationString, setPickedLocationString] = useState('');
  const [placeInputRef, setInputRef] = useState(false);
  const [listVisible, setListVisible] = useState(true);
  const [searchValues, setSearchValues] = useState([]);

  useEffect(() => {
    fetchRecentlyViewedCategories();
    fetchRecentlyViewedPros();

    // checkIfLocationisEnabled()
  }, []);

  useEffect(() => {
    console.log(latitude, longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    // if (dispatch) dispatch({ type: 'SET_BOOKING_EDIT', payload: false });

    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!!route?.params?.fromBookings) {
          navigation.navigate('Explore');
          setTimeout(() => {
            navigation.navigate('Bookings');
          }, 10);
        } else {
          navigation.goBack();
        }
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, []);

  const fetchRecentlyViewedCategories = () => {
    // RECENTLY VIEWD CATEGORIES NEED TO BE USED. IF THAT DOESNT EXITS (i.e. new user), USE POPULAR CATEGORIES>
    Get('/user/recentlyViewCategories')
      .then((response) => {
        console.log(response);
        if (!!response?.data && response?.data?.length > 0) {
          setRecentCategories(response.data.slice(0, 6));
        } else {
          Get('/user/list-categories?page=1&records=10&isPopular=1')
            .then((response) => {
              if (!!response?.data?.rows && response?.data?.rows?.length > 0) {
                setRecentCategories(response.data.rows.slice(0, 6));
              } else {
                setRecentCategories(response.data.rows);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        Get('/user/list-categories?page=1&records=10&isPopular=1')
          .then((response) => {
            if (!!response?.data?.rows && response?.data?.rows?.length > 0) {
              setRecentCategories(response.data.rows.slice(0, 6));
            } else {
              setRecentCategories(response.data.rows);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
  };

  const fetchRecentlyViewedPros = () => {
    Get('/user/recently-viewed')
      .then((resp) => {
        if (resp.data.rows.length === 0) {
          Get('/user/list-featured-professionals').then((response) => {
            console.log(
              'RECENTLY VIEWED PROS EMPTY. USING FEATURED PROS INSTEAD: ',
              response,
            );
            if (!!response?.data?.rows && response?.data?.rows?.length > 0) {
              setRecentPros(response.data.rows.slice(0, 4));
            } else {
              setRecentPros(response.data.rows);
            }
          });
        } else {
          if (!!resp?.data?.rows && resp?.data?.rows?.length > 0) {
            setRecentPros(
              resp.data.rows.slice(0, 4).map((item) => item.professionals),
            );
          } else {
            setRecentPros(resp.data.rows.map((item) => item.professionals));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!!search) {
      timer = setTimeout(() => {
        onManuallyTextSearch();
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [search]);

  const onManuallyTextSearch = () => {
    Get(`/user/list-categories?page=1&records=10&search=${search}`)
      .then((response) => {
        setSearchValues(response.data.rows);
      })
      .catch((error) => {});
  };

  const onRecentCategorySelectionPress = (selectedCategory) => {
    setSearch(
      !!selectedCategory.categoryName
        ? selectedCategory.categoryName
        : selectedCategory.name,
    );

    Post('/user/recentlyViewCategories', {
      categoryId: !!selectedCategory.categoryId
        ? selectedCategory.categoryId
        : selectedCategory.id,
    })
      .then((response) => {})
      .catch((error) => {});

    navigation.navigate('SearchMapView', {
      selectedCategory: !!selectedCategory.categoryId
        ? selectedCategory.categoryId
        : selectedCategory.id,
      selectedCategoryName: !!selectedCategory.categoryName
        ? selectedCategory.categoryName
        : selectedCategory.name,
      globalSearchPickedLocation: {
        latitude: latitude,
        longitude: longitude,
      },
      globalSearchPickedLocationString: pickedLocationString,
    });
  };

  const onRecentProSelectionPress = (selectedPro) => {
    if (
      selectedPro.ProMetas &&
      selectedPro.ProMetas[0] &&
      selectedPro.ProMetas[0].businessName
    ) {
      setSearch(selectedPro.ProMetas[0].businessName);
    }
    navigation.push('ProfessionalPublicProfile', {
      proId: selectedPro.id,
      singleBack: true,
      doubleBack: false,
    });
  };

  const executeSearch = () => {
    //* Chidi & Mow list issue no 653 - search can be done only with location
    // if (search && search !== '') {
    navigation.navigate('SearchMapView', {
      globalSearchSearchString: !!search ? search : '',
      selectedCategoryName: !!search ? search : '',
      globalSearchPickedLocation: {
        latitude: latitude,
        longitude: longitude,
      },
      globalSearchPickedLocationString: pickedLocationString,
    });
    // }
  };

  const fetchLocationDetailsHandler = (data, details) => {
    setLatitude(details.geometry.location.lat);
    setLongitude(details.geometry.location.lng);
    setPickedLocationString(data.description);

    setListVisible(true);
  };

  const makeRecentCategoryListItem = ({item}) => {
    return (
      // Flat List Item
      <TouchableOpacity
        style={[
          commonStyle.geolocationlist,
          {flexDirection: 'row', alignItems: 'center'},
        ]}
        onPress={() => onRecentCategorySelectionPress(item)}
        activeOpacity={0.3}>
        <SearchIcon />
        <Text
          style={[
            commonStyle.grayText16,
            commonStyle.textCapitalize,
            {marginLeft: '2%'},
          ]}>
          {!!item.categoryName ? item.categoryName : item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const makeRecentProsListItem = ({item}) => {
    return (
      // Flat List Item
      <List style={[commonStyle.categoriseList]}>
        <ListItem thumbnail style={commonStyle.categoriseListItem}>
          <TouchableOpacity
            style={commonStyle.serviceListtouch}
            onPress={() => onRecentProSelectionPress(item)}
            activeOpacity={0.5}>
            <Left style={{alignSelf: 'flex-start'}}>
              <Image
                // defaultSource={require('../assets/images/default-user.png')}
                source={
                  item && item.profileImage
                    ? {
                        uri: item.profileImage,
                      }
                    : require('../assets/images/default-user.png')
                }
                style={commonStyle.globalsearchlistimg}
              />
            </Left>
            <Body
              style={[
                commonStyle.categoriseListBody,
                {alignSelf: 'flex-start', marginLeft: 15},
              ]}>
              <Text
                style={[commonStyle.blackText16, commonStyle.textCapitalize]}>
                {/* {item.ProMetas && item.ProMetas[0]?.ProMetas[0].businessName? ProMetas[0].businessName : '-' } */}
                {item &&
                item.ProMetas &&
                item.ProMetas[0] &&
                item.ProMetas[0].businessName
                  ? item.ProMetas[0].businessName
                  : 'N/A'}
              </Text>
              <Text style={commonStyle.grayText14}>
                {item &&
                item.ProMetas &&
                item.ProMetas[0] &&
                item.ProMetas[0].address
                  ? item.ProMetas[0].address
                  : 'N/A'}
              </Text>
            </Body>
          </TouchableOpacity>
        </ListItem>
      </List>
    );
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        <View transparent style={{height: 140}}>
          <SearchBar
            searchIcon={{display: 'none'}}
            onChangeText={(text) => setSearch(text)}
            onClear={(text) => setSearch('')}
            value={search}
            autoFocus={true}
            placeholder="Service, Professionals"
            placeholderTextColor={'#939DAA'}
            // clearIcon={<SearchIcon/>}
            containerStyle={{
              backgroundColor: '#fff',
              borderBottomWidth: 0,
              borderTopWidth: 0,
              width: '100%',
              paddingTop: 10,
              paddingLeft: 20,
              paddingRight: 20,
            }}
            inputStyle={{
              backgroundColor: '#fff',
              color: '#110F17',
              fontFamily: 'SofiaPro',
            }}
            inputContainerStyle={{
              paddingRight: 28,
              paddingLeft: 20,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderColor: '#110F17',
              height: 52,
            }}
            style={{
              fontSize: 14,
              fontFamily: 'SofiaPro',
              backgroundColor: '#fff',
            }}
          />
          <View style={{position: 'absolute', right: 28, top: 20}}>
            <TouchableOpacity
              style={commonStyle.globalsearchIcon}
              onPress={() => executeSearch()}>
              <SearchIcon />
            </TouchableOpacity>
          </View>
          <View style={commonStyle.searchback}>
            <TouchableOpacity
              style={commonStyle.haederback}
              onPress={() => {
                if (!!route?.params?.fromBookings) {
                  navigation.navigate('Explore');
                  setTimeout(() => {
                    navigation.navigate('Bookings');
                  }, 10);
                } else {
                  navigation.goBack();
                }
              }}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <View>
            <GooglePlacesInput
              setListVisible={setListVisible}
              fetchLocationDetailsHandler={fetchLocationDetailsHandler}
            />
            <View style={{position: 'absolute', right: 28, top: 22}}>
              <TouchableOpacity
                style={commonStyle.globalsearchIcon}
                onPress={() => executeSearch()}>
                <SearchIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <View style={commonStyle.horizontalPadd}>
          <TouchableOpacity
          disabled={latitude && longitude}
          onPress={() => onCurrentLocationPress()} 
          style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderBottomWidth: 1, borderWidth: 1, borderColor:'#dcdcdc', paddingLeft: 16, paddingRight: 20, height: 45}}>
            <SendIconOrange/>
            <Text style={[commonStyle.textorange14, {marginLeft: 10}]}>Current Location</Text>
          </TouchableOpacity>
        </View> */}

        {/* <KeyboardAwareScrollView> */}
        {listVisible && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                commonStyle.geolocationlistwrap,
                {paddingBottom: 0, paddingTop: 0},
              ]}>
              <FlatList
                vertical
                data={search === '' ? recentCategories : searchValues}
                keyExtractor={(item, index) => index.toString()}
                renderItem={makeRecentCategoryListItem}
              />
              <View style={[commonStyle.dividerlinefull, {marginTop: 15}]} />
            </View>

            <View style={commonStyle.geolocationlistwrap}>
              <FlatList
                vertical
                data={recentPros}
                keyExtractor={(item, index) => index.toString()}
                renderItem={makeRecentProsListItem}
              />
            </View>
          </ScrollView>
        )}
        {/* </KeyboardAwareScrollView> */}
      </Container>
    </Fragment>
  );
};

export default GlobalSearch;
