// import {AccessToken, LoginManager} from 'react-native-fbsdk';
// import {LoginManager} from 'react-native-fbsdk';
// import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
// import {LoginButton, AccessToken} from 'react-native-fbsdk-next';
// import {LoginManager} from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import commonStyle from '../../assets/css/mainStyle';
import global from '../../components/commonservices/toast';

const FacebookLoginBtn = (props) => {
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    console.log('Facebook Data: ', facebookCredential);
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const facebookLoginHandler = () => {
    onFacebookButtonPress()
      .then((data) => {
        console.log('fb data', data);
        props.facebookLoginSuccessHandler(data);
      })
      .catch((err) => {
        console.log(err);
        global.showToast('Error Encountered.', 'error');
        LoginManager.logOut();
      });
  };

  return (
    <View style={commonStyle.mb15}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={commonStyle.btnsocial}
        onPress={facebookLoginHandler}>
        <Image
          style={commonStyle.socialIcon}
          source={require('../../assets/images/facebook.png')}
        />
        <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
          {props.text} with Facebook
        </Text>
      </TouchableOpacity>

      {/* <LoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            console.log('login has error: ' + result.error);
          } else if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              console.log(data.accessToken.toString());
            });
          }
        }}
        onLogoutFinished={() => console.log('logout.')}
      /> */}
    </View>
  );
};

export default FacebookLoginBtn;
