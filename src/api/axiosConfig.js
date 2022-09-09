import axios from 'axios';
import global from '../components/commonservices/toast';

const instance = axios.create({
  // baseURL: 'https://api.readyhubb.com/api/', //LIVE
  // baseURL: 'http://readyhubb-stagein.tk:3078/api/', //DEV
  baseURL: 'https://api.staging.readyhubb.com/api/', //STAGING
  timeout: 15000,
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log('ERROR IN AXIOS: ', error.message);
    if (error?.message === 'Network Error') {
      global.showToast('No internet connection', 'error');
    }
    return Promise.reject(error);
  },
);

export default instance;
