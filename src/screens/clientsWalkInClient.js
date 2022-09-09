import React, {Fragment, useState, useEffect} from 'react';
import {
  StatusBar,
  Text,
  Image,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  BackHandler,
  Dimensions,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import PTRView from 'react-native-pull-to-refresh';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, List, ListItem, Body, Left} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {FAB} from 'react-native-paper';
import Modal from 'react-native-modal';
import {
  SearchIcon,
  CloseIcon,
  LeftArrowIos,
  LeftArrowAndroid,
  RightAngle,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import cloneDeep from 'lodash/cloneDeep';

import {useSelector, useDispatch} from 'react-redux';
import {
  clientsListRequest,
  clientsListClear,
} from '../store/actions/clientsListAction';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import EventEmitter from 'react-native-eventemitter';

const ClientsWalkInClient = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visibleModal, setVisibleModal] = useState(false);

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const [alphabeticClients, setAlphabeticClients] = useState([]);

  const [clientCount, setClientCount] = useState(0);

  // Get the current state
  const clientsListData = useSelector((state) => state.clientsListReducer);
  const loderStatus = useSelector((state) => state.clientsListReducer.loader);

  // useEffect(() => {
  //   fetch('https://jsonplaceholder.typicode.com/posts')
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       setFilteredDataSource(responseJson);
  //       setMasterDataSource(responseJson);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  useEffect(() => {
    let obj = {listType: route.params.listType};
    dispatch(clientsListRequest(obj));

    EventEmitter.on('refreshPage', () => {
      dispatch(clientsListRequest(obj));
    });

    return () => {
      clientsListClear();
    };
  }, []);

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Analytics');
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, []);

  useEffect(() => {
    if (
      clientsListData &&
      clientsListData.details &&
      clientsListData.details.rows &&
      clientsListData.details.rows.length
    ) {
      console.log(
        'CLIENTS LIST DATA FETCHED: ',
        JSON.stringify(clientsListData),
      );
      setMasterDataSource(clientsListData);
    }
  }, [clientsListData]);

  useEffect(() => {
    let arrangedClients = arrangeClientsAlphabetically(filteredDataSource);
    setAlphabeticClients(arrangedClients);
  }, [filteredDataSource]);

  useEffect(() => {
    if (
      masterDataSource?.details?.rows &&
      masterDataSource.details.rows.length
    ) {
      let arrangedClients = arrangeClientsAlphabetically(masterDataSource);

      setAlphabeticClients(arrangedClients);
    }
  }, [masterDataSource]);

  const arrangeClientsAlphabetically = (dataSource) => {
    if (
      !!dataSource &&
      dataSource.status == 200 &&
      !!dataSource.details &&
      !!dataSource.details.rows &&
      dataSource.details.rows.length > 0
    ) {
      setClientCount(dataSource.details.rows.length);

      return Object.values(
        dataSource.details.rows.reduce((alphabetSection, user) => {
          // Phone number must for organic and in-organic clients
          console.log('*********', JSON.stringify(user));
          if (!!user && user.name) {
            let firstLetter = user.name[0].toLocaleUpperCase();
            if (!alphabetSection[firstLetter]) {
              alphabetSection[firstLetter] = {title: firstLetter, data: [user]};
            } else {
              alphabetSection[firstLetter].data.push(user);
            }
          }
          const orderedAlphabetSection = Object.keys(alphabetSection)
            .sort()
            .reduce((orderedObj, key) => {
              orderedObj[key] = alphabetSection[key];
              return orderedObj;
            }, {});
          return orderedAlphabetSection;
        }, {}),
      );
    } else {
      setClientCount(0);
      return [];
    }
  };

  const searchFilterFunction = (text) => {
    if (text) {
      // TO DEEP CLONE (prevent original masterDataSource object from being altered)
      let newData = cloneDeep(masterDataSource);

      if (newData?.details?.rows) {
        const newRows = newData.details.rows.filter(function (item) {
          const userName = item?.name ? item.name : '';
          const textData = text;
          return userName
            .toLocaleLowerCase()
            .includes(textData.toLocaleLowerCase());
        });
        newData.details.rows = newRows;
        setFilteredDataSource(newData);
        setSearch(text);
      }
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  // This method is for refresh tyhe page
  const refreshPage = () => {
    let obj = {listType: route.params.listType};
    dispatch(clientsListRequest(obj));
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        <View style={{height: 60, marginBottom: 10}}>
          <SearchBar
            searchIcon={{display: 'none'}}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction(text)}
            value={search}
            // autoFocus={true}
            placeholder="Search by client"
            placeholderTextColor={'#939DAA'}
            containerStyle={{
              backgroundColor: '#fff',
              borderBottomWidth: 0,
              borderTopWidth: 0,
              width: '100%',
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}
            inputStyle={{
              backgroundColor: '#fff',
              color: '#110F17',
              fontFamily: 'SofiaPro',
            }}
            inputContainerStyle={{
              paddingRight: 0,
              paddingLeft: 15,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderColor: '#dcdcdc',
            }}
            style={{
              fontSize: 14,
              fontFamily: 'SofiaPro',
              backgroundColor: '#fff',
            }}
          />
          <View
            style={[
              commonStyle.clientsearchback,
              {top: Platform.OS === 'ios' ? 15 : 15},
            ]}>
            <TouchableOpacity
              style={commonStyle.haederback}
              onPress={() => navigation.navigate('Analytics')}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
        </View>

        {!loderStatus ? (
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={[commonStyle.geolocationlistwrap, commonStyle.mb5]}>
              <View style={[commonStyle.searchBarText, commonStyle.mb05]}>
                <Text style={commonStyle.modalforgotheading}>Walk-in</Text>
                <Text style={[commonStyle.dotSmall, {marginHorizontal: 10}]}>
                  .
                </Text>
                <Text style={commonStyle.modalforgotheading}>
                  {clientCount}
                </Text>
              </View>

              {!!alphabeticClients && alphabeticClients.length > 0 ? (
                alphabeticClients.map((alphabetSection, index) => (
                  <View key={index}>
                    <TouchableHighlight style={{marginVertical: 8}}>
                      <Text style={commonStyle.blackTextR}>
                        {alphabetSection.title ? alphabetSection.title : ''}
                      </Text>
                    </TouchableHighlight>
                    {alphabetSection.data.map((clientListItem, aIndex) => (
                      <List key={aIndex} style={{marginVertical: 10}}>
                        <ListItem
                          thumbnail
                          style={[commonStyle.switchAccountView]}>
                          <TouchableOpacity
                            style={commonStyle.accountListFlex}
                            activeOpacity={0.5}
                            onPress={() =>
                              navigation.navigate('ClientsProfileWalkIn', {
                                clientId: clientListItem.id,
                              })
                            }>
                            <Left
                              style={[
                                commonStyle.reviewsAvaterwrap,
                                {
                                  alignSelf: 'flex-start',
                                  backgroundColor: '#FFE8E2',
                                },
                              ]}>
                              {/* <Image style={commonStyle.avatericon} defaultSource={require('../assets/images/default.png')} source={{ uri: clientListItem.profileImage }}/> */}
                              <Image
                                style={commonStyle.avatericon}
                                source={
                                  clientListItem.profileImage
                                    ? {uri: clientListItem.profileImage}
                                    : require('../assets/images/default-user.png')
                                }
                              />
                            </Left>
                            <Body style={commonStyle.switchAccountbody}>
                              <Text
                                style={[
                                  commonStyle.blackTextR18,
                                  commonStyle.mb03,
                                ]}>
                                {clientListItem.name ? clientListItem.name : ''}
                              </Text>
                              <Text
                                style={commonStyle.categorytagsText}
                                numberOfLines={1}>
                                {clientListItem.countryCode
                                  ? clientListItem.countryCode
                                  : ''}{' '}
                                {clientListItem.phone
                                  ? clientListItem.phone
                                  : ''}
                              </Text>
                            </Body>
                            <TouchableHighlight style={{alignSelf: 'center'}}>
                              <RightAngle />
                            </TouchableHighlight>
                          </TouchableOpacity>
                        </ListItem>
                      </List>
                    ))}
                  </View>
                ))
              ) : (
                <View style={[commonStyle.noMassegeWrap]}>
                  <View style={[commonStyle.mb1]}>
                    <Image
                      style={{height: 120}}
                      source={require('../assets/images/no-client.png')}
                      resizeMode={'contain'}
                    />
                  </View>
                  <Text
                    style={[
                      commonStyle.grayText16,
                      commonStyle.textCenter,
                      commonStyle.colorOrange,
                    ]}>
                    No clients yet
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        ) : (
          <ActivityLoaderSolid />
        )}
        <TouchableWithoutFeedback>
          <TouchableOpacity
            activeOpacity={0.5}
            style={commonStyle.floting}
            onPress={() => {
              setVisibleModal('ServicesInfoDialog');
            }}>
            <Image
              style={{
                resizeMode: 'contain',
                width: 20,
                height: 20,
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 2,
              }}
              source={require('../assets/images/user-add.png')}
            />
          </TouchableOpacity>
        </TouchableWithoutFeedback>
      </Container>

      {/* Setup Service modal start */}
      <Modal
        isVisible={visibleModal === 'ServicesInfoDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.othersbottomModal}>
        <View>
          <View style={commonStyle.othersModal}>
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}
              onPress={() =>
                navigation.navigate('ClientsImport') &
                setVisibleModal({visibleModal: null})
              }>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/users-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>
                Import from your contacts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyle.searchBarText, {padding: 12}]}
              onPress={() =>
                navigation.navigate('ClientsAddClient') &
                setVisibleModal({visibleModal: null})
              }>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/add-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Add manually</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={commonStyle.modalcancle}
            activeOpacity={0.9}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Setup Service modal End */}
    </Fragment>
  );
};

export default ClientsWalkInClient;
