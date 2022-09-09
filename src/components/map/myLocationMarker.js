import React from 'react';
import {View, Image} from 'react-native';

const MyLocationMarker = () => {
  return (
    <View>
      <Image
        source={require('../../assets/images/map/myLocation.png')}
        style={{
          width: 70,
          height: 70,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default MyLocationMarker;
