import moment from 'moment';
import {Body, Container, Left, List, ListItem} from 'native-base';
import React, {useRef, useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  RefreshControl,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import {Button} from 'react-native-elements/dist/buttons/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import {CloseIcon, EditIcon, RightAngle} from '../../components/icons';
import {timeConversion} from '../../utility/commonService';
import ProWalkingCTA from './proWalkingCTA';
import ProWalkinStatus from './proWalkinStatus';
import Modal from 'react-native-modal';
import {intervalInMinutes} from '../../utility/booking';
import BookingNotesModal from '../../components/modal/BookingNotesModal';
import {useFocusEffect} from '@react-navigation/native';

const ProWalkingDetailsComponent = ({
  loading,
  bookingData,
  fetchData,
  markAsComplete,
  cancelBooking,
  rescheduleBooking,
  reBook,
  visibleModal,
  setVisibleModal,
  notesData,
  noteEditId,
  noteEditText,
  setNoteEditId,
  setNoteEditText,
  deleteNoteData,
  constructNotesData,
  exportInvoice,
  exportingText,
}) => {
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const getTaxAmount = () => {
    if (!!bookingData) {
      return (!!bookingData?.tax ? +bookingData?.tax : 0).toFixed(2);
    } else {
      return '0.00';
    }
  };

  return !loading ? (
    <>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl onRefresh={fetchData} />}>
          <View style={[commonStyle.bookingInnerbox, commonStyle.mt05]}>
            {bookingData?.blockTimeFrom && (
              <Text style={[commonStyle.subheading, commonStyle.mb1]}>
                {moment(bookingData?.blockTimeFrom).format(
                  'dddd, DD MMM YYYY [at] hh:mm a',
                )}
              </Text>
            )}
            <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
              <ProWalkinStatus bookingData={bookingData} />
            </View>
            <View>
              <List style={commonStyle.bookingInnerUser}>
                <ListItem
                  thumbnail
                  style={{
                    ...commonStyle.switchAccountView,
                    justifyContent: 'flex-start',
                  }}>
                  <Left
                    style={[
                      commonStyle.favoritesUserAvaterwrap,
                      {
                        backgroundColor: '#FFE8E2',
                      },
                    ]}>
                    <Image
                      style={[
                        commonStyle.favoritesUserAvaterImg,
                        !bookingData?.walkInClient?.profileImage && {
                          height: 20,
                          width: 20,
                        },
                      ]}
                      defaultSource={require('../../assets/images/default-user.png')}
                      source={
                        !!bookingData?.walkInClient?.profileImage
                          ? {
                              uri: bookingData?.walkInClient?.profileImage,
                            }
                          : require('../../assets/images/default-user.png')
                      }
                    />
                  </Left>
                  <Body style={commonStyle.switchAccountbody}>
                    <View style={[commonStyle.searchBarText, commonStyle.mb03]}>
                      <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                        {bookingData?.walkInClient?.name}
                        <Text style={commonStyle.grayText16}>
                          {' · Walk-in'}
                        </Text>
                      </Text>
                    </View>
                    <Text
                      style={commonStyle.categorytagsText}
                      numberOfLines={1}>
                      {bookingData?.walkInClient?.countryCode}{' '}
                      {bookingData?.walkInClient?.phone}
                    </Text>
                  </Body>
                  <RightAngle />
                </ListItem>
              </List>
            </View>
            <View style={[commonStyle.socialShareRow, commonStyle.mt3]}>
              {bookingData?.status == 1 && (
                <>
                  <ProWalkingCTA
                    onPress={() => {
                      setVisibleModal('BookingCancelDialog');
                    }}
                    imageUrl={require('../../assets/images/close.png')}
                    buttonText={'Cancel'}
                  />
                  <ProWalkingCTA
                    onPress={rescheduleBooking}
                    imageUrl={require('../../assets/images/calendar.png')}
                    buttonText={'Reschedule'}
                  />
                </>
              )}
              {(bookingData?.status == 3 || bookingData?.status == 4) && (
                <ProWalkingCTA
                  alternateView={true}
                  onPress={reBook}
                  imageUrl={require('../../assets/images/calendar.png')}
                  buttonText={'Re-Book'}
                />
              )}
            </View>
          </View>

          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox]}>
              <List style={[commonStyle.setupserviceList]}>
                <ListItem thumbnail style={commonStyle.categoriseListItem}>
                  <View style={commonStyle.serviceListtouch}>
                    <Left
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: 7,
                        marginRight: 15,
                      }}>
                      <Text
                        style={[
                          commonStyle.dotLarge,
                          {
                            backgroundColor: '#828FE6',
                            marginLeft: 0,
                            marginRight: 0,
                          },
                        ]}>
                        .
                      </Text>
                    </Left>
                    <Body style={commonStyle.categoriseListBody}>
                      <Text
                        style={[commonStyle.blackTextR, commonStyle.mb05]}
                        numberOfLines={1}>
                        {bookingData?.Service?.name}
                      </Text>
                      <View
                        style={[commonStyle.searchBarText, commonStyle.mb05]}>
                        {!!bookingData && (
                          <Text
                            style={[commonStyle.grayText16, {marginRight: 4}]}>
                            {moment(bookingData?.blockTimeFrom).format(
                              'hh:mm a',
                            )}
                            {' - '}
                            {moment(bookingData?.blockTimeFrom)
                              .add(
                                intervalInMinutes(
                                  bookingData?.Service,
                                  bookingData?.Service,
                                  false,
                                ),
                                'minutes',
                              )
                              .format('hh:mm a')}{' '}
                            {'·'}{' '}
                            {timeConversion(bookingData?.Service?.duration)}
                          </Text>
                        )}
                      </View>
                    </Body>
                    <View style={{alignSelf: 'flex-start'}}>
                      <TouchableHighlight>
                        <Text style={commonStyle.blackTextR}>
                          ${bookingData?.amount}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </ListItem>
              </List>

              {!!parseFloat(getTaxAmount()) ? (
                <>
                  <View style={[commonStyle.bookingdatewrap, commonStyle.mb2]}>
                    <Text style={commonStyle.blackTextR} numberOfLines={1}>
                      Tax
                    </Text>
                    <Text style={[commonStyle.blackTextR]}>
                      ${getTaxAmount()}
                    </Text>
                  </View>
                  <View style={commonStyle.dividerlinefull} />
                </>
              ) : (
                <></>
              )}

              <View
                style={[
                  commonStyle.bookingdatewrap,
                  commonStyle.mb05,
                  commonStyle.mt1,
                ]}>
                <Text style={commonStyle.blackTextR} numberOfLines={1}>
                  Total
                </Text>
                <Text
                  style={[commonStyle.blackText16, commonStyle.colorOrange]}>
                  ${bookingData?.totalAmount}
                </Text>
              </View>

              <List style={[commonStyle.contactwaylist, {marginTop: 20}]}>
                <ListItem
                  thumbnail
                  style={commonStyle.switchAccountView}
                  onPress={exportInvoice}>
                  <Left>
                    <Image
                      style={[
                        commonStyle.paymentCardImg,
                        {marginRight: 0, width: 30},
                      ]}
                      source={require('../../assets/images/file-text.png')}
                    />
                  </Left>
                  <Body style={commonStyle.switchAccountbody}>
                    <Text style={commonStyle.blackTextR}>{exportingText}</Text>
                  </Body>
                  <TouchableOpacity style={{marginLeft: 10}}>
                    <RightAngle />
                  </TouchableOpacity>
                </ListItem>
              </List>
            </View>
          </View>

          <View style={[commonStyle.setupCardBox]}>
            <Text style={[commonStyle.subtextblack]}>Notes</Text>
            {!!notesData && notesData.length > 0 ? (
              notesData.map((noteItem, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#dcdcdc',
                      paddingVertical: 18,
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '78%'}}>
                      <Text style={commonStyle.blackTextR}>
                        {noteItem.text || noteItem}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={[commonStyle.moreInfoCircle, {marginRight: 5}]}
                        onPress={() => {
                          setNoteEditId(index);
                          setNoteEditText(noteItem);
                          setVisibleModal('AddNoteModal');
                        }}>
                        <EditIcon />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={commonStyle.moreInfoCircle}
                        deleteNoteData
                        onPress={() => deleteNoteData(index, 'beforeConfirm')}>
                        <CloseIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={[commonStyle.grayText14]}>No Notes to Show</Text>
            )}
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {alignSelf: 'flex-start', marginTop: 10},
              ]}
              onPress={() => {
                setNoteEditId(null);
                setNoteEditText(null);
                setVisibleModal('AddNoteModal');
              }}>
              <TouchableHighlight>
                <Text
                  style={{
                    fontSize: 36,
                    fontFamily: 'SofiaPro-ExtraLight',
                    lineHeight: 36,
                    marginRight: 15,
                  }}>
                  +
                </Text>
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Add a note</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {bookingData?.status == 2 && (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Mark as Completed"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => {
                  setVisibleModal('BookingCompleteDialog');
                }}
              />
            </View>
          </View>
        )}
      </Container>
      {/* Booking cancellation modal start */}
      <Modal
        isVisible={
          visibleModal === 'BookingCancelDialog' ||
          visibleModal === 'BookingCompleteDialog'
        }
        onSwipeComplete={() => setVisibleModal(null)}
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
            onPress={() => setVisibleModal(null)}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <View style={commonStyle.modalContent}>
            <View
              style={[
                commonStyle.dialogheadingbg,
                {borderBottomWidth: 0, paddingBottom: 0},
              ]}>
              <Text
                style={[
                  commonStyle.modalforgotheading,
                  commonStyle.textCenter,
                ]}>
                Are you sure, you want to{' '}
                {visibleModal === 'BookingCancelDialog' ? 'cancel' : 'complete'}{' '}
                the booking?
              </Text>
            </View>
          </View>
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title={
                    visibleModal === 'BookingCancelDialog'
                      ? 'Cancel'
                      : 'Complete'
                  }
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => {
                    visibleModal === 'BookingCancelDialog'
                      ? cancelBooking()
                      : markAsComplete();
                  }}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title={
                    visibleModal === 'BookingCancelDialog'
                      ? 'Keep booking'
                      : "Don't Complete"
                  }
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={[
                    commonStyle.buttonStylehalf,
                    commonStyle.lightorang,
                  ]}
                  titleStyle={[
                    commonStyle.buttontitleStyle,
                    commonStyle.colorOrange,
                  ]}
                  onPress={() => setVisibleModal(null)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Notes Modal */}
      <Modal
        isVisible={visibleModal === 'AddNoteModal'}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        onSwipeComplete={() => {
          setVisibleModal(null);
          setNoteEditId(null);
          setNoteEditText(null);
        }}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        swipeThreshold={50}
        propagateSwipe={true}
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View style={[commonStyle.scrollableModal, {maxHeight: '100%'}]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal(null)}>
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
            <BookingNotesModal
              setNoteEditText={setNoteEditText}
              noteEditText={noteEditText}
              noteEditId={noteEditId}
              setKeyboardStatus={setKeyboardStatus}
            />
          </ScrollView>
          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Save a note"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal(null);
                constructNotesData();
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Delete note modal start */}
      <Modal
        isVisible={visibleModal === 'DeleteNoteModal'}
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
                <Text
                  style={[
                    commonStyle.modalforgotheading,
                    commonStyle.textCenter,
                  ]}>
                  Are you sure you want to delete this note?
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Delete"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => deleteNoteData()}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Cancel"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={[
                    commonStyle.buttonStylehalf,
                    commonStyle.lightorang,
                  ]}
                  titleStyle={[
                    commonStyle.buttontitleStyle,
                    commonStyle.colorOrange,
                  ]}
                  onPress={() => setVisibleModal({visibleModal: null})}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete note modal end */}
    </>
  ) : (
    <ActivityLoaderSolid />
  );
};

export default ProWalkingDetailsComponent;
