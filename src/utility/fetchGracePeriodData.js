import {Get} from '../api/apiAgent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../components/commonservices/toast';

export const checkGracePeriodExpiry = async () => {
  try {
    const {data} = await Get('/pro/subcription-plan');
    const userType = await AsyncStorage.getItem('userType');
    console.log('SUBS RESPONSE: checkGrace ', userType, data);
    // isExpire: 0 = Plan active; 2 = In Grace Period; 1 = Everything Expired (Main plan + Grace Period)
    if (data?.isExpire === 1 && userType == 1) {
      console.log('REDIRECTING TO BUY SUB PAGE!!! **');

      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log('Error fetching Grace period data: ', {err});
    return false;
  }
};

export const fetchGracePeriodData = async () => {
  try {
    const {data} = await Get('/pro/subcription-plan');
    console.log('SUBS RESPONSE: ', data);
    // isExpire: 0 = Plan active; 2 = In Grace Period; 1 = Everything Expired (Main plan + Grace Period)
    if (data?.isExpire === 2) {
      const gracePeriodDays = Number(data.gracePeriod);
      const expirationDate = new Date(data.expirationDate);

      expirationDate.setDate(expirationDate.getDate() + gracePeriodDays);

      return {
        subscriptionStatus: data?.isExpire,
        gracePeriodExpiryDate: expirationDate,
        type: data?.type,
      };
    } else if (data?.isExpire === 1) {
      console.log('REDIRECTING TO BUY SUB PAGE!!!');
      global.showToast(
        'Your plan is over, please subscribe to one of our new plans to continue.',
        'error',
      );
      return {
        subscriptionStatus: data?.isExpire,
        type: data?.type,
      };
    } else {
      return {
        subscriptionStatus: data?.isExpire,
        type: data?.type,
      };
    }
  } catch (err) {
    console.log('Error fetching Grace period data: ', {err});
  }
};
