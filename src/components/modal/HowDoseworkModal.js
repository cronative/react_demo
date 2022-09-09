import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {List, ListItem, Body, Left} from 'native-base';

import commonStyle from '../../assets/css/mainStyle';

const HowDoseworkModal = ({navigation}) => {
  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0, justifyContent: 'center'},
        ]}>
        <Text style={[commonStyle.modalforgotheading, commonStyle.textCenter]}>
          How does it work?
        </Text>
      </View>

      <View style={commonStyle.typeofServiceFilterWrap}>
        <View>
          <List style={commonStyle.mb2}>
            <ListItem thumbnail style={commonStyle.switchAccountView}>
              <Left style={commonStyle.howdoseInfoCircle}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/mail.png')}
                />
              </Left>
              <Body style={commonStyle.switchAccountbody}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                  Send your link to other professionals
                </Text>
                <Text style={commonStyle.grayText14}>
                  Share your link directly from the app. Your friends will use
                  your link to sign up.
                </Text>
              </Body>
            </ListItem>
          </List>
          <List style={commonStyle.mb2}>
            <ListItem thumbnail style={commonStyle.switchAccountView}>
              <Left style={commonStyle.howdoseInfoCircle}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/users-orange.png')}
                />
              </Left>
              <Body style={commonStyle.switchAccountbody}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                  Free Trial & discount for your referrals
                </Text>
                <Text style={commonStyle.grayText14}>
                  Sit back and relax while your referrals get started with a
                  free Readyhubb trial. Once the trial period is over we will
                  reward you for all referrals that purchase a paid
                  subscribtion.
                </Text>
              </Body>
            </ListItem>
          </List>
          <List style={commonStyle.mb1}>
            <ListItem thumbnail style={commonStyle.switchAccountView}>
              <Left style={commonStyle.howdoseInfoCircle}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/gift-icon.png')}
                />
              </Left>
              <Body style={commonStyle.switchAccountbody}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                  Get rewarded!
                </Text>
                <Text style={commonStyle.grayText14}>
                  You did it! Cheers to earning extra income with Readyhubb, we
                  will add your $15 referral reward to your balance and you can
                  cash out at any time.🥂
                </Text>
              </Body>
            </ListItem>
          </List>
        </View>
      </View>
    </View>
  );
};

export default HowDoseworkModal;
