import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image as ImageU,
  RefreshControl,
} from 'react-native';
import RNMasonryScroll from 'react-native-masonry-scrollview';

import commonStyle from '../../assets/css/mainStyle';
import {Get} from '../../api/apiAgent';
import {SingleInspireFollowing, SingleInspire} from '../../components/inspire';
import EventEmitter from 'react-native-eventemitter';
import {useFocusEffect} from '@react-navigation/core';

const InspireFollowingTab = () => {
  const [inspireDetailsList, setInspireDetailsList] = useState([]);
  const [message, setMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  // useEffect(() => {
  //   fetchInspireFollingDetails();
  // }, []);

  // useEffect(() => {
  //   EventEmitter.on('refreshInspirationList', () => {
  //     fetchInspireFollingDetails();
  //   });
  // }, []);

  useEffect(() => {
    console.log('InspireFollowingTab is calling');
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInspireFollingDetails();
    }, []),
  );

  const fetchInspireFollingDetails = () => {
    setLoader(true);
    Get('user/my-following-professional-inspirations', '')
      .then((result) => {
        console.log('result  fetchInspireFollingDetails =  ', result);
        setMessage(result.message);
        if (result.status === 200) {
          setInspireDetailsList(result.data.rows);
        }
        setTimeout(() => {
          setLoader(false);
        }, 2000);
      })
      .catch((error) => {
        setMessage('No following inspirition yet');
        setTimeout(() => {
          setLoader(false);
        }, 2000);
      });
  };

  const modificationInspireFavourite = (data, index) => {
    // const tempInspireDetails = [...inspireDetailsList];
    // tempInspireDetails[index] = data;
    // setInspireDetailsList([...tempInspireDetails]);
    fetchInspireFollingDetails();
  };

  const refreshPage = () => {
    fetchInspireFollingDetails();
  };

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loader} onRefresh={refreshPage} />
        }>
        {!inspireDetailsList || inspireDetailsList.length === 0 ? (
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
              columns={1}
              horizontal={false}
              style={{paddingTop: 5}}>
              {inspireDetailsList && inspireDetailsList.length
                ? inspireDetailsList.map((item, index) => (
                    <SingleInspireFollowing
                      key={index}
                      itemDetails={item}
                      index={index}
                      modificationInspireFavourite={
                        modificationInspireFavourite
                      }
                      professionalDetails={null}
                    />
                  ))
                : null}
            </RNMasonryScroll>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InspireFollowingTab;
