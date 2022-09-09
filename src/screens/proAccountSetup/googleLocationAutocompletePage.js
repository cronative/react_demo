import React, { Fragment } from 'react';
import {
  StatusBar,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Container, Header } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { LeftArrowIos, LeftArrowAndroid } from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import GooglePlacesInput from '../../components/GooglePlacesInput';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';

const GoogleLocationAutocompletePage = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { return_url } = (route && route.params) || '';

  const fetchLocationDetailsHandler = (data, details) => {


    let value = {
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
      data: data,
    };

    console.log("valuevaluevaluevaluevalue", value)

    dispatch({
      type: 'SET_LOCATION_DETAILS',
      value,
    });

    navigation.navigate(return_url);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        <View style={{ height: height, marginTop: Platform.OS === 'ios' ? 20 : 10 }}>
          <GooglePlacesInput
            fetchLocationDetailsHandler={fetchLocationDetailsHandler}
          />
          <View style={[commonStyle.autocompletesearchback, { top: Platform.OS === 'ios' ? 17 : 17, }]}>
            <TouchableOpacity
              style={commonStyle.haederback}
              onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default GoogleLocationAutocompletePage;
