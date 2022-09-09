import React, {Fragment, useEffect} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {Container} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import commonStyle from '../assets/css/mainStyle';
import HTMLView from 'react-native-htmlview';
import {useSelector, useDispatch} from 'react-redux';
import {cmsPageRequestBySlug} from '../store/actions';
import ActivityLoader from '../components/ActivityLoader';

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const cmsPageDetails = useSelector((state) => state.cmsPageDetails);

  useEffect(() => {
    dispatch(cmsPageRequestBySlug('user/cms-list/privacyPolicy'));
  }, []);

  return (
    <Fragment>
      {cmsPageDetails && cmsPageDetails.loader ? <ActivityLoader /> : null}
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, {marginTop: 20}]}>
            {cmsPageDetails && !cmsPageDetails.loader && cmsPageDetails.data ? (
              <HTMLView
                value={
                  !cmsPageDetails.loader &&
                  cmsPageDetails.data &&
                  cmsPageDetails.data[0] &&
                  cmsPageDetails.data[0].description
                }
                stylesheet={styles}
              />
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </Container>
    </Fragment>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  div: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 0,
    paddingTop: 0,
  },
  strong: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 36,
    lineHeight: 40,
    textAlign: 'left',
    marginBottom: 0,
    marginTop: -30,
    fontWeight: '600',
  },
  a: {
    fontWeight: '400',
    color: '#ff5f22',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
    margin: 0,
  },
  p: {
    fontWeight: '400',
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 24,
    marginTop: -75,
  },
  span: {
    fontWeight: '300',
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 24,
  },
  ul: {
    color: '#292929',
    marginBottom: 10,
  },
  li: {
    fontWeight: '300',
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 0,
  },
  b: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
  },
  i: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
  },
  h1: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 42,
    textAlign: 'left',
  },
  h2: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 36,
    lineHeight: 40,
    textAlign: 'left',
    marginBottom: 0,
    marginTop: -30,
    fontWeight: '600',
  },
  h3: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 28,
    textAlign: 'left',
  },
  h4: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 20,
    textAlign: 'left',
  },
  h5: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
  },
  h6: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
  },
});
