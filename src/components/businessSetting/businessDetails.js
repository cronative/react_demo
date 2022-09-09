import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  TouchableHighlight,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import circleWarningImg from '../../assets/images/warning.png';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import { Container, Footer, List, ListItem, Body, Left } from 'native-base';
import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
  UncheckedBox,
  CheckedBox,
  DownArrow,
} from '../icons';
import commonStyle from '../../assets/css/mainStyle';
import { AreaSelectModal } from '../modal';
import Geocoder from 'react-native-geocoding';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import EventEmitter from 'react-native-eventemitter';

const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../commonservices/toast';
import { Get, Post, Put } from '../../api/apiAgent';
import { AreaCoverData } from '../../utility/staticData';

import GetLocation from 'react-native-get-location';
import { GOOGLE_API_KEY } from '../../utility/commonStaticValues';
import { DECIMAL_REGX_AMOUNT } from '../../utility/commonRegex';
import { useSelector, useDispatch } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Pulse from 'react-native-pulse';
import { setupProgressionUpdate } from '../../store/actions';
import { useFocusEffect } from '@react-navigation/native';

const CustomMarker = () => (
  <View style={commonStyle.mapMarkerPulse}>
    <Image
      style={{
        resizeMode: 'contain',
        width: 70,
        height: 70,
      }}
      source={require('../../assets/images/map/currentLocation.png')}
    />
  </View>
);

