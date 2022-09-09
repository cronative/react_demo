import AsyncStorage from '@react-native-async-storage/async-storage';
import {Body, Left, List, ListItem} from 'native-base';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';

const GroupBookingPaidInCashModal = ({
  sessionUserList,
  onPaidConfirm,
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
          Following client's payment has failed
        </Text>
      </View>
      {sessionUserList.map(
        (user) =>
          user.isPaymentFailed == 1 && (
            <View key={user.id}>
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
                    onPress={() => onPaidConfirm(user)}>
                    <Text style={commonStyle.unfollowbtnText}>Paid</Text>
                  </TouchableOpacity>
                </ListItem>
              </List>
            </View>
          ),
      )}
    </View>
  );
};

export default GroupBookingPaidInCashModal;
