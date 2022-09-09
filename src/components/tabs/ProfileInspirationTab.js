import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image as ImageU,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import commonStyle, { Colors } from '../../assets/css/mainStyle';
import { SingleInspire } from '../../components/inspire';
import { useSelector } from 'react-redux';
import global from '../../components/commonservices/toast';
import { useResponsiveWidth } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import FastImage from 'react-native-fast-image';
import {
  FavoritesIcon,
  FavoritesRedSolid,
  VideoPlayIcon,
} from '../../components/icons';
import Image from 'react-native-scalable-image';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Put } from '../../api/apiAgent';

const { createAnimatableComponent } = Animatable;
const AnimatableView = createAnimatableComponent(View);

const ProfileInspirationTab = (props) => {
  const [logedInUserId, setLogedInUserId] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const navigation = useNavigation();

  const getLogedInUserId = async () => {
    console.log('\n\n\n\n\n***************************\n\n\n getLogedInUserId');
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('USERID TRY', userId);
      if (!!userId) {
        setLogedInUserId(userId);
        setIsPublic(false);
      } else {
        setIsPublic(true);
        setLogedInUserId(0);
      }
    } catch (e) {
      console.log('USERID ERROR', userId, ' ', e);
      setIsPublic(true);
      setLogedInUserId(0);
    }
  };

  useEffect(() => {
    console.log('\n\n\n\n\n***************************\n\n\n useeffect64564');
    getLogedInUserId();
  }, []);

  // useFocusEffect(
  //     useCallback(()=>{
  //         getLogedInUserId();
  //     } ,[])
  // );

  const profileData = useSelector((state) => state.professionalDetails.details);
  const proProfileImage = useSelector(
    (state) => state.professionalDetails.details.profileImage,
  );
  useEffect(() => {
    console.log('\n\n\n\n\n***************************\n\n\n profileinsptab');
    profileData.inspiration.map((inspiration) => {
      inspiration.pro = { profileImage: proProfileImage };
      let type = [];
      inspiration.byMe.forEach((element) => {
        type.push(element.type);
      });
      if (type.includes(3)) {
        inspiration.favourite = true;
      } else {
        inspiration.favourite = false;
      }
    });
    console.log(
      '\n\n\n\n\n***************************\n\n\n profileData.inspiration',
      profileData.inspiration,
    );
  }, []);
  const [inspireDetailsList, setInspireDetailsList] = useState([
    ...profileData.inspiration,
  ]);
  const { width, height } = Dimensions.get('window');

  const modificationInspireFavourite = (data, index) => {
    const tempInspireDetails = [...inspireDetailsList];
    tempInspireDetails[index] = data;
    setInspireDetailsList([...tempInspireDetails]);
  };

  const favoriteOrNotHandler = (itemDetails, index) => {
    if (!isPublic) {
      //   setLoader(true);
      Put('user/favourite/inspiration-stories/' + itemDetails.id, {
        favourite: itemDetails.favourite ? 0 : 1,
      })
        .then((result) => {
          // setLoader(false);
          if (result.status === 200) {
            global.showToast(result.message, 'success');
            if (itemDetails.favourite) {
              itemDetails.favourite = false;
            } else {
              itemDetails.favourite = true;
            }
            modificationInspireFavourite(itemDetails, index);
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          // setLoader(false);
          console.log(error);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    } else {
      global.showToast('Please login and wish inspire', 'error');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {inspireDetailsList && inspireDetailsList.length === 0 ? (
          <View style={commonStyle.noMassegeWrap}>
            <ImageU
              style={[commonStyle.nobookingsimg, { marginBottom: 0 }]}
              source={require('../../assets/images/no-massege-img.png')}
            />
            <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
              {'No inspiration posts yet'}
            </Text>
          </View>
        ) : (
          <View
            style={{
              paddingLeft: 11,
              paddingBottom: 70,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {/* <RNMasonryScroll
                            removeClippedSubviews={true}
                            columns={2}
                            horizontal={false}
                            style={{ paddingTop: 5 }}> */}

            {inspireDetailsList && inspireDetailsList.length
              ? inspireDetailsList.map((itemDetails, index) => (
                <View style={{ width: 0.48 * width }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      // navigation.navigate(
                      //     'Inspire',
                      //     {
                      //         screen: 'InspireInner',
                      //         params: {
                      //             inspiritionId: itemDetails.id,
                      //         }
                      //     }
                      // );
                      navigation.navigate('Inspire');

                      setTimeout(() => {
                        navigation.navigate('InspireInner', {
                          inspiritionId: itemDetails.id,
                          doubleBack: true,
                        });
                      }, 200);
                    }}>
                    <AnimatableView
                      animation={'fadeInUp'}
                      delay={100 * index}
                      style={commonStyle.masonryContainer}>
                      {itemDetails?.InspirationResources[0]?.resourceType ===
                        'video' && (
                          <VideoPlayer
                            source={{
                              uri: itemDetails?.InspirationResources[0]?.url,
                            }}
                            tapAnywhereToPause={false}
                            repeat={true}
                            navigator={null}
                            disableBack={true}
                            toggleResizeModeOnFullscreen={false}
                            paused={false}
                            muted={true}
                            controls={false}
                            disableFullscreen={true}
                            disablePlayPause={true}
                            disableSeekbar={true}
                            disableVolume={true}
                            disableTimer={true}
                          />
                        )}
                      {itemDetails?.InspirationResources[0]?.resourceType ===
                        'image' && (
                          <FastImage
                            style={commonStyle.masonryBannerimage}
                            source={
                              itemDetails.InspirationResources &&
                                itemDetails.InspirationResources.length &&
                                itemDetails.InspirationResources[0]
                                  .resourceType === 'image'
                                ? {
                                  uri:
                                    itemDetails.InspirationResources &&
                                    itemDetails.InspirationResources.length &&
                                    itemDetails.InspirationResources[0].url,
                                }
                                : require('../../assets/images/default.png')
                            }
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        )}
                      <LinearGradient
                        colors={[
                          'rgba(0, 0, 0, 0.1)',
                          'rgba(0, 0, 0, 0.3)',
                          'rgba(0, 0, 0, 0.5)',
                        ]}
                        style={commonStyle.borderRadiusoverlay}>
                        {itemDetails.userId != logedInUserId && !isPublic ? (
                          <TouchableOpacity
                            style={commonStyle.masonryfavoriteWrap}
                            onPress={() =>
                              favoriteOrNotHandler(itemDetails, index)
                            }>
                            {itemDetails.favourite ? (
                              <FavoritesRedSolid />
                            ) : (
                              <FavoritesIcon />
                            )}
                          </TouchableOpacity>
                        ) : null}
                        <View style={commonStyle.masonrycontent}>
                          <Text
                            style={commonStyle.masonrytitle}
                            numberOfLines={2}>
                            {itemDetails.title}
                          </Text>
                          {!props.isOwnProfile ? (
                            <View style={commonStyle.masonryUserdata}>
                              <View style={commonStyle.masonryUserAvaterwrap}>
                                <FastImage
                                  style={commonStyle.masonryUseravaterImg}
                                  source={
                                    itemDetails?.pro?.profileImage
                                      ? { uri: itemDetails?.pro?.profileImage }
                                      : require('../../assets/images/default-user.png')
                                  }
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              </View>
                              <Text
                                style={commonStyle.masonrytitle}
                                numberOfLines={1}>
                                {profileData &&
                                  profileData.ProMetas &&
                                  profileData.ProMetas[0] &&
                                  profileData.ProMetas[0].businessName}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </LinearGradient>
                    </AnimatableView>
                  </TouchableOpacity>
                </View>
              ))
              : null}
            {/* </RNMasonryScroll> */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileInspirationTab;
