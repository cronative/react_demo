import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';
import {Get, Post} from '../api/apiAgent';
import * as Constant from '../api/constant';
import {
  Container,
  Header,
  List,
  ListItem,
  Body,
  Left,
  Right,
} from 'native-base';
import {RightAngle} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {AllCategoryData} from '../utility/staticData';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
const {width, height} = Dimensions.get('window');

const AllCategories = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [catList, setCatList] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const fetchData = () => {
    setLoader(true);
    Get('/user/list-categories', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          setCatList(result.data.rows);
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
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <SafeAreaView
        style={[
          commonStyle.mainContainer,
          commonStyle.pb1,
          {paddingTop: 0, height: height - 60},
        ]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              {catList &&
                catList.map((item, index) => (
                  <List key={index} style={[commonStyle.categoriseList]}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <TouchableOpacity
                        style={commonStyle.serviceListtouch}
                        activeOpacity={0.4}
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
                        <Left
                          style={[
                            commonStyle.accountlistavaterbg,
                            {backgroundColor: item.color},
                          ]}>
                          {item.logoUrl ? (
                            <Image
                              style={commonStyle.avatericon}
                              source={
                                item.logoUrl === null
                                  ? require('../assets/images/gift-box.png')
                                  : {uri: item.logoUrl}
                              }
                            />
                          ) : (
                            <Image
                              style={commonStyle.avatericon}
                              source={require('../assets/images/gift-box.png')}
                            />
                          )}
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                          <Text
                            style={[commonStyle.blackTextR18, commonStyle.mb05]}
                            numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={[commonStyle.grayText16]}>
                            {item.description}
                          </Text>
                        </Body>
                        <View
                          style={{alignSelf: 'center', alignItems: 'center'}}>
                          <RightAngle />
                        </View>
                      </TouchableOpacity>
                    </ListItem>
                  </List>
                ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

export default AllCategories;
