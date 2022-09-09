import React, {useState, useEffect} from 'react';
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
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {Get} from '../../api/apiAgent';
import {SingleInspire} from '../../components/inspire';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import EventEmitter from 'react-native-eventemitter';
import {useFocusEffect} from '@react-navigation/core';
import {useCallback} from 'react';

const InspireForYouTab = () => {
  const [inspireDetailsList, setInspireDetailsList] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState(null);
  const [message, setMessage] = useState(null);
  const [interestedCategoryDetails, setInterestedCategoryDetails] = useState(
    [],
  );
  const [defaultCategoryDetails, setDefaultCategoryDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderCat, setLoaderCat] = useState(false);
  const [loaderInsp, setLoaderInsp] = useState(false);

  const {width, height} = Dimensions.get('window');

  // useEffect(() => {
  //   EventEmitter.on('refreshInspirationList', () => {
  //     fetchInspireForYouDetails();
  //   });
  // }, []);

  // useEffect(() => {
  //   fetchPreferedCategoryDetailsList();
  //   fetchInspireForYouDetails();
  // }, []);
  useEffect(() => {
    console.log('InspireForYouTab is calling');
  }, []);
  useFocusEffect(
    useCallback(() => {
      setFilterCategoryId(null);
      fetchPreferedCategoryDetailsList();
      fetchInspireForYouDetails();
    }, []),
  );

  const filterBasedOnCategoryHandler = (categoryId, index) => {
    if (filterCategoryId === categoryId) {
      setFilterCategoryId(null);
      fetchInspireForYouDetails();
    } else {
      setFilterCategoryId(categoryId);
      fetchInspireForYouDetails(categoryId);
    }
  };

  const modificationInspireFavourite = (data, index) => {
    const tempInspireDetails = [...inspireDetailsList];
    tempInspireDetails[index] = data;
    setInspireDetailsList([...tempInspireDetails]);
  };

  const fetchInspireForYouDetails = (categoryId = null) => {
    setLoaderInsp(true);
    let url = categoryId
      ? 'user/inspiration-for-you?categoryId=' + categoryId
      : 'user/inspiration-for-you';
    Get(url, '')
      .then((result) => {
        setMessage(result.message);
        if (result.status === 200) {
          setInspireDetailsList(result.data);
        }
        setTimeout(() => {
          setLoaderInsp(false);
        }, 4000);
      })
      .catch((error) => {
        setMessage('No inspiration posts yet');
        setTimeout(() => {
          setLoaderInsp(false);
        }, 4000);
      });
  };

  const fetchPreferedCategoryDetailsList = () => {
    setLoaderCat(true);
    Get('user/customer-preffered-category', '')
      .then((result) => {
        if (result.status === 200) {
          console.log(
            '*****\n\nfetchPreferedCategoryDetailsList  ',
            result.data,
          );
          setInterestedCategoryDetails(result.data);
        } else {
          fetchDefaultCategories();
        }
        setTimeout(() => {
          setLoaderCat(false);
        }, 4000);
      })
      .catch((error) => {
        fetchDefaultCategories();
        setTimeout(() => {
          setLoaderCat(false);
        }, 4000);
      });
  };

  const refreshPage = () => {
    setLoader(true);
    setFilterCategoryId(null);
    fetchPreferedCategoryDetailsList();
    fetchInspireForYouDetails();
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  const fetchDefaultCategories = () => {
    Get('user/list-categories?isPopular=1&page=1&records=7')
      .then((result) => {
        setDefaultCategoryDetails(result.data.rows);
      })
      .catch((err) => {
        console.log('Error while trying to fetch categories');
      });
  };

  return (
    <SafeAreaView>
      {loader || loaderCat || loaderInsp ? <ActivityLoaderSolid /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loader} onRefresh={refreshPage} />
        }>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={commonStyle.scrollCss}>
          <View
            style={[
              commonStyle.sortAreaWrap,
              {paddingStart: 20, paddingTop: 10, paddingBottom: 10},
            ]}>
            {interestedCategoryDetails && interestedCategoryDetails.length
              ? interestedCategoryDetails.map((eachCategory, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      commonStyle.tagsOutline,
                      eachCategory.categoryId === filterCategoryId
                        ? {borderWidth: 1, borderColor: '#F36A46'}
                        : null,
                    ]}
                    onPress={() =>
                      filterBasedOnCategoryHandler(
                        eachCategory.categoryId,
                        index,
                      )
                    }>
                    <Text
                      style={[
                        commonStyle.categorytagsText,
                        eachCategory.categoryId === filterCategoryId
                          ? {color: '#F36A46'}
                          : null,
                      ]}>
                      {eachCategory.Category && eachCategory.Category.name}
                    </Text>
                  </TouchableOpacity>
                ))
              : null}
            {!interestedCategoryDetails?.length &&
            defaultCategoryDetails?.length
              ? defaultCategoryDetails.map((eachCategory, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      commonStyle.tagsOutline,
                      eachCategory.id === filterCategoryId
                        ? {borderWidth: 1, borderColor: '#F36A46'}
                        : null,
                    ]}
                    onPress={() =>
                      filterBasedOnCategoryHandler(eachCategory.id, index)
                    }>
                    <Text
                      style={[
                        commonStyle.categorytagsText,
                        eachCategory.id === filterCategoryId
                          ? {color: '#F36A46'}
                          : null,
                      ]}>
                      {eachCategory?.name}
                    </Text>
                  </TouchableOpacity>
                ))
              : null}
          </View>
        </ScrollView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {inspireDetailsList && inspireDetailsList.length === 0 ? (
            <View style={commonStyle.noMassegeWrap}>
              <ImageU
                style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
                source={require('../../assets/images/no-massege-img.png')}
              />
              <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                {'No inspiration posts yet'}
              </Text>
            </View>
          ) : (
            <View style={{paddingLeft: 8, paddingBottom: 70}}>
              <RNMasonryScroll
                // removeClippedSubviews={true}
                columns={2}
                horizontal={false}
                style={{paddingTop: 5, paddingBottom: 20}}>
                {inspireDetailsList && inspireDetailsList.length
                  ? inspireDetailsList.map((item, index) => (
                      <View style={{width: 0.48 * width}} key={index}>
                        <SingleInspire
                          key={index}
                          itemDetails={item}
                          index={index}
                          modificationInspireFavourite={
                            modificationInspireFavourite
                          }
                          professionalDetails={null}
                        />
                      </View>
                    ))
                  : null}
              </RNMasonryScroll>
            </View>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InspireForYouTab;
