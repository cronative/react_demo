import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {List, ListItem, Body, Left, Title} from 'native-base';
import {CloseIcon, NextArrow} from '../icons';

import commonStyle from '../../assets/css/mainStyle';

const BookingFlowAddServiceModal = ({navigation}) => {
  return (
    <View style={commonStyle.modalContent}>
      <View style={[commonStyle.dialogheadingbg, {justifyContent: 'center'}]}>
        <Text style={[commonStyle.blackText16]}>Add a service</Text>
      </View>
      <View style={[commonStyle.typeofServiceFilterWrap]}>
        <View>
          <Text style={[commonStyle.subtextbold, commonStyle.mb2]}>
            Make Up (4)
          </Text>
          <List style={[commonStyle.setupserviceList]}>
            <ListItem thumbnail style={commonStyle.categoriseListItem}>
              <View style={commonStyle.serviceListtouch}>
                <Body style={commonStyle.categoriseListBody}>
                  <Text
                    style={[commonStyle.blackTextR, commonStyle.mb1]}
                    numberOfLines={1}>
                    Keratin Lash Lift & Tin
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                      40 min
                    </Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      $100
                    </Text>
                  </View>
                </Body>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={[
                      commonStyle.unfollowbtn,
                      {marginLeft: 5, paddingHorizontal: 18},
                    ]}>
                    <Text style={commonStyle.unfollowbtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ListItem>
            <View style={commonStyle.mt1}>
              <Text style={commonStyle.grayText14}>
                Using a blend of herbs in a compress. This massage may and
                soothes muscles.{' '}
                <Title style={commonStyle.textorange14}>Read more</Title>
              </Text>
            </View>
          </List>
          <List style={[commonStyle.setupserviceList]}>
            <ListItem thumbnail style={commonStyle.categoriseListItem}>
              <View style={commonStyle.serviceListtouch}>
                <Body style={commonStyle.categoriseListBody}>
                  <Text
                    style={[commonStyle.blackTextR, commonStyle.mb1]}
                    numberOfLines={1}>
                    Gorgeous Unlimited Single Lash
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                      2 h
                    </Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      $200
                    </Text>
                  </View>
                </Body>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={[commonStyle.addedbtn, {marginLeft: 5}]}>
                    <Text style={commonStyle.addedbtnText}>Added</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ListItem>
            <View style={commonStyle.mt1}>
              <Text style={commonStyle.grayText14}>
                Using a blend of herbs in a compress. This massage For Test may
                relievestress and soothes muscles.{' '}
                <Title style={commonStyle.textorange14}>Read more</Title>
              </Text>
            </View>
          </List>
          <List style={[commonStyle.setupserviceList]}>
            <ListItem thumbnail style={commonStyle.categoriseListItem}>
              <View style={commonStyle.serviceListtouch}>
                <Body style={commonStyle.categoriseListBody}>
                  <Text
                    style={[commonStyle.blackTextR, commonStyle.mb1]}
                    numberOfLines={1}>
                    Evening MakeUp
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                      1 h
                    </Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      $200
                    </Text>
                  </View>
                </Body>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={[
                      commonStyle.unfollowbtn,
                      {marginLeft: 5, paddingHorizontal: 18},
                    ]}>
                    <Text style={commonStyle.unfollowbtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ListItem>
          </List>
        </View>
        <View>
          <Text style={[commonStyle.subtextbold, commonStyle.mb2]}>
            Bridal Make Up (4)
          </Text>
          <List style={[commonStyle.setupserviceList]}>
            <ListItem thumbnail style={commonStyle.categoriseListItem}>
              <View style={commonStyle.serviceListtouch}>
                <Body style={commonStyle.categoriseListBody}>
                  <Text
                    style={[commonStyle.blackTextR, commonStyle.mb1]}
                    numberOfLines={1}>
                    Bridal MakeUp
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                      40 min
                    </Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      $100
                    </Text>
                  </View>
                </Body>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={[
                      commonStyle.unfollowbtn,
                      {marginLeft: 5, paddingHorizontal: 18},
                    ]}>
                    <Text style={commonStyle.unfollowbtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ListItem>
            <View style={commonStyle.mt1}>
              <Text style={commonStyle.grayText14}>
                Using a blend of herbs in a compress. This massage may and
                soothes muscles.{' '}
                <Title style={commonStyle.textorange14}>Read more</Title>
              </Text>
            </View>
          </List>
          <List style={[commonStyle.setupserviceList]}>
            <ListItem thumbnail style={commonStyle.categoriseListItem}>
              <View style={commonStyle.serviceListtouch}>
                <Body style={commonStyle.categoriseListBody}>
                  <Text
                    style={[commonStyle.blackTextR, commonStyle.mb1]}
                    numberOfLines={1}>
                    Professional MakeUp
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                      2 h
                    </Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      $200
                    </Text>
                  </View>
                </Body>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={[
                      commonStyle.unfollowbtn,
                      {marginLeft: 5, paddingHorizontal: 18},
                    ]}>
                    <Text style={commonStyle.unfollowbtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ListItem>
            <View style={commonStyle.mt1}>
              <Text style={commonStyle.grayText14}>
                Using a blend of herbs in a compress. This massage For Test may
                relievestress and soothes muscles.{' '}
                <Title style={commonStyle.textorange14}>Read more</Title>
              </Text>
            </View>
          </List>
          <List style={[commonStyle.setupserviceList]}>
            <ListItem thumbnail style={commonStyle.categoriseListItem}>
              <View style={commonStyle.serviceListtouch}>
                <Body style={commonStyle.categoriseListBody}>
                  <Text
                    style={[commonStyle.blackTextR, commonStyle.mb1]}
                    numberOfLines={1}>
                    Gorgeous Unlimited Single Lash
                  </Text>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                      2 h
                    </Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                      $200
                    </Text>
                  </View>
                </Body>
                <View style={{alignSelf: 'flex-start'}}>
                  <TouchableOpacity
                    style={[
                      commonStyle.unfollowbtn,
                      {marginLeft: 5, paddingHorizontal: 18},
                    ]}>
                    <Text style={commonStyle.unfollowbtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ListItem>
          </List>
        </View>
      </View>
    </View>
  );
};

export default BookingFlowAddServiceModal;
