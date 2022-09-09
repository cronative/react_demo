import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {ScrollView, View, Text, StatusBar, Dimensions, TouchableOpacity, TouchableHighlight, ImageBackground, Image} from 'react-native';
import {Container, Header, List, ListItem, Body, Left, Right} from 'native-base';
import MapView, {ProviderPropType, Marker, AnimatedRegion} from 'react-native-maps';
import {RightAngle} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
// const LATITUDE = 37.78825;
const LATITUDE = 25.79065;
// const LONGITUDE = -122.4324;
const LONGITUDE = -80.13005;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CustomMarker = () => (
  <View
    style={{
      paddingVertical: 10,
      paddingHorizontal: 30,
      backgroundColor: "#007bff",
      borderColor: "#eee",
      borderRadius: 5,
      elevation: 10
    }}
  >
    <Text style={{ color: "#fff" }}>Berlin</Text>
  </View>
);

const SearchMapView = ({navigation}) => {

  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [coordinate, setCoordinate] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
  });

return (
        <View>
            <MapView
              style={commonStyle.mapView}
              mapType='satellite'
              region={region}
              onRegionChangeComplete={region => setRegion(region)}
            >
              <Marker coordinate={coordinate}>
                <CustomMarker />
              </Marker>
            </MapView>
        </View>
  );
};

export default SearchMapView;