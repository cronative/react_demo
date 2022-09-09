import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Platform, ActivityIndicator, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const ActivityLoader = (props) => {

  return (
    <View
      style={{
        justifyContent: 'center',
        height: height,
        position: 'absolute',
        width: width,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
      }}>
      <ActivityIndicator
        size={Platform.OS === 'ios' ? 'large' : 50}
        color="#F36A46"
      />
    </View>
  );
};

export default ActivityLoader;