const BusinessDetails = ({
  isUpdate,
  setLoader,
  setLocationLoader,
  redirectUrlHandler,
  progressionData,
}) => {
  Geocoder.init(GOOGLE_API_KEY);
  const navigation = useNavigation();
  const [businessNameType, setBusinessNameType] = useState(null);
  const [userName, setUserName] = useState('');

  const [isBusinessNameFocus, setIsBusinessNameFocus] = useState(false);
  const [businessName, setBusinessName] = useState('');

  const [iscurrentLocationChecked, setIscurrentLocationChecked] =
    useState(false);

  const [businessAddress, setBusinessAddress] = useState('');

  const [isamountFocus, setIsamountFocus] = useState(false);
  const [amount, setAmount] = useState('');

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [errorAlert, setErrorAlert] = useState('');

  const [mileageCoverOriginal, setMileageCoverOriginal] = useState(null);
  const [mileageCoverTemp, setTempMileageCoverTemp] = useState(null);
  const [mileageAreaName, setMileageAreaName] = useState();
  const [isUpdatedData, setIsUpdatedData] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(true);

  const [services, setServices] = useState(null);

  const ASPECT_RATIO = width / height;
  const [latitide, setLatitude] = useState(40.713051);
  const [longitude, setLongitude] = useState(-74.007233);
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const dispatch = useDispatch();

  //   navigationValueDetails

  const [region, setRegion] = useState({
    latitude: parseFloat(latitide),
    longitude: parseFloat(longitude),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [coordinatePoint, setCoordinatePoint] = useState({
    latitude: parseFloat(latitide),
    longitude: parseFloat(longitude),
  });

  const [typeofServicItems, setTypeofServicItems] = useState([
    {
      typeofServiceName: 'In-person',
      isChecked: false,
      disabled: false,
    },
    {
      typeofServiceName: 'Mobile',
      isChecked: false,
      disabled: false,
    },
    {
      typeofServiceName: 'Virtual',
      isChecked: false,
      disabled: !isUpdate,
    },
  ]);
  const [isProSubscription, setIsProSubscription] = useState(false);
  // const [onMapLayout, setOnMapLayout] = useState(false);

  const locationDetails = useSelector(
    (state) => state.navigationValueDetails.locationDetails,
  );

  useEffect(() => {
    if (!!errorAlert) {
      setTimeout(() => {
        setErrorAlert(null);
      }, 3000);
    }
  }, [errorAlert]);

  // useFocusEffect(useCallback(() => verifyAccess, []));

  const verifyAccess = () => {
    // setIsLoadingVerify(true);
    setLoader(true);
    Get('/pro/subcription-plan')
      .then((response) => {
        // isExpire = 2 => Grace period ,  == 1 => total expired , == 0 => not expired
        console.log('subs response ***^^^***', response);
        setLoader(false);
        if (response.data.type === 1) {
          // hide graph
          console.log('check 1');
          setIsProSubscription(false);
        } else if (response.data.type === 2 && response.data.isExpire == 0) {
          setIsProSubscription(true);
        } else {
          if (response.data.isExpire == 1 || response.data.isExpire == 2) {
            //  hide graph
            console.log('check 2');
            setIsProSubscription(false);
          } else if (response.data.isExpire === 0) {
            // show graph
            console.log('check 3');
            setIsProSubscription(true);
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
        setIsProSubscription(false);
      });
  };

  useEffect(() => {
    console.log("1899999999999 > ", locationDetails)
    if (locationDetails && locationDetails.lat && locationDetails.lng) {
      updateMapLocationAndMarker(locationDetails.lat, locationDetails.lng);
      setBusinessAddress(locationDetails.data.description);
      setIscurrentLocationChecked(false);
    }
    verifyAccess();
  }, [locationDetails]);

  useEffect(() => {
    getBusinessDetails();
    getServiceDetails();
    getUserName();

    // Refreshing the page
    EventEmitter.on('refreshServiceAdd', () => {
      console.log('EventEmitter On');
      getBusinessDetails();
      getServiceDetails;
      getUserName();
    });
  }, []);

  const getUserName = () => {
    setLoader(true);
    Get('user/profile', '')
      .then((result) => {
        setLoader(false);
        if (result.status == 200 && result.data) {
          console.log('this is result', result.data);
          setUserName(result.data.userName);
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const businessNameSelectHelper = (index, value) => {
    setBusinessNameType(value);
  };

  const onModalAcceptCall = () => {
    setVisibleModal({ visibleModal: null });
    setMileageCoverOriginal(mileageCoverTemp.value);
    setMileageAreaName(mileageCoverTemp.coverAreaDistance);
  };

  /**
   * This method will call on Type of Services.
   */
  const typeofServiceSelectHelper = (item) => {
    if (item.isChecked) {
      let count = 0;

      if (item.typeofServiceName == 'Virtual') {
        services.forEach((element) => {
          element.Services.forEach((element2) => {
            if (element2.isVirtualService == 1) {
              count = count + 1;
            }
          });
        });
      } else if (item.typeofServiceName == 'Mobile') {
        services.forEach((element) => {
          element.Services.forEach((element2) => {
            if (element2.isMobileService == 1) {
              count = count + 1;
            }
          });
        });
      } else if (item.typeofServiceName == 'In-person') {
        services.forEach((element) => {
          element.Services.forEach((element2) => {
            if (element2.isMobileService == 0) {
              count = count + 1;
            }
          });
        });
      }

      if (count > 0) {
        setErrorAlert(
          `You have ${count} service${count > 1 ? 's' : ''} listed under ${item.typeofServiceName
          } service. Remove them first to change these settings.`,
        );
      } else if (count == 0) {
        const tempArray = [...typeofServicItems];
        let index = tempArray.findIndex(
          (eachCategory) => eachCategory === item,
        );
        const tempItem = { ...item };
        tempItem.isChecked = !tempItem.isChecked;
        tempArray[index] = tempItem;
        setTypeofServicItems([...tempArray]);
      }
    } else {
      const tempArray = [...typeofServicItems];
      let index = tempArray.findIndex((eachCategory) => eachCategory === item);
      const tempItem = { ...item };
      tempItem.isChecked = !tempItem.isChecked;
      tempArray[index] = tempItem;
      setTypeofServicItems([...tempArray]);
    }
  };

  /**
   * This method will call on Current Location Select.
   */
  const currentLocationSelectHelper = () => {
    setIscurrentLocationChecked(!iscurrentLocationChecked);
    if (!iscurrentLocationChecked) {
      checkLocationIsEnableOrNot();
    }
  };
  const checkLocationIsEnableOrNot = () => {
    DeviceInfo.isLocationEnabled().then((enabled) => {
      if (enabled) {
        getLocation();
      } else {
        global.showToast('Please enable device location', 'error');
        setIscurrentLocationChecked(false);
      }
    });
  };

  const getLocation = () => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getCurrentLocation();
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
            global.showToast('Location Access deny', 'error');
            setIscurrentLocationChecked(false);
          }
        } catch (err) {
          console.log('hello eroor', err);
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
  };

  const getCurrentLocation = () => {
    console.log('fetching lcoation...');
    setLocationLoader(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        getAddressFormLatLong(location.latitude, location.longitude);
      })
      .catch((error) => {
        setLocationLoader(false);
        setIscurrentLocationChecked(false);
        const { code, message } = error;
      });
  };

  const getAddressFormLatLong = (latitude, longitude) => {
    console.log('check 1', latitude, longitude);
    updateMapLocationAndMarker(latitude, longitude);
    Geocoder.from(latitude, longitude)
      .then((json) => {
        console.log('address: ', json);
        setLocationLoader(false);
        var addressComponent = json.results[0].formatted_address;
        setBusinessAddress(addressComponent);
      })
      .catch((error) => {
        console.log('error while trying to find address', { error });
        if (error.code === 3) {
          console.log('ERROR CODE 3', error.origin.url);
          Get(`${error.origin.url}`).then((result) => {
            console.log('result', result);
          });
        }
        console.warn(error);
        setLocationLoader(false);
      });
  };

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

  const onSubmitBusinessSetup = async () => {
    skipBtnHandler();
    const tempTypeOfServiceSelection = typeofServicItems.filter(
      (eachService) => eachService.isChecked,
    );
    if (
      (businessNameType == 1 || (businessNameType == 2 && businessName)) &&
      tempTypeOfServiceSelection.length
    ) {
      const payload = {
        inPersonType: typeofServicItems[0].isChecked ? 1 : 0,
        mobileType: typeofServicItems[1].isChecked ? 1 : 0,
        virtualType: typeofServicItems[2].isChecked ? 1 : 0,
        businessName:
          businessNameType == 2
            ? businessName
            : // : isUpdatedData
            // ? businessName
            userName,
        proNameSelectionType: parseInt(businessNameType),
      };

      if (typeofServicItems[0].isChecked) {
        if (latitide && businessAddress) {
          payload.latitude = latitide;
          payload.longitude = longitude;
          payload.address = businessAddress || '';
        } else {
          return;
        }
      }
      if (typeofServicItems[1].isChecked) {
        let tempAmount = parseFloat(amount);
        if (amount && tempAmount == 0) {
          setAmount(null);
          return;
        }
        if (amount) {
          if (!DECIMAL_REGX_AMOUNT.test(amount)) {
            setIsValidAmount(false);
            return;
          }
        }
        if (mileageCoverOriginal) {
          payload.coverage = mileageCoverOriginal;
          payload.travelFees = amount || 0;
        } else {
          return;
        }
      }
      console.log(payload);
      proStepSettingSubmit(payload);
    } else {
      return;
    }
  };

  const skipBtnHandler = () => {
    Put('pro/skip-step', { businessDetails: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep);
      })
      .catch((error) => {
        console.log(' ERRORRR>>>>>>>>>>>>>', error);
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const proStepSettingSubmit = (data) => {
    setLoader(true);
    if (!isUpdatedData) {
      console.log('Adding..................');
      Post('pro/setup-business', data)
        .then((result) => {
          setLoader(false);
          if (result.status === 201) {
            global.showToast(result.message, 'success');
            // navigation.navigate('SetupService');
            if (!!progressionData) {
              const updatedProgression = progressionData.map((step) => {
                if (step.stepNo === 4) {
                  return { ...step, isCompleted: 1 };
                }
                return step;
              });
              dispatch(setupProgressionUpdate(updatedProgression));
            }

            redirectUrlHandler();
            console.log('send Props');
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    } else {
      Put('pro/business-details', data)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            console.log('Updating..................');
            global.showToast(result.message, 'success');
            redirectUrlHandler();
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    }
  };

  const getBusinessDetails = () => {
    setLoader(true);
    Get('pro/business-details', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200 && result.data) {
          setIsUpdatedData(true);
          let data = result.data;
          const tempTypeOfService = [...typeofServicItems];
          tempTypeOfService[0].isChecked = data.inPersonType ? true : false;
          tempTypeOfService[1].isChecked = data.mobileType ? true : false;
          tempTypeOfService[2].isChecked = data.virtualType ? true : false;
          setTypeofServicItems([...tempTypeOfService]);
          setBusinessName(data.businessName);
          console.log('Name is *********************', data);
          setBusinessNameType(data.proNameSelectionType);
          if (data.inPersonType) {
            updateMapLocationAndMarker(data.latitude, data.longitude);
            setBusinessAddress(data.address);
          }
          if (data.mobileType) {
            setAmount((data.travelFees != 0 && data.travelFees) || '');
            if (data.coverage) {
              setMileageCoverOriginal(data.coverage);

              let index = AreaCoverData.findIndex(
                (x) => x.value === data.coverage,
              );
              setTempMileageCoverTemp(AreaCoverData[index]);
              setMileageAreaName(AreaCoverData[index].coverAreaDistance);
            }
            setBusinessAddress(data.address);
          }
          if (data.inPersonType) {
            updateMapLocationAndMarker(data.latitude, data.longitude);
            setBusinessAddress(data.address);
          }
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const getServiceDetails = () => {
    setLoader(true);
    Get('pro/services', '')
      .then((result) => {
        setLoader(false);
        if (result.status == 200 && result.data) {
          console.log(result.data);
          setServices(result.data.rows);
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const updateMapLocationAndMarker = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    setCoordinatePoint({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    });
  };

  // const onMapLayoutHandler = () => {
  //   setOnMapLayout(true);
  // };

  const checkIsCorrectPrice = () => {
    setIsValidAmount(true);
    let tempAmount = parseFloat(amount);
    if (amount && tempAmount == 0) {
      setAmount(null);
      return;
    }
    if (amount) {
      if (!DECIMAL_REGX_AMOUNT.test(amount)) {
        setIsValidAmount(false);
      }
    }
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={[commonStyle.fromwrap]}>
          <Text style={[commonStyle.subheading, commonStyle.mb1]}>
            {!isUpdate ? 'Setup y' : 'Y'}our business
          </Text>
        </View>
        <View style={commonStyle.categoriseListWrap}>
          <View style={[commonStyle.setupCardBox]}>
            <Text style={commonStyle.subtextblack}>Business name</Text>
            <View>
              <RadioGroup
                style={commonStyle.setupradioGroup}
                color="#ffffff"
                activeColor="#ffffff"
                highlightColor={'#ffffff'}
                selectedIndex={businessNameType}
                onSelect={(index, value) => {
                  businessNameSelectHelper(index, value);
                }}>
                <RadioButton style={commonStyle.setupradioButton} value="1">
                  <View style={commonStyle.radioCustomView}>
                    <Text style={commonStyle.blackTextR}>Use your name</Text>
                    {businessNameType == 1 ? (
                      <CircleCheckedBoxActive />
                    ) : (
                      <CircleCheckedBoxOutline />
                    )}
                  </View>
                </RadioButton>
                <RadioButton style={commonStyle.setupradioButton} value="2">
                  <View style={commonStyle.radioCustomView}>
                    <Text style={commonStyle.blackTextR}>
                      Create business name
                    </Text>
                    {businessNameType == 2 ? (
                      <CircleCheckedBoxActive />
                    ) : (
                      <CircleCheckedBoxOutline />
                    )}
                  </View>
                </RadioButton>
              </RadioGroup>
            </View>
            {businessNameType == 2 ? (
              <View style={commonStyle.mt1}>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    isBusinessNameFocus && commonStyle.focusinput,
                  ]}
                  defaultValue={businessName}
                  onFocus={() => setIsBusinessNameFocus(true)}
                  onChangeText={(text) => setBusinessName(text)}
                  autoFocus={false}
                  keyboardType="default"
                  returnKeyType="done"
                  autoCapitalize={'none'}
                  placeholder="Business name"
                  maxLength={100}
                  placeholderTextColor={'#939DAA'}
                />
              </View>
            ) : null}
          </View>

          <View style={[commonStyle.setupCardBox]}>
            <Text style={commonStyle.subtextblack}>Type of services</Text>
            {typeofServicItems.map((item, index) => (
              <View
                key={index}
              // style={ }
              >
                <CheckBox
                  // style={
                  //   item.disabled
                  //     ? {paddingVertical: 10, opacity: 0.5}
                  //     : {paddingVertical: 10}
                  // }
                  style={
                    { paddingVertical: 10 }

                    // item.typeofServiceName === 'Virtual'
                    //   ? !isProSubscription
                    //     ? {paddingVertical: 10, opacity: 0.5 }
                    //     : {paddingVertical: 10 }
                    //   : {paddingVertical: 10 }
                  }
                  onClick={() => typeofServiceSelectHelper(item)}
                  isChecked={item.isChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  leftText={item.typeofServiceName}
                  leftTextStyle={commonStyle.blackTextR}
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                  disabled={false
                    // !isUpdate
                    //   ? item.disabled
                    //   : item.typeofServiceName === 'Virtual'
                    //     ? !isProSubscription
                    //     : item.disabled
                  }
                />
                {/* {item.typeofServiceName === 'Virtual' && !isProSubscription ? (
                  <TouchableHighlight
                    style={[
                      commonStyle.paidbtn,
                      { position: 'absolute', left: 60, top: 10 },
                    ]}>
                    <Text style={commonStyle.paidbtntext}>Pro feature</Text>
                  </TouchableHighlight>
                ) : null} */}
              </View>
            ))}

            {/* {!isProSubscription && (
              <View style={[commonStyle.mt1, commonStyle.mb1]}>
                <List style={commonStyle.payinCashinfowrap}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Left style={{ marginRight: 8, alignSelf: 'flex-start' }}>
                        <Image
                          source={require('../../assets/images/payincashicon.png')}
                          style={commonStyle.payincashimg}
                          resizeMode={'contain'}
                        />
                      </Left>
                      <Body style={commonStyle.categoriseListBody}>
                        <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                          The "Virtual” option is unavailable during the trial
                          period. You’ll be able to activate it after
                          subscription.
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List>
              </View>
            )} */}
          </View>

          {typeofServicItems[0].isChecked || typeofServicItems[1].isChecked ? (
            <View style={[commonStyle.setupCardBox]}>
              {typeofServicItems[0].isChecked ? (
                <>
                  <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
                    Location
                  </Text>
                  <View style={commonStyle.mb2}>
                    <CheckBox
                      name="currentLocation"
                      style={{ paddingVertical: 10 }}
                      onClick={() => currentLocationSelectHelper()}
                      isChecked={iscurrentLocationChecked}
                      checkedCheckBoxColor={'#ff5f22'}
                      uncheckedCheckBoxColor={'#e6e7e8'}
                      rightText={'Use your current location?'}
                      rightTextStyle={commonStyle.blackTextR}
                      checkedImage={<CheckedBox />}
                      unCheckedImage={<UncheckedBox />}
                    />
                  </View>
                  <View style={commonStyle.mb2}>
                    <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                      Business address
                    </Text>

                    <TouchableOpacity
                      style={[
                        commonStyle.textInput,
                        {
                          alignItems: 'center',
                          flexDirection: 'row',
                          height: 'auto',
                          minHeight: 50,
                        },
                      ]}
                      activeOpacity={0.5}
                      onPress={() => {
                        navigation.navigate('GoogleLocationAutocompletePage', {
                          return_url: isUpdate
                            ? 'BusinessSettingsYourBusiness'
                            : 'SetupBusiness',
                        });
                      }}>
                      <Text style={commonStyle.blackTextR}>
                        {businessAddress}
                      </Text>
                    </TouchableOpacity>
                    <View style={commonStyle.inputdivider} />
                  </View>
                </>
              ) : null}
              {typeofServicItems[1].isChecked ? (
                <>
                  <View style={commonStyle.mb2}>
                    <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                      The area I cover
                    </Text>
                    <TouchableOpacity
                      style={commonStyle.dropdownselectmodal}
                      onPress={() => {
                        setVisibleModal('ChooseAreaDialog');
                      }}>
                      {mileageAreaName ? (
                        <Text style={commonStyle.blackTextR}>
                          {mileageAreaName}
                        </Text>
                      ) : (
                        <Text style={commonStyle.grayText16}>Choose area</Text>
                      )}
                      <DownArrow />
                    </TouchableOpacity>
                  </View>
                  <View style={commonStyle.mb2}>
                    <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                      Travel fee (it’s optional)
                    </Text>
                    <View>
                      <TextInput
                        style={[
                          commonStyle.textInput,
                          commonStyle.prefixInput,
                          isamountFocus && commonStyle.focusinput,
                        ]}
                        defaultValue={amount}
                        onFocus={() => setIsamountFocus(true)}
                        onChangeText={(text) => setAmount(text)}
                        onBlur={() => checkIsCorrectPrice()}
                        // returnKeyType="next"
                        keyboardType="numeric"
                        // autoCapitalize={'none'}
                        returnKeyType="done"
                        autoCapitalize={'none'}
                        placeholder="Amount"
                        placeholderTextColor={'#939DAA'}
                      />
                      <Text style={commonStyle.prefixText}>$</Text>
                    </View>
                    {!isValidAmount ? (
                      <Text style={commonStyle.inputfielderror}>
                        Invalid amount
                      </Text>
                    ) : null}
                  </View>
                </>
              ) : null}
              {typeofServicItems[0].isChecked && businessAddress ? (
                <View
                  style={{
                    width: '100%',
                    borderRadius: 20.8 / 2,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                  }}>
                  <MapView
                    style={commonStyle.mapview}
                    initialRegion={region}
                    region={region}
                    provider={PROVIDER_GOOGLE}
                    mapType="standard"
                    // mapType={Platform.OS == "android" ? "none" : "standard"}
                    zoomEnabled={true}
                    minZoomLevel={Platform.OS == 'android' ? 15 : 6}
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
                    ]}
                  // onRegionChangeComplete={(region) => setRegion(region)}
                  >
                    <Marker coordinate={coordinatePoint}>
                      <CustomMarker />
                    </Marker>
                  </MapView>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
      {(businessNameType == 1 || (businessNameType == 2 && businessName)) &&
        (!typeofServicItems[0].isChecked ||
          (typeofServicItems[0].isChecked && businessAddress)) &&
        (!typeofServicItems[1].isChecked ||
          (typeofServicItems[1].isChecked && mileageCoverOriginal)) &&
        (typeofServicItems[0].isChecked ||
          typeofServicItems[1].isChecked ||
          typeofServicItems[2].isChecked) ? (
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title={isUpdate ? 'Update' : 'Save and Continue'}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => onSubmitBusinessSetup()}
            />
          </View>
        </View>
      ) : null}

      {/* Area modal start */}
      <Modal
        isVisible={visibleModal === 'ChooseAreaDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
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
          <View style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <AreaSelectModal
              onSelectAreaValue={setTempMileageCoverTemp}
              mileageCoverOriginal={mileageCoverOriginal}
            />
          </ScrollView>
          {mileageCoverTemp ? (
            <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
              <Button
                title="Apply"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => onModalAcceptCall()}
              />
            </View>
          ) : null}
        </View>
      </Modal>
      {/* area Password modal end */}

      {/* Type change prevention modal starts here */}
      <Modal
        visible={!!errorAlert}
        onRequestClose={() => {
          setErrorAlert(null);
        }}
        onBackdropPress={() => setErrorAlert(null)}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You can’t remove this type of service
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              {errorAlert}
            </Text>
          </View>
        </View>
      </Modal>
      {/* Type change prevention modal ends here */}
    </Fragment>
  );
};

export default BusinessDetails;
