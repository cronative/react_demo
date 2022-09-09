import React from 'react';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {v4 as uuid} from 'uuid';
import 'react-native-get-random-values';

const doAppleLogin = async () => {
  // Generate secure, random values for state and nonce
  const rawNonce = uuid();
  const state = uuid();

  try {
    // Initialize the module
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: 'DKMT9U3H35.com.readyhubb.ios',

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: 'https://www.readyhubb.com/apple-login',

      // [OPTIONAL]
      // Scope.ALL (DEFAULT) = 'email name'
      // Scope.Email = 'email';
      // Scope.Name = 'name';
      scope: appleAuthAndroid.Scope.ALL,

      // [OPTIONAL]
      // ResponseType.ALL (DEFAULT) = 'code id_token';
      // ResponseType.CODE = 'code';
      // ResponseType.ID_TOKEN = 'id_token';
      responseType: appleAuthAndroid.ResponseType.ALL,

      // [OPTIONAL]
      // A String value used to associate a client session with an ID token and mitigate replay attacks.
      // This value will be SHA256 hashed by the library before being sent to Apple.
      // This is required if you intend to use Firebase to sign in with this credential.
      // Supply the response.id_token and rawNonce to Firebase OAuthProvider
      nonce: rawNonce,

      // [OPTIONAL]
      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      state,
    });

    const response = await appleAuthAndroid.signIn();
    if (response) {
      const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
      const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN
      const user = response.user; // Present when user first logs in using appleId
      const state = response.state; // A copy of the state value that was passed to the initial request.
      return response;
    } else {
      throw 'Something went wrong';
    }
  } catch (error) {
    if (error && error.message) {
      switch (error.message) {
        case appleAuthAndroid.Error.NOT_CONFIGURED:
          throw 'appleAuthAndroid not configured yet.';
        case appleAuthAndroid.Error.SIGNIN_FAILED:
          throw 'Apple signin failed.';
        case appleAuthAndroid.Error.SIGNIN_CANCELLED:
          throw 'User cancelled Apple signin.';
        default:
          throw 'Something went wrong';
      }
    }
    throw 'Something went wrong';
  }
};

async function onAppleButtonPress(props) {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // console.log('appleAuthRequestResponse', appleAuthRequestResponse);

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw 'Apple Sign-In failed - no identify token returned';
  }

  // Create a Firebase credential from the response
  const {identityToken, nonce} = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  // Sign the user in with the credential
  return firebase.auth().signInWithCredential(appleCredential);
}

const AppleLoginBtn = (props) => {
  const appleLoginHandler = () => {
    if (Platform.OS === 'android') {
      doAppleLogin()
        .then((data) => {
          const {id_token, nonce} = data;
          firebaseOperation(id_token, nonce);
        })
        .catch((err) => console.error('error: ' + err));
    } else {
      onAppleButtonPress()
        .then((data) => {
          props.appleLoginSuccessHandler(data);
        })
        .catch((err) => console.error('error: ' + err));
    }
  };

  const firebaseOperation = async (id_token, nonce) => {
    try {
      const appleCredential = auth.AppleAuthProvider.credential(
        id_token,
        nonce,
      );
      const userCredential = await firebase
        .auth()
        .signInWithCredential(appleCredential);

      props.appleLoginSuccessHandler(userCredential);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={commonStyle.mb15}>
      {appleAuthAndroid.isSupported || appleAuth.isSupported ? (
        <TouchableOpacity
          activeOpacity={0.5}
          style={commonStyle.btnsocial}
          onPress={appleLoginHandler}>
          <Image
            style={commonStyle.socialIcon}
            source={require('../../assets/images/apple.png')}
          />
          <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
            {props.text} with Apple
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default AppleLoginBtn;
