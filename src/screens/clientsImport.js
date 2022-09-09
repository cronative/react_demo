import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  Dimensions,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Body, Left, Title} from 'native-base';
import CheckBox from 'react-native-check-box';
import {Button, SearchBar} from 'react-native-elements';
import Modal from 'react-native-modal';
import {Get, Post} from '../api/apiAgent';
import {
  UncheckedBox,
  CheckedBox,
  SearchIcon,
  CheckedOrange,
} from '../components/icons';
import {AnalyticsPaymentModal} from '../components/modal';
import commonStyle from '../assets/css/mainStyle';
import circleMsgImg from '../assets/images/circle-msg-icon.png';
import {useDispatch, useSelector} from 'react-redux';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import Contacts from 'react-native-contacts';
import EventEmitter from 'react-native-eventemitter';
import {
  importClientContactsRequest,
  importClientContactsRequestClear,
} from '../store/actions/clientsListAction';
import debounce from 'lodash.debounce';

const ClientsImport = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [isClientImportAllChecked, setIsClientImportAllChecked] =
    useState(false);
  const [showButton, setShowButton] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [isSearchable, setIsSearchable] = useState(true);
  const [loader, setLoader] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [importClientList, setImportClientList] = useState([]);
  const [selectedImportClient, setSelectedImportClient] = useState([]);
  const clientAddData = useSelector(
    (state) => state.clientsListReducer.importClientDetails,
  );
  let debounceTimer;

  // Get all client data from your device
  const getContactPermission = async () => {
    try {
      let permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );

      // Check the permission is granter or not
      if (permission === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionStatus(false);
        clearSearch();
      } else {
        setPermissionStatus(true);
        setLoader(false);
        global.showToast('Contacts permission denied', 'error');
      }
    } catch (catchError) {
      setLoader(false);
      setPermissionStatus(true);
      console.log('Catch Error : ', catchError);
    }
  };

  const getIosContactList = async () => {
    console.log('this function is being called');

    Contacts.getAll().then((contacts) => {
      console.log('contact is', contacts);
    });

    console.log('function calling ends');
  };

  const getContactPermissionIos = async () => {
    Contacts.checkPermission().then((permission) => {
      // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
      if (permission === 'undefined') {
        Contacts.requestPermission().then((permission) => {
          // ...
          if (permission === 'authorized') {
            // yay!
            //getIosContactList();
            setPermissionStatus(false);
            console.log('permission granted1 *****');
            clearSearch();
          }
          if (permission === 'denied') {
            // x.x
            setPermissionStatus(true);
            console.log('permission decliend1 *****');
            setLoader(false);
            global.showToast('Contacts permission denied', 'error');
          }
        });
      }
      if (permission === 'authorized') {
        // yay!
        setPermissionStatus(false);
        console.log('permission granted2 *****');
        //getIosContactList();
        clearSearch();
      }
      if (permission === 'denied') {
        // x.x
        setPermissionStatus(true);
        console.log('permission decliend2 *****');
        setLoader(false);
        global.showToast('Contacts permission denied', 'error');
      }
    });
  };

  useEffect(() => {
    if (!!importClientList) {
      if (search.length > 0) {
        debounceTimer = setTimeout(() => {
          console.log('Searching', search);
          setImportClientList(
            importClientList.map((items) => {
              let matchedStatus =
                Platform.OS === 'android'
                  ? items?.displayName
                      ?.toLowerCase()
                      .search(search.toLowerCase())
                  : items?.givenName
                      ?.toLowerCase()
                      .search(search.toLowerCase());
              if (matchedStatus != -1) {
                items.visible = true;
              } else {
                items.visible = false;
              }
              return items;
            }),
          );
        }, 500);
      } else {
        setImportClientList(
          importClientList.map((item) => {
            item.visible = true;
            return item;
          }),
        );
      }
    }

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [search]);

  // This methos will load once
  useEffect(() => {
    if (Platform.OS === 'android') {
      getContactPermission();
    } else if (Platform.OS === 'ios') getContactPermissionIos();
  }, []);

  // This methos is to search the filter
  const searchFilterFunction = (text) => {
    if (text.length > 0) {
      setIsSearchable(false);
    } else {
      setIsSearchable(true);
    }
    setSearch(text);
  };

  // This method will call on Client Import All Checked.
  const ClientImportAllSelectHelper = () => {
    if (importClientList.length == 0) {
      return;
    }
    // getTheSettimeOut();
    setIsClientImportAllChecked(!isClientImportAllChecked);
    if (isClientImportAllChecked === false) {
      if (importClientList.length > 0) {
        importClientList.forEach((items) => {
          items.isChecked = true;
        });
        setSelectedImportClient(importClientList);
      }
    } else {
      if (importClientList.length > 0) {
        importClientList.forEach((items) => {
          items.isChecked = false;
        });
        setSelectedImportClient([]);
      }
    }
    setImportClientList([...importClientList]);
  };

  // This method is to get the set timeout
  const getTheSettimeOut = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  // This method is to select helper
  const importClientListSelectHelper = (item) => {
    // getTheSettimeOut();
    if (isClientImportAllChecked === true) {
      setIsClientImportAllChecked(false);
    }
    importClientList.forEach((importclient) => {
      if (importclient.uniqueId === item.uniqueId) {
        if (importclient.isChecked === true) {
          importclient.isChecked = false;
        } else {
          importclient.isChecked = true;
        }
      }
    });
    setImportClientList([...importClientList]);
    let blankArray = [];
    importClientList.forEach((items) => {
      if (items.isChecked === true) {
        blankArray.push(items);
      }
    });
    blankArray.length > 0
      ? setSelectedImportClient(blankArray)
      : setSelectedImportClient([]);
  };

  // This method will call on Modal show hide.
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // This method is to redict user to client all contact page
  const showMsgModal = () => {
    setVisibleModal(true);
    setTimeout(() => {
      setVisibleModal(false);
      navigation.navigate('ClientsAllContacts');
    }, 3000);
  };

  // This function is to clear the search bar
  const clearSearch = () => {
    setLoader(true);
    setSearch('');
    setIsSearchable(true);
    Contacts.getAll()
      .then((contactList) => {
        setTimeout(() => {
          setLoader(false);
        }, 1000);
        let count = 1;
        if (contactList.length > 0) {
          if (Platform.OS === 'android') {
            contactList.sort((a, b) =>
              a?.displayName.toLowerCase() > b?.displayName.toLowerCase()
                ? 1
                : b?.displayName.toLowerCase() > a?.displayName.toLowerCase()
                ? -1
                : 0,
            );
          } else if (Platform.OS === 'ios') {
            contactList.sort((a, b) =>
              a?.givenName.toLowerCase() > b?.givenName.toLowerCase()
                ? 1
                : b?.givenName.toLowerCase() > a?.givenName.toLowerCase()
                ? -1
                : 0,
            );
          }

          contactList.map((item) => {
            item.uniqueId = count++;
            item.isChecked = false;
            item.visible = true;
            return item;
          });
          setImportClientList(contactList);
          setSelectedImportClient([]);
        } else {
          setImportClientList([]);
          setSelectedImportClient([]);
        }
      })
      .catch((e) => {
        setLoader(false);
      });
  };

  // This function is to import the client
  const importClients = () => {
    let blankArray = [];
    importClientList.forEach((items) => {
      if (items.isChecked === true && items?.phoneNumbers?.length > 0) {
        let obj = {
          name: items?.displayName
            ? items.displayName
            : items.givenName + ' ' + items.familyName,
          phone: items?.phoneNumbers[0].number
            .split(' ')
            .join('')
            .split('(')
            .join('')
            .split(')')
            .join('')
            .split('-')
            .join(''),
        };
        blankArray.push(obj);
      }
    });
    if (blankArray.length > 0) {
      let newArray = [];
      setLoader(true);
      blankArray.map((eachItems) => {
        let phoneNum, ctryCode;
        if (eachItems.phone.length == 10) {
          phoneNum = eachItems.phone;
          ctryCode = '';
        } else if (eachItems.phone.length == 11) {
          phoneNum = eachItems.phone.substr(-10);
          ctryCode = '';
        } else if (eachItems.phone.length > 11) {
          phoneNum = eachItems.phone.substr(-10);
          ctryCode = eachItems.phone.replace(phoneNum, '');
        }
        let newObj = {
          name: eachItems.name ? eachItems.name : 'N/A',
          phone: phoneNum,
        };
        if (ctryCode != '') {
          newObj.countryCode = ctryCode.replace('+', '');
        }
        newArray.push(newObj);
      });

      // console.log('Real Array : ', newArray);
      let bodyObj = {
        data: newArray,
      };
      dispatch(importClientContactsRequest(bodyObj));
    } else {
      global.showToast(
        'Please select at least one client from the list',
        'error',
      );
    }
  };

  // This method will handle the response
  useEffect(() => {
    if (clientAddData && clientAddData.status == 200) {
      setSearch('');
      setIsClientImportAllChecked(false);
      setShowButton(true);
      setVisibleModal(false);
      setIsSearchable(true);
      setLoader(false);
      setScrollOffset();
      setImportClientList([]);
      setSelectedImportClient([]);
      dispatch(importClientContactsRequestClear());
      global.showToast(clientAddData.message, 'success');
      setTimeout(() => {
        navigation.navigate('Analytics');
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1200);
    } else if (clientAddData && clientAddData.status != 200) {
      setLoader(false);
      if (
        clientAddData.response.data.message !== null &&
        clientAddData.response.data.message !== ''
      ) {
        global.showToast(clientAddData.response.data.message, 'error');
        dispatch(importClientContactsRequestClear());
      }
    }
  }, [clientAddData]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.importallselectwrap, {paddingTop: 15}]}>
            <View style={{height: 60, marginBottom: 5}}>
              <SearchBar
                searchIcon={{display: 'none'}}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={() => searchFilterFunction('')}
                value={search}
                disabled={permissionStatus}
                // autoFocus={true}
                placeholder="Search by client"
                placeholderTextColor={'#939DAA'}
                containerStyle={{
                  backgroundColor: '#fff',
                  padding: 0,
                  borderBottomWidth: 0,
                  borderTopWidth: 0,
                  width: '100%',
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
              <View style={[commonStyle.clientsearchback, {top: 8, left: 5}]}>
                <TouchableOpacity style={commonStyle.haederback}>
                  <SearchIcon />
                </TouchableOpacity>
              </View>
            </View>
            {isSearchable === true ? (
              <View>
                <CheckBox
                  style={{paddingVertical: 10}}
                  onClick={() => ClientImportAllSelectHelper()}
                  isChecked={isClientImportAllChecked}
                  checkedCheckBoxColor={'#ff5f22'}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  rightText={`Select all (${importClientList.length})`}
                  rightTextStyle={[commonStyle.blackTextR]}
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                />
              </View>
            ) : null}
          </View>

          <View style={[commonStyle.categoriseListWrap, commonStyle.mt15]}>
            <View style={[commonStyle.categoriseListView, commonStyle.mb2]}>
              {importClientList &&
                importClientList.map(
                  (item, index) =>
                    !!item.visible && (
                      <List key={index} style={[commonStyle.categoriseList]}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          <TouchableOpacity
                            style={commonStyle.accountListFlex}
                            activeOpacity={0.5}>
                            <View
                              style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                marginRight: 15,
                              }}>
                              <CheckBox
                                onClick={() =>
                                  importClientListSelectHelper(item)
                                }
                                isChecked={item.isChecked}
                                checkedCheckBoxColor={'#ff5f22'}
                                uncheckedCheckBoxColor={'#e6e7e8'}
                                checkedImage={<CheckedBox />}
                                unCheckedImage={<UncheckedBox />}
                              />
                            </View>
                            <Left
                              style={[
                                commonStyle.reviewsAvaterwrap,
                                {
                                  alignSelf: 'flex-start',
                                  backgroundColor: item.importclientAvaterBg,
                                },
                              ]}>
                              <Image
                                style={commonStyle.avatericon}
                                source={require('../assets/images/default-user.png')}
                              />
                            </Left>
                            <Body style={commonStyle.switchAccountbody}>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                                onPress={() =>
                                  importClientListSelectHelper(item)
                                }>
                                <Text
                                  style={[
                                    commonStyle.blackTextR18,
                                    commonStyle.mb03,
                                    {marginRight: 10},
                                  ]}>
                                  {item.displayName
                                    ? item.displayName
                                    : item.givenName + ' ' + item.familyName}
                                </Text>
                                {/* {item.isExistingClient == true ?
                            <CheckedOrange/> : null } */}
                              </TouchableOpacity>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                                onPress={() =>
                                  importClientListSelectHelper(item)
                                }>
                                {item?.phoneNumbers?.length > 0 ? (
                                  <Text
                                    style={commonStyle.categorytagsText}
                                    numberOfLines={1}>
                                    {item?.phoneNumbers[0].number
                                      .split(' ')
                                      .join('')}
                                  </Text>
                                ) : (
                                  <Text
                                    style={commonStyle.categorytagsText}
                                    numberOfLines={1}>
                                    N/A
                                  </Text>
                                )}
                              </TouchableOpacity>
                            </Body>
                          </TouchableOpacity>
                        </ListItem>
                      </List>
                    ),
                )}
            </View>
          </View>
        </ScrollView>
        {showButton && (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title={`Import clients (${selectedImportClient.length})`}
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={importClients}
              // onPress={() => {setVisibleModal('AnalyticsPaymentDialog')}}
            />
          </View>
        )}
      </Container>
      {/* Import Invite clients modal start */}
      <Modal
        isVisible={visibleModal === 'AnalyticsPaymentDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <View style={commonStyle.modalContent}>
              <View
                style={[
                  commonStyle.dialogheadingbg,
                  {borderBottomWidth: 0, paddingBottom: 0},
                ]}>
                <Text style={[commonStyle.subheading]}>
                  Invite clients by text
                </Text>
              </View>
              <View style={[commonStyle.mt15, commonStyle.mb1]}>
                <Text style={commonStyle.grayText16}>
                  Let you clients know, that from now on, you’re available to
                  book via Readyhubb. Invites will be sent at 9:00
                </Text>
                <View style={commonStyle.mt1}>
                  <Button
                    title="Send text invites (24)"
                    containerStyle={[
                      commonStyle.buttoncontainerStyle,
                      {paddingHorizontal: 0},
                    ]}
                    buttonStyle={[
                      commonStyle.commonbuttonStyle,
                      {width: '100%'},
                    ]}
                    titleStyle={commonStyle.buttontitleStyle}
                    onPress={() => {
                      showMsgModal();
                    }}
                  />
                  <TouchableOpacity
                    style={commonStyle.notnowbtn}
                    activeOpacity={0.5}
                    onPress={() => setVisibleModal({visibleModal: null})}>
                    <Text style={commonStyle.grayTextBold}>
                      Don’t invite to Readyhubb
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Import Invite clients modal End */}

      {/* Send text invites Message modal start */}
      <Modal
        visible={visibleModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={commonStyle.messageIcon}>
              <Image source={circleMsgImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              24 clients will be invited to book with you via Readyhubb
            </Text>
          </View>
        </View>
      </Modal>
      {/* Send text invites Message modal end */}
    </Fragment>
  );
};

export default ClientsImport;
