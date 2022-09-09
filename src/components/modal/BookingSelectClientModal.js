import {Body, Left, List, ListItem} from 'native-base';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle, {Colors} from '../../assets/css/mainStyle';

const BookingSelectClientModal = ({
  navigation,
  setClientId,
  setVisibleModal,
  onSelectClient,
}) => {
  const clientList = useSelector((state) => state.clientsListReducer.details);
  const clientLoader = useSelector((state) => state.clientsListReducer.loader);
  const dispatch = useDispatch();

  console.log('clientList', clientList);
  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        {!!clientList?.count && (
          <Text style={[commonStyle.modalforgotheading]}>
            Select walk-in client
          </Text>
        )}
      </View>

      <View>
        <View>
          {!clientLoader ? (
            clientList?.count ? (
              clientList?.rows?.map((client) => (
                <List style={commonStyle.walkinclientlist} key={client.id}>
                  <ListItem thumbnail style={commonStyle.accountListitem}>
                    <TouchableOpacity
                      style={commonStyle.accountListFlex}
                      onPress={() => onSelectClient(client)}>
                      <Left>
                        <View style={[commonStyle.walkinclientavater]}>
                          <Image
                            style={commonStyle.walkinclientavatericon}
                            defaultSource={require('../../assets/images/signup/account-avater-1.png')}
                            source={
                              client.profileImage
                                ? {
                                    uri: client.profileImage,
                                  }
                                : require('../../assets/images/signup/account-avater-1.png')
                            }
                          />
                        </View>
                      </Left>
                      <Body style={commonStyle.accountListBody}>
                        <Text
                          style={[commonStyle.blackTextR18, commonStyle.mb05]}>
                          {client.name}
                        </Text>
                        <Text style={commonStyle.categorytagsText}>
                          {client.countryCode}
                          {client.phone}
                        </Text>
                      </Body>
                    </TouchableOpacity>
                  </ListItem>
                </List>
              ))
            ) : (
              <Text style={[commonStyle.textorange14, {textAlign: 'center'}]}>
                No walk-in client found
              </Text>
            )
          ) : (
            <ActivityIndicator color={Colors.orange}></ActivityIndicator>
          )}
        </View>
      </View>
    </View>
  );
};

export default BookingSelectClientModal;
