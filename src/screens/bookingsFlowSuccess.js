import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Body, Container, List, ListItem} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import CalendarEventButton from '../components/calendar/Calendar';
import {refreshBottomTabAction} from '../store/actions/nagationAction';
import {totalAmount, totalAmountWithTax} from '../utility/booking';
const {width, height} = Dimensions.get('window');

const BookingFlowSuccess = ({navigation}) => {
  const dispatch = useDispatch();
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const proMetaInfo = professionalProfileDetailsData?.ProMetas?.[0];
  const [date, setDate] = useState('');
  const [selectedServices, setServices] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('cartData').then((cartData) => {
      let prevSelectedServices;

      if (cartData) {
        cartData = JSON.parse(cartData);
        prevSelectedServices = cartData?.selectedServices.map((s) => ({
          ...s,
          timeSlot: moment(s.timeSlot),
        }));
      }

      setServices(prevSelectedServices);
      setDate(moment(cartData?.selectedServices?.[0]?.timeSlot));
      setComment(cartData.comment);

      const backHandlerdata = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('Explore');
          return true;
        },
      );

      return () => backHandlerdata.remove();
    });
  }, []);

  const formattedDuration = ({timeSlot, duration}) => {
    const modifiedDuration = Math.ceil(duration / 30) * 30;
    return timeSlot
      ? `${timeSlot.format('h:mm a')} - ${timeSlot
          .clone()
          .add(modifiedDuration, 'minutes')
          .format('h:mm a')}`
      : null;
  };
  console.log('dataaaa', JSON.stringify(proMetaInfo, null, 2));
  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.signupNotification, {height: height}]}>
            <View style={commonStyle.horizontalPadd}>
              <View
                style={{position: 'relative', marginBottom: 10, marginTop: 0}}>
                <View style={commonStyle.bookingSuccessBox}>
                  <View style={commonStyle.bookingdateUserwrap}>
                    <View style={commonStyle.bookingdatewrap}>
                      <Text style={commonStyle.blackTextR18} numberOfLines={1}>
                        {moment(date).format('D MMMM YYYY')}
                      </Text>
                      <TouchableHighlight
                        style={[
                          commonStyle.bookingStatusbtn,
                          commonStyle.confirmStatusbtn,
                        ]}>
                        <Text style={commonStyle.bookingStatusbtnText}>
                          Confirmed
                        </Text>
                      </TouchableHighlight>
                    </View>
                    <View style={commonStyle.bookingUserwrap}>
                      <View style={commonStyle.bookingUserAvaterwrap}>
                        <Image
                          style={commonStyle.bookingUserAvaterImg}
                          defaultSource={require('../assets/images/default-user.png')}
                          onError={require('../assets/images/default-user.png')}
                          source={
                            professionalProfileDetailsData &&
                            professionalProfileDetailsData.profileImage
                              ? {
                                  uri: professionalProfileDetailsData.profileImage,
                                }
                              : require('../assets/images/default-user.png')
                          }
                        />
                      </View>
                      <Text style={commonStyle.grayText16} numberOfLines={1}>
                        {proMetaInfo?.businessName}
                      </Text>
                    </View>
                  </View>
                  <View style={commonStyle.bookingdateUserwrap}>
                    {selectedServices?.map((s) => (
                      <List style={[commonStyle.pt2]}>
                        <ListItem
                          style={[commonStyle.commListitem, commonStyle.mb05]}>
                          <Body>
                            <Text style={commonStyle.blackTextR}>{s.name}</Text>
                          </Body>
                          <TouchableHighlight
                            style={{
                              alignSelf: 'flex-start',
                              alignItems: 'flex-start',
                            }}>
                            <Text style={commonStyle.grayText16}>
                              {formattedDuration(s)}
                            </Text>
                          </TouchableHighlight>
                        </ListItem>
                      </List>
                    ))}
                    {/* <List style={[commonStyle.mb05, commonStyle.mt2]}>
                      <ListItem style={commonStyle.commListitem}>
                        <Body>
                          <Text style={commonStyle.blackTextR}>
                            Gorgeous Unlimited Single Lash
                          </Text>
                        </Body>
                        <TouchableHighlight
                          style={{
                            alignSelf: 'flex-start',
                            alignItems: 'flex-start',
                          }}>
                          <Text style={commonStyle.grayText16}>1pm-3pm</Text>
                        </TouchableHighlight>
                      </ListItem>
                    </List> */}
                  </View>
                  <View style={[commonStyle.horizontalPadd, commonStyle.pt2]}>
                    <View
                      style={[commonStyle.bookingdatewrap, commonStyle.mb05]}>
                      <Text style={commonStyle.blackTextR} numberOfLines={1}>
                        Total
                      </Text>
                      <Text
                        style={[
                          commonStyle.blackText16,
                          commonStyle.colorOrange,
                        ]}>
                        $
                        {totalAmountWithTax(
                          selectedServices,
                          proMetaInfo?.tax,
                        )[0].toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={commonStyle.bookingSuccessBoxLayer1}></View>
                <View style={commonStyle.bookingSuccessBoxLayer2}></View>
              </View>
            </View>

            <View style={commonStyle.freamContentWrap}>
              <View style={[commonStyle.geolocationCard, {borderRadius: 20}]}>
                <Text
                  style={[
                    commonStyle.subheading,
                    commonStyle.textCenter,
                    commonStyle.mb15,
                  ]}>
                  Success!
                </Text>
                <Text
                  style={[
                    commonStyle.grayText16,
                    commonStyle.textCenter,
                    commonStyle.mb2,
                  ]}>
                  We will send you a text reminder before your appointment.
                </Text>
                <Button
                  title="View my Bookings"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.changePassModalbutton}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => {
                    //Start Change: Snehasish Das, Issue #1618
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Bookings'}],
                    });
                    //End Change: Snehasish Das, Issue #1618
                    dispatch(refreshBottomTabAction(true));
                  }}
                />
                {selectedServices?.length == 1 ? (
                  <CalendarEventButton
                    data={{
                      name: selectedServices?.[0]?.name,
                      time: moment
                        .utc(selectedServices?.[0]?.timeSlot)
                        .format('HH:mm:ss'),
                      date: moment(date).format('YYYY-MM-DD'),
                      duration: selectedServices?.[0]?.duration,
                      location: proMetaInfo?.address,
                      pro: proMetaInfo?.businessName,
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BookingFlowSuccess;
