import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, Footer, List, ListItem, Body, Left} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import commonStyle from '../assets/css/mainStyle';
import {Post} from '../api/apiAgent';
import global from '../components/commonservices/toast';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import EventEmitter from 'react-native-eventemitter';

const BookingsPreviousInnerReport = (props) => {
  // Declare the variables
  const navigation = useNavigation();
  const {
    bookId,
    reservationId,
    bookingProImage,
    bookingProName,
    bookingProAddress,
    bookingProService,
    reportType,
    bookingCustomerId,
    bookingData,
    sessionUserList,
  } = props.route.params;
  const [isLeaveCommentFocus, setIsLeaveCommentFocus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [leaveComment, setLeaveComment] = useState('');

  useEffect(() => {
    console.log('Booking Data Received: ', JSON.stringify(bookingData));
  }, [bookingData]);

  // This method is to submit the report
  const reportSubmit = () => {
    setLoader(true);
    let postdata, url;
    if (reportType == 'client') {
      postdata = {
        reservationId: reservationId,
        description: leaveComment,
      };
      url = 'user/report-problem';
    } else {
      postdata = {
        // 'customerId' : bookingCustomerId,
        description: leaveComment,
      };
      url = 'pro/report-problem';
    }
    Post(url, postdata)
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          setLeaveComment('');
          global.showToast(result.message, 'success');
          if (reportType == 'client') {
            setTimeout(() => {
              navigation.navigate('BookingsPreviousInner', {
                bookingId: bookId,
                fromNotificationList: false,
              });
            }, 1000);
          } else {
            setTimeout(() => {
              navigation.navigate('bookingsProInner', {
                rowId: bookId,
                fromNotificationList: false,
              });
            }, 1000);
          }
          setTimeout(() => {
            EventEmitter.emit('refreshPage');
          }, 1200);
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.leaveReviewwrap, {paddingBottom: 0}]}>
            <View>
              <View style={commonStyle.clientProfilebox}>
                {reportType === 'professional' &&
                bookingData?.Service?.type == 2 ? (
                  <List>
                    <ListItem
                      thumbnail
                      style={{
                        ...commonStyle.switchAccountView,
                        justifyContent: 'flex-start',
                      }}>
                      {sessionUserList.map((user, index) => (
                        <Left
                          key={index}
                          style={{
                            ...commonStyle.favoritesUserAvaterwrap,
                            marginLeft: index * -8,
                            zIndex: index,
                          }}>
                          <Image
                            style={commonStyle.favoritesUserAvaterImg}
                            //Start Change: Snehasish Das, Issue #1734
                            defaultSource={require('../assets/images/default-user.png')}
                            source={
                              // user?.profileImage
                              !!user?.profileImage
                                ? {
                                    uri: user?.profileImage,
                                  }
                                : require('../assets/images/default-user.png')
                              // : defaultImage
                            }
                            //End Change: Snehasish Das, Issue #1734
                          />
                        </Left>
                      ))}
                    </ListItem>
                  </List>
                ) : bookingProImage ? (
                  <Image
                    style={commonStyle.clientProfileimg}
                    source={{uri: bookingProImage}}
                  />
                ) : (
                  <Image
                    style={commonStyle.clientProfileimg}
                    source={require('../assets/images/users/user-1.png')}
                  />
                )}
              </View>
            </View>
            <View style={[commonStyle.mt2, commonStyle.mb3]}>
              {reportType !== 'professional' &&
              bookingData?.Service?.type !== 2 ? (
                <>
                  <Text
                    style={[
                      commonStyle.modalforgotheading,
                      commonStyle.textCenter,
                      commonStyle.mb1,
                    ]}>
                    {bookingProName}
                  </Text>
                  <Text
                    style={[
                      commonStyle.grayText14,
                      commonStyle.textCenter,
                      commonStyle.mb15,
                    ]}>
                    {bookingProAddress}
                  </Text>
                </>
              ) : null}
              <TouchableHighlight
                style={[commonStyle.outlintextbtn, {alignSelf: 'center'}]}>
                <Text style={commonStyle.categorytagsText}>
                  {reportType == 'professional'
                    ? bookingData?.Service?.name
                    : bookingProService}
                  {/* {bookingProService} */}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={commonStyle.horizontalPadd}>
              <View style={[commonStyle.mb2]}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Describe a problem
                </Text>
                <View
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isLeaveCommentFocus && commonStyle.focusinput,
                  ]}>
                  <TextInput
                    style={[
                      commonStyle.newtextareaInput,
                      {height: 110, textAlignVertical: 'top'},
                    ]}
                    defaultValue={leaveComment}
                    onFocus={() => setIsLeaveCommentFocus(true)}
                    onChangeText={(text) => setLeaveComment(text)}
                    returnKeyType="done"
                    keyboardType="default"
                    autoCapitalize={'none'}
                    value={leaveComment}
                    multiline={true}
                    numberOfLines={6}
                    maxLength={500}
                    blurOnSubmit={true}
                    onSubmitEditing={(e) => {
                      console.log('On Submit Editing');
                      e.target.blur();
                    }}
                  />
                  <Text style={commonStyle.textlength}>
                    {(leaveComment && leaveComment.length) || 0}
                    /500
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {leaveComment.trim().length > 0 ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Send"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={reportSubmit}
              />
            </View>
          </View>
        ) : null}
      </Container>
    </Fragment>
  );
};

export default BookingsPreviousInnerReport;
