import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image} from 'react-native';
import {Button} from 'react-native-elements';
import commonStyle from '../../assets/css/mainStyle';
import circleMsgImg from '../../assets/images/circle-msg-icon.png';

const ChangePasswordMessageModal = ({navigation, type = null}) => {
  return (
    <View style={commonStyle.modalContent}>
      <View style={commonStyle.messageIcon}>
        <Image source={circleMsgImg} style={commonStyle.messageimg} />
      </View>
      <Text
        style={[
          commonStyle.subtextblack,
          commonStyle.textCenter,
          commonStyle.mb2,
        ]}>
        Your password has been changed
      </Text>
      {type == 'beforeLogin' && (
        <Text
          style={[
            commonStyle.grayText16,
            commonStyle.textCenter,
            commonStyle.mb3,
          ]}>
          {/* Now you will be moved to the sign in screen automatically */}
          Sign into your account with your new password.
        </Text>
      )}
    </View>
  );
};

export default ChangePasswordMessageModal;
