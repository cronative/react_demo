import React, {Fragment, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Platform,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {List, ListItem, Body, Left} from 'native-base';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import Pulse from 'react-native-pulse';
import {OnboardingNotification, CheckedIconActive} from '../components/icons';

import commonStyle from '../assets/css/mainStyle';
import {OnboardingStyles} from '../utility/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setNavigationValue} from '../store/actions';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';

const Onboarding = ({navigation}) => {
  const [showLoading, setShowLoading] = useState(true);
  const dispatch = useDispatch();
  const redirectToStartScreen = async (type) => {
    await AsyncStorage.setItem('isCompleteOnboarding', '1');
    if (type === 'Explore') {
      await AsyncStorage.setItem('isClickedExplore', '1');
      dispatch(setNavigationValue(4));
    } else {
      navigation.navigate(type);
    }
  };

  const getData = async () => {
    let exploreData = await AsyncStorage.getItem('isClickedExplore');
    if (exploreData === '1') {
      dispatch(setNavigationValue(4));
    }

    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  };

  useEffect(() => {
    getData();
  }, []);

  return !!showLoading ? (
    <ActivityLoaderSolid />
  ) : (
    <Fragment style={{backgroundColor: '#fff'}}>
      <StatusBar backgroundColor="#F36A46" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[commonStyle.mainContainer, {paddingTop: 0}]}
        bounces={false}>
        <View>
          <Swiper
            dot={<View style={styles.dotsinactive} />}
            activeDot={<View style={styles.dotsactive} />}
            paginationStyle={{
              bottom: Platform.OS === 'ios' ? 0 : 0,
            }}
            style={styles.swiperstyle}
            loop={false}>
            <View style={commonStyle.onboardingslide}>
              <Image
                style={commonStyle.onboardingimage}
                source={require('../assets/images/onboarding/onboarding-process-img-1.png')}
                resizeMode="cover"
              />
              <View style={commonStyle.onboardingtextwrap}>
                <Text style={commonStyle.onboardingtextheading}>
                  Discover and book top rated professionals near you
                </Text>
                <Text style={commonStyle.onboardingsubtext}>
                  With thousands of beauty, wellness and freelance professionals
                  on our app its easier to find exactly what you are looking
                  for.
                </Text>
              </View>
            </View>
            <View style={[commonStyle.onboardingslide, commonStyle.bgimage]}>
              <Image
                style={commonStyle.onboardingimage}
                source={require('../assets/images/onboarding/onboarding-process-img-2.png')}
                resizeMode="cover"
              />
              <View style={commonStyle.onboardingtextwrap}>
                <Text style={commonStyle.onboardingtextheading}>
                  Find Inspiration and follow your favourite professionals
                </Text>
                <Text style={commonStyle.onboardingsubtext}>
                  Keep up with your favourite professionals and find inspiration
                  for your next booking.
                </Text>
              </View>
            </View>
            <View style={commonStyle.onboardingslide}>
              {/* <Image style={commonStyle.onboardingimage} source={require('../assets/images/onboarding/onboarding-process-img-1.png')} /> */}
              <View style={commonStyle.onboardingheight}>
                <View style={commonStyle.notificationCenter}>
                  <Pulse
                    color="#ffffff"
                    numPulses={4}
                    diameter={200}
                    speed={20}
                    duration={2000}
                  />
                  <View style={commonStyle.notificationposition}>
                    <OnboardingNotification />
                  </View>
                </View>

                <View style={commonStyle.onboardingcardwrap}>
                  <View style={commonStyle.onboardingcard1}></View>
                  <View style={commonStyle.onboardingcard2}></View>
                  <View style={commonStyle.onboardingcard3}>
                    <List>
                      <ListItem style={commonStyle.commListitem}>
                        <Left>
                          <Text style={commonStyle.textdategray}>
                            Today, 23 Nov, 2021
                          </Text>
                        </Left>
                        <TouchableOpacity style={commonStyle.paidbtn}>
                          <Text style={commonStyle.paidbtntext}>Paid</Text>
                          <CheckedIconActive />
                        </TouchableOpacity>
                      </ListItem>
                      <View style={[commonStyle.cardTextwrap]}>
                        <Text style={commonStyle.subtextblack}>
                          Bridal Makeup
                        </Text>
                        <Text style={commonStyle.carddot}>.</Text>
                        <Text style={commonStyle.subtextblack}>$100</Text>
                      </View>
                      <View style={[commonStyle.cardTextwrap]}>
                        <Text style={commonStyle.texttimeblack}>11am-12pm</Text>
                        <Text
                          style={{
                            width: 3,
                            height: 3,
                            opacity: 0.5,
                            backgroundColor: '#393939',
                            borderRadius: 4,
                            marginHorizontal: 5,
                          }}>
                          .
                        </Text>
                        <Text style={commonStyle.textdategray}>1h</Text>
                      </View>
                    </List>
                  </View>
                </View>
              </View>
              <View style={commonStyle.onboardingtextwrap}>
                <Text style={commonStyle.onboardingtextheading}>
                  Book services and keep an eye on your bookings
                </Text>
                <Text style={commonStyle.onboardingsubtext}>
                  Make bookings instantly and keep track of your appointments on
                  the go.
                </Text>
              </View>
            </View>
          </Swiper>
        </View>
        <View
          style={[
            {backgroundColor: '#fff', paddingTop: 30, paddingBottom: 20},
          ]}>
          <Button
            title="Get Started"
            containerStyle={commonStyle.buttoncontainerStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={() => redirectToStartScreen('signup_account_type')}
          />
          <Button
            title="Explore the App"
            type="outline"
            containerStyle={commonStyle.buttoncontainerStyle}
            buttonStyle={commonStyle.outlinebuttonStyle}
            titleStyle={commonStyle.outlinetitleStyle}
            onPress={() => redirectToStartScreen('Explore')}
          />
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  ...OnboardingStyles,
});

export default Onboarding;
