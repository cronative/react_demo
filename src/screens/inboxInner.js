import {useNavigation} from '@react-navigation/native';
import {Body, Container, Left, List, ListItem, Footer} from 'native-base';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Buffer} from 'buffer';
import {
  SafeAreaView,
  Alert,
  BackHandler,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import {Modal as NativeModal} from 'react-native';
// import {TwilioService} from '../components/commonservices/twilio-service';
import EventEmitter from 'react-native-eventemitter';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {Client} from 'twilio-chat';
import {Delete, Get, Post} from '../api/apiAgent';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import RNFetchBlob from 'rn-fetch-blob';
import {
  AddFiles,
  CloseIcon,
  LeftArrowAndroid,
  LeftArrowIos,
  MoreVertical,
  SendIcon,
} from '../components/icons';
const {width, height} = Dimensions.get('window');
import {UploadPhotoVideoModal} from '../components/modal';
import {
  VIDEO_POSTER_BASE_PATH,
  IMAGE_MAX_SIZE,
  IMAGE_MAX_SIZE_VALIDATION_MSG,
} from '../api/constant';
import ImageEditor from '@react-native-community/image-editor';
import {useFocusEffect} from '@react-navigation/core';
import ImageView from 'react-native-image-viewing';

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    backgroundColor: '#ccc',
  },
});

