import AsyncStorage from '@react-native-async-storage/async-storage';
import {Body, Left, List, ListItem} from 'native-base';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';

const BookingProSelectClientMessageModal = ({sessionUserList, ...props}) => {
  const writeMessage = async (sessionUser) => {
    const customer = sessionUser
      ? sessionUser
      : props?.bookingData?.data?.customer;
    const reservationDisplayId = sessionUser
      ? sessionUser?.reservation?.reservationDisplayId
      : props.bookingData?.data?.reservationDisplayId;
    console.log('Session User: ', customer);
    console.log('Reservation: ', reservationDisplayId);
    const loginId = await AsyncStorage.getItem('userId');

    props.onMessage({
      userType: '1',
      channelDetails: {
        User: customer,
        customerId: customer?.id,
      },
      loginId,
      reservationId: reservationDisplayId,
      clientId: customer?.id.toString(),
    });
  };

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 10},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>
          Select client to write a message
        </Text>
      </View>
      {props.bookingData !== null &&
      props.bookingData?.data?.Service?.type !== 2 ? (
        <View>
          <List style={commonStyle.walkinclientlist}>
            <ListItem thumbnail style={commonStyle.accountListitem}>
              <Left
                style={[
                  commonStyle.favoritesUserAvaterwrap,
                  {marginRight: 10},
                ]}>
                <Image
                  style={commonStyle.favoritesUserAvaterImg}
                  defaultSource={require('../../assets/images/default-user.png')}
                  source={
                    !!props?.bookingData?.data?.customer?.profileImage
                      ? {
                          uri: props?.bookingData?.data?.customer?.profileImage,
                        }
                      : require('../../assets/images/default-user.png')
                  }
                />
              </Left>
              <Body style={commonStyle.accountListBody}>
                <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>
                  {props?.bookingData?.data?.customer?.userName}
                </Text>
                <Text style={commonStyle.categorytagsText}>
                  {props?.bookingData?.data?.customer?.countryCode}{' '}
                  {props?.bookingData?.data?.customer?.phone}
                </Text>
              </Body>
              <TouchableOpacity
                style={[commonStyle.unfollowbtn, {marginLeft: 10}]}
                onPress={() => writeMessage()}>
                <Text style={commonStyle.unfollowbtnText}>Write</Text>
              </TouchableOpacity>
            </ListItem>
          </List>
        </View>
      ) : (
        sessionUserList.map((user) => (
          <View>
            <List style={commonStyle.walkinclientlist}>
              <ListItem thumbnail style={commonStyle.accountListitem}>
                <Left
                  style={[
                    commonStyle.favoritesUserAvaterwrap,
                    {marginRight: 10},
                  ]}>
                  <Image
                    style={commonStyle.favoritesUserAvaterImg}
                    defaultSource={require('../../assets/images/default-user.png')}
                    source={
                      !!user?.profileImage
                        ? {
                            uri: user?.profileImage,
                          }
                        : require('../../assets/images/default-user.png')
                    }
                  />
                </Left>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>
                    {user?.fullName}
                  </Text>
                  <Text style={commonStyle.categorytagsText}>
                    {user?.countryCode.indexOf('+') > -1
                      ? user?.countryCode
                      : '+' + user?.countryCode}{' '}
                    {user?.phone}
                  </Text>
                </Body>
                <TouchableOpacity
                  style={[commonStyle.unfollowbtn, {marginLeft: 10}]}
                  onPress={() => writeMessage(user)}>
                  <Text style={commonStyle.unfollowbtnText}>Write</Text>
                </TouchableOpacity>
              </ListItem>
            </List>
          </View>
        ))
      )}
    </View>
  );
};

export default BookingProSelectClientMessageModal;
