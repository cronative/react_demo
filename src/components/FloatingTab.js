import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import Tooltip from 'react-native-walkthrough-tooltip';
import {mainAPI} from '../api/apiAgent';
import commonStyle from '../assets/css/mainStyle';
import global from '../components/commonservices/toast';
import {AddIcon, CancelOrange} from '../components/icons';
import {BlockTimeModal} from '../components/modal';
import {fetchGracePeriodData} from '../utility/fetchGracePeriodData';

const {width, height} = Dimensions.get('window');
const SIZE = 20;

const FloatingTab = (props) => {
  const navigation = useNavigation();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [bookingToggle, setBookingToggle] = useState(true);

  /**
   * This method will call on Map show hide.
   */
  const bookingToggleHandle = async () => {
    const response = await fetchGracePeriodData();
    console.log('statusss: ', response);
    if (response.subscriptionStatus !== 1) {
      if (bookingToggle) {
        setBookingToggle(false);
        setTooltipVisible(true);
      } else {
        setBookingToggle(true);
        setTooltipVisible(false);
      }
    }
  };
  /**
   * =======================.
   */

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [blockFromTime, setBlockFromTime] = useState(null);
  const [blockToTime, setBlockToTime] = useState(null);

  const submitBlockTime = () => {
    if (!!blockFromTime && !!blockToTime) {
      mainAPI({
        methodType: 'post',
        url: '/pro/block-time',
        data: {
          blockFrom: blockFromTime,
          blockTo: blockToTime,
        },
      })
        .then(() => {
          setVisibleModal(false);
          global.showToast('Blocking time added successfully', 'success');
          setBlockFromTime(null);
          setBlockToTime(null);
        })
        .catch(() => {
          setVisibleModal(false);
          global.showToast('Blocking time has not been saved', 'error');
          setBlockFromTime(null);
          setBlockToTime(null);
        });
    } else {
      global.showAlert('Please fill the required fields');
    }
  };

  const blockTimetoggle = () => {
    setVisibleModal(!visibleModal);
  };
  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  /**
   * =======================.
   */

  //   const goNewWalkInBooking = () => {
  //     props.navigation.navigate('NewWalkInBooking');
  //     setTooltipVisible(false);
  //   };

  const redirectPageByType = (type) => {
    bookingToggleHandle();
    if (type === 1) {
      navigation.navigate('NewWalkInBooking', {
        preSelected: false,
        selectedUser: null,
      });
    } else if (type === 2) {
      console.log('this is called');
      setTimeout(() => {
        blockTimetoggle();
      }, 1000);
      // blockTimetoggle();
    } else if (type === 3) {
      navigation.navigate('InspirationAddOrEdit');
    }
  };
  // console.log('blockFromTime, blockToTime', blockFromTime, blockToTime);
  return (
    <Pressable
      hitSlop={10}
      onPress={() => {
        bookingToggleHandle;
      }}>
      <Tooltip
        animated={true}
        arrowSize={{width: 16, height: 8}}
        backgroundColor="rgba(0,0,0,0.5)"
        isVisible={tooltipVisible}
        contentStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
          paddingHorizontal: 0,
          width: '100%',
        }}
        content={
          <>
            <View style={commonStyle.floatbottomtooltip}>
              <TouchableOpacity
                style={[
                  commonStyle.searchBarText,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: '#dcdcdc',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  },
                ]}
                onPress={() => redirectPageByType(1)}>
                <TouchableHighlight
                  style={[commonStyle.haederback, {paddingLeft: 0}]}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../assets/images/walk-in-booking-img.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>New walk-in booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  commonStyle.searchBarText,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: '#dcdcdc',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  },
                ]}
                onPress={() => redirectPageByType(2)}>
                <TouchableHighlight
                  style={[commonStyle.haederback, {paddingLeft: 0}]}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../assets/images/block-time-img.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Block time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  commonStyle.searchBarText,
                  {paddingHorizontal: 20, paddingVertical: 10},
                ]}
                onPress={() => redirectPageByType(3)}>
                <TouchableHighlight
                  style={[commonStyle.haederback, {paddingLeft: 0}]}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../assets/images/inspiration-img.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Inspiration post</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        placement="top"
        onClose={bookingToggleHandle}>
        <TouchableHighlight
          underlayColor="rgba(0,0,0,0)"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0)"',
            width: 70,
            height: 65,
            paddingTop: Platform.OS === 'ios' ? 17 : 20,
          }}
          onPress={bookingToggleHandle}>
          {bookingToggle ? (
            <View
              style={{
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AddIcon />
              <Text style={commonStyle.floattextadd}>Add</Text>
            </View>
          ) : (
            <View
              style={{
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CancelOrange />
              <Text style={commonStyle.floattextcancel}>Cancel</Text>
            </View>
          )}
        </TouchableHighlight>
      </Tooltip>
      {/* Block modal start */}
      <Modal
        isVisible={visibleModal}
        swipeDirection="down"
        onSwipeComplete={blockTimetoggle}
        swipeThreshold={50}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
            onPress={blockTimetoggle}>
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
            <BlockTimeModal
              isVisible={visibleModal}
              setBlockFromTime={setBlockFromTime}
              setBlockToTime={setBlockToTime}
            />
          </ScrollView>
          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Save"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={submitBlockTime}
            />
          </View>
        </View>
      </Modal>
      {/* Block time modal End */}
    </Pressable>
  );
};

export default FloatingTab;
