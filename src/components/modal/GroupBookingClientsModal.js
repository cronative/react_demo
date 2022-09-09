import AsyncStorage from '@react-native-async-storage/async-storage';
import {Body, Left, List, ListItem} from 'native-base';
import React, {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import {RightAngle} from '../icons';

const GroupBookingClientsModal = ({
  sessionUserList,
  navigateToClientPage,
  bookingData,
  seatCount,
  setVisibleModal,
  ...props
}) => {
  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 10},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>
          Clients on group session
        </Text>
      </View>
      <View>
        <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
          {sessionUserList.length}
          <Text style={commonStyle.grayText16}>/{seatCount} seats</Text>
        </Text>
      </View>

      {sessionUserList.map((user) => (
        <View key={user.id}>
          <List style={[commonStyle.walkinclientlist, {paddingVertical: 0}]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.accountListitem,
                {marginTop: 18, marginBottom: 18},
              ]}
              onPress={() => {
                setVisibleModal(null);
                navigateToClientPage(user.id);
              }}>
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
              <View>
                <RightAngle />
              </View>
            </ListItem>
          </List>
        </View>
      ))}
    </View>
  );
};

export default GroupBookingClientsModal;
