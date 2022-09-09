import * as React from 'react';
import { View, Text } from 'react-native';
import commonStyle from '../assets/css/mainStyle';

const renderReadMore = (handlePress) => {
    return (
      <Text style={commonStyle.textorange} onPress={handlePress}>
        Read more
      </Text>
    );
  }
 
 const renderShowLess = (handlePress) => {
    return (
      <Text style={commonStyle.textorange} onPress={handlePress}>
        Read less
      </Text>
    );
  }
 
 const handleTextReady = () => {
    // ...
  }

  export {
      renderReadMore,
      renderShowLess,
      handleTextReady
  }