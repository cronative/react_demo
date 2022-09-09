import {is} from 'date-fns/locale';
import {Patch, Post} from '../../api/apiAgent';
import global from '../commonservices/toast';
export const addUpdateServiceApi = (data, isUpdate, setLoader, callback) => {
  console.log('data', JSON.stringify(data, null, 2));
  let ID = data.id;
  delete data.id;
  let formData = new FormData();
  Object.keys(data).map((ff) => {
    formData.append(ff, data?.[ff]);
  });
  if (isUpdate) {
    Patch(`pro/services-with-image/${ID}`, formData, 'multipart/form-data')
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        callback(false);
        console.log('error update service', error);
        console.log('error update service', error?.response?.data);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      })
      .finally(() => {
        setLoader(false);
      });
  } else {
    console.log('pro/add-service-with-image', formData);
    Post('pro/add-service-with-image', formData, '', 'multipart/form-data')
      .then((result) => {
        console.log('ssssss', result);
        callback(result);
      })
      .catch((error) => {
        callback(false);
        console.log('error add service', error);
        console.log('error add service', error.response.data);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      })
      .finally(() => {
        setLoader(false);
      });
  }
};
