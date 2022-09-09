import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import axios from './axiosConfig';
import { API_BASE_PATH } from './constant';

export const Get = async (url, params, token) => {
  var accessToken = token || (await AsyncStorage.getItem('accessToken'));
  console.log(accessToken, url);
  let header = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: accessToken ? 'Bearer ' + accessToken : '',
    timezone: new Date().getTimezoneOffset(),
  };

  console.log("URL ====> ", url);
  console.log("Params ====> ", params);
  console.log("header ====> ", header);
  return new Promise((resolve, reject) => {
    return axios
      .get(url, {
        params,
        headers: header,
      })
      .then((response) => {
        // console.log("response ====> ", response);
        return resolve(response.data)
      })
      .catch((error) => {
        // console.log("error ====> ", error);
        return reject(error)
      });
  });
};

export const Post = async (
  url,
  params,
  token = '',
  contentType = 'application/json',
) => {
  var accessToken = token || (await AsyncStorage.getItem('accessToken'));

  console.log('URL >> ', url)
  console.log('params >> ', params)

  let header = {
    'content-Type': contentType,
    Authorization: accessToken ? 'Bearer ' + accessToken : '',
    timezone: new Date().getTimezoneOffset(),
  };
  return new Promise((resolve, reject) => {
    return axios
      .post(url, params, {
        headers: header,
      })
      .then(({ data: response }) => {
        console.log('response >> ', response)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const passwordPost = async (url, params) => {
  let header = {
    'content-Type': 'application/json',
    timezone: new Date().getTimezoneOffset(),
  };
  return new Promise((resolve, reject) => {
    return axios
      .post(url, params, {
        headers: header,
      })
      .then(({ data: response }) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const Put = async (url, params, contentType = 'application/json') => {
  var accessToken = await AsyncStorage.getItem('accessToken');
  return new Promise((resolve, reject) => {
    return axios
      .put(url, params, {
        headers: {
          // 'Content-Type': contentType,
          Authorization: accessToken ? 'Bearer ' + accessToken : '',
          timezone: new Date().getTimezoneOffset(),
        },
      })
      .then(({ data: response }) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const Patch = async (url, params, contentType = 'application/json') => {
  var accessToken = await AsyncStorage.getItem('accessToken');
  return new Promise((resolve, reject) => {
    return axios
      .patch(url, params, {
        headers: {
          'Content-Type': contentType,
          Authorization: accessToken ? 'Bearer ' + accessToken : '',
          timezone: new Date().getTimezoneOffset(),
        },
      })
      .then(({ data: response }) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const Delete = async (url, params) => {
  var accessToken = await AsyncStorage.getItem('accessToken');

  return new Promise((resolve, reject) => {
    return axios
      .delete(url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? 'Bearer ' + accessToken : '',
          timezone: new Date().getTimezoneOffset(),
        },
      })
      .then(({ data: response }) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const DeleteBodyParameter = async (url, params) => {
  var accessToken = await AsyncStorage.getItem('accessToken');
  return new Promise((resolve, reject) => {
    return axios
      .delete(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? 'Bearer ' + accessToken : '',
          timezone: new Date().getTimezoneOffset(),
        },
        data: params,
      })
      .then(({ data: response }) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    return Get(requestedData.url)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'post') {
    return Post(requestedData.url, requestedData.data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'put') {
    return Put(requestedData.url, requestedData.data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }
}

export async function fileUpload(url, data, method) {
  var accessToken = await AsyncStorage.getItem('accessToken');

  return new Promise((resolve, reject) => {
    return RNFetchBlob.fetch(
      method,
      API_BASE_PATH + url,
      {
        Authorization: accessToken ? 'Bearer ' + accessToken : '',
        'Content-Type': 'multipart/form-data',
      },
      data,
    )
      .then((resp) => {
        resolve(resp.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const PostPromiseIntact = async (
  url,
  data,
  token = '',
  contentType = 'application/json',
) => {
  var accessToken = token || (await AsyncStorage.getItem('accessToken'));

  let header = {
    'content-Type': contentType,
    Authorization: accessToken ? 'Bearer ' + accessToken : '',
    timezone: new Date().getTimezoneOffset(),
  };

  return axios.post(url, data, {
    headers: header,
  });
};
