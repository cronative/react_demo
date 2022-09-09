import auth from '@react-native-firebase/auth';
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import { GOOGLE_WEB_CLIENT_ID } from '../../utility/commonStaticValues';



GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  webClientId: GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
});

const GoogleLoginBtn = (props) => {
  async function onGoogleButtonPress() {
    if (GoogleSignin.isSignedIn()) {
      GoogleSignin.signOut();
    }
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    console.log('token', idToken);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const googleLoginHandler = () => {
    onGoogleButtonPress()
      .then((data) => {
        props.googleLoginSuccessHandler(data);
      })
      .catch((err) => {
        // console.error(err + ': ' + err.code);
        GoogleSignin.signOut();
      });
  };

  return (
    <View style={commonStyle.mb4}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={commonStyle.btnsocial}
        onPress={() => googleLoginHandler()}>
        <Image
          style={commonStyle.socialIcon}
          source={require('../../assets/images/google.png')}
        />
        <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
          {props.text} with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleLoginBtn;
