import React, {
  Fragment,
  useState,
  useEffect,
  RefObject,
  useRef,
  useCallback,
} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Platform,
  Dimensions,
  BackHandler,
} from 'react-native';
import {Container, List, ListItem, Body, Left} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {
  LeftArrowIos,
  LeftArrowAndroid,
  FavoritesIcon,
  FavoritesRedSolid,
  LikeIcon,
  CommentIcon,
  MoreVertical,
  ShareIcon,
  SendIcon,
  LikeSolidIcon,
} from '../../components/icons';
import {
  InspireComments,
  InspireMoreProfessional,
} from '../../components/inspire';
import commonStyle from '../../assets/css/mainStyle';
import {Delete, Get, Post, Put} from '../../api/apiAgent';
import * as Constant from '../../api/constant';
import global from '../../components/commonservices/toast';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import moment from 'moment';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import EventEmitter from 'react-native-eventemitter';
const {width, height} = Dimensions.get('window');
import VideoPlayer from 'react-native-video-controls';
import ReadMore from 'react-native-read-more-text';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';
import FastImage from 'react-native-fast-image';
import {Buffer} from 'buffer';
import base64 from 'react-native-base64';

const InspireInner = ({route}) => {
  const navigation = useNavigation();

  const [isMessageInputFocus, setIsMessageInputFocus] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const [visibleModal, setVisibleModal] = useState(false);
  const {inspiritionId, doubleBack} = route.params;
  const [inspireDetails, setInspireDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [logedInUserId, setLogedInUserId] = useState(null);
  const [isChangeFavorite, setIsChangeFavorite] = useState(false);
  const scrollViewRef = useRef(0);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [videoPlayPause, setVideoPlayPause] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tempLike, setTempLike] = useState(0);

  const inputRef = useRef();

  useEffect(() => {
    getLogedInUserId();
  }, [inspiritionId]);

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      fetchInspireDetailsByInspiritionId();

      return () => {
        setIsVisible(false);
      };
    }, [inspiritionId]),
  );

  useFocusEffect(
    useCallback(() => {
      setVideoPlayPause(false);
      return () => {
        setVideoPlayPause(true);
      };
    }, []),
  );

  const inspireMessageHandler = () => {
    const postData = {
      inspirationId: inspireDetails.details.id,
      content: messageInput,
      proId: inspireDetails.details.userId,
    };
    setLoader(true);
    Post('user/inspirationStoryThreads', postData)
      .then((result) => {
        setLoader(false);
        if (result.status === 201) {
          // global.showToast(result.message, 'success');
          setMessageInput('');
          setIsMessageInputFocus(false);
          const tempInspiritionDetails = {...inspireDetails};
          tempInspiritionDetails.comments.count =
            tempInspiritionDetails.comments.count + 1;
          tempInspiritionDetails.comments.rows.push({
            id: result.data.id,
            createdAt: result.data.createdAt,
            content: result.data.content,
            customer: result.user,
          });
          setInspireDetails({...tempInspiritionDetails});
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
  };

  const fetchInspireDetailsByInspiritionId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    let url = userId ? 'user/inspiration/' : 'user/inspirationWithOutLogin/';
    setLoader(true);
    Get(url + inspiritionId, '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          result.data.details = result.data.details[0];
          result.data.professional = result.data.professional[0];
          console.log(
            '\n\n\n*********fetchInspireDetailsByInspiritionId*****',
            result.data?.details?.Liked,
          );
          setInspireDetails(result.data);
          setTimeout(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToPosition(0);
            }
          }, 0);
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };
  const fetchInspireDetailsByInspiritionIdWithoutLoad = async () => {
    const userId = await AsyncStorage.getItem('userId');
    let url = userId ? 'user/inspiration/' : 'user/inspirationWithOutLogin/';
    // setLoader(true);
    Get(url + inspiritionId, '')
      .then((result) => {
        // setLoader(false);
        if (result.status === 200) {
          result.data.details = result.data.details[0];
          result.data.professional = result.data.professional[0];
          console.log(
            '\n\n\n*********fetchInspireDetailsByInspiritionId*****',
            result.data?.details?.Liked,
          );
          setInspireDetails(result.data);
          setTimeout(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToPosition(0);
            }
          }, 0);
        }
      })
      .catch((error) => {
        // setLoader(false);
      });
  };

  const favoriteOrNotHandler = () => {
    let tempInspireDetails = {...inspireDetails};
    setLoader(true);
    Put('user/favourite/inspiration-stories/' + tempInspireDetails.details.id, {
      favourite:
        tempInspireDetails.details.favourite &&
        tempInspireDetails.details.favourite.length
          ? 0
          : 1,
    })
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          setIsChangeFavorite(true);
          global.showToast(result.message, 'success');
          if (
            tempInspireDetails.details.favourite &&
            tempInspireDetails.details.favourite.length
          ) {
            tempInspireDetails.details.favourite = [];
          } else {
            tempInspireDetails.details.favourite.push(result.data);
          }
          setInspireDetails({...tempInspireDetails});
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
  };

  const getLogedInUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setLogedInUserId(userId);
    } catch (e) {}
  };

  const shareInspritionDetaisPage = async () => {
    let options = {
      title: 'Inspiration story',
      message: 'Check this post out on Readyhubb 🙌🏽',
      url: `${Constant.FRONTEND_BASE_PATH}/inspire-inner/${base64.encode(
        inspireDetails.details.id.toString(),
      )}`,
    };
    await Share.open(options)
      .then((res) => {
        console.log('Success : ', res);
      })
      .catch((err) => {
        err && console.log('Error : ', err);
      });
  };

  const viewOrFollowingProHandler = () => {
    let tempInspireDetails = {...inspireDetails};
    if (!tempInspireDetails.followed || !tempInspireDetails.followed.length) {
      setLoader(true);
      Put('user/follow/professionals/' + tempInspireDetails.details.userId, {
        follow:
          tempInspireDetails.followed && tempInspireDetails.followed.length
            ? 0
            : 1,
      })
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            global.showToast(result.message, 'success');
            if (
              tempInspireDetails.followed &&
              tempInspireDetails.followed.length
            ) {
              tempInspireDetails.followed = [];
            } else {
              tempInspireDetails.followed.push(result.data);
            }
            setInspireDetails({...tempInspireDetails});
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
      redirectToProfessionalProfile();
    }
  };

  const likeOrUnLikeCommentByProfessional = (index) => {
    const tempInspireDetails = {...inspireDetails};
    const tempCommentDetails = tempInspireDetails.comments.rows[index];
    // setLoader(true);
    Post('pro/like-a-comment/' + tempCommentDetails.id, '')
      .then((result) => {
        // setLoader(false);
        if (result.status === 201) {
          global.showToast(result.message, 'success');
          if (
            tempCommentDetails.commentLikes &&
            tempCommentDetails.commentLikes.length
          ) {
            tempCommentDetails.commentLikes = [];
          } else {
            tempCommentDetails.commentLikes.push(result.data);
          }
          tempInspireDetails.comments.rows[index] = tempCommentDetails;
          setInspireDetails({...tempInspireDetails});
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        // setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };

  const deletePostHandler = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure, you want to delete',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => inspiritionDeleteApi()},
      ],
      {cancelable: false},
    );
  };

  const inspiritionDeleteApi = () => {
    setLoader(true);
    Delete('pro/inspiration-stories/' + inspireDetails.details.id, '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          setVisibleModal({visibleModal: null});
          global.showToast(result.message, 'success');
          onClickRedirect();
        } else {
          global.showToast(result.message || 'Something went wrong', 'error');
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

  const onClickRedirect = () => {
    setTimeout(() => {
      navigation.navigate('ProfessionalInspirationPostList');
    }, 1000);
    setTimeout(() => {
      EventEmitter.emit('refresh');
    }, 1200);
  };

  const onBackPressHandler = () => {
    goBack();
  };

  const goBack = () => {
    if (isChangeFavorite) {
      setTimeout(() => {
        navigation.goBack();
      }, 10);
      setTimeout(() => {
        EventEmitter.emit('refreshInspirationList');
      }, 25);
    } else {
      navigation.goBack();
    }

    if (doubleBack) {
      setTimeout(() => {
        navigation.goBack();
      }, 50);
    }
  };

  const redirectToProfessionalProfile = () => {
    setInspireDetails([]);
    navigation.navigate('Explore');
    setTimeout(() => {
      navigation.navigate('Explore', {
        screen: 'ProfessionalPublicProfile',
        params: {
          proId: inspireDetails.pro.id,
          doubleBack: true,
          singleBack: false,
        },
      });
    }, 10);
  };

  const viewOwnProfile = () => {
    navigation.navigate('ProfessionalPublicProfile', {
      proId: logedInUserId,
      doubleBack: false,
      singleBack: true,
    });
  };

  const likeOrNotHandler = () => {
    const likeValue =
      (inspireDetails.details.Liked &&
        inspireDetails.details.Liked.length &&
        tempLike !== -1) ||
      tempLike === 1
        ? 0
        : 1;

    if (likeValue === 0) {
      console.log('-1');
      setTempLike(-1);
    } else {
      console.log('1');
      setTempLike(1);
    }

    Put('user/like/inspiration-stories/' + inspireDetails.details.id, {
      like: likeValue,
    })
      .then((result) => {
        if (result.status === 200) {
          console.log('Service Call Success');
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

  const likeCount = () => {
    console.log(
      !inspireDetails?.details?.Likes,
      tempLike,
      inspireDetails?.details?.Liked,
    );
    if (!inspireDetails?.details?.Likes) {
      return tempLike === 1 ? 1 : 0;
    } else {
      if (
        inspireDetails?.details?.Liked &&
        inspireDetails?.details?.Liked?.length
      ) {
        return +inspireDetails.details.Likes + (tempLike === -1 ? -1 : 0);
      } else {
        return +inspireDetails.details.Likes + (tempLike === 1 ? 1 : 0);
      }
    }
  };

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        goBack();
        return true;
      },
    );
    return () => backHandlerdata.remove();
  }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      {isVisible && (
        <SafeAreaView style={[commonStyle.mainContainer, {paddingTop: 0}]}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            extraScrollHeight={5}
            //ref={scrollViewRef}
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={{
              height: Platform.OS === 'ios' ? height - 65 : height - 30,
              paddingBottom: Platform.OS === 'ios' ? 80 : 70,
            }}>
            <ScrollView>
              <View>
                <View
                  style={
                    ([commonStyle.onboardingslide],
                    isVideoFullScreen && {height: height})
                  }>
                  {inspireDetails &&
                  inspireDetails.details &&
                  inspireDetails.details.InspirationResources &&
                  inspireDetails.details.InspirationResources[0].resourceType ==
                    'image' ? (
                    // <Image
                    //   style={commonStyle.inspireinnerimg}
                    //   // defaultSource={require('../../assets/images/masonry/masonry-img-1.png')}
                    //   source={
                    //     inspireDetails &&
                    //       inspireDetails.details &&
                    //       inspireDetails.details.InspirationResources &&
                    //       inspireDetails.details.InspirationResources.length &&
                    //       inspireDetails.details.InspirationResources[0].url
                    //       ? {
                    //         uri: inspireDetails.details.InspirationResources[0]
                    //           .url,
                    //       }
                    //       : require('../../assets/images/masonry/masonry-img-1.png')
                    //   }
                    //   resizeMode="cover"
                    // />
                    <FastImage
                      style={commonStyle.inspireinnerimg}
                      source={
                        inspireDetails &&
                        inspireDetails.details &&
                        inspireDetails.details.InspirationResources &&
                        inspireDetails.details.InspirationResources.length &&
                        inspireDetails.details.InspirationResources[0].url
                          ? {
                              uri: inspireDetails.details
                                .InspirationResources[0].url,
                            }
                          : require('../../assets/images/masonry/masonry-img-1.png')
                      }
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : inspireDetails &&
                    inspireDetails.details &&
                    inspireDetails.details.InspirationResources &&
                    inspireDetails.details.InspirationResources.length &&
                    inspireDetails.details.InspirationResources[0]
                      .resourceType == 'video' ? (
                    // <Video
                    //   source={{
                    //     uri: inspireDetails.details.InspirationResources[0].url,
                    //   }}
                    //   // poster="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                    //   controls={true}
                    //   paused={false}
                    //   repeat={true}
                    //   resizeMode="contain"
                    //   style={[commonStyle.inspireinnerimg, { marginTop: 80 }]}
                    // />
                    <VideoPlayer
                      source={{
                        uri: inspireDetails.details.InspirationResources[0].url,
                      }}
                      tapAnywhereToPause={false}
                      repeat={true}
                      style={[
                        commonStyle.inspireinnerimg,
                        {marginTop: isVideoFullScreen ? 0 : 60},
                      ]}
                      navigator={null}
                      disableBack={true}
                      toggleResizeModeOnFullscreen={false}
                      onEnterFullscreen={() => {
                        setIsVideoFullScreen(true);
                      }}
                      onExitFullscreen={() => {
                        setIsVideoFullScreen(false);
                      }}
                      paused={videoPlayPause}
                    />
                  ) : null}
                </View>
                {!isVideoFullScreen && (
                  <View
                    style={[
                      commonStyle.profileserviceheader,
                      {marginTop: Platform.OS === 'ios' ? 15 : 15},
                    ]}>
                    <TouchableOpacity
                      style={commonStyle.profileserviceheaderback}
                      onPress={() => onBackPressHandler()}>
                      {Platform.OS === 'ios' ? (
                        <LeftArrowIos />
                      ) : (
                        <LeftArrowAndroid />
                      )}
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={[
                          commonStyle.profileserviceheaderback,
                          {marginLeft: 10},
                        ]}
                        activeOpacity={0.5}
                        onPress={() => shareInspritionDetaisPage()}>
                        <ShareIcon />
                      </TouchableOpacity>
                      {logedInUserId ? (
                        <>
                          {inspireDetails.details &&
                          logedInUserId == inspireDetails.details.userId ? (
                            <TouchableOpacity
                              style={[
                                commonStyle.profileserviceheaderback,
                                {marginLeft: 10},
                              ]}
                              activeOpacity={0.5}
                              onPress={() => {
                                setVisibleModal('ServicesAddGroupDialog');
                              }}>
                              <MoreVertical />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={[
                                commonStyle.profileserviceheaderback,
                                {marginLeft: 10},
                              ]}
                              activeOpacity={0.5}
                              onPress={() => {
                                favoriteOrNotHandler();
                              }}>
                              {inspireDetails.details &&
                              inspireDetails.details.favourite &&
                              inspireDetails.details.favourite.length ? (
                                <FavoritesRedSolid />
                              ) : (
                                <FavoritesIcon />
                              )}
                            </TouchableOpacity>
                          )}
                        </>
                      ) : null}
                    </View>
                  </View>
                )}
              </View>
              <View style={commonStyle.inspireinnercontent}>
                <List>
                  <View style={commonStyle.mb15}>
                    <Text style={commonStyle.blackTextR}>
                      {inspireDetails &&
                        inspireDetails.details &&
                        inspireDetails.details.description}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {inspireDetails &&
                      inspireDetails.Tags &&
                      inspireDetails.Tags.map((eachTag, index) => {
                        return !!expanded || index < 5 ? (
                          <TouchableHighlight
                            key={index}
                            style={[
                              commonStyle.outlintextbtn,
                              commonStyle.mb1,
                            ]}>
                            <Text style={commonStyle.categorytagsText}>
                              {eachTag}
                            </Text>
                          </TouchableHighlight>
                        ) : null;
                      })}
                    {inspireDetails &&
                    inspireDetails.Tags &&
                    inspireDetails.Tags.length > 5 ? (
                      <TouchableOpacity
                        onPress={() => {
                          setExpanded((expanded) => !expanded);
                        }}>
                        <Text
                          style={[
                            commonStyle.addedbtnText,
                            {marginBottom: 15},
                          ]}>
                          {expanded ? 'See Less' : 'See More'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <ListItem
                    thumbnail
                    style={[commonStyle.switchAccountView, commonStyle.mb2]}>
                    <Left style={commonStyle.reviewsAvaterwrap}>
                      <TouchableOpacity
                        onPress={() => {
                          if (logedInUserId != inspireDetails.details.userId) {
                            redirectToProfessionalProfile();
                          } else {
                            viewOwnProfile();
                          }
                        }}>
                        <Image
                          style={commonStyle.reviewsAvaterImg}
                          defaultSource={require('../../assets/images/default-user.png')}
                          source={
                            inspireDetails &&
                            inspireDetails.pro &&
                            inspireDetails.pro.profileImage
                              ? {
                                  uri: inspireDetails.pro.profileImage,
                                }
                              : require('../../assets/images/default-user.png')
                          }
                        />
                      </TouchableOpacity>
                    </Left>
                    <Body style={commonStyle.switchAccountbody}>
                      <TouchableOpacity
                        onPress={() => {
                          if (logedInUserId != inspireDetails.details.userId) {
                            redirectToProfessionalProfile();
                          } else {
                            viewOwnProfile();
                          }
                        }}>
                        <Text
                          style={[commonStyle.blackTextR, commonStyle.mb05]}>
                          {inspireDetails &&
                            inspireDetails.professional &&
                            inspireDetails.professional.businessName}
                        </Text>
                      </TouchableOpacity>
                      <Text style={commonStyle.grayText14} numberOfLines={1}>
                        {inspireDetails && inspireDetails.details
                          ? moment(
                              inspireDetails &&
                                inspireDetails.details &&
                                inspireDetails.details.createdAt,
                            ).fromNow()
                          : null}
                      </Text>
                    </Body>
                    {logedInUserId &&
                    inspireDetails.details &&
                    logedInUserId != inspireDetails.details.userId ? (
                      <TouchableOpacity
                        style={commonStyle.unfollowbtn}
                        onPress={() => viewOrFollowingProHandler()}>
                        <Text style={commonStyle.unfollowbtnText}>
                          {inspireDetails.followed &&
                          inspireDetails.followed.length
                            ? 'View'
                            : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={commonStyle.unfollowbtn}
                        onPress={() => {
                          if (logedInUserId != inspireDetails.details.userId) {
                            redirectToProfessionalProfile();
                          } else {
                            viewOwnProfile();
                          }
                        }}>
                        <Text style={commonStyle.unfollowbtnText}>View</Text>
                      </TouchableOpacity>
                    )}
                    {/* {logedInUserId &&
                    inspireDetails.details &&
                    logedInUserId == inspireDetails.details.userId ? (
                      <TouchableOpacity
                        style={commonStyle.unfollowbtn}
                        onPress={() => {
                          viewOwnProfile();
                        }}>
                        <Text style={commonStyle.unfollowbtnText}>View</Text>
                      </TouchableOpacity>
                    ) : null} */}
                  </ListItem>
                </List>

                <View style={commonStyle.likecommentwrap}>
                  {logedInUserId && (
                    <TouchableOpacity
                      style={commonStyle.commentbtnwrap}
                      disabled={
                        !(
                          logedInUserId &&
                          inspireDetails.details &&
                          logedInUserId != inspireDetails.details.userId
                        )
                      }
                      onPress={likeOrNotHandler}>
                      {logedInUserId &&
                      inspireDetails.details &&
                      logedInUserId != inspireDetails.details.userId ? (
                        (inspireDetails?.details?.Liked &&
                          inspireDetails?.details?.Liked?.length &&
                          tempLike !== -1) ||
                        tempLike === 1 ? (
                          <LikeSolidIcon />
                        ) : (
                          <LikeIcon />
                        )
                      ) : (
                        <LikeIcon />
                      )}
                      <Text style={[commonStyle.grayText16, commonStyle.ml1]}>
                        {likeCount()}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {logedInUserId && (
                    <TouchableOpacity
                      style={commonStyle.commentbtnwrap}
                      disabled={
                        !(
                          logedInUserId &&
                          inspireDetails.details &&
                          logedInUserId != inspireDetails.details.userId
                        )
                      }
                      onPress={() => {
                        if (!!inputRef) {
                          scrollViewRef?.current?.scrollToEnd({
                            animated: false,
                          });
                          setTimeout(() => {
                            inputRef?.current?.focus();
                          }, 1000);
                        }
                      }}>
                      <CommentIcon />
                      <Text style={[commonStyle.grayText16, commonStyle.ml1]}>
                        {inspireDetails && inspireDetails.comments
                          ? inspireDetails.comments.count
                          : 0}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {inspireDetails &&
              inspireDetails.comments &&
              inspireDetails.comments.count ? (
                <InspireComments
                  commentsDetails={inspireDetails.comments}
                  likeOrUnLikeCommentByProfessional={
                    likeOrUnLikeCommentByProfessional
                  }
                  logedInUserId={logedInUserId}
                />
              ) : null}

              {inspireDetails &&
              inspireDetails.details &&
              inspireDetails.otherInspiration &&
              inspireDetails.otherInspiration.count &&
              logedInUserId != inspireDetails.details.userId ? (
                <InspireMoreProfessional
                  otherInspiration={
                    inspireDetails && inspireDetails.otherInspiration
                  }
                  professionalDetails={{
                    coverImage: inspireDetails.professional.coverImage,
                    businessName: inspireDetails.professional.businessName,
                    pro: inspireDetails.pro,
                  }}
                  logedInUserId={logedInUserId ? false : true}
                />
              ) : null}
            </ScrollView>

            {logedInUserId &&
            inspireDetails.details &&
            logedInUserId != inspireDetails.details.userId ? (
              <View
                style={{
                  paddingBottom: 5,
                  backgroundColor: '#fff',
                  paddingTop: 5,
                  flexShrink: 1,
                  position: 'absolute',
                  bottom: Platform.OS === 'ios' ? 0 : 0,
                  width: width,
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.18,
                  shadowRadius: 5.95,
                  elevation: 3,
                }}>
                <View style={[commonStyle.commentinput]}>
                  <TextInput
                    ref={inputRef}
                    style={[
                      commonStyle.textInput,
                      isMessageInputFocus && commonStyle.focusinput,
                      {paddingRight: 45},
                    ]}
                    value={messageInput}
                    onFocus={() => setIsMessageInputFocus(true)}
                    onChangeText={(text) => setMessageInput(text)}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    placeholder="Write a comment"
                    placeholderTextColor={'#939DAA'}
                    maxLength={1000}
                  />
                  {messageInput.trim().length > 0 ? (
                    <TouchableOpacity
                      style={[
                        commonStyle.messagesendicon,
                        {top: Platform.OS === 'ios' ? 22 : 23, right: 25},
                      ]}
                      onPress={() => inspireMessageHandler()}>
                      <SendIcon />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}
          </KeyboardAwareScrollView>
          {/* <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.commentinput]}>
            <TextInput
              style={[
                commonStyle.textInput,
                isFullNameFocus && commonStyle.focusinput,
              ]}
              onFocus={() => setIsFullNameFocus(true)}
              onChangeText={(text) => setFullName(text)}
              returnKeyType="done"
              autoCapitalize={'none'}
              placeholder="Write a comment..."
              placeholderTextColor={'#939DAA'}
            />
          </View>
        </View> */}
        </SafeAreaView>
      )}

      {/* Inspire Inner modal start */}
      <Modal
        isVisible={visibleModal === 'ServicesAddGroupDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.othersbottomModal}>
        <View>
          <View style={commonStyle.othersModal}>
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}
              onPress={() => {
                setVisibleModal({visibleModal: null});
                setTimeout(() => {
                  navigation.navigate('InspirationEdit', {
                    inspiritionId: inspiritionId,
                  });
                }, 10);
              }}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/edit-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Edit post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyle.searchBarText, {padding: 12}]}
              onPress={() => deletePostHandler()}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/trash-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Delete post</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={commonStyle.modalcancle}
            activeOpacity={0.9}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Inspire Inner modal end */}
    </Fragment>
  );
};

export default InspireInner;
