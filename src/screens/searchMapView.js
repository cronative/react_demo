import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import {Container} from 'native-base';
import {
  LeftArrowIos,
  LeftArrowAndroid,
  Location,
  LocationList,
  StarIcon,
  MapPointer,
  FilterIcon,
  FilterIconWhite,
  SortingIcon,
} from '../components/icons';
import {SearchFilterModal, SortByModal} from '../components/modal';
import commonStyle from '../assets/css/mainStyle';
import RNModal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import {
  professionalListingByCategoryRequest,
  professionalListingByCategoryClear,
} from '../store/actions/professionalListingByCategoryAction';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import GetLocation from 'react-native-get-location';
import moment from 'moment';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import {Left, Body, Right, List, ListItem} from 'native-base';
import ProfessionalCustomMarker from '../components/map/professionalCustomMarker';
import * as Constant from '../api/constant';
import {Get, Post} from '../api/apiAgent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import MyLocationMarker from '../components/map/myLocationMarker';

const {width: viewportWidth} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

//const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(85);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const {width, height} = Dimensions.get('window');

const SearchMapView = ({navigation, route}) => {
  const [isFilter, setIsFilter] = useState(false);
  const [mapToggle, setMapToggle] = useState(true);
  const [coordinates, setCoordinates] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [showingOpenNow, setShowingOpenNow] = useState(false);
  const [showingNearest, setShowingNearest] = useState(false);
  const [showingTopRated, setShowingTopRated] = useState(false);
  // const [scrollOffset, setScrollOffset] = useState()
  const [sort, setSort] = useState(null);
  const [typeOfService, setTypeOfService] = useState(null);
  const [isInPerson, setIsInPerson] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [date, setDate] = useState(null);
  const [logedInUserId, setLogedInUserId] = useState(null);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [topRatedFilter, setTopRatedFilter] = useState(false);
  const [localLoader, setLocalLoader] = useState(false);

  // check if filter option is selected
  const [isFilterOptionSelected, setIsFilterOptionSelected] = useState(false);

  const [isDatesInvalid, setIsDatesInvalid] = useState(false);

  // const [openNowFilter, setOpenNowFilter] = useState(false);
  const ASPECT_RATIO = width / height;
  const [latitude, setLatitude] = useState(26.58512);
  const [longitude, setLongitude] = useState(89.00968);
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [proListingViewModal, setProListingViewModal] = useState(true);
  const [region, setRegion] = useState({
    latitude: parseFloat(
      route?.params?.globalSearchPickedLocation?.latitude || latitude,
    ),
    longitude: parseFloat(
      route?.params?.globalSearchPickedLocation?.longitude || longitude,
    ),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [myLocation, setMyLocation] = useState(null);

  // const [coordinatePoint, setCoordinatePoint] = useState({
  //   latitude: parseFloat(latitude),
  //   longitude: parseFloat(longitude),
  // });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const ref = useRef(null);
  const [professionalDetails, setProfessionalDetails] = useState([]);
  const [initialPriceRange, setInitialPriceRange] = useState([0, 1500]);

  // Declare the dispatch variable
  const dispatch = useDispatch();

  // Get the current state
  const professionalsByCategoryData = useSelector(
    (state) => state.professionalListingByCategoryReducer.data,
  );
  const loderStatus = useSelector(
    (state) => state.professionalListingByCategoryReducer.loader,
  );

  const currentNavState = navigation.dangerouslyGetState().routes;

  //* Animation Items
  const searchListRef = useRef();
  const professionalCardRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    if (professionalsByCategoryData && professionalsByCategoryData.data) {
      let tempValues = [0, -0];
      console.log(
        '\n\nPrice Range Data: ',
        professionalsByCategoryData.data.initialMinValue,
        professionalsByCategoryData.data.minValue,
        professionalsByCategoryData.data.initialMaxValue,
        professionalsByCategoryData.data.maxValue,
        '\n\n',
      );
      if (
        parseInt(professionalsByCategoryData.data.initialMinValue) >
          parseInt(professionalsByCategoryData.data.minValue) ||
        parseInt(professionalsByCategoryData.data.initialMaxValue) <
          parseInt(professionalsByCategoryData.data.minValue)
      ) {
        tempValues[0] = parseInt(
          professionalsByCategoryData.data.initialMinValue,
        );
      } else {
        tempValues[0] = parseInt(professionalsByCategoryData.data.minValue);
      }

      if (
        parseInt(professionalsByCategoryData.data.initialMaxValue) <
          parseInt(professionalsByCategoryData.data.maxValue) ||
        parseInt(professionalsByCategoryData.data.initialMinValue) >
          parseInt(professionalsByCategoryData.data.maxValue)
      ) {
        tempValues[1] = parseInt(
          professionalsByCategoryData.data.initialMaxValue,
        );
      } else {
        tempValues[1] = parseInt(professionalsByCategoryData.data.maxValue);
      }

      setPriceRange(tempValues);
      setInitialPriceRange([
        parseInt(professionalsByCategoryData.data.initialMinValue),
        parseInt(professionalsByCategoryData.data.initialMaxValue),
      ]);

      if (
        professionalsByCategoryData &&
        professionalsByCategoryData.data &&
        professionalsByCategoryData.data.rows &&
        professionalsByCategoryData.data.rows.length
      ) {
        const modifyProfessionalData =
          professionalsByCategoryData.data.rows.map((eachItem, index) => {
            if (eachItem.distance !== null && eachItem.distance !== undefined) {
              eachItem.distance =
                Number(eachItem.distance).toFixed(2) + ' miles';
            } else {
              eachItem.distance = null;
            }
            if (eachItem.ProMetas && eachItem.ProMetas.length) {
              if (eachItem.ProMetas[0].coverImage) {
                eachItem.coverImage = eachItem.ProMetas[0].coverImage;
              } else {
                eachItem.coverImage = null;
              }
              eachItem.coordinate = {
                latitude: eachItem.ProMetas[0].latitude
                  ? parseFloat(eachItem.ProMetas[0].latitude)
                  : latitude,
                latitudeDelta: 0.015,
                longitude: eachItem.ProMetas[0].longitude
                  ? parseFloat(eachItem.ProMetas[0].longitude)
                  : longitude,
                longitudeDelta: 0.0121,
              };
            }
            return eachItem;
          });
        setProfessionalDetails(modifyProfessionalData);
        setLocalLoader((localLoader) => false);
      } else {
        setProfessionalDetails([]);
        setLocalLoader((localLoader) => false);
      }
    }
  }, [professionalsByCategoryData]);

  useEffect(() => {
    getLocation();
    return () => {
      dispatch(professionalListingByCategoryClear());
    };
  }, []);

  useEffect(() => {
    if (
      (coordinates && coordinates.latitude && coordinates.longitude) ||
      (route.params.globalSearchPickedLocation &&
        route.params.globalSearchPickedLocation.latitude &&
        route.params.globalSearchPickedLocation.longitude)
    ) {
      if (!isLocationReady) {
        refreshPage();
        setIsLocationReady(true);
      }
    } else {
      setIsLocationReady(false);
    }
  }, [
    coordinates,
    coordinates.latitude,
    coordinates.longitude,
    route.params.globalSearchPickedLocation,
  ]);

  // EXPERIMENT
  useEffect(() => {
    // console.log("LOCATION TEST. FROM GLOBAL:", route.params.globalSearchPickedLocation)
    // console.log("LOCATION TEST. FROM CURRENT:", coordinates)
    if (isLocationReady) {
      refreshPage();
    }
  }, [
    coordinates,
    isAll,
    isInPerson,
    isMobile,
    isVirtual,
    route.params.globalSearchPickedLocation,
    route.params.globalSearchSearchString,
    route.params.selectedCategory,
    showingTopRated,
    showingOpenNow,
    showingNearest,
    topRatedFilter,
  ]);

  useEffect(() => {
    // console.log("ALL: ", isAll)
    // console.log("IN PERSON:", isInPerson)
    // console.log("MOBILE:", isMobile)
    // console.log("VIRTUAL", isVirtual)
    // console.log("OPEN:", showingOpenNow)

    checkAllServiceTypeToggle();
  }, [isAll, isInPerson, isMobile, isVirtual, showingOpenNow]);

  useEffect(() => {
    console.log('SHOWING NEAREST:', showingNearest);
  }, [showingNearest]);
  // useEffect(() => {
  //   console.log("PRICE RANGE TEST:", priceRange)
  // }, [priceRange])

  useEffect(() => {
    if (date && date[0] !== null && date[1] === 'Invalid date') {
      setIsDatesInvalid(true);
    } else {
      setIsDatesInvalid(false);
    }
  }, [date]);

  useEffect(() => {
    if (!!mapRef?.current && !!region) {
      mapRef?.current.animateCamera({
        center: {
          latitude: region?.latitude,
          longitude: region?.longitude,
        },
        zoom: 12,
      });
    }
  }, [region]);

  const refreshPage = () => {
    let location = determineLocation();
    console.log('price data is ****', priceRange);
    let obj;
    if (priceRange[1] !== -0) {
      obj = {
        sort: sort,
        topRatedFilter: topRatedFilter,
        typeOfService: {
          isAll: isAll,
          isInPerson: isInPerson,
          isMobile: isMobile,
          isVirtual: isVirtual,
        },
        priceRange: priceRange,
        date: date,
        openNow: showingOpenNow,
        location: location,
      };
    } else {
      obj = {
        sort: sort,
        topRatedFilter: topRatedFilter,
        typeOfService: {
          isAll: isAll,
          isInPerson: isInPerson,
          isMobile: isMobile,
          isVirtual: isVirtual,
        },
        date: date,
        openNow: showingOpenNow,
        location: location,
      };
    }

    //Determine if search string or particular category
    if (route.params.globalSearchSearchString) {
      obj.searchString = route.params.globalSearchSearchString;
    } else if (route.params.selectedCategory) {
      obj.categoryId = route.params.selectedCategory;
    }

    setLocalLoader((localLoader) => true);
    dispatch(professionalListingByCategoryRequest(obj));
  };

  const myStyles = {
    tagsOutlineActive: {
      ...commonStyle.tagsOutline,
      backgroundColor: '#F36A46',
    },
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
            console.log('GRANTED PermissionsAndroid');
            getCurrentLocation();
          } else {
            // --
            console.log('error happened');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
  };

  const getCurrentLocation = () => {
    // setLoader(true);
    if (
      route.params.globalSearchPickedLocation &&
      route.params.globalSearchPickedLocation.latitude &&
      route.params.globalSearchPickedLocation.longitude
    ) {
      setCoordinates({
        latitude: route.params.globalSearchPickedLocation.latitude,
        longitude: route.params.globalSearchPickedLocation.longitude,
      });
      setLatitude(route.params.globalSearchPickedLocation.latitude);
      setLongitude(route.params.globalSearchPickedLocation.longitude);
      setRegion({
        latitude: route.params.globalSearchPickedLocation.latitude,
        longitude: route.params.globalSearchPickedLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          setMyLocation(location);
        })
        .catch((error) => {
          // setLoader(false);
          const {code, message} = error;
          console.warn(code, message);
        });
    } else {
      setLocalLoader((localLoader) => true);
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          setLocalLoader((localLoader) => false);
          console.log('COORDINATES=============================: ', location);
          // setLoader(false);
          // AsyncStorage.setItem('device_cordinets', JSON.stringify(location));
          setCoordinates(location);
          setLatitude(location.latitude);
          setLongitude(location.longitude);
          setMyLocation(location);
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        })
        .catch((error) => {
          setLocalLoader((localLoader) => false);
          // setLoader(false);
          const {code, message} = error;
          console.warn(code, message);
        });
    }
  };

  const determineLocation = () => {
    let location;
    //if location picked from Global search
    if (
      route.params.globalSearchPickedLocation &&
      route.params.globalSearchPickedLocation.latitude &&
      route.params.globalSearchPickedLocation.longitude
    ) {
      location = {
        latitude: route.params.globalSearchPickedLocation.latitude,
        longitude: route.params.globalSearchPickedLocation.longitude,
      };
    }
    //if location NOT picked from Global search (picking from this page)
    else if (coordinates && coordinates.latitude && coordinates.longitude) {
      location = coordinates;
    } else {
      location = {latitude: null, longitude: null};
    }
    return location;
  };

  const fetchTopRatedPros = () => {
    // setShowingTopRated(prevState => !prevState);
    setTopRatedFilter((prevState) => !prevState);
  };

  const fetchNearestPros = () => {
    // Set other params to null, add new nearest param -> old
    // sort:6 -> sort by distance
    if (showingNearest) {
      setShowingNearest(false);
      setSort(null);

      // refreshPage();
    } else {
      setShowingNearest(true);
      setSort(6);
      // let obj = {
      //   categoryId: route.params.selectedCategory,
      //   sort: 6,
      //   typeOfService: null,
      //   priceRange: null,
      //   date: null,
      //   nearest: true,
      //   location:
      //     coordinates && coordinates.latitude && coordinates.longitude
      //       ? coordinates
      //       : null,
      // };
      // dispatch(professionalListingByCategoryRequest(obj));
      // setTimeout(() => professionalListingByCategoryClear(), 10000);
    }
  };

  //SET CURRENT OPEN FLAG
  const fetchCurrentlyOpen = () => {
    setShowingOpenNow((prevState) => !prevState);
  };

  // SET TYPE OF SORTING
  const setTypeOfServiceFilter = (value) => {
    setTypeOfService(value);
  };

  // SET PRICE RANGE
  const setPriceRangeFilter = (values) => {
    setPriceRange(values);
  };

  // SET DATE RANGE
  const setDateFilter = (value) => {
    if (value) {
      const formatted_dates = value.map((date) =>
        moment(date).format('YYYY-MM-DD'),
      );
      setDate(formatted_dates);
    } else {
      setDate(null);
    }
  };

  // call applied
  const callApplied = () => {
    if (isLocationReady) {
      refreshPage();
    }
  };
  /**
   * This method will call on Map show hide.
   */
  const mapViewToggle = () => {
    if (!!professionalCardRef?.current) {
      professionalCardRef?.current?.transition({opacity: 1}, {opacity: 0}, 300);
      setTimeout(() => {
        setSelectedIndex(null);
      });
    }

    if (!!mapToggle && !!searchListRef?.current) {
      searchListRef.current.transition(
        {top: -height + 155},
        {top: Platform.OS === 'ios' ? -100 : -100},
        500,
      );
    } else if (!!searchListRef?.current) {
      searchListRef.current.transition({top: height - 155}, {top: 90}, 500);
    }

    if (!!mapToggle && !!mapRef?.current) {
      mapRef?.current?.animateCamera({
        zoom: 12,
      });
    } else if (!!mapRef?.current) {
      mapRef?.current?.animateCamera({
        zoom: 12.3,
      });
    }
    setMapToggle(!mapToggle);
  };
  /**
   * =======================.
   */

  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  /**
   * =======================.
   */

  //Removes duplicate Category Names
  const returnUniqueCategories = (arr) => {
    const cat_names = arr.map((item) => item.categoryName);
    const unique_cats = [...new Set(cat_names)];
    return unique_cats;
  };

  const checkAllServiceTypeToggle = () => {
    if (isInPerson === true && isMobile === true && isVirtual === true) {
      setIsAll(true);
      setIsInPerson(false);
      setIsMobile(false);
      setIsVirtual(false);
    } else if (
      (isInPerson === true || isMobile === true || isVirtual === true) &&
      isAll === true
    ) {
      setIsAll(false);
    } else if (isAll === true) {
      setIsInPerson(false);
      setIsMobile(false);
      setIsVirtual(false);
    }
  };

  const closeModal = () => {
    setVisibleModal({visibleModal: null});
  };

  // const handleOnScroll = (event) => {
  //   setScrollOffset(event.nativeEvent.contentOffset.y);
  // };

  // const handleScrollTo = (p) => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollTo(p);
  //   }
  // };

  const renderItem = ({item, index}) => {
    return (
      <Animatable.View
        animation={'fadeIn'}
        duration={800}
        useNativeDriver
        style={{
          backgroundColor: 'rgba(0,0,0,0)',
          borderRadius: 12,
          width: '100%',
        }}
        key={index}>
        <List
          style={[
            commonStyle.propertiesList,
            {marginLeft: 0, marginRight: 0, marginBottom: 0, borderRadius: 12},
          ]}>
          <ListItem thumbnail style={commonStyle.propertiesListitem}>
            <TouchableOpacity
              style={commonStyle.propertiestouch}
              onPress={() => {
                navigation.navigate('ProfessionalPublicProfile', {
                  proId: item.id,
                  doubleBack: false,
                  singleBack: true,
                });
              }}>
              <Left style={commonStyle.propertiesLeft}>
                <Image
                  // defaultSource={require('../assets/images/default-new.png')}
                  source={
                    item.profileImage
                      ? {
                          uri: item.profileImage,
                        }
                      : require('../assets/images/default-new.png')
                  }
                  style={commonStyle.propertylisting}
                />

                {/* {this.props.PageName == 'Property_sale' ? (
                  <Button style={commonStyle.propertiesactive}>
                    <Text style={commonStyle.propertiesbtntext}>
                      Active Sale
                    </Text>
                  </Button>
                ) : (
                  <Button style={commonStyle.propertiesactive}>
                    <Text style={commonStyle.propertiesbtntext}>
                      Closed Sale
                    </Text>
                  </Button>
                )} */}
              </Left>
              <Body style={commonStyle.propertiesBody}>
                <View>
                  <Text
                    style={[commonStyle.propertiestext1, {marginBottom: 6}]}
                    numberOfLines={1}>
                    {item.ProMetas &&
                      item.ProMetas.length &&
                      item.ProMetas[0].businessName}
                  </Text>
                  <Text
                    style={[commonStyle.propertiestext2, {marginBottom: 2}]}
                    numberOfLines={2}>
                    {item.ProMetas &&
                      item.ProMetas.length &&
                      item.ProMetas[0].address}
                  </Text>
                  {/* <Text style={commonStyle.propertiestext2} numberOfLines={2}>
                    {item.ProMetas &&
                      item.ProMetas.length &&
                      item.ProMetas[0].city}
                    ,{' '}
                    {item.ProMetas &&
                      item.ProMetas.length &&
                      item.ProMetas[0].country}
                  </Text> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    marginTop: 6,
                  }}>
                  <Text
                    style={[commonStyle.propertiestext3, {marginRight: 15}]}>
                    <StarIcon />{' '}
                    {item.ratings ? Number(item.ratings).toFixed(1) : 'N/A'}
                  </Text>
                  <Text style={commonStyle.propertiestext4}>
                    <MapPointer /> {item.distance || 'NA'}
                  </Text>
                </View>
              </Body>
            </TouchableOpacity>
            {/* <TouchableHighlight style={commonStyle.propertiesRight}>
              <Text style={commonStyle.grayText14}>
                <MapPointer />
                {item.distance ? `${item.distance}` : 'NA'}
              </Text>
            </TouchableHighlight> */}
          </ListItem>
        </List>
      </Animatable.View>
    );
  };

  const onPressMarker = (marker, markerIndex, markerCoordinate) => {
    if (selectedIndex == markerIndex) {
      if (!!professionalCardRef?.current) {
        professionalCardRef?.current?.transition(
          {opacity: 1},
          {opacity: 0},
          300,
        );
        setTimeout(() => {
          setSelectedIndex(null);
        });
      }
      return;
    }
    console.log('marker= ', marker);
    console.log('markerIndex= ', markerIndex);
    console.log('markerCoords= ', markerCoordinate);
    setRegion({
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude,
      latitudeDelta: markerCoordinate.latitudeDelta,
      longitudeDelta: markerCoordinate.longitudeDelta,
    });
    setSelectedIndex(markerIndex);
  };

  const navigateToPrevPage = () => {
    let result = currentNavState.find((item) => item.name === 'GlobalSearch');
    dispatch(professionalListingByCategoryClear());
    if (result) {
      navigation.goBack();
    } else {
      navigation.navigate('GlobalSearch');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {localLoader && !isLocationReady ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.searchMapWrap}>
          <View style={commonStyle.searchBarPosions}>
            <View style={commonStyle.searchBarView}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigateToPrevPage()}
                style={commonStyle.searchBarText}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.preventDefault();
                    navigation.goBack();
                  }}
                  style={commonStyle.haederback}>
                  {Platform.OS === 'ios' ? (
                    <LeftArrowIos />
                  ) : (
                    <LeftArrowAndroid />
                  )}
                </TouchableOpacity>
                <Text numberOfLines={1} style={[commonStyle.texttimeblack]}>
                  {route.params.selectedCategoryName}
                </Text>
                <Text style={commonStyle.dotSmall}>.</Text>
                <Text
                  style={[commonStyle.grayText14, {width: '40%'}]}
                  numberOfLines={1}>
                  {route.params.globalSearchPickedLocationString &&
                  route.params.globalSearchPickedLocationString !== ''
                    ? route.params.globalSearchPickedLocationString
                    : 'Current Location'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{width: 20, overflow: 'hidden', alignItems: 'flex-end'}}
                onPress={() => mapViewToggle()}>
                {mapToggle ? <Location /> : <LocationList />}
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View>
              <MapView
                ref={(current) => (mapRef.current = current)}
                style={[commonStyle.dammymapbg, {}]}
                initialRegion={region}
                provider={PROVIDER_GOOGLE}
                mapType="standard"
                // mapType={Platform.OS == "android" ? "none" : "standard"}
                zoomEnabled={true}
                minZoomLevel={10}
                rotateEnabled={false}
                showsCompass={false}
                moveOnMarkerPress={false}
                showsUserLocation={false}
                customMapStyle={[
                  {
                    featureType: 'all',
                    elementType: 'geometry.fill',
                    stylers: [
                      {
                        weight: '2.00',
                      },
                    ],
                  },
                  {
                    featureType: 'all',
                    elementType: 'geometry.stroke',
                    stylers: [
                      {
                        color: '#9c9c9c',
                      },
                    ],
                  },
                  {
                    featureType: 'all',
                    elementType: 'labels.text',
                    stylers: [
                      {
                        visibility: 'on',
                      },
                    ],
                  },
                  {
                    featureType: 'landscape',
                    elementType: 'all',
                    stylers: [
                      {
                        color: '#f2f2f2',
                      },
                    ],
                  },
                  {
                    featureType: 'landscape',
                    elementType: 'geometry.fill',
                    stylers: [
                      {
                        color: '#e8e9ff',
                      },
                    ],
                  },
                  {
                    featureType: 'landscape.man_made',
                    elementType: 'geometry.fill',
                    stylers: [
                      {
                        color: '#e8e9ff',
                      },
                    ],
                  },
                  {
                    featureType: 'poi',
                    elementType: 'all',
                    stylers: [
                      {
                        visibility: 'off',
                      },
                    ],
                  },
                  {
                    featureType: 'road',
                    elementType: 'all',
                    stylers: [
                      {
                        saturation: -100,
                      },
                      {
                        lightness: 45,
                      },
                    ],
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry.fill',
                    stylers: [
                      {
                        color: '#ffffff',
                      },
                    ],
                  },
                  {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [
                      {
                        color: '#7b7b7b',
                      },
                    ],
                  },
                  {
                    featureType: 'road',
                    elementType: 'labels.text.stroke',
                    stylers: [
                      {
                        color: '#ffffff',
                      },
                    ],
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'all',
                    stylers: [
                      {
                        visibility: 'simplified',
                      },
                    ],
                  },
                  {
                    featureType: 'road.arterial',
                    elementType: 'labels.icon',
                    stylers: [
                      {
                        visibility: 'off',
                      },
                    ],
                  },
                  {
                    featureType: 'transit',
                    elementType: 'all',
                    stylers: [
                      {
                        visibility: 'off',
                      },
                    ],
                  },
                  {
                    featureType: 'water',
                    elementType: 'all',
                    stylers: [
                      {
                        color: '#cccffc',
                      },
                      {
                        visibility: 'on',
                      },
                    ],
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [
                      {
                        color: '#cccffc',
                      },
                    ],
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                      {
                        color: '#070707',
                      },
                    ],
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [
                      {
                        color: '#ffffff',
                      },
                    ],
                  },
                ]}>
                {professionalDetails.map((marker, index) => {
                  return (
                    <Marker
                      key={index}
                      coordinate={marker.coordinate}
                      onPress={() => {
                        onPressMarker(marker, index, marker.coordinate);
                      }}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ProfessionalCustomMarker
                          activeMarker={selectedIndex === index}
                        />
                      </View>
                    </Marker>
                  );
                })}
                {!!myLocation && (
                  <Marker coordinate={myLocation}>
                    <View
                      style={{
                        height: 70,
                        width: 70,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MyLocationMarker />
                    </View>
                  </Marker>
                )}
              </MapView>
            </View>

            {selectedIndex != null ? (
              <Animatable.View
                ref={professionalCardRef}
                useNativeDriver
                style={{
                  bottom: 30,
                  zIndex: 1000,
                  position: 'absolute',
                }}>
                <Carousel
                  ref={ref}
                  data={professionalDetails}
                  renderItem={renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  inactiveSlideScale={0.95}
                  firstItem={selectedIndex} //need to replace with selected index
                  inactiveSlideOpacity={1}
                  onSnapToItem={(e) => {
                    if (!!professionalDetails[e]) {
                      onPressMarker(
                        professionalDetails[e],
                        e,
                        professionalDetails[e].coordinate,
                      );
                    }
                  }}
                  // contentContainerCustomStyle={styles.sliderContentContainer}
                />
              </Animatable.View>
            ) : null}
            {selectedIndex == null && (
              <Animatable.View
                animation={
                  mapToggle
                    ? {
                        0: {
                          top: height,
                        },
                        1: {
                          top: 90,
                        },
                      }
                    : {
                        0: {
                          top: 0,
                        },
                        1: {
                          top: Platform.OS === 'ios' ? -100 : -100,
                        },
                      }
                }
                duration={500}
                ref={searchListRef}
                style={[
                  mapToggle
                    ? commonStyle.searchMapContent
                    : commonStyle.searchListMapContent,
                  // {backgroundColor: '#ff0'},
                ]}>
                <View style={commonStyle.mapFilterbg}>
                  <TouchableOpacity
                    style={[
                      commonStyle.termswrap,
                      commonStyle.mt2,
                      {height: 15},
                    ]}
                    onPress={() => mapViewToggle()}
                    onLongPress={() => mapViewToggle()}>
                    <Text
                      style={{
                        backgroundColor: '#ECEDEE',
                        width: 75,
                        height: 4,
                        borderRadius: 2,
                      }}></Text>
                  </TouchableOpacity>

                  <View style={commonStyle.filterAreaWrap}>
                    {isFilter ? (
                      <TouchableOpacity
                        style={[commonStyle.tagsOutline, commonStyle.bgorange]}>
                        <Text
                          style={[
                            commonStyle.filterBlackText,
                            commonStyle.textWhite,
                          ]}>
                          <FilterIconWhite /> Filters
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={commonStyle.tagsOutline}
                        onPress={() => {
                          setVisibleModal('FilterDialog');
                          if (isDatesInvalid) {
                            setDateFilter(null);
                          }
                        }}>
                        <Text style={commonStyle.filterBlackText}>
                          <FilterIcon /> Filters
                        </Text>
                      </TouchableOpacity>
                    )}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={commonStyle.scrollCss}>
                      <View style={commonStyle.sortAreaWrap}>
                        <TouchableOpacity
                          style={commonStyle.tagsOutline}
                          onPress={() => {
                            setVisibleModal('SortByDialog');
                          }}>
                          <Text style={commonStyle.categorytagsText}>
                            Sort by <SortingIcon />
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            showingOpenNow
                              ? myStyles.tagsOutlineActive
                              : commonStyle.tagsOutline
                          }
                          onPress={() => fetchCurrentlyOpen()}>
                          <Text
                            style={
                              showingOpenNow
                                ? commonStyle.categorytagswhiteText
                                : commonStyle.categorytagsText
                            }>
                            Open now
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            showingNearest
                              ? myStyles.tagsOutlineActive
                              : commonStyle.tagsOutline
                          }>
                          <Text
                            style={
                              showingNearest
                                ? commonStyle.categorytagswhiteText
                                : commonStyle.categorytagsText
                            }
                            onPress={() => fetchNearestPros()}>
                            Nearest
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            // showingTopRated
                            topRatedFilter
                              ? myStyles.tagsOutlineActive
                              : commonStyle.tagsOutline
                          }
                          onPress={() => fetchTopRatedPros()}>
                          {/* onPress={() => setTopRatedFilter(prevState => !prevState)}> */}
                          <Text
                            style={
                              topRatedFilter
                                ? commonStyle.categorytagswhiteText
                                : commonStyle.categorytagsText
                            }>
                            Top-rated
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </View>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  onScroll={handleOnScroll}>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingBottom: 20,
                      backgroundColor: '#fff',
                    }}>
                    {/* {localLoader && <ActivityLoader />} */}
                    {professionalDetails &&
                      !localLoader &&
                      professionalDetails.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.8}
                          onPress={() => {
                            // mapViewToggle();
                            navigation.navigate('ProfessionalPublicProfile', {
                              proId: item.id,
                              doubleBack: false,
                              singleBack: true,
                            });
                          }}>
                          <View style={commonStyle.ListViewCard}>
                            <Image
                              // defaultSource={require('../assets/images/default-new.png')}
                              source={
                                item.ProResources &&
                                item.ProResources[0] &&
                                item.ProResources[0].url
                                  ? {
                                      uri: item.ProResources[0].url,
                                    }
                                  : require('../assets/images/default-new.png')
                              }
                              // source={
                              //   item.coverImage
                              //     ? {
                              //         uri: item.coverImage,
                              //       }
                              //     : require('../assets/images/default-new.png')
                              // }
                              style={commonStyle.ListViewCardImg}
                            />
                            <View style={commonStyle.featuredCardContent}>
                              <View style={commonStyle.featuredCardRatingRow}>
                                <View style={commonStyle.featuredUserImgWrap}>
                                  <Image
                                    style={commonStyle.featuredUserImg}
                                    // defaultSource={require('../assets/images/default-user.png')}
                                    source={
                                      item.profileImage
                                        ? {
                                            uri: item.profileImage,
                                          }
                                        : require('../assets/images/default-user.png')
                                    }
                                  />
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
                                      : 'N/A'}
                                  </Text>
                                </TouchableHighlight>
                              </View>
                              {/* <View style={commonStyle.featuredCardText}>
                     <Text
                       style={[
                         commonStyle.subtextblack,
                         commonStyle.mb05,
                       ]}>
                       {item.businessName}
                     </Text>
                   </TouchableHighlight>
                 </View> */}
                              <View style={commonStyle.featuredCardText}>
                                <Text
                                  style={[
                                    commonStyle.subtextblack,
                                    commonStyle.mb05,
                                  ]}>
                                  {item.ProMetas &&
                                    item.ProMetas[0] &&
                                    item.ProMetas[0].businessName}
                                </Text>

                                <View style={commonStyle.categorytagsWrap}>
                                  {item.allProCategories?.rows &&
                                    item.allProCategories.rows.length > 0 &&
                                    returnUniqueCategories(
                                      item.allProCategories.rows,
                                    ).map((cat, ind) => (
                                      <TouchableHighlight
                                        key={ind}
                                        style={commonStyle.tagsOutline}>
                                        <Text
                                          style={commonStyle.categorytagsText}>
                                          {cat}
                                        </Text>
                                      </TouchableHighlight>
                                    ))}
                                </View>

                                <Text
                                  style={[
                                    commonStyle.grayText16,
                                    commonStyle.mb1,
                                  ]}>
                                  {item.ProMetas.length > 0 &&
                                  item.ProMetas[0].address
                                    ? item.ProMetas[0].address
                                    : null}
                                </Text>
                                <TouchableHighlight>
                                  <Text style={commonStyle.grayText14}>
                                    {' '}
                                    <MapPointer />{' '}
                                    {item.distance
                                      ? `${item.distance} from you`
                                      : 'No Distance info'}
                                  </Text>
                                </TouchableHighlight>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    {!localLoader && professionalDetails?.length == 0 ? (
                      // <ActivityLoader />
                      <View style={commonStyle.noMassegeWrap}>
                        <Image
                          style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                          source={require('../assets/images/no-review.png')}
                        />
                        <Text
                          style={[
                            commonStyle.grayText16,
                            commonStyle.textCenter,
                          ]}>
                          No Professionals to Show
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </ScrollView>
              </Animatable.View>
            )}
          </ScrollView>
          {/* </RNModal> */}

          {/* </KeyboardAwareScrollView> */}
        </View>
      </Container>

      {/* Filter modal start */}
      <Modal
        isVisible={visibleModal === 'FilterDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <SearchFilterModal
              isInPerson={isInPerson}
              setIsInPerson={setIsInPerson}
              isMobile={isMobile}
              setIsMobile={setIsMobile}
              isVirtual={isVirtual}
              setIsVirtual={setIsVirtual}
              isAll={isAll}
              setIsAll={setIsAll}
              priceRange={priceRange}
              initialPriceRange={initialPriceRange}
              date={date}
              setTypeOfServiceFilter={setTypeOfServiceFilter}
              setPriceRangeFilter={setPriceRangeFilter}
              setDateFilter={setDateFilter}
              refreshPage={refreshPage}
              isFilterOptionSelected={isFilterOptionSelected}
              setIsFilterOptionSelected={setIsFilterOptionSelected}
              closeModal={closeModal}
              checkAllServiceTypeToggle={checkAllServiceTypeToggle}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              // disabled={date && date[0] !== null && date[1] === "Invalid date"}
              disabled={isDatesInvalid}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal({visibleModal: null});
                callApplied();
                // refreshPage();
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Filter modal end */}

      {/* Sort By modal start */}
      <Modal
        isVisible={visibleModal === 'SortByDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <SortByModal sort={sort} setSort={setSort} />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal({visibleModal: null});
                callApplied();
                // refreshPage();
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Sort By modal end */}
    </Fragment>
  );
};

export default SearchMapView;
