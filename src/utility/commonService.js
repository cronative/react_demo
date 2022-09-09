import Intercom from '@intercom/intercom-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ct from 'countries-and-timezones';
import momentTz from 'moment-timezone';
import { phone } from 'phone';
import { BACKEND_SERVER } from '../api/constant';
import moment from 'moment';
export const arrangeErrorMessage = (err) => {
  let str =
    (err.response && err.response.data && err.response.data.message) ||
    'Something went wrong';
  if (err.response.status === 422) {
    for (var key in err.response.data.errors) {
      if (err.response.data.errors.hasOwnProperty(key)) {
        for (var j = 0; j < err.response.data.errors[key].length; j++) {
          str += err.response.data.errors[key][j];
        }
      }
    }
  }
  return str;
};

/**
 * Inputs type number only
 * @param event * @returns true if type number only
 */
export const inputTypeNumberOnly = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
};

/**
 * Inputs with out space
 * @param event * @returns true if with out space
 */
export const inputWithOutSpace = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode === 32) {
    event.preventDefault();
  }
};

/**
 * Inputs type number and decimal
 * @param event * @returns
 */
export const inputTypeNumberAndDecimal = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 46 || charCode > 57)) {
    event.preventDefault();
  }
};

export const timeConversion = (timeInMins) => {
  const hours = Math.floor(timeInMins / 60) + (timeInMins % 60 > 30 ? 1 : 0);
  return (
    (hours ? `${hours}h` : '') +
    (timeInMins % 60 <= 30 && timeInMins % 60 > 0 ? ' 30m' : '')
  );
};

export const getTwilioToken = async (identity = null) => {
  console.log('hello service', identity);
  if (!identity) {
    identity = await AsyncStorage.getItem('userId');
  }
  let response = await fetch(
    'https://teal-dotterel-7600.twil.io/chat-token?identity=' + identity,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
  let json = await response.json();
  console.log('Twilio service getToken()', json);
  return json.token;
};

export const getCurrentCountryCode = () => {
  return ct.getCountryForTimezone(momentTz.tz.guess()).id;
};

export const verifyMobileNumber = (number = '') => {
  // return phone(number);
  return true;
};

export const setupIntercom = async ({ email, id, name, type }) => {
  console.log('inteeeeeee');
  if (type == 1) {
    if (id && email) {
      Intercom.registerIdentifiedUser({
        email: email,
        userId: `${BACKEND_SERVER}_${id}`,
      })
        .then((res) => {
          console.log('intercom setup', res);
          Intercom.updateUser({
            email: email,
            userId: `${BACKEND_SERVER}_${id}`,
            name: name,
            languageOverride: 'en',
            signedUpAt: moment().unix(),
            unsubscribedFromEmails: true,
          })
            .then((user) => {
              console.log('userIntercom', user);
            })
            .catch((error) => {
              console.log('intercom userError', error);
            });
        })
        .catch((error) => {
          console.log('intercom error', error);
        });
    }
  }
};
