import {useNavigation} from '@react-navigation/native';
import {getDistance} from 'geolib';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Get, Put} from '../../api/apiAgent';
import {useSelector} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {
  LeftArrowAndroid,
  LeftArrowIos,
  MapPointer,
  StarIcon,
} from '../../components/icons';
import global from '../../components/commonservices/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfessionalPublicProfileTop = ({
  route,
  isOwnProfile,
  myCoordinates,
  goBack,
}) => {
  const profileData = useSelector((state) => state.professionalDetails.details);
  const statusCode = useSelector((state) => state.professionalDetails.status);
  const [proId, setProId] = useState(null);
  const [followUnfollowStatus, setFollowUnfollowStatus] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [accessToken, setAccessToken] = useState(false);
  const navigation = useNavigation();
  const [professionBusinessTypeTags, setProfessionBusinessTypeTags] = useState(
    [],
  );
  const [distance, setDistance] = useState(null);
  const [filePath, setFilePath] = useState('');
  // For Opening Google Maps
  let map_url = null;
  if (
    profileData &&
    profileData.ProMetas &&
    profileData.ProMetas[0] &&
    profileData.ProMetas[0].latitude &&
    profileData.ProMetas[0].longitude
  ) {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${profileData.ProMetas[0].latitude},${profileData.ProMetas[0].longitude}`;
    const label = `${profileData.ProMetas[0].businessName}`;
    map_url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
  }

  useEffect(() => {
    if (profileData && statusCode === 200) {
      setProId(profileData.id);
      let tempProfessionBusinessTypes = [];
      if (profileData && profileData.ProMetas && profileData.ProMetas.length) {
        let professionalPrometas = profileData.ProMetas[0];
        if (professionalPrometas.inPersonType === 1) {
          tempProfessionBusinessTypes.push('In-Person');
        }
        if (professionalPrometas.mobileType === 1) {
          tempProfessionBusinessTypes.push('Mobile');
        }
        if (professionalPrometas.virtualType === 1) {
          tempProfessionBusinessTypes.push('Virtual');
        }
      }

      if (tempProfessionBusinessTypes.length > 0) {
        setProfessionBusinessTypeTags(tempProfessionBusinessTypes);
      } else {
        setProfessionBusinessTypeTags(['No Categories to show']);
      }
      setFilePath((profileData.profileImage && profileData.profileImage) || '');
    }
  }, [profileData]);

  useEffect(() => {
    if (myCoordinates) {
      getProDistance();
    }
  }, [profileData, myCoordinates]);

  useEffect(() => {
    if (proId != null) {
      fetchFavoritesProfessional();
    }
    return () => {
      fetchFavoritesProfessional();
    };
  }, [proId]);

  const getProDistance = () => {
    if (
      profileData &&
      profileData.ProMetas &&
      profileData.ProMetas.length &&
      profileData.ProMetas[0].latitude &&
      profileData.ProMetas[0].longitude &&
      myCoordinates
    ) {
      const distanceMeter = getDistance(
        {
          latitude: myCoordinates.latitude,
          longitude: myCoordinates.longitude,
        },
        {
          latitude: profileData.ProMetas[0].latitude,
          longitude: profileData.ProMetas[0].longitude,
        },
      );
      if (distanceMeter > 999) {
        let kmConvert = distanceMeter * 0.00062137;
        kmConvert = Number(kmConvert).toFixed(2);
        setDistance(kmConvert + ' miles');
      } else {
        setDistance((distanceMeter * 0.00062137).toFixed(2) + ' miles');
      }
    } else {
      setDistance(0);
    }
  };

  //Removes duplicate Category Names
  const returnUniqueCategories = (arr) => {
    const cat_names = arr.map((item) => item.categoryName);
    const unique_cats = [...new Set(cat_names)];
    return unique_cats;
  };

  const fetchFavoritesProfessional = async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken != null) {
      setAccessToken(true);
      Get('user/follow/professionals', '')
        .then((result) => {
          if (result.status === 200 && result.data.length) {
            result.data.forEach((element) => {
              if (element.proId == proId) {
                setFollowUnfollowStatus(true);
              }
            });
            setIsLoader(true);
          } else {
            setIsLoader(true);
          }
        })
        .catch((error) => {
          console.log('Error  ', error);
        });
    } else {
      setAccessToken(false);
    }
  };

  const followOrUnFllowProfessionalHandler = () => {
    Put('user/follow/professionals/' + proId, {
      follow: !!followUnfollowStatus ? 0 : 1,
    })
      .then((result) => {
        if (result.status === 200) {
          global.showToast(result.message, 'success');
          setFollowUnfollowStatus(!followUnfollowStatus);
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <View style={{backgroundColor: '#fff9f8'}}>
        {profileData &&
        profileData.resources &&
        profileData.resources.length ? (
          <Swiper
            dot={<View style={commonStyle.dotsinactive} />}
            activeDot={<View style={commonStyle.dotsactive} />}
            paginationStyle={{
              bottom: 40,
            }}
            style={commonStyle.profileservicebannerwraper}
            loop={false}>
            {profileData.resources.map((img, index) => (
              // console.log('Imageeeeeeeeeeeeeee : ', img.url),
              <View key={index} style={commonStyle.onboardingslide}>
                <Image
                  style={commonStyle.profileservicebannerimg}
                  source={{uri: img.url}}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        ) : (
          <Image
            style={commonStyle.profileservicebannerdflimg}
            source={require('../../assets/images/default-new.png')}
            resizeMode="cover"
          />
        )}

        <View style={commonStyle.profileserviceheader}>
          <TouchableOpacity
            style={commonStyle.profileserviceheaderback}
            onPress={() => goBack()}>
            {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
          </TouchableOpacity>
          {accessToken === true && !isOwnProfile ? (
            isLoader === true && followUnfollowStatus === false ? (
              <TouchableOpacity
                style={commonStyle.followbtn}
                activeOpacity={0.5}
                onPress={() => followOrUnFllowProfessionalHandler()}>
                <Text style={commonStyle.followbtnText}>Follow</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={commonStyle.followbtn}
                onPress={() => followOrUnFllowProfessionalHandler()}
                activeOpacity={0.5}>
                <Text style={commonStyle.followbtnText}>Unfollow</Text>
              </TouchableOpacity>
            )
          ) : null}
        </View>
      </View>
      <View>
        <View style={commonStyle.profileservicedetailsinfo}>
          <View style={commonStyle.profileserviceUserRatingwrap}>
            <View style={commonStyle.profileserviceUserImgWrap}>
              {filePath ? (
                <Image
                  style={commonStyle.profileserviceUserImg}
                  source={{uri: filePath}}
                />
              ) : (
                <Image
                  style={commonStyle.profileserviceUserImg}
                  source={require('../../assets/images/default.png')}
                />
              )}
            </View>
            <TouchableHighlight
              style={[commonStyle.profileserviceratingbtn, commonStyle.shadow]}>
              <Text style={[commonStyle.blackText16, commonStyle.mb03]}>
                <StarIcon />
                {profileData && profileData.ratings
                  ? Number(profileData.ratings).toFixed(1)
                  : '0'}
              </Text>
            </TouchableHighlight>
          </View>
          <View style={commonStyle.featuredCardText}>
            <Text style={[commonStyle.subheading, commonStyle.mb05]}>
              {profileData &&
                profileData.ProMetas &&
                profileData.ProMetas[0] &&
                profileData.ProMetas[0].businessName}
            </Text>
            <View style={commonStyle.categorytagsWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableHighlight style={commonStyle.tagsOutline}>
                  <Text style={commonStyle.filterBlackText}>
                    {professionBusinessTypeTags &&
                      professionBusinessTypeTags.length &&
                      professionBusinessTypeTags.join(' . ')}
                  </Text>
                </TouchableHighlight>
                {profileData && profileData.ProCategories
                  ? returnUniqueCategories(profileData.ProCategories).map(
                      (uniqueCategoryName, index) => (
                        <TouchableHighlight
                          key={index}
                          style={commonStyle.tagsOutline}>
                          <Text style={commonStyle.categorytagsText}>
                            {uniqueCategoryName}
                          </Text>
                        </TouchableHighlight>
                      ),
                    )
                  : null}
              </ScrollView>
            </View>
            <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
              {profileData &&
                profileData.ProMetas &&
                profileData.ProMetas[0] &&
                profileData.ProMetas[0].address}
            </Text>
            <View style={commonStyle.searchBarText}>
              <TouchableHighlight>
                <Text style={commonStyle.grayText14}>
                  <MapPointer />{' '}
                  {distance != null ? distance + ' from you' : 'NA'}
                </Text>
              </TouchableHighlight>
              <Text style={commonStyle.dotSmall}> . </Text>
              <TouchableOpacity onPress={() => Linking.openURL(map_url)}>
                <Text style={commonStyle.textorange14}>Show on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Fragment>
  );
};

export default ProfessionalPublicProfileTop;