const InboxInner = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isMessageInputFocus, setIsMessageInputFocus] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [messageDetailsList, setMessageDetailsList] = useState([]);
  const [isBlockedUser, setIsBlockedUser] = useState(
    route.params && route.params.isBlockedUser,
  );
  const [isReloadChatList, setIsReloadChatList] = useState(false);
  const [twilioChannel, setTwilioChannel] = useState(undefined);
  const [uploadFile, setUploadFile] = useState(null);
  const [imageContent, setImageContent] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const [imgViewerData, setImgViewerData] = useState(null);
  const [imgViewerCurrentIndex, setImgViewerCurrentIndex] = useState(null);
  const [visible, setIsVisible] = useState(false);

  const {channelId, channelDetails, userType, loginId, isSession} =
    route.params;
  const messageDetais = useSelector(
    (state) => state.messageDetails.messageDetailsList,
  );

  const scrollViewRef = useRef();

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (route?.params?.fromBookings) {
          console.log('From Bookings');
          navigation.goBack();
          setTimeout(() => {
            navigation.goBack();
          }, 100);
        } else {
          navigation.goBack();
        }
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, []);

  useEffect(() => {
    if (userType == '1') {
      setUserId(channelDetails.customerId);
      setUserImage(channelDetails?.User?.profileImage);
      setUserName(
        channelDetails.User &&
          channelDetails.User[isSession ? 'fullName' : 'userName'],
      );
    } else {
      if (!channelDetails.ProMeta) {
        console.log('channel ***', JSON.stringify(channelDetails));
        setUserId(channelDetails.User.id);
        setUserImage(channelDetails?.User?.profileImage);
        setUserName(
          channelDetails.User && channelDetails.User?.ProMetas?.length > 0
            ? channelDetails.User.ProMetas[0].businessName
            : channelDetails?.User?.userName,
        );
      } else {
        setUserId(channelDetails.proId);
        setUserImage(channelDetails?.ProMeta?.profile?.profileImage);
        setUserName(
          channelDetails.ProMeta && channelDetails.ProMeta.businessName,
        );
      }
    }
    setUpTwilio();
    getMessageDetails(channelId);
  }, [channelId]);

  useEffect(() => {
    if (messageDetais && messageDetais.state) {
      manageMessageAddHandler(messageDetais);
    }
  }, [messageDetais]);

  useEffect(() => {
    if (twilioChannel?.channelState?.status === 'joined') {
      retrieveTwilioImages(twilioChannel);
      updateReadStatus(twilioChannel);
    }
  }, [twilioChannel]);

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        setKeyboardStatus(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd();
        }, 1000);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardStatus(0);
      });

      return () => {
        setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  const updateReadStatus = (twilioChannel) => {
    if (messageDetailsList.length > 0) {
      twilioChannel
        .updateLastConsumedMessageIndex(
          messageDetailsList[messageDetailsList.length - 1]?.index,
        )
        .then((val) => {});
    }
  };

  const chooseFile = () => {
    if (isBlockedUser) {
      global.showToast('Unblock to send message.', 'error');
    } else {
      let options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
        quality: 0.2,
        mediaType: 'photo',
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          let source = response;
          setUploadFile(source);
          if (!!twilioChannel) {
            if (twilioChannel.channelState.status == 'joined') {
              twilioChannel
                .sendMessage({
                  contentType: response?.type,
                  // media: Buffer.from(response.data, 'base64'),
                  media: Buffer.from(response.data, 'base64'),
                })
                .then((result) => {
                  setUploadFile(null);
                })
                .catch((reject) => {});
            } else {
              global.showToast('Channel not joined', 'error');
              setUploadFile(null);
            }
          } else {
            setUploadFile(null);
          }
        }
      });
    }
  };

  const fileSelectedEvent = (items) => {
    if (isBlockedUser) {
      global.showToast('Unblock to send message.', 'error');
    } else {
      if (items?.length > 0) {
        let sizeValidationPass = validateFileSizes(items);
        if (!sizeValidationPass) {
          Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
          return false;
        }
        let typeCheckedItems = items.filter((item) => {
          if (
            item.node.type === 'image/jpg' ||
            item.node.type === 'image/jpeg' ||
            item.node.type === 'image/png' ||
            item.node.type === 'image'
          ) {
            return item;
          }
        });

        if (typeCheckedItems.length === items.length) {
          setVisibleModal(null);

          // let source = response;
          let source = typeCheckedItems[0].node.image;
          setUploadFile(source);

          if (Platform.OS === 'android') {
            RNFetchBlob.fs
              .readFile(typeCheckedItems[0].node.image.uri, 'base64')
              .then((fileData) => {
                if (!!twilioChannel) {
                  if (twilioChannel.channelState.status == 'joined') {
                    twilioChannel
                      .sendMessage({
                        contentType:
                          typeCheckedItems[0].node.type === 'image'
                            ? 'image/jpg'
                            : typeCheckedItems[0].node.type,
                        // media: Buffer.from(response.data, 'base64'),
                        media: Buffer.from(fileData, 'base64'),
                      })
                      .then((result) => {
                        setUploadFile(null);
                      })
                      .catch((reject) => {});
                  } else {
                    setUploadFile(null);
                  }
                } else {
                  setUploadFile(null);
                }
              });
          } else {
            ImageEditor.cropImage(typeCheckedItems[0].node.image.uri, {
              size: {
                width: typeCheckedItems[0].node.image.width,
                height: typeCheckedItems[0].node.image.height,
              },
              offset: {
                x: 0,
                y: 0,
              },
            }).then((uri) => {
              RNFetchBlob.fs
                .readFile(uri.replace('file://', ''), 'base64')
                .then((fileData) => {
                  if (!!twilioChannel) {
                    if (twilioChannel.channelState.status == 'joined') {
                      twilioChannel
                        .sendMessage({
                          contentType:
                            typeCheckedItems[0].node.type === 'image'
                              ? 'image/jpg'
                              : typeCheckedItems[0].node.type,
                          // media: Buffer.from(response.data, 'base64'),
                          media: Buffer.from(fileData, 'base64'),
                        })
                        .then((result) => {
                          setUploadFile(null);
                        })
                        .catch((reject) => {});
                    } else {
                      setUploadFile(null);
                    }
                  } else {
                    setUploadFile(null);
                  }
                });
            });
          }
          // setReviewFiles([...reviewFiles, ...imageFiles]);
        } else {
          Alert.alert('Only jpg, jpeg or png images are accepted');
          // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
        }
      }
    }
  };

  const cameraSubmitEvent = (response) => {
    if (isBlockedUser) {
      global.showToast('Unblock to send message.', 'error');
    } else {
      let sizeValidationPass = validateFileSizes(response);
      if (!sizeValidationPass) {
        Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
        return false;
      }

      setVisibleModal(null);
      // if (Platform.OS === 'ios') {
      //   let path = response.uri;
      //   path = '~' + path.substring(path.indexOf('/Documents'));
      //   response.fileName = path.split('/').pop();
      // }
      // let imageFile = {
      //   name: response.fileName,
      //   type: response.type,
      //   uri: response.uri,
      //   size: response.fileSize,
      // };
      if (
        response.type === 'image/jpg' ||
        response.type === 'image/jpeg' ||
        response.type === 'image/png'
      ) {
        setVisibleModal(null);
        setVisibleModal(null);

        let source = response;
        // let source = typeCheckedItems[0].node.image;
        setUploadFile(source);

        RNFetchBlob.fs.readFile(source.uri, 'base64').then((fileData) => {
          if (!!twilioChannel) {
            if (twilioChannel.channelState.status == 'joined') {
              twilioChannel
                .sendMessage({
                  contentType:
                    source.type === 'image' ? 'image/jpg' : source.type,
                  // media: Buffer.from(response.data, 'base64'),
                  media: Buffer.from(fileData, 'base64'),
                })
                .then((result) => {
                  setUploadFile(null);
                })
                .catch((reject) => {});
            } else {
              global.showToast('Channel not joined', 'error');
              setUploadFile(null);
            }
          } else {
            setUploadFile(null);
          }
        });
      } else {
        Alert.alert('Only jpg, jpeg or png images are accepted');
        // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
      }
    }
  };

  const validateFileSizes = (data) => {
    // for array
    if (data?.length) {
      let validatedItems = data.filter(
        (item) => item.node.image.fileSize <= IMAGE_MAX_SIZE,
      );
      return validatedItems.length === data.length;
    } else {
      // for single image
      return data.fileSize <= IMAGE_MAX_SIZE;
    }
  };

  const setUpTwilio = () => {
    let twilioChannel;
    Post('user/chat-identity', '')
      .then((result) => {
        if (result.status === 200) {
          let twilioToken = result.data.token;
          // setTimeout(() => {
          Client.create(twilioToken) //setup twilio client using the token
            .then((client) => {
              let channelName = channelId;
              client
                .getChannelByUniqueName(channelName) //get the unique channel name
                .then((channel) => {
                  if (channel) {
                    return channel;
                  }
                })
                .catch((err) => {
                  if (err.body.code == 50300) {
                    return client.createChannel({
                      //creating a unique channel name if not exist
                      uniqueName: channelName,
                      friendlyName: channelName,
                    });
                  }
                })
                .then((channel) => {
                  twilioChannel = channel;
                  if (twilioChannel.channelState.status !== 'joined')
                    twilioChannel.join(); //join the channel if not joined
                })
                .then(() => {
                  setTwilioChannel(twilioChannel);
                  twilioChannel.on('messageAdded', (message) => {
                    if (message.state.type == 'media') {
                      message.media.getContentTemporaryUrl().then((url) => {
                        let key = message.sid;
                        setImageContent((imageContent) => {
                          return {...imageContent, [key]: url};
                        });
                      });
                    }
                    dispatch({type: 'SET_MESSAGE_DETAILS', value: message});
                  });
                });
            });
          // }, 100);
        }
      })
      .catch((error) => {});
  };

  const getMessageDetails = (channelId) => {
    setLoader(true);
    Get('user/messages/', {channelId})
      .then((result) => {
        setLoader(false);
        if (result.status === 200 && result.data) {
          setMessageDetailsList(result.data);
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const onClickRedirect = () => {
    if (route?.params?.fromBookings) {
      console.log('From Bookings');
      navigation.goBack();
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } else {
      navigation.goBack();
    }
  };

  const deleteChatHandler = () => {
    setLoader(true);
    Delete('user/chats/', {
      channelId,
      lastMessageIndex:
        messageDetailsList[messageDetailsList.length - 1]?.index,
    })
      .then((result) => {
        setLoader(false);
        console.log(
          'delete response is***** ',
          // result,
          // channelId,
          JSON.stringify(
            messageDetailsList[messageDetailsList.length - 1]?.index,
          ),
        );
        if (result.status === 200) {
          global.showToast(result.message, 'success');
          setVisibleModal({visibleModal: null});
          setMessageDetailsList([]);
          setTimeout(() => {
            onClickRedirect();
          }, 10);
        }
      })
      .catch((error) => {
        global.showToast(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
        setLoader(false);
      });
  };

  const blockUserHandler = () => {
    setLoader(true);
    Post('user/block-users/', {blockerId: userId})
      .then((result) => {
        setLoader(false);
        if (result.status == 200) {
          setVisibleModal({visibleModal: null});
          global.showToast(result.message, 'success');
          setIsBlockedUser(1);
          setIsReloadChatList(true);
        }
      })
      .catch((error) => {
        setVisibleModal({visibleModal: null});
        global.showToast(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
        setLoader(false);
      });
  };

  const unBlockIdUserHandler = () => {
    setLoader(true);
    Post('user/unblock-users/', {unblockId: userId})
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          setVisibleModal({visibleModal: null});
          global.showToast(result.message, 'success');
          setIsBlockedUser(0);
          setIsReloadChatList(true);
        }
      })
      .catch((error) => {
        // if (
        //   error &&
        //   error.response &&
        //   error.response.data &&
        //   error.response.data.status == 409
        // ) {
        //   global.showToast(error.response.data.message, 'success', 'top');
        //   setVisibleModal({visibleModal: null});
        // } else {
        //   global.showToast(error.response.data.message, 'error', 'top');
        // }
        global.showToast(error.response.data.message, 'error');
        setLoader(false);
      });
  };

  const onSendMessage = () => {
    if (messageInput.trim().length) {
      sendMessageToApi(messageInput);
      setMessageInput('');
    }
  };

  const sendMessageToApi = (message) => {
    setSendLoader(true);
    Post('user/messages/', {message, channelId})
      .then((result) => {
        setLoader(false);
        if (result.status === 200 && result.data) {
          setMessageInput(null);
          setIsMessageInputFocus(false);
          setIsReloadChatList(true);
        } else {
          global.showToast(result.message || 'Something went wrong', 'error');
        }
      })
      .catch((error) => {
        global.showToast(
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
        setLoader(false);
      })
      .finally(() => {
        setSendLoader(false);
      });
  };

  const deleteChatOrBlockUserHandlerConfirmation = (message, type) => {
    Alert.alert(
      'Confirmation',
      message,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            type === 'Block'
              ? blockUserHandler()
              : type === 'UnBlock'
              ? unBlockIdUserHandler()
              : deleteChatHandler(),
        },
      ],
      {cancelable: false},
    );
  };

  const manageMessageAddHandler = (messageDetails) => {
    if (messageDetails && messageDetails.sid) {
      if (
        messageDetailsList.length == 0 ||
        (messageDetailsList &&
          messageDetailsList.length &&
          messageDetailsList.every((item) => item.sid != messageDetails.sid))
      ) {
        setMessageDetailsList([...messageDetailsList, messageDetails]);
        setTimeout(() => {
          if (scrollViewRef.current) {
            console.log('Scrolling After Adding Message Fetch');
            scrollViewRef.current.scrollToEnd();
          }
        }, 100);
        // }
      }
    }
  };

  const retrieveTwilioImages = (twilioChannel) => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        console.log('Scrolling Before Retrieving Images');
        scrollViewRef.current.scrollToEnd();
      }
    }, 100);
    twilioChannel.getMessages().then((messages) => {
      if (!!messages) {
        messages.items.forEach((singleMessage) => {
          if (singleMessage.state.type == 'media') {
            singleMessage.media.getContentTemporaryUrl().then((url) => {
              let key = singleMessage.sid;
              setImageContent((imageContent) => {
                return {...imageContent, [key]: url};
              });
            });
          }
        });
      }
    });
  };

  const reviewImagePressHandler = (ProResources) => {
    console.log('pro resources:', ProResources);
    // const imgUrls = ProResources.map((item) => {
    //   if (item.resourceType == 'image') return { uri: item.url };
    // });
    setImgViewerData([{uri: ProResources}]);
    // setImgViewerCurrentIndex(0);
    setIsVisible(true);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <View style={commonStyle.userheaderwrap}>
          <List>
            <ListItem thumbnail style={commonStyle.switchAccountView}>
              <TouchableOpacity
                style={commonStyle.headeruserback}
                onPress={onClickRedirect}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
              <Left style={commonStyle.headerinboxuserAvaterwrap}>
                <TouchableOpacity
                  onPress={() => {
                    if (userId && userType) {
                      if (userType == '1') {
                        navigation.navigate('Analytics');
                        setTimeout(
                          () =>
                            navigation.navigate('ClientsProfile', {
                              clientId: userId,
                              fromInboxInner: true,
                            }),
                          10,
                        );
                      } else {
                        navigation.navigate('Explore');
                        setTimeout(() => {
                          navigation.navigate('ProfessionalPublicProfile', {
                            proId: userId,
                            doubleBack: true,
                            singleBack: false,
                          });
                        }, 100);
                      }
                    }
                  }}>
                  <Image
                    style={commonStyle.headerinboxuserAvaterImg}
                    defaultSource={require('../assets/images/default-user.png')}
                    source={
                      userImage
                        ? {
                            uri: userImage,
                          }
                        : require('../assets/images/default-user.png')
                    }
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </Left>
              <Body style={commonStyle.switchAccountbody}>
                <TouchableOpacity
                  onPress={() => {
                    if (userId && userType) {
                      if (userType == '1') {
                        navigation.navigate('Analytics');
                        setTimeout(
                          () =>
                            navigation.navigate('ClientsProfile', {
                              clientId: userId,
                              fromInboxInner: true,
                            }),
                          10,
                        );
                      } else {
                        navigation.navigate('Explore');
                        setTimeout(() => {
                          navigation.navigate('ProfessionalPublicProfile', {
                            proId: userId,
                            doubleBack: true,
                            singleBack: false,
                          });
                        }, 100);
                      }
                    }
                  }}>
                  <Text style={[commonStyle.blackText16]}>{userName}</Text>
                </TouchableOpacity>
                {/* <Text style={commonStyle.grayText14} numberOfLines={1}>
                  Usually responds within 3 hours
                </Text> */}
              </Body>
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}
                onPress={() => {
                  setVisibleModal('MessageInnerInfoDialog');
                }}>
                <MoreVertical />
              </TouchableOpacity>
            </ListItem>
          </List>
        </View>
        {/* <View style={styles.screen}>
          {!messageDetailsList || !messageDetailsList.length ? null : (
            // <ChatLoader />
            <GiftedChat
              // messagesContainerStyle={styles.messageContainer}
              messages={messageDetailsList}
              renderAvatarOnTop
              // onSend={(messages) => onSend(messages)}
              user={{from: 1}}
            />
          )}
        </View> */}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          extraScrollHeight={50}
          //ref={scrollViewRef}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            height: Platform.OS === 'ios' ? height - 115 : height - 90,
          }}>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 70,
              flex: 1,
            }}>
            <FlatList
              style={[
                {
                  paddingTop: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                },
                keyboardStatus && {marginTop: keyboardStatus},
              ]}
              ref={scrollViewRef}
              data={messageDetailsList}
              renderItem={(eachMessage, index) => (
                <TouchableWithoutFeedback key={index}>
                  {eachMessage.item.from == loginId ||
                  eachMessage.item.author == loginId ? (
                    eachMessage.item.type != 'media' ? (
                      <View style={commonStyle.messagereply}>
                        <TouchableHighlight
                          style={commonStyle.messagereplytext}>
                          <Text style={commonStyle.blackTextR}>
                            {eachMessage.item.body}
                          </Text>
                        </TouchableHighlight>
                      </View>
                    ) : imageContent[eachMessage.item.sid] ? (
                      <TouchableHighlight
                        style={commonStyle.replyuploadpic}
                        onPress={() =>
                          reviewImagePressHandler(
                            imageContent[eachMessage.item.sid],
                          )
                        }>
                        <Image
                          style={{
                            height: 120,
                            width: 120,
                            borderRadius: 12,
                          }}
                          source={{
                            uri: imageContent[eachMessage.item.sid],
                          }}
                          resizeMode={'cover'}
                        />
                      </TouchableHighlight>
                    ) : (
                      <View style={commonStyle.replyuploadpic}>
                        <View
                          style={{
                            height: 120,
                            width: 120,
                            borderRadius: 12,
                          }}></View>
                      </View>
                    )
                  ) : eachMessage.item.type != 'media' ? (
                    <View style={commonStyle.messageSend}>
                      <TouchableHighlight style={commonStyle.messageSendtext}>
                        <Text style={commonStyle.blackTextR}>
                          {eachMessage.item.body}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  ) : imageContent[eachMessage.item.sid] ? (
                    <TouchableHighlight
                      style={commonStyle.Senduploadpic}
                      onPress={() =>
                        reviewImagePressHandler(
                          imageContent[eachMessage.item.sid],
                        )
                      }>
                      <Image
                        style={{height: 120, width: 120, borderRadius: 12}}
                        source={{
                          uri: imageContent[eachMessage.item.sid],
                        }}
                        resizeMode={'cover'}
                      />
                    </TouchableHighlight>
                  ) : (
                    <View style={commonStyle.replyuploadpic}>
                      <View
                        style={{
                          height: 120,
                          width: 120,
                          borderRadius: 12,
                        }}></View>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              )}
            />
          </View>
          <View
            style={{
              paddingBottom: 20,
              backgroundColor: '#fff',
              paddingTop: 5,
              flexShrink: 1,
              position: 'absolute',
              bottom: Platform.OS === 'ios' ? 0 : -5,
            }}>
            {!!uploadFile && (
              <View style={{paddingHorizontal: 20}}>
                <View style={commonStyle.previewpic}>
                  <Image
                    style={{height: 60, width: 60, borderRadius: 8}}
                    source={
                      !!uploadFile?.uri
                        ? {
                            uri: uploadFile.uri,
                          }
                        : require('../assets/images/additional-pic-1.png')
                    }
                    resizeMode={'cover'}
                  />
                  {/* <TouchableOpacity style={commonStyle.closepreviewpic}>
                    <CloseIcon />
                  </TouchableOpacity> */}
                </View>
              </View>
            )}
            <View style={[commonStyle.messagehere]}>
              <TouchableOpacity
                // onPress={chooseFile}
                onPress={() => setVisibleModal('CustomGallery')}>
                <AddFiles />
              </TouchableOpacity>
              <TextInput
                style={[
                  commonStyle.messageInput,
                  isMessageInputFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsMessageInputFocus(true)}
                onChangeText={(text) => setMessageInput(text)}
                returnKeyType="done"
                autoCapitalize={'none'}
                placeholder="Your message here"
                placeholderTextColor={'#939DAA'}
                value={messageInput}
              />
              {messageInput && messageInput.trim().length > 0 ? (
                <TouchableOpacity
                  style={commonStyle.messagesendicon}
                  onPress={() => onSendMessage()}>
                  <SendIcon />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <ImageView
          images={imgViewerData}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </Container>

      {/* Message Inner Info modal start */}
      <Modal
        isVisible={visibleModal === 'MessageInnerInfoDialog'}
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
            {/* <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/walk-in-booking-img.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Create new booking</Text>
            </TouchableOpacity> */}
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
                deleteChatOrBlockUserHandlerConfirmation(
                  'Are you sure, you want to delete chat history?',
                  'chatClear',
                )
              }>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/trash-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Delete chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyle.searchBarText, {padding: 12}]}
              onPress={() =>
                deleteChatOrBlockUserHandlerConfirmation(
                  isBlockedUser
                    ? 'Are you sure, you want to unBlock?'
                    : 'Are you sure, you want to Block',
                  isBlockedUser ? 'UnBlock' : 'Block',
                )
              }>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/block-time-img.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>
                {isBlockedUser ? 'UnBlock' : 'Block'}
              </Text>
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
      {/* Message Inner Info modal End */}

      {/* Custom Gallery Modal */}
      <NativeModal
        animationType="fade"
        transparent={true}
        visible={visibleModal === 'CustomGallery'}
        onRequestClose={() => {
          setVisibleModal(null);
        }}
        style={commonStyle.centeredView}>
        <View style={commonStyle.fullmodalView}>
          <View
            style={[
              commonStyle.skipHeaderWrap,
              {marginTop: Platform.OS === 'ios' ? 32 : 0},
            ]}>
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => setVisibleModal(null)}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
            <Body style={[commonStyle.headerbacktitle, {marginLeft: -40}]}>
              <Text style={commonStyle.blackText16}>Upload your photo</Text>
            </Body>
          </View>
          <UploadPhotoVideoModal
            visible={visibleModal === 'CustomGallery'}
            multiSelect={false}
            //* Available Types: All, Videos, Photos
            assetType={'Photos'}
            submitEvent={fileSelectedEvent}
            cameraSubmitEvent={cameraSubmitEvent}
            fileSizeRequired={true}
          />
        </View>
      </NativeModal>
    </Fragment>
  );
};

export default InboxInner;
