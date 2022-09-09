import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  Footer,
  List,
  ListItem,
  Body,
  Left,
  Title,
} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import {CloseIcon, DownArrow, ClockIcon} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {
  BookingFlowSignUpModal,
  BookingFlowAddServiceModal,
  BookingFlowDateTimeModal,
} from '../components/modal';

const {width, height} = Dimensions.get('window');

const BookingFlow = () => {
  const navigation = useNavigation();
  const [isLeaveCommentFocus, setIsLeaveCommentFocus] = useState(false);
  const [leaveComment, setLeaveComment] = useState('');

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);

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

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.horizontalPadd}>
            <View style={commonStyle.mtb10}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                Choose a service
              </Text>
            </View>
            <View style={[commonStyle.setupCardBox, {paddingHorizontal: 0}]}>
              <View
                style={[commonStyle.setupserviceList, {paddingHorizontal: 20}]}>
                <List style={commonStyle.mb1}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Body style={commonStyle.categoriseListBody}>
                        <Text
                          style={[commonStyle.blackTextR, commonStyle.mb1]}
                          numberOfLines={1}>
                          Bridal Trial MakeUp
                        </Text>
                        <View style={commonStyle.searchBarText}>
                          <Text
                            style={[commonStyle.grayText16, {marginRight: 4}]}>
                            1 h
                          </Text>
                          <Text style={commonStyle.dotSmall}>.</Text>
                          <Text
                            style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                            $200
                          </Text>
                        </View>
                      </Body>
                      <View style={{alignSelf: 'flex-start'}}>
                        <TouchableOpacity style={commonStyle.moreInfoCircle}>
                          <CloseIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ListItem>
                  <View style={[commonStyle.mt1, commonStyle.mb2]}>
                    <Text style={commonStyle.grayText14}>
                      Just had great experience with the italian gentleman
                      hairdresser. I have extra long hair and it’s uneasy to
                      deal with it.{' '}
                      <Title style={commonStyle.textorange14}>Read more</Title>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[commonStyle.watingtimewrap, commonStyle.lightBlue]}
                    activeOpacity={1}>
                    <View style={commonStyle.searchBarText}>
                      <TouchableHighlight style={commonStyle.haederback}>
                        <ClockIcon />
                      </TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>Waiting time</Text>
                    </View>
                    <TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>1 h</Text>
                    </TouchableHighlight>
                  </TouchableOpacity>
                </List>
                <List style={commonStyle.mb1}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Body style={commonStyle.categoriseListBody}>
                        <Text
                          style={[commonStyle.blackTextR, commonStyle.mb1]}
                          numberOfLines={1}>
                          Gorgeous Unlimited Single Lash
                        </Text>
                        <View style={commonStyle.searchBarText}>
                          <Text
                            style={[commonStyle.grayText16, {marginRight: 4}]}>
                            2 h
                          </Text>
                          <Text style={commonStyle.dotSmall}>.</Text>
                          <Text
                            style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                            $200
                          </Text>
                        </View>
                      </Body>
                      <View style={{alignSelf: 'flex-start'}}>
                        <TouchableOpacity style={commonStyle.moreInfoCircle}>
                          <CloseIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ListItem>
                </List>
              </View>
              <View>
                <TouchableOpacity
                  style={[commonStyle.searchBarText, {alignSelf: 'center'}]}
                  onPress={() => {
                    setVisibleModal('BookingFlowAddServiceDialog');
                  }}>
                  <TouchableHighlight>
                    <Text
                      style={[commonStyle.unfollowbtnText, {marginRight: 5}]}>
                      +
                    </Text>
                  </TouchableHighlight>
                  <Text
                    style={[commonStyle.text14bold, commonStyle.colorOrange]}>
                    Add a service
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[commonStyle.mb3, commonStyle.mt1]}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Select date and time
              </Text>
              <TouchableOpacity
                style={commonStyle.dropdownselectmodal}
                onPress={() => {
                  setVisibleModal('BookingFlowDateTimeDialog');
                }}>
                <View style={[commonStyle.searchBarText]}>
                  <Text style={commonStyle.grayText16}>Date and Time</Text>
                  {/* <Text style={[commonStyle.blackTextR]}>25 Dec 2020</Text> */}
                </View>
                <DownArrow />
              </TouchableOpacity>
            </View>
            <View style={[commonStyle.mb2]}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Leave a comment (it’s optional)
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  commonStyle.textareainput,
                  isLeaveCommentFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsLeaveCommentFocus(true)}
                onChangeText={(text) => setLeaveComment(text)}
                returnKeyType="done"
                autoCapitalize={'none'}
                multiline={true}
                numberOfLines={7}
                maxLength={500}
                blurOnSubmit={true}
                onSubmitEditing={(e) => {
                  console.log('On Submit Editing');
                  e.target.blur();
                }}
              />
              <Text style={commonStyle.textlength}>0/500</Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Proceed to confirmation"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal('BookingFlowSignUpDialog');
              }}
            />
          </View>
        </View>
      </Container>

      {/* Booking Flow Sign Up modal start */}
      <Modal
        isVisible={visibleModal === 'BookingFlowSignUpDialog'}
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
            <BookingFlowSignUpModal />
          </ScrollView>

          {/* Please check devevelopment phase */}
          <View style={[commonStyle.termswrap, commonStyle.mb3]}>
            <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BookingFlowConfirmBooking') &
                setVisibleModal({visibleModal: null})
              }>
              <Text style={commonStyle.blackText16}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Booking Flow Sign Up modal End */}

      {/* Booking Flow Add Service modal start */}
      <Modal
        isVisible={visibleModal === 'BookingFlowAddServiceDialog'}
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
            <BookingFlowAddServiceModal />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Save changes"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View>
        </View>
      </Modal>
      {/* Booking Flow Add Service modal End */}

      {/* Booking Flow Date & Time modal start */}
      <Modal
        isVisible={visibleModal === 'BookingFlowDateTimeDialog'}
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
            <BookingFlowDateTimeModal />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
            {/* <Button 
                      title="Join the waitlist"
                      containerStyle={commonStyle.buttoncontainerothersStyle}
                      buttonStyle={commonStyle.commonbuttonStyle}
                      titleStyle={commonStyle.buttontitleStyle}
                      onPress={() => setVisibleModal ({ visibleModal: null })}
                      /> */}
          </View>
        </View>
      </Modal>
      {/* Booking Flow Date & Time modal modal end */}
    </Fragment>
  );
};

export default BookingFlow;
