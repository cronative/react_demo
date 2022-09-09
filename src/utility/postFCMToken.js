import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { Post } from '../api/apiAgent'

const postFCMToken = () => {
    const devicePlatform = Platform.OS === 'ios' ? 1 : 2;
    const deviceId = DeviceInfo.getUniqueId();

    messaging().getToken()
        .then(token => {
            if (token) {
                const payload = {
                    type: devicePlatform,
                    fcmToken: token,
                    deviceId: deviceId
                };
                console.log('device id: ', deviceId)
                Post('/common/add-device', payload)
                    .then(response => {
                        console.log('Successfully sumbitted FCM Token', response)
                    })
                    .catch(err => console.log(err))
            }
        })
        .catch(err => {
            console.log(err)
        })
}

export default postFCMToken;