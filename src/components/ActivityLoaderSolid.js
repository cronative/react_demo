import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Platform, ActivityIndicator, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const ActivityLoaderSolid = (props) => {
  return (
    <View
      style={{
        flexGrow: 1,
        justifyContent: 'center',
        height: !!props?.height ? props.height : height,
      }}>
      <ActivityIndicator
        size={Platform.OS === 'ios' ? 'large' : 50}
        color="#F36A46"
      />
    </View>
  );
};

export default ActivityLoaderSolid;
