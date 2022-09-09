import {Image, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import global from '../../components/commonservices/toast';
import RNCalendarEvents from 'react-native-calendar-events';
import RNModal from 'react-native-modal';

const CalendarEventButton = ({data, style, textStyle}) => {
  const [isVisible, setIsVisible] = useState(false);
  const requestForPermisson = async () => {
    const res = await RNCalendarEvents.requestPermissions((readOnly = false));
    if (res === 'authorized') {
      addToApple();
    } else {
      requestForPermisson();
    }
  };
  const checkForPermission = async () => {
    const checkPermission = await RNCalendarEvents.checkPermissions(
      (readOnly = false),
    );

    if (checkPermission === 'authorized') {
      addToApple();
    } else {
      requestForPermisson();
    }
  };

  const addToOutlook = () => {
    let start = moment
      .utc(`${data?.date} ${data?.time}`, 'YYYY-MM-DD HH:mm:ss')
      .format('YYYYMMDDTHHmmss');
    let end = moment
      .utc(`${data?.date} ${data?.time}`, 'YYYY-MM-DD HH:mm:ss')
      .add(data?.duration, 'minutes')
      .format('YYYYMMDDTHHmmss');
    Linking.openURL(
      `ms-outlook://events/new?title=${data?.name}&start=${start}&end=${end}&location=${data?.location}&description=Your service provdier: ${data?.pro}`,
    )
      .then((res) => {
        console.log('outlook', res);
      })
      .catch((e) => {
        console.log('error-outlook', e);
        alert('No Outlook app installed');
      });
  };
  const addToGoogle = async () => {
    let start = moment
      .utc(`${data?.date} ${data?.time}`, 'YYYY-MM-DD HH:mm:ss')
      .local()
      .format('YYYYMMDDTHHmmss');
    let end = moment
      .utc(`${data?.date} ${data?.time}`, 'YYYY-MM-DD HH:mm:ss')
      .add(data?.duration, 'minutes')
      .local()
      .format('YYYYMMDDTHHmmss');
    Linking.openURL(
      `com.google.calendar://?action=create&text=${data?.name}&dates=${start}/${end}&location=${data?.location}&details=Your service provider: ${data?.pro}`,
    )
      .then((res) => {
        console.log('outlook', res);
      })
      .catch((e) => {
        console.log('error-outlook', e);
        alert('No Google Calendar app installed');
      });
  };
  const addToApple = () => {
    AddCalendarEvent?.presentEventCreatingDialog({
      title: data?.name,
      startDate: moment
        .utc(`${data?.date} ${data?.time}`, 'YYYY-MM-DD HH:mm:ss')
        .toDate()
        .toISOString(),
      endDate: moment
        .utc(`${data?.date} ${data?.time}`, 'YYYY-MM-DD HH:mm:ss')
        .add(parseInt(data?.duration), 'minutes')
        .toDate()
        .toISOString(),
      location: data?.location,
      notes: `Your service provdier: ${data?.pro}`,
    })
      .then((eventInfo) => {
        console.warn(JSON.stringify(eventInfo));
        // global.showToast('Event added to calendar', 'success');
      })
      .catch((error) => {
        console.warn(error);
        alert('No Calendar app found');
      })
      .finally(() => {
        setIsVisible(false);
      });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
        }}
        style={styles.container}>
        <Text style={[commonStyle.blackText16, {marginEnd: 10}]}>
          Add to Calendar
        </Text>
        <Ionicons name="chevron-down" size={20} />
      </TouchableOpacity>
      <RNModal
        animationType="slide"
        transparent={true}
        isVisible={isVisible}
        onSwipeComplete={() => {
          setIsVisible(false);
        }}
        swipeThreshold={50}
        swipeDirection="down"
        hasBackdrop={true}
        avoidKeyboard={true}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        // scrollTo={handleScrollTo}
        scrollOffsetMax={500 - 100}
        backdropColor="rgba(0,0,0,0.5)"
        style={commonStyle.bottomModal}>
        <View>
          <View
            style={[commonStyle.staticModalContent, commonStyle.rnModalBody]}>
            <View
              style={[
                commonStyle.dialogheadingbg,
                {
                  justifyContent: 'center',
                  borderBottomWidth: 0,
                  paddingHorizontal: 35,
                },
              ]}>
              <TouchableOpacity
                style={[commonStyle.termswrap, {height: 15}]}
                onPress={() => {
                  setIsVisible(false);
                }}>
                <Text
                  style={{
                    backgroundColor: '#ECEDEE',
                    width: 75,
                    height: 4,
                    borderRadius: 2,
                  }}></Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[commonStyle.modalforgotheading, commonStyle.textCenter]}>
              Add Event to
            </Text>

            <View style={[commonStyle.typeofServiceFilterWrap]}>
              <View style={commonStyle.mb15}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={commonStyle.btnsocial}
                  onPress={() => {
                    addToApple();
                  }}>
                  <Image
                    style={commonStyle.socialIcon}
                    source={require('../../assets/images/apple.png')}
                  />
                  <Text
                    style={[
                      commonStyle.blackText16,
                      {flex: 1, textAlign: 'center', marginRight: 25},
                    ]}>
                    Apple Calendar
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={commonStyle.mb15}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={commonStyle.btnsocial}
                  onPress={() => {
                    setIsVisible(false);
                    addToGoogle();
                  }}>
                  <Image
                    style={commonStyle.socialIcon}
                    source={require('../../assets/images/google.png')}
                  />
                  <Text
                    style={[
                      commonStyle.blackText16,
                      {flex: 1, textAlign: 'center', marginRight: 25},
                    ]}>
                    Google Calendar
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={commonStyle.mb15}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={commonStyle.btnsocial}
                  onPress={() => {
                    setIsVisible(false);
                    addToOutlook();
                  }}>
                  <Image
                    style={[commonStyle.socialIcon, {borderRadius: 13}]}
                    source={require('../../assets/images/outlook.png')}
                  />
                  <Text
                    style={[
                      commonStyle.blackText16,
                      {flex: 1, textAlign: 'center', marginRight: 25},
                    ]}>
                    Outlook Calendar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

export default CalendarEventButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.theamblack,
    marginVertical: 20,
    flexDirection: 'row',
  },
});
