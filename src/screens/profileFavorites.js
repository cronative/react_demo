import React, {Fragment, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image as ImageU,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Container,
  List,
  ListItem,
  Left,
  Body,
  ScrollableTab,
  Tab,
  Tabs,
} from 'native-base';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import Image from 'react-native-scalable-image';
import commonStyle from '../assets/css/mainStyle';
import {Get, Put} from '../api/apiAgent';
import {SingleInspire} from '../components/inspire';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import EventEmitter from 'react-native-eventemitter';
import * as Constant from '../api/constant';
import global from '../components/commonservices/toast';
import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/core';

const ProfileFavorites = ({navigation}) => {
  const [message, setMessage] = useState(null);
  const [follingMessage, setFollingMessage] = useState(null);
  const [favoriteInspireList, setFavoriteInspireList] = useState([]);
  const [favoriteProfessionalList, setFavoriteProfessionalList] = useState([]);
  const [loader, setLoader] = useState(false);
  const {width, height} = Dimensions.get('window');

  const [loaderFav, setLoaderFav] = useState(false);
  const [loaderPro, setLoaderPro] = useState(false);
  // useEffect(() => {
  //   fetchFavoritesInspirations();
  //   fetchFavoritesProfessional();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavoritesInspirations();
      fetchFavoritesProfessional();
    }, []),
  );

  useEffect(() => {
    EventEmitter.on('refreshInspirationList', () => {
      fetchFavoritesInspirations();
    });
  }, []);

  // Tabs index count
  const [activeTabValue, setActiveTabValue] = useState(0);
  const onChangeTabValue = (event) => {
    console.log('onChangeTabValue', event);
    setActiveTabValue(event.i);
  };

  const fetchFavoritesInspirations = () => {
    setLoaderFav(true);
    Get('user/favourite/inspiration-stories', '')
      .then((result) => {
        setMessage(result.message);
        if (result.status === 200 && result.data && result.data.length > 0) {
          let modifyData = result.data.map((eachItem) => {
            eachItem.favourite = [
              {
                id: eachItem.id,
                inspirationId: eachItem.inspirationId,
                status: eachItem.status,
                type: eachItem.type,
              },
            ];
            eachItem.description = eachItem.InspirationStory.description;
            eachItem.title = eachItem.InspirationStory.title;
            eachItem.userId = eachItem.InspirationStory.userId;
            eachItem.id = eachItem.InspirationStory.id;
            eachItem.InspirationResources =
              eachItem.InspirationStory.InspirationResources;
            eachItem.ProMeta = eachItem.InspirationStory.ProMeta;
            eachItem.pro = eachItem.InspirationStory.pro;
            return eachItem;
          });
          console.log(
            '********************\n\n\n\nuser/favourite/inspiration-stories',
            modifyData,
          );
          setFavoriteInspireList(modifyData);
          setTimeout(() => {
            setLoaderFav(false);
          }, 4000);
        } else if (
          result.status === 200 &&
          result.data &&
          result.data.length == 0
        ) {
          setFavoriteInspireList([]);
          setTimeout(() => {
            setLoaderFav(false);
          }, 4000);
        }
      })
      .catch((error) => {
        console.log(
          '********************\n\n\n\nuser/favourite/inspiration-stories',
          error,
        );
        setMessage('No inspiration posts yet');
        setTimeout(() => {
          setLoaderFav(false);
        }, 4000);
      });
  };

  const fetchFavoritesProfessional = () => {
    setLoaderPro(true);
    Get('user/follow/professionals', '')
      .then((result) => {
        setFollingMessage(result.message);
        if (result.status === 200 && result.data && result.data.length > 0) {
          let modifyList = result.data.map((eachProfessional, index) => {
            eachProfessional.isFollow = 1;
            eachProfessional.categoryList =
              eachProfessional.professional.ProCategories.map(
                (eachCategory) => {
                  return ' ' + eachCategory.categoryName;
                },
              );
            eachProfessional.categoryList = eachProfessional.categoryList
              .toString()
              .trimStart();
            return eachProfessional;
          });
          setFavoriteProfessionalList(modifyList);
          console.log('user/follow/professionals ', favoriteProfessionalList);
          setLoaderPro(false);
        } else if (
          result.status === 200 &&
          result.data &&
          result.data.length == 0
        ) {
          console.log('user/follow/professionals ', favoriteProfessionalList);
          setFavoriteProfessionalList([]);
          setLoaderPro(false);
        }
      })
      .catch((error) => {
        console.log('user/follow/professionals ', error);
        setFollingMessage('You are not following any pros');
        setLoaderPro(false);
      });
  };

  const modificationInspireFavourite = (data, index) => {
    console.log('modificationInspireFavourite called ');
    fetchFavoritesInspirations();
    // const tempInspireDetails = [...favoriteInspireList];
    // tempInspireDetails[index] = data;
    // setFavoriteInspireList([...tempInspireDetails]);
    // console.log("modificationInspireFavourite");
  };

  const followOrUnFllowProfessionalHandler = (index) => {
    const tempProfessionalList = [...favoriteProfessionalList];
    const tempProfessionalDetails = tempProfessionalList[index];
    setLoaderPro(true);
    Put('user/follow/professionals/' + tempProfessionalDetails.proId, {
      follow: tempProfessionalDetails.isFollow ? 0 : 1,
    })
      .then((result) => {
        console.log(result);
        setLoaderPro(false);
        if (result.status === 200) {
          console.log('success');
          global.showToast(result.message, 'success');
          // tempProfessionalDetails.isFollow = tempProfessionalDetails.isFollow
          //   ? 0
          //   : 1;
          // tempProfessionalList[index] = tempProfessionalDetails;
          // console.log(tempProfessionalList);
          // setFavoriteProfessionalList([...tempProfessionalList]);
          fetchFavoritesProfessional();
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoaderPro(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };

  const refreshFav = () => {
    console.log('REFRESH REFRESH REFRESH');
    fetchFavoritesInspirations();
  };

  const refreshProf = () => {
    console.log('REFRESH REFRESH REFRESH');
    fetchFavoritesProfessional();
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {/* {loader ? <ActivityLoaderSolid /> : null} */}
      <Container style={[commonStyle.mainContainer]}>
        <Tabs
          renderTabBar={() => (
            <ScrollableTab style={commonStyle.customScrollTab} />
          )}
          onChangeTab={(event) => onChangeTabValue(event)}
          prerenderingSiblingsNumber={2}
          style={commonStyle.tabsStyle}
          tabContainerStyle={commonStyle.tabsconStyle}
          tabBarUnderlineStyle={[
            commonStyle.tabBarUnderlineStyle,
            activeTabValue === 0
              ? {marginStart: Platform.OS === 'ios' ? -5 : 0}
              : {marginStart: Platform.OS === 'ios' ? -55 : 0},
          ]}>
          {/* activeTabValue === 0 ? {marginStart: Platform.OS === 'ios' ? -4 : 0} : {marginStart: Platform.OS === 'ios' ? -55 : 0} */}
          <Tab
            heading="Professionals"
            tabStyle={[commonStyle.inactivetabStyle, commonStyle.tabposions1]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabposions1,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            {loaderPro ? (
              <ActivityLoaderSolid />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={loader} onRefresh={refreshProf} />
                }>
                {favoriteProfessionalList &&
                favoriteProfessionalList.length === 0 ? (
                  <View style={commonStyle.noMassegeWrap}>
                    <ImageU
                      style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                      source={require('../assets/images/no-massege-img.png')}
                    />
                    <Text
                      style={[commonStyle.grayText16, commonStyle.textCenter]}>
                      {'You are not following any pros'}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      commonStyle.horizontalPadd,
                      commonStyle.mt1,
                      commonStyle.mb3,
                    ]}>
                    {favoriteProfessionalList.map((eachProfessional, index) => (
                      <List key={index} style={commonStyle.favoriteslistWrap}>
                        <ListItem
                          activeOpacity={1}
                          thumbnail
                          style={[commonStyle.switchAccountView]}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              paddingVertical: 18,
                              paddingLeft: 15,
                              paddingRight: 15,
                              borderRadius: 20,
                              overflow:"hidden"
                            }}
                            onPress={() =>
                              navigation.navigate('ProfessionalPublicProfile', {
                                proId: eachProfessional?.professional?.id,
                                doubleBack: false,
                                singleBack: true,
                              })
                            }
                            >
                            <View style={[commonStyle.favoritesUserAvaterwrap]}>
                              <ImageU
                                style={commonStyle.favoritesUserAvaterImg}
                                resizeMode={'contain'}
                                defaultSource={require('../assets/images/default-user.png')}
                                source={
                                  eachProfessional.professional &&
                                  eachProfessional.professional.profileImage
                                    ? {
                                        uri: eachProfessional.professional
                                          .profileImage,
                                      }
                                    : require('../assets/images/default-user.png')
                                }
                                onPress={() => {
                                  navigation.navigate(
                                    'ProfessionalPublicProfile',
                                    {
                                      proId: eachProfessional?.professional?.id,
                                      doubleBack: false,
                                      singleBack: true,
                                    },
                                  );
                                }}
                              />
                            </View>
                            <Body style={commonStyle.switchAccountbody}>
                              <Text
                                style={commonStyle.blackTextR}
                                // onPress={() => {
                                //   navigation.navigate(
                                //     'ProfessionalPublicProfile',
                                //     {
                                //       proId: eachProfessional?.professional?.id,
                                //       doubleBack: false,
                                //       singleBack: true,
                                //     },
                                //   );
                                // }}
                                >
                                {eachProfessional.professional &&
                                  eachProfessional.professional.ProMeta &&
                                  eachProfessional.professional.ProMeta
                                    .businessName}
                              </Text>
                              <Text
                                style={commonStyle.grayText14}
                                numberOfLines={1}>
                                {eachProfessional.categoryList}
                              </Text>
                            </Body>
                            <TouchableOpacity
                              style={[
                                commonStyle.unfollowbtn,
                                {marginLeft: 10},
                              ]}
                              onPress={() =>
                                followOrUnFllowProfessionalHandler(index)
                              }>
                              <Text style={commonStyle.unfollowbtnText}>
                                {eachProfessional.isFollow
                                  ? 'Unfollow'
                                  : 'Follow'}
                              </Text>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </ListItem>
                      </List>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </Tab>
          <Tab
            heading="Favorite inspiration"
            tabStyle={[commonStyle.inactivetabStyle, commonStyle.tabposions2]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabposions2,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={loader} onRefresh={refreshFav} />
              }>
              {loaderFav ? <ActivityLoaderSolid /> : null}
              {favoriteInspireList && favoriteInspireList.length === 0 ? (
                <View style={commonStyle.noMassegeWrap}>
                  <ImageU
                    style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                    source={require('../assets/images/no-massege-img.png')}
                  />
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    {
                      'No inspiration posts saved yet - find pros and save posts you love'
                    }
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    paddingLeft: 12,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {/* <RNMasonryScroll

                      removeClippedSubviews={true}
                      columns={2}
                      horizontal={false}> */}
                  {favoriteInspireList && favoriteInspireList.length > 0
                    ? favoriteInspireList.map((item, index) => {
                        return (
                          <View style={{width: 0.48 * width}}>
                            <SingleInspire
                              key={index}
                              itemDetails={item}
                              index={index}
                              modificationInspireFavourite={
                                modificationInspireFavourite
                              }
                            />
                          </View>
                        );
                      })
                    : [<></>]}
                  {/* </RNMasonryScroll> */}
                </View>
              )}
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    </Fragment>
  );
};

export default ProfileFavorites;
