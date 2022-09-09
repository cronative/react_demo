import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axiosConfig';
import global from '../components/commonservices/toast';
import {setNavigationValue} from '../store/actions';

export default {
  setupInterceptors: (store, history) => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Clear AsyncStorage to redirect login page
        if (error.response?.data?.status === 406) {
          AsyncStorage.removeItem('accessToken', () => {
            AsyncStorage.removeItem('refreshToken', () => {
              AsyncStorage.removeItem('isValidForLogin', () => {
                AsyncStorage.removeItem('userId', () => {
                  AsyncStorage.removeItem('email', () => {
                    AsyncStorage.removeItem('fullName', () => {
                      AsyncStorage.removeItem('userType', () => {
                        AsyncStorage.removeItem('image', () => {
                          global.showToast(
                            'Token expired, Please login to continue',
                            'error',
                          );
                          setTimeout(() => {
                            store.dispatch(setNavigationValue(1));
                          }, 500);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        }

        return Promise.reject(error);
      },
    );
  },
};
