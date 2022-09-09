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
} from 'react-native';
import {Container} from 'native-base';
import {StarIcon, MapPointer} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {ServiceData} from '../utility/staticData';
import {useNavigation} from '@react-navigation/native';
import {Get} from '../api/apiAgent';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';

const ExploreViewAllRated = (props) => {
  // Declare the constant
  const navigation = useNavigation();
  const {type, location} = props.route.params;
  const [loader, setLoader] = useState(true);
  const [listData, setListData] = useState([]);

  let lat = location[0];
  let long = location[1];

  // This function will call once the current state will change
  useEffect(() => {
    let headerMsg;
    if (type == 'top_rated') {
      headerMsg = 'Top rated';
      commonFunc(
        `user/top-rated-professionals${
          lat && long ? '?latitude=' + lat + '&longitude=' + long : ''
        }`,
      );
    } else if (type == 'popular_in_hair') {
      headerMsg = 'Popular in Hair';
      commonFunc(
        `/user/popular-professionals?type=hair${
          lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
        }`,
      );
    } else {
      headerMsg = 'Popular in Nails';
      commonFunc(
        `/user/popular-professionals?type=nails${
          lat && long ? '&latitude=' + lat + '&longitude=' + long : ''
        }`,
      );
    }
    navigation.setOptions({headerTitle: headerMsg});
  }, []);

  // This method is a common function
  const commonFunc = (urlString) => {
    Get(urlString)
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          setListData(result.data.rows);
        }
      })
      .catch((error) => {
        setListData([]);
        setLoader(false);
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <View style={commonStyle.searchMapWrap}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                backgroundColor: '#fff',
              }}>
              {listData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('ProfessionalPublicProfile', {
                      proId: item.id,
                      singleBack: true,
                      doubleBack: false,
                    })
                  }>
                  <View style={commonStyle.ListViewCard}>
                    <Image
                      style={commonStyle.ListViewCardImg}
                      source={
                        item.ProResources &&
                        item.ProResources[0] &&
                        item.ProResources[0].url
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
                                item.profileImage === null
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
                            style={[commonStyle.blackText16, commonStyle.mb03]}>
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
                          style={[commonStyle.subtextblack, commonStyle.mb05]}>
                          {item.ProMetas[0] &&
                          item.ProMetas[0].businessName &&
                          item.ProMetas[0].businessName
                            ? item.ProMetas[0].businessName
                            : item.username}
                        </Text>
                        {/* <View style={commonStyle.categorytagsWrap}>
                              <TouchableHighlight style={commonStyle.tagsOutline}>
                                <Text style={commonStyle.categorytagsText}>MakeUp</Text>
                              </TouchableHighlight>
                            </View> */}
                        <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                          {item.ProMetas &&
                          item.ProMetas[0] &&
                          item.ProMetas[0].address
                            ? item.ProMetas[0].address
                            : ''}
                        </Text>
                        {item.distance ? (
                          <TouchableHighlight>
                            <Text style={commonStyle.grayText14}>
                              {' '}
                              <MapPointer /> {Number(item.distance).toFixed(2)}
                              miles from you
                            </Text>
                          </TouchableHighlight>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Container>
    </Fragment>
  );
};
export default ExploreViewAllRated;
