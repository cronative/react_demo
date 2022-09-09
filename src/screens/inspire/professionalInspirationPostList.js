import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Image as ImageU,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Container, Body } from 'native-base';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import commonStyle from '../../assets/css/mainStyle';
import { FAB } from 'react-native-paper';
import { LeftArrowIos, LeftArrowAndroid } from '../../components/icons';
import { SingleInspire } from '../../components/inspire';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import { Get } from '../../api/apiAgent';
import EventEmitter from 'react-native-eventemitter';
import { useFocusEffect } from '@react-navigation/core';

const ProfessionalInspirationPostList = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [inspireDetailsList, setInspireDetailsList] = useState([]);
  const [loader, setLoader] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    fetchCreatedInspirations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCreatedInspirations();
    }, []),
  );

  useEffect(() => {
    EventEmitter.on('refresh', () => {
      console.log('Commingg....');
      fetchCreatedInspirations();
    });
  }, []);

  function FlotingAddIcon() {
    return (
      <ImageU
        style={{
          resizeMode: 'contain',
          width: 20,
          height: 20,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 2,
        }}
        source={require('../../assets/images/plus.png')}
      />
    );
  }

  const fetchCreatedInspirations = (categoryId = null) => {
    setLoader(true);
    Get('pro/inspiration-stories', '')
      .then((result) => {
        setLoader(false);
        setMessage(result.message);
        if (result.status === 200 && result.data.length) {
          setInspireDetailsList(result.data);
        }
      })
      .catch((error) => {
        setMessage('No inspiration posts yet');
        setLoader(false);
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      <SafeAreaView style={[commonStyle.mainContainer]}>
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => { console.log("TESTTETE"); navigation.goBack() }}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={[commonStyle.headerbacktitle]}>
            {!loader && (
              <Text style={commonStyle.blackText16}>
                Inspiration posts (
                {inspireDetailsList && inspireDetailsList.length})
              </Text>
            )}
          </Body>
        </View>
        <View style={{ paddingBottom: 75 }}>
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
                paddingLeft: 8,
                paddingBottom: 100,
                // backgroundColor: '#ff0',
              }}>
              <RNMasonryScroll
                // removeClippedSubviews={true}
                columns={2}
                horizontal={false}
                style={{ paddingTop: 10 }}>
                {inspireDetailsList && inspireDetailsList.length
                  ? inspireDetailsList.map((item, index) => (
                    <View style={{ width: 0.48 * width }}>
                      <SingleInspire
                        key={index}
                        itemDetails={item}
                        index={index}
                        isProfessionalCreated={true}
                        professionalDetails={null}
                      />
                    </View>
                  ))
                  : null}
              </RNMasonryScroll>
            </View>
          )}
        </View>
      </SafeAreaView>
      {!loader && (
        <FAB
          style={commonStyle.floting}
          icon={(props) => <FlotingAddIcon {...props} />}
          onPress={() =>
            // navigation.navigate('InspirationAddOrEdit', {
            //   inspiritionId: 21,
            // })
            navigation.navigate('InspirationAddOrEdit')
          }
        />
      )}
    </Fragment>
  );
};

export default ProfessionalInspirationPostList;
