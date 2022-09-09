import React, {Fragment, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import Share from 'react-native-share';
import {Container} from 'native-base';
import {Button} from 'react-native-elements';
import Pulse from 'react-native-pulse';
import Clipboard from '@react-native-community/clipboard';
import {InviteIcon, CopyIcon} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import PhoneFream from '../assets/images/setup-welcome-fream.png';
import global from '../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {FRONTEND_BASE_PATH} from '../api/constant';
import {ShareDialog} from 'react-native-fbsdk-next';

const ProfileInviteFriends = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const referralCodeData = useSelector(
    (state) => state?.profileReducer?.referralCode?.referralId,
  );
  const refferURL = `${FRONTEND_BASE_PATH}?ref=${referralCodeData}`;
  const [copiedText, setCopiedText] = useState('');

  // This function will call after click on copyToClipBoard
  const copyToClipboard = () => {
    if (referralCodeData !== null && referralCodeData !== '') {
      Clipboard.setString(refferURL);
      global.showToast('Copied to clipboard', 'success');
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // This function will call once click on share button
  const onShare = async () => {
    if (referralCodeData !== null && referralCodeData !== '') {
      let options = {
        title: 'Share with',
        message:
          'Join me and the community of professionals using Readyhubb to manage and grow their businesses! List your business on Readyhubb and get discovered by new clients. Sign up with my link below: ',
        subject: 'ReadyHubb Share & Earn',
        url: refferURL,
      };
      await Share.open(options)
        .then((res) => {
          console.log('Success : ', res);
        })
        .catch((err) => {
          err && console.log('Error : ', err);
        });
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // This function will call after click on single share
  const singleShare = async (type) => {
    if (referralCodeData !== null && referralCodeData !== '') {
      let keyType;
      if (type === 'facebook') {
        keyType = Share.Social.FACEBOOK;
      } else if (type === 'whatsapp') {
        keyType = Share.Social.WHATSAPP;
      } else if (type === 'email') {
        keyType = Share.Social.EMAIL;
      } else if (type === 'twitter') {
        keyType = Share.Social.TWITTER;
      } else if (type === 'instagram') {
        keyType = Share.Social.INSTAGRAM;
      }
      const shareOptions = {
        title: 'Share your code with',
        message:
          'Join me and the community of professionals using Readyhubb to manage and grow their businesses! List your business on Readyhubb and get discovered by new clients. Sign up with my link below: ',
        subject: 'ReadyHubb Share & Earn',
        url: refferURL,
        social: keyType,
      };
      await Share.shareSingle(shareOptions)
        .then((res) => {
          console.log('Success : ', res);
        })
        .catch((err) => {
          err && console.log('Error : ', err);
        });
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  const messengerShare = () => {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: refferURL,
      contentDescription: 'ReadyHubb Share & Earn',
    };

    ShareDialog.canShow(shareLinkContent)
      .then(function (canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      })
      .then(
        function (result) {
          if (result.isCancelled) {
            console.log('Share cancelled');
          } else {
            console.log('Share success with postId: ' + result.postId);
          }
        },
        function (error) {
          console.log('Share fail with error: ' + error);
        },
      );
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.othersContainer]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ecedff'}}>
          <View style={[commonStyle.profileInviteWrap, commonStyle.pt3]}>
            <View style={commonStyle.profileInviteHeader}>
              <View style={commonStyle.notificationCenter}>
                <Pulse
                  color="#ffffff"
                  numPulses={3}
                  diameter={270}
                  speed={20}
                  duration={2000}
                />
                <View style={commonStyle.notificationposition}>
                  <InviteIcon />
                </View>
              </View>
            </View>

            <View style={commonStyle.geolocationCardWrap}>
              <View style={commonStyle.geolocationCard}>
                <Text
                  style={[
                    commonStyle.subheading,
                    commonStyle.textCenter,
                    commonStyle.mb15,
                  ]}>
                  Invite your friends!
                </Text>
                <View
                  style={[
                    commonStyle.copytextwrap,
                    {justifyContent: 'center'},
                  ]}>
                  <Text style={[commonStyle.blackText16]} numberOfLines={1}>
                    {referralCodeData ? referralCodeData : null}
                  </Text>
                  <TouchableOpacity
                    style={{position: 'absolute', right: 15, width: 25}}
                    onPress={copyToClipboard}>
                    <Text>
                      <CopyIcon />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={[commonStyle.termswrap, commonStyle.mb3]}>
                  <Text style={[commonStyle.dividerline2]}></Text>
                  <Text style={[commonStyle.blackTextR, commonStyle.ordivider]}>
                    or share via
                  </Text>
                  <Text style={[commonStyle.dividerline2]}></Text>
                </View>

                <View style={commonStyle.socialShareRow}>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb15}
                      onPress={() => singleShare('facebook')}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/share/share-icon-1.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                        ]}
                        numberOfLines={1}>
                        Facebook
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb15}
                      onPress={() => singleShare('twitter')}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/share/share-icon-2.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                        ]}
                        numberOfLines={1}>
                        Twitter
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb15}
                      onPress={messengerShare}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/share/share-icon-3.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                        ]}
                        numberOfLines={1}>
                        Messenger
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb15}
                      onPress={() => singleShare('whatsapp')}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/share/share-icon-4.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                        ]}
                        numberOfLines={1}>
                        WhatsApp
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb15}
                      onPress={() => singleShare('email')}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/share/share-icon-5.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                        ]}
                        numberOfLines={1}>
                        Email
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb15}
                      onPress={onShare}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/share/share-icon-6.png')}
                        />
                      </View>
                      <Text
                        style={[
                          commonStyle.texttimeblack,
                          commonStyle.textCenter,
                        ]}
                        numberOfLines={1}>
                        Other apps
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    </Fragment>
  );
};

export default ProfileInviteFriends;
