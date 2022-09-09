import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Platform,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../utility/commonStaticValues';
import { SendIconOrange } from '../components/icons';
import commonStyle, { Colors } from '../assets/css/mainStyle';
import { getAvailableLocationProviders } from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

const GooglePlacesInput = (props) => {
  const autoCompleteRef = useRef();
  const locationCheck = () => {
    getAvailableLocationProviders().then((providers) => {
      console.log(providers);
      if (Platform.OS === 'android' && !providers.gps && !providers.network) {
        Alert.alert(
          'Location Not Enabled',
          'Please enable your location to search',
        );
        autoCompleteRef?.current?.blur();
      } else if (Platform.OS === 'ios' && !providers.locationServicesEnabled) {
        Alert.alert(
          'Location Not Enabled',
          'Please enable your location to search',
        );
        autoCompleteRef?.current?.blur();
      }
    });
  };

  return (
    <View>
      <GooglePlacesAutocomplete
        ref={autoCompleteRef}
        styles={{
          container: {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 0,
            height: 60,
          },
          textInputContainer: {
            flexDirection: 'row',
            paddingBottom: 0,
            borderWidth: 1,
            borderColor: '#110F17',
            borderBottomWidth: 2,
            borderRightWidth: 2,
            color: '#110F17',
            fontFamily: 'SofiaPro',
            height: 55,
            borderRadius: 12,
            paddingRight: 30,
            paddingLeft: 15,
          },
          textInput: {
            backgroundColor: '#fff',
            height: 52,
            borderRadius: 12,
            paddingVertical: 5,
            paddingLeft: 15,
            paddingRight: 5,
            fontSize: 14,
            flex: 1,
            // borderWidth: 1,
            // borderColor: '#110F17',
            // borderBottomWidth: 2,
            // borderRightWidth: 2,
            color: '#110F17',
            fontFamily: 'SofiaPro',
          },
          poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
            fontFamily: 'SofiaPro',
            backgroundColor: 'red',
          },
          listView: {
            zIndex: 1000,
            position: 'absolute',
            width: '100%',
            top: 70,
            left: 20,
            height: height - 380,
            overflow: 'scroll',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
          description: {
            fontFamily: 'SofiaPro',
            fontSize: 16,
          },
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 0,
            width: 0,
            display: 'none',
          },
        }}
        placeholder="Search Location"
        minLength={2} // minimum length of text to search
        autoFocus={true}
        fetchDetails={true}
        onPress={(data, details = null) => {
          props.fetchLocationDetailsHandler(data, details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en', // language of the result
        }}
        debounce={200}
        currentLocation={false}
        currentLocationLabel={
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#dcdcdc',
                paddingLeft: 16,
                paddingRight: 20,
                height: 45,
                zIndex: 999,
                width: Platform.OS === 'ios' ? width - 60 : width - 70,
              }}>
              <SendIconOrange />
              <Text style={[commonStyle.textorange14, { marginLeft: 10 }]}>
                Current Location
              </Text>
            </View>
          </>
        }
        enablePoweredByContainer={false}
        // Start Change: Snehasish Das, Issue #1327
        textInputProps={{
          onFocus: () => {
            console.log('Focus Event');
            locationCheck();
            if (!!props.setListVisible) {
              props.setListVisible(false);
            }
          },
          onBlur: () => {
            console.log('Blur Event');
            if (!!props.setListVisible) {
              props.setListVisible(true);
            }
          },
        }}
        // End Change: Snehasish Das, Issue #1327
        // Start Chagne: Snehasish Das, Issues #1022, #1735
        GooglePlacesSearchQuery={{
          rankby: 'distance',
        }}
        enableHighAccuracyLocation={false}
      // End Chagne: Snehasish Das, Issues #1022, #1735
      />
    </View>
  );
};

export default GooglePlacesInput;
