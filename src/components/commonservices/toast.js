//import Toast from 'react-native-root-toast';
// import { NavigationActions} from 'react-navigation';
// import {
//   parseISO,
//   differenceInMinutes,
//   differenceInDays,
//   differenceInHours,
// } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
// import api from '../common-webservices/api';

/**
 * Global Toast fuction with short duration
 * @param {string} msg
 */
var global = {
  showToast(description, type, position = 'bottom', title = '') {
    title = title || type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'info' ? 'Information' : '';
    Toast.show({
      type: type,
      position: position,
      zIndex: 999999,
      text1: title,
      text2 : description,
      visibilityTime: 4000,
      autoHide: true,
      // topOffset: 30,
      //bottomOffset: 40,
      onShow: () => {},
      onHide: () => {},
      onPress: () => {},
    });
  },

  /**
   * Global Toast fuction with long duration
   * @param {string} msg
   */
  showLongToast(msg) {
    let toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: -90,
      shadow: true,
      animation: true,
      backgroundColor: '#363648',
      textColor: '#ffffff',
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {},
    });
  },

  /**
   * Global Alert fuction
   * @param {string} msg
   */

  showAlert(msg) {
    Alert.alert(
      '',
      msg,
      [
        {
          text: 'Ok',
          onPress: () => console.log('Ask me later pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  },

  /**
   * Global fuction for set navigation to root stack
   */

  // setRoot(props, page) {
  //   console.log(props, page)
  //   const resetAction = StackActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({routeName: page})],
  //   });
  //   props.navigation.dispatch(resetAction);
  // },

  /**
   * Global intended link open fuction
   * @param {string} url
   */
  callNumber(url) {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          this.showToast("Can't handle the phone call, please try manually");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => this.showToast('An error occurred, please try manually'));
  },

  /**
   * Global System mail open fuction
   * @param {string} url
   */

  mailTo(url) {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          this.showToast("Can't handle to open gmail app, please try manually");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => this.showToast('An error occurred, please try manually'));
  },

  /**
   * Global Time Elapsed since given Timestamp function
   * @param {timestamp} timestamp
   */
  // calculateTimeElapsed(timestamp) {
  //   let timeElapsed = differenceInMinutes(Date.now(), parseISO(timestamp));
  //   //if more than an hour ago (but less than 1 day)
  //   if (timeElapsed > 60 && timeElapsed < 1440) {
  //     timeElapsed =
  //       differenceInHours(Date.now(), parseISO(timestamp)) + ' hours ago';
  //   }
  //   //if more than a day ago
  //   else if (timeElapsed >= 1440) {
  //     timeElapsed =
  //       differenceInDays(Date.now(), parseISO(timestamp)) + ' days ago';
  //   } else {
  //     timeElapsed = timeElapsed + ' minutes ago';
  //   }
  //   return timeElapsed;
  // },

  // async unreadNotificationsPresent(token) {
  //   let endpoint = 'notification-list?notification_type=all';
  //   let notificationListCount = [];
  //   await api.getNotificationList(token, endpoint).then((responseJSON) => {
  //     for (let index = 0; index < responseJSON.data.length; index++) {
  //       if (responseJSON.data[index].read_at == null) {
  //         notificationListCount.push(responseJSON.data[index]);
  //       }
  //     }
  //   });
  //   return notificationListCount;
  // },
  Logout(props) {
    AsyncStorage.removeItem('access_token', () => {
      AsyncStorage.removeItem('refresh_token', () => {
        AsyncStorage.removeItem('user_data', () => {
          // props.navigation.navigate('BeforeLoginStack');
        });
        // redirect to logout
        /*   const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: page})],
    });
    props.navigation.dispatch(resetAction); */
      });
    });
  },
};

module.exports = global;
