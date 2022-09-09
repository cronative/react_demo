import {useNavigation} from '@react-navigation/native';
import {getDistance} from 'geolib';
import moment from 'moment';
import {Body, Left, List, ListItem} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import call from 'react-native-phone-call';
import ReadMore from 'react-native-read-more-text';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {
  CommentBox,
  DirectionsIcon,
  MailBox,
  MapPointer,
  RightAngle,
  SmartPhone,
  StarIcon,
} from '../../components/icons';
import {similarProsRequest} from '../../store/actions/similarProsAction';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';
import {Get} from '../../api/apiAgent';
import {AdditionalInstraFeedData} from '../../utility/staticData';
import global from '../commonservices/toast';
import MyLocationMarker from '../map/myLocationMarker';

const CustomMapPointer = () => (
  <View>
    <Image
      style={{
        resizeMode: 'contain',
        width: 35,
        height: 35,
      }}
      source={require('../../assets/images/map/marker.png')}
    />
  </View>
);

const AboutTab = ({myCoordinates, isOwnProfile, professionalId, onMessage}) => {
  const navigation = useNavigation();
  const similarProsData = useSelector((state) => state.similarPros.data);
  const profileData = useSelector((state) => state.professionalDetails.details);
  const loderStatus = useSelector((state) => state.similarPros.loader);
  const [shopDistance, setShopDistance] = useState(null);
  const [businessDays, setBusinessDays] = useState();
  const [similarProfessional, setSimilarProfessional] = useState([]);
  const [ProMetas, setProMetas] = useState(null);
  const [isCallSilimerProfessional, setIsCallSilimerProfessional] =
    useState(false);
  const [map_url, set_map_url] = useState(null);
  const [instagramPictures, setInstagramPictures] = useState([]);
  // const [userId, setUserId] = useState(null);

  const [additionalLinks, setAdditionalLinks] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // if (!isCallSilimerProfessional && profileData) {
    if (profileData && profileData.ProCategories) {
      if (!isCallSilimerProfessional) {
        setIsCallSilimerProfessional(true);
        dispatch(
          similarProsRequest({
            proId: profileData.id,
            location: myCoordinates,
          }),
        );
      }
    }

    if (profileData && profileData.ProMetas && profileData.ProMetas[0]) {
      console.log('Profile Data: ', profileData);
      setProMetas(profileData.ProMetas[0]);
      setAdditionalLinks(profileData?.additionalLinks);
      if (myCoordinates) {
        let distance = calculateShopDistance(
          profileData.ProMetas[0].latitude,
          profileData.ProMetas[0].longitude,
        );

        setShopDistance(distance);
      }
      if (
        profileData.ProMetas[0].latitude &&
        profileData.ProMetas[0].longitude
      ) {
        const scheme = Platform.select({
          ios: 'maps:0,0?q=',
          android: 'geo:0,0?q=',
        });
        const latLng = `${profileData.ProMetas[0].latitude},${profileData.ProMetas[0].longitude}`;
        const label = `${profileData.ProMetas[0].businessName}`;
        const address = `${profileData.ProMetas[0].address}`;

        let temp_map_url = Platform.select({
          // ios: `${scheme}${label}@${latLng}${address}`,
          // ios: `${scheme}${encodeURIComponent(address)}`,
          // android: `${scheme}${encodeURIComponent(address)}`,
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`,
        });
        set_map_url(temp_map_url);
      }
    }

    if (profileData && profileData.ProAvailableDays) {
      arrangeAvailabilityDays(profileData.ProAvailableDays);
      arrangeDaysData(profileData.ProAvailableDays);
    }

    if (profileData?.id) {
      fetchInstagramPictures();
    }
    // }
  }, [myCoordinates, profileData]);

  useEffect(() => {
    if (similarProsData) {
      console.log('Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa : ', similarProsData);
      let filterData = similarProsData.filter(
        (items) => items.userId !== professionalId,
      );
      if (filterData.length >= 10) {
        filterData = filterData?.slice(0, 10);
      }
      console.log('PRE FILTER: ', filterData);
      // similarProfessionalModification(similarProsData.rows);
      filterData = filterData.map((eachItem, index) => {
        // console.log('Dist: ', eachItem.distance)
        if (eachItem?.coverImage) {
          eachItem.coverImage = eachItem?.coverImage;
        } else {
          eachItem.coverImage = '';
        }
        if (eachItem?.profileImage) {
          eachItem.profileImage = eachItem?.profileImage;
        } else {
          eachItem.profileImage = '';
        }
        return eachItem;
      });
      console.log('Updated sims: ', filterData);

      setSimilarProfessional([...filterData]);
    }
  }, [similarProsData]);

  const arrangeAvailabilityDays = (avail_arr) => {
    if (avail_arr) {
      return avail_arr.sort(function (a, b) {
        return a.dayValue - b.dayValue;
      });
    }
  };

  const arrangeDaysData = (data) => {
    if (data) {
      const tempJsonStringData = JSON.stringify(data);
      const tempBusinessHoursItems = JSON.parse(tempJsonStringData);
      if (tempBusinessHoursItems) {
        tempBusinessHoursItems.map((eachItem, index) => {
          eachItem.ProAvailableTimes.map((item, index) => {
            item.fromTime = timeFormatmodification(item.fromTime);
            item.toTime = timeFormatmodification(item.toTime);
          });
        });
        setBusinessDays([...tempBusinessHoursItems]);
      }
    }
  };

  const timeFormatmodification = (timeData) => {
    let timeArray = timeData.split(':');
    const tempDate = moment();
    tempDate.set({
      hour: timeArray[0],
      minute: timeArray[1],
      second: timeArray[2],
    });
    let value = new Date(tempDate);
    return value;
  };

  const calculateShopDistance = (latitude, longitude) => {
    if (myCoordinates && latitude && longitude) {
      let distanceMeter = getDistance(
        {latitude: myCoordinates.latitude, longitude: myCoordinates.longitude},
        {latitude: latitude, longitude: longitude},
      );
      // return `${distanceMeter} miles`;
      if (distanceMeter > 999) {
        let kmConvert = distanceMeter * 0.00062137;
        kmConvert = Number(kmConvert).toFixed(2);
        // setDistance(kmConvert + 'km');
        return `${kmConvert} miles`;
      } else {
        // setDistance(distanceMeter + 'm');
        return `${(distanceMeter * 0.00062137).toFixed(2)} miles`;
      }
    } else {
      return 0;
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fetchInstagramPictures = () => {
    // console.log('FETCHING INSTA PICS WITH ID: ', userId)
    // Get(`/pro/user-ig-posts/${userId}`)
    Get(`/pro/user-ig-posts/${profileData.id}`)
      .then((response) => {
        console.log('insta response: ', response);
        let image_urls = response.data.map((item) => item.media_url);
        setInstagramPictures(image_urls);
        console.log('INSTAGRAM PICTURES: ', image_urls);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchAdditionalLinks = () => {
    setLoader(true);
    Get('/pro/additional-info', '')
      .then((result) => {
        console.log('additional: ', result);
        setLoader(false);
        if (result.status === 200) {
          if (result.data && result.data.additionalLinks) {
            setAdditionalLinks(result.data.additionalLinks);
          }
        } else {
          global.showToast('Something went wrong', 'error');
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
  };

  const openLink = (link) => {
    console.log('Can Opening');
    let updatedLink =
      String(link).startsWith('https://') || String(link).startsWith('http://')
        ? link
        : 'https://' + link;
    Linking.canOpenURL(updatedLink)
      .then((supported) => {
        if (!supported) {
          console.log('Can Opening');
          global.showToast('Something went wrong.', 'error');
        } else {
          console.log('Can Open');
          Linking.openURL(updatedLink);
        }
      })
      .catch((err) => {
        console.log('Can Opening', err);
        global.showToast('Something went wrong.', 'error');
      });
  };

  return (
    <View style={commonStyle.mt2}>
      <View style={[commonStyle.setupCardBox]}>
        <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>Bio</Text>
        <View style={commonStyle.biowrap}>
          {ProMetas && ProMetas.bioData ? (
            <>
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={renderReadMore}
                renderRevealedFooter={renderShowLess}
                onReady={handleTextReady}>
                <Text style={[commonStyle.blackTextR, {lineHeight: 27}]}>
                  {ProMetas.bioData}
                </Text>
              </ReadMore>
            </>
          ) : (
            <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
              No bio available
            </Text>
          )}
          {!!additionalLinks &&
            additionalLinks?.length > 0 &&
            additionalLinks.map((link, index) => (
              <View key={index}>
                <List style={[commonStyle.mt15]}>
                  <ListItem
                    thumbnail
                    style={commonStyle.accountListitem}
                    onPress={() => {
                      openLink(link.url);
                    }}>
                    <Left
                      style={[
                        commonStyle.howdoseInfoCircle,
                        {alignSelf: 'center', marginRight: 10},
                      ]}>
                      <Image
                        style={{width: 16, height: 16}}
                        resizeMode={'contain'}
                        source={require('../../assets/images/link.png')}
                      />
                    </Left>
                    <Body
                      style={[
                        commonStyle.accountListBody,
                        {alignSelf: 'center'},
                      ]}>
                      <Text style={[commonStyle.blackTextR]}>{link?.url}</Text>
                    </Body>
                  </ListItem>
                </List>
              </View>
            ))}
        </View>
      </View>
      <View style={[commonStyle.setupCardBox]}>
        <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
          Contact & Business hours
        </Text>
        <View>
          {ProMetas?.isPhoneNOShare == 1 && (
            <List style={commonStyle.contactwaylist}>
              <ListItem thumbnail style={commonStyle.switchAccountView}>
                <Left>
                  <SmartPhone />
                </Left>
                <Body style={commonStyle.switchAccountbody}>
                  <Text style={commonStyle.blackTextR}>
                    {ProMetas && ProMetas.countryCode && ProMetas.phoneNumber
                      ? `${ProMetas && ProMetas.countryCode} ${
                          ProMetas && ProMetas.phoneNumber
                        }`
                      : 'NA'}
                  </Text>
                </Body>
                {ProMetas && ProMetas.countryCode && ProMetas.phoneNumber ? (
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() =>
                      call({
                        number: ProMetas.countryCode + ProMetas.phoneNumber,
                        prompt: true,
                      }).catch((e) => console.log(e))
                    }>
                    <Text style={commonStyle.clearfilterText}>Call</Text>
                  </TouchableOpacity>
                ) : null}
              </ListItem>
            </List>
          )}
          {ProMetas?.IsEmailShare == 1 && (
            <List style={commonStyle.contactwaylist}>
              <ListItem thumbnail style={commonStyle.switchAccountView}>
                <Left>
                  <MailBox />
                </Left>
                <Body style={commonStyle.switchAccountbody}>
                  <Text style={commonStyle.blackTextR} numberOfLines={1}>
                    {ProMetas && ProMetas.email ? ProMetas.email : 'NA'}
                  </Text>
                </Body>
                {ProMetas && ProMetas.email ? (
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() =>
                      Linking.openURL(
                        ProMetas
                          ? `mailto:${ProMetas.email}?subject=SendMail&body=Description`
                          : ``,
                      )
                    }>
                    <Text style={commonStyle.clearfilterText}>Write</Text>
                  </TouchableOpacity>
                ) : null}
              </ListItem>
            </List>
          )}
          {!isOwnProfile ? (
            <List style={commonStyle.contactwaylist}>
              <ListItem thumbnail style={commonStyle.switchAccountView}>
                <Left>
                  <CommentBox />
                </Left>
                <Body style={commonStyle.switchAccountbody}>
                  <TouchableOpacity activeOpacity={0.5} onPress={onMessage}>
                    <>
                      <Text style={commonStyle.blackTextR}>Ask a question</Text>
                      {/* <Text style={commonStyle.grayText14} numberOfLines={1}>
                        Usually responds within 3 hours
                      </Text> */}
                    </>
                  </TouchableOpacity>
                </Body>
                <TouchableOpacity style={{marginLeft: 10}}>
                  <RightAngle />
                </TouchableOpacity>
              </ListItem>
            </List>
          ) : null}
        </View>
        <View style={commonStyle.mt1}>
          {businessDays && businessDays.length ? (
            businessDays.map((eachDay, pIndex) => (
              <List key={pIndex} style={commonStyle.weektimelist}>
                <ListItem thumbnail style={commonStyle.switchAccountView}>
                  <Left style={{width: 60}}>
                    <Text
                      style={
                        eachDay.offDay === 1
                          ? commonStyle.grayText16
                          : [commonStyle.clearfilterText]
                      }>
                      {days[eachDay.dayValue - 1]}
                    </Text>
                  </Left>
                  <Body style={commonStyle.switchAccountbody}>
                    {eachDay.offDay === 1 ? (
                      <Text style={commonStyle.grayText16}>Day off</Text>
                    ) : (
                      <Fragment>
                        {eachDay.ProAvailableTimes &&
                        eachDay.ProAvailableTimes.length ? (
                          eachDay.ProAvailableTimes.map((eachTime, cIndex) => (
                            <Text key={cIndex} style={commonStyle.blackTextR}>
                              {eachTime.fromTime &&
                                moment(eachTime.fromTime).format('LT')}{' '}
                              -{' '}
                              {eachTime.toTime &&
                                moment(eachTime.toTime).format('LT')}
                            </Text>
                          ))
                        ) : (
                          <Text style={commonStyle.grayText16}>Day off</Text>
                        )}
                      </Fragment>
                    )}
                  </Body>
                </ListItem>
              </List>
            ))
          ) : (
            <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
              AVALABILITY DATA NOT FOUND
            </Text>
          )}
        </View>
      </View>
      <View style={[commonStyle.setupCardBox]}>
        <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
          Location
        </Text>
        <View style={commonStyle.setupbusinessmapwrap}>
          {ProMetas && ProMetas.latitude && ProMetas.longitude ? (
            <View
              style={{
                width: '100%',
                borderRadius: 20.8 / 2,
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}>
              <MapView
                style={commonStyle.mapview}
                initialRegion={{
                  latitude: ProMetas.latitude,
                  longitude: ProMetas.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                region={{
                  latitude: ProMetas.latitude,
                  longitude: ProMetas.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
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
                ]}>
                <Marker
                  coordinate={{
                    latitude: ProMetas.latitude,
                    longitude: ProMetas.longitude,
                  }}>
                  <CustomMapPointer />
                  {!!myCoordinates && (
                    <Marker coordinate={myCoordinates}>
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
                </Marker>
              </MapView>
            </View>
          ) : null}

          {map_url ? (
            <TouchableOpacity
              style={commonStyle.directionsbtn}
              activeOpacity={0.5}
              onPress={() => {
                if (map_url) Linking.openURL(map_url);
              }}>
              <DirectionsIcon />
              <Text style={[commonStyle.blackText16, commonStyle.ml1]}>
                Directions
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={commonStyle.mt2}>
          <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
            {(ProMetas && ProMetas.address) || 'Address Info Unavailable'}
          </Text>
          {shopDistance ? (
            <TouchableHighlight>
              <Text style={commonStyle.grayText14}>
                <MapPointer /> {`${' '}${shopDistance} from you`}
              </Text>
            </TouchableHighlight>
          ) : null}
        </View>
      </View>

      {instagramPictures?.length ? (
        <View style={[commonStyle.setupCardBox, {paddingHorizontal: 0}]}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              commonStyle.sortAreaWrap,
              commonStyle.mb2,
              commonStyle.horizontalPadd,
            ]}>
            <Image
              style={commonStyle.socialIcon}
              source={require('../../assets/images/instagramm.png')}
            />
            <Text style={[commonStyle.subtextblack, commonStyle.ml1]}>
              Instagram feed
            </Text>
          </TouchableOpacity>
          <FlatList
            horizontal
            style={commonStyle.mb05}
            ItemSeparatorComponent={() => <View style={{marginRight: -26}} />}
            showsHorizontalScrollIndicator={false}
            data={instagramPictures}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity key={index} activeOpacity={0.8}>
                <View style={commonStyle.instrafeedImgwrap}>
                  <Image
                    defaultSource={require('../../assets/images/default.png')}
                    source={{uri: item}}
                    style={commonStyle.instrafeedImg}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <></>
      )}
      {!!similarProfessional &&
      similarProfessional.length > 0 &&
      !loderStatus ? (
        <View
          style={[
            commonStyle.setupCardBox,
            {paddingHorizontal: 0, paddingBottom: 5},
          ]}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              commonStyle.sortAreaWrap,
              commonStyle.mb2,
              commonStyle.horizontalPadd,
            ]}>
            <Text style={[commonStyle.subtextblack]}>
              Similiar professionals
            </Text>
          </TouchableOpacity>
          <FlatList
            horizontal
            ItemSeparatorComponent={() => <View style={{marginRight: -26}} />}
            showsHorizontalScrollIndicator={false}
            data={similarProfessional}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setIsCallSilimerProfessional(false);
                  navigation.push('ProfessionalPublicProfile', {
                    proId: item.id,
                    singleBack: true,
                    doubleBack: false,
                  });
                }}>
                <View style={[commonStyle.othersServiceCard]}>
                  <Image
                    defaultSource={require('../../assets/images/default.png')}
                    source={
                      item?.ProResources?.length
                        ? {uri: item.ProResources[0].url}
                        : require('../../assets/images/default.png')
                    }
                    style={commonStyle.othersServiceCardImg}
                  />
                  <View
                    style={[
                      commonStyle.othersServiceCardContent,
                      {minHeight: 155},
                    ]}>
                    <View style={commonStyle.featuredCardRatingRow}>
                      <View style={commonStyle.featuredUserImgWrap}>
                        <Image
                          style={commonStyle.featuredUserImg}
                          source={
                            item?.profileImage
                              ? {
                                  uri: item.profileImage,
                                }
                              : require('../../assets/images/default.png')
                          }
                        />
                      </View>
                      <TouchableHighlight
                        style={[
                          commonStyle.ratingWhitebtn,
                          commonStyle.shadow,
                        ]}>
                        <Text
                          style={[commonStyle.blackText16, commonStyle.mb03]}>
                          <StarIcon />
                          {item?.ratings ? Number(item.ratings).toFixed(1) : 0}
                        </Text>
                      </TouchableHighlight>
                    </View>
                    <View style={commonStyle.featuredCardText}>
                      <Text
                        style={[commonStyle.blackText16, commonStyle.mb05]}
                        numberOfLines={1}>
                        {(item?.ProMetas?.length &&
                          item?.ProMetas[0]?.businessName) ||
                          'NA'}
                      </Text>
                      {/* <Text style={[commonStyle.grayText14, commonStyle.mb1]}> */}
                      <View style={commonStyle.mt1}>
                        {item?.ProMetas?.length ? (
                          <Text
                            style={[commonStyle.grayText14, commonStyle.mb1]}
                            numberOfLines={2}>
                            {item.ProMetas[0]?.address?.length > 40
                              ? item.ProMetas[0].address.substr(0, 50) + '...'
                              : item.ProMetas[0].address}
                          </Text>
                        ) : (
                          // <ReadMore
                          //   numberOfLines={3}
                          //   renderTruncatedFooter={renderReadMore}
                          //   renderRevealedFooter={renderShowLess}
                          //   onReady={handleTextReady}>
                          //   <Text
                          //     style={[commonStyle.grayText14, commonStyle.mb1]}>
                          //     {item.address.substr(0,50)}
                          //   </Text>
                          // </ReadMore>
                          <Text
                            style={[commonStyle.grayText14, commonStyle.mb2]}>
                            N/A
                          </Text>
                        )}
                      </View>

                      {/* </Text> */}
                      <TouchableHighlight>
                        <Text style={commonStyle.grayText14}>
                          <MapPointer />
                          {item?.distance != null
                            ? Number(item.distance).toFixed(2) +
                              'miles from you'
                            : 'N/A'}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AboutTab;
