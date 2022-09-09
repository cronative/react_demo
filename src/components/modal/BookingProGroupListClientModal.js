import React, {Fragment, useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import {List, ListItem, Body, Left, Title} from 'native-base';
import {RightAngle, ReplayAngle, StarIcon, MapPointer, DownArrow} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';

const BookingProGroupListClientModal = ({navigation}) => {

  return (
      <View style={commonStyle.modalContent}>
        <View style={[commonStyle.dialogheadingbg, {borderBottomWidth: 0, paddingBottom: 10}]}>
          <Text style={[commonStyle.modalforgotheading]}>Clients on group lesson</Text>
        </View>
        <View style={[commonStyle.searchBarText]}>
          <Text style={[commonStyle.blackTextR]}>7<Title style={commonStyle.grayText16}>/10 seats</Title></Text>
        </View>

          <View>
              <List style={commonStyle.walkinclientlist}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                <TouchableOpacity style={commonStyle.accountListFlex}>
                  <Left style={[commonStyle.favoritesUserAvaterwrap, {marginRight: 10}]}>
                    <Image style={commonStyle.favoritesUserAvaterImg} defaultSource={require('../../assets/images/default.png')} source={require('../../assets/images/users/user-1.png')}/>
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>Mike Myers</Text>
                    <Text style={commonStyle.categorytagsText}>+44 567 902 467</Text>
                  </Body>
                  <TouchableHighlight style={{alignSelf: 'center',}}>
                    <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>							
                </ListItem>
              </List>
              <List style={commonStyle.walkinclientlist}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                <TouchableOpacity style={commonStyle.accountListFlex}>
                  <Left style={[commonStyle.favoritesUserAvaterwrap, {marginRight: 10}]}>
                    <Image style={commonStyle.favoritesUserAvaterImg} defaultSource={require('../../assets/images/default-user.png')} source={require('../../assets/images/users/user-4.png')}/>
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>Mike Myers</Text>
                    <Text style={commonStyle.categorytagsText}>+44 567 902 467</Text>
                  </Body>
                  <TouchableHighlight style={{alignSelf: 'center',}}>
                    <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>							
                </ListItem>
              </List>
              <List style={commonStyle.walkinclientlist}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                <TouchableOpacity style={commonStyle.accountListFlex}>
                  <Left style={[commonStyle.favoritesUserAvaterwrap, {marginRight: 10}]}>
                    <Image style={commonStyle.favoritesUserAvaterImg} defaultSource={require('../../assets/images/default-user.png')} source={require('../../assets/images/users/user-5.png')}/>
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>Mike Myers</Text>
                    <Text style={commonStyle.categorytagsText}>+44 567 902 467</Text>
                  </Body>
                  <TouchableHighlight style={{alignSelf: 'center',}}>
                    <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>							
                </ListItem>
              </List>
              <List style={commonStyle.walkinclientlist}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                <TouchableOpacity style={commonStyle.accountListFlex}>
                  <Left style={[commonStyle.favoritesUserAvaterwrap, {marginRight: 10}]}>
                    <Image style={commonStyle.favoritesUserAvaterImg} defaultSource={require('../../assets/images/default-user.png')} source={require('../../assets/images/users/user-3.png')}/>
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>Mike Myers</Text>
                    <Text style={commonStyle.categorytagsText}>+44 567 902 467</Text>
                  </Body>
                  <TouchableHighlight style={{alignSelf: 'center',}}>
                    <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>							
                </ListItem>
              </List>
              <List style={commonStyle.walkinclientlist}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                <TouchableOpacity style={commonStyle.accountListFlex}>
                  <Left style={[commonStyle.favoritesUserAvaterwrap, {marginRight: 10}]}>
                    <Image style={commonStyle.favoritesUserAvaterImg} defaultSource={require('../../assets/images/default-user.png')} source={require('../../assets/images/users/user-2.png')}/>
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>Mike Myers</Text>
                    <Text style={commonStyle.categorytagsText}>+44 567 902 467</Text>
                  </Body>
                  <TouchableHighlight style={{alignSelf: 'center',}}>
                    <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>							
                </ListItem>
              </List>
              <List style={commonStyle.walkinclientlist}>
                <ListItem thumbnail style={commonStyle.accountListitem}>
                <TouchableOpacity style={commonStyle.accountListFlex}>
                  <Left style={[commonStyle.favoritesUserAvaterwrap, {marginRight: 10}]}>
                    <Image style={commonStyle.favoritesUserAvaterImg} defaultSource={require('../../assets/images/default-user.png')} source={require('../../assets/images/users/user-6.png')}/>
                  </Left>
                  <Body style={commonStyle.accountListBody}>
                    <Text style={[commonStyle.blackTextR18, commonStyle.mb05]}>Mike Myers</Text>
                    <Text style={commonStyle.categorytagsText}>+44 567 902 467</Text>
                  </Body>
                  <TouchableHighlight style={{alignSelf: 'center',}}>
                    <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>							
                </ListItem>
              </List>
          </View>
      </View>
    );
};


export default BookingProGroupListClientModal;
