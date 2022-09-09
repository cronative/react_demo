import auth from '@react-native-firebase/auth';
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import { GOOGLE_WEB_CLIENT_ID } from '../../utility/commonStaticValues';
import { authorize } from 'react-native-app-auth';
import { Post } from '../../api/apiAgent';
import global from '../../components/commonservices/toast';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  scopes: ['https://www.googleapis.com/auth/calendar'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
});

const GoogleCalendarConnect = (props) => {
  async function onGoogleButtonPress() {
    if (GoogleSignin.isSignedIn()) {
      console.log('signing out')
      GoogleSignin.signOut();
    }
    // Get the users ID token
    // const {idToken} = await GoogleSignin.signIn();
    const response = await GoogleSignin.signIn();
    console.log('response', response);
    // console.log('response', resp);
    // console.log('token', idToken);
    const resp = await GoogleSignin.requestServerAuthCode('98364265034-ob4l8a1hujamlugkp33d1dujefm57qvn.apps.googleusercontent.com', true)
    console.log('TEST', resp);
    const { accessToken } = await GoogleSignin.getTokens()
    // Create a Google credential with the token
    const googleCredential = await auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    // return auth().signInWithCredential(googleCredential);
    auth().signInWithCredential(googleCredential);
    return accessToken
  }

  const googleLoginHandler = () => {
    onGoogleButtonPress()
      .then((data) => {
        // props.googleLoginSuccessHandler(data);
      })
      .catch((err) => {
        // console.error(err + ': ' + err.code);
        GoogleSignin.signOut();
      });
  };

  const connectGoogleHandler = async () => {
    const config = {
      issuer: 'https://accounts.google.com',
      clientId: '760253870545-rj6be5oer0u3ujdjb0d321c1odui5ako.apps.googleusercontent.com', // android - release build
      // clientId: '760253870545-20i338tf8hme6rptqomino37gign1rbr.apps.googleusercontent.com', //android - debug build
      // clientId: '760253870545-saad9hv94ega90es9vi49v5bhn5gsouv.apps.googleusercontent.com', // ios
      redirectUrl: 'com.googleusercontent.apps.760253870545-rj6be5oer0u3ujdjb0d321c1odui5ako:/oauth2redirect/google', //android - release build
      // redirectUrl: 'com.googleusercontent.apps.760253870545-20i338tf8hme6rptqomino37gign1rbr:/oauth2redirect/google', //android - debug build
      // redirectUrl: 'com.googleusercontent.apps.760253870545-saad9hv94ega90es9vi49v5bhn5gsouv:/oauth2redirect/google', //ios
      scopes: ['openid', 'profile'],
    };
    try {
      const result = await authorize(config);
      console.log('Resulttttttttttttttt : ', result);
      console.log('Google Refresh token : ', result.refreshToken);
      Post('/pro/g-calendar-token', { gRefreshToken: result.refreshToken })
        .then(response => {
          if (response.status === 200) {
            global.showToast('Google Calendar Connected Successfully.', 'success')
            props.googleLoginSuccessHandler();
          }
        })
        .catch(err => {
          global.showToast('Failed to connect Google Calendar.', 'error')
          console.log(err)
        })
      // props.googleLoginSuccessHandler(data);
    } catch (error) {
      console.log('Errrrrrrrrrorrrrr : ', error);
    }
  };

  return (
    <View style={commonStyle.mb4}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={props.text == 'connectGoogle' ? commonStyle.btnsocial : [commonStyle.btnsocial, { backgroundColor: '#f5c4b8' }]}
        disabled={props.disabled}
        onPress={() => {
          props.text == 'connectGoogle' ? connectGoogleHandler() : googleLoginHandler();
        }}>
        <Image
          style={commonStyle.socialIcon}
          source={require('../../assets/images/google.png')}
        />
        <Text
          style={props.text == 'connectGoogle' ? [commonStyle.blackText16, commonStyle.connectgoogle] : [commonStyle.blackText16, commonStyle.disconnectgoogle]}
        >
          {props.text == 'connectGoogle' ? `Connect Google Calendar` : `${props.text}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleCalendarConnect;
