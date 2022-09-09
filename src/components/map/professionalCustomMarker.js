import React, {useMemo} from 'react';
import {View, Image} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import {Content} from 'native-base';
import * as Animatable from 'react-native-animatable';

const ProfessionalCustomMarker = (props) => {
  const zoomIn = {
    0: {
      scale: 1,
    },
    1: {
      scale: 1.5,
    },
  };

  const zoomOut = {
    0: {
      scale: 1.5,
    },
    1: {
      scale: 1,
    },
  };

  return (
    <View>
      {props.activeMarker ? (
        <Animatable.Image
          animation={zoomIn}
          duration={500}
          source={require('../../assets/images/map/marker.png')}
          style={{
            width: 32,
            height: 32,
          }}
          resizeMode="contain"
          useNativeDriver
        />
      ) : (
        <Animatable.Image
          animation={zoomOut}
          duration={500}
          source={require('../../assets/images/map/marker.png')}
          style={{
            width: 32,
            height: 32,
          }}
          resizeMode="contain"
          useNativeDriver
        />
      )}
    </View>
  );
};
export default React.memo(ProfessionalCustomMarker);
