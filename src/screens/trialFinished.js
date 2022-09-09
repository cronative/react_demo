import React, { Fragment, useState, useEffect, RefObject, useRef } from 'react';
import { ScrollView, Dimensions, TextInput, View, Text, StatusBar, Linking, TouchableOpacity, StyleSheet, TouchableHighlight, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, List, ListItem, Body, Left, Title } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import CheckBox from 'react-native-check-box'
import { CheckedOrange, EditIcon, RightAngle, UncheckedBox, CheckedBox } from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import { BookingFlowPaymentMethodModal } from '../components/modal';
import { SUBSCRIPTION_MANAGEMENT_URL_WEB } from '../api/constant';

const { width, height } = Dimensions.get('window')

const TrialFinished = () => {

  const navigation = useNavigation();
  const [isMobleServiceChecked, setIsMobleServiceChecked] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);

  /**
   * This method will call on Modal show hide.
  */
  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = p => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  /**
   * =======================.
  */

  /**
   * This method will call on Current Location Select.
  */
  const MobleServiceSelectHelper = () => {
    setIsMobleServiceChecked(!isMobleServiceChecked)
  }

  const onUpgradeClick = () => {
    Linking.canOpenURL(SUBSCRIPTION_MANAGEMENT_URL_WEB)
      .then((supported) => {
        if (!supported) {
          this.showToast('Something went wrong.');
        } else {
          Linking.openURL(SUBSCRIPTION_MANAGEMENT_URL_WEB);
        }
      })
      .catch((err) => this.showToast('Something went wrong.'));
  };


  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={commonStyle.horizontalPadd}>
            <View style={[commonStyle.mt15, commonStyle.mb3]}>
              <Text style={[commonStyle.subheading, commonStyle.mb1]}>Your free trial is finished</Text>
              <Text style={[commonStyle.grayText16, commonStyle.mb2]}>Your free trial version is over, please subscribe to one of our plans to continue</Text>
              <List style={commonStyle.payinCashinfowrap}>
                <ListItem thumbnail style={commonStyle.categoriseListItem}>
                  <View style={commonStyle.serviceListtouch}>
                    <Left style={{ marginRight: 8, alignSelf: 'flex-start' }}>
                      <Image source={require('../assets/images/payincashicon.png')} style={commonStyle.payincashimg} resizeMode={'contain'} />
                    </Left>
                    <Body style={commonStyle.categoriseListBody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                        Subscription is available only via the web-version of the Readyhubb.
                      </Text>
                    </Body>
                  </View>
                </ListItem>
              </List>
            </View>

            <View style={[commonStyle.setupCardBox, { paddingHorizontal: 0 }]}>
              <View style={commonStyle.bookingdateUserwrap}>
                <View style={commonStyle.bookingdatewrap}>
                  <Text style={commonStyle.subtextbold} numberOfLines={1}>Pro plan</Text>
                  {/* <Text style={commonStyle.heading24orange}>$30/month</Text> */}
                </View>
                <View style={commonStyle.planlistwrap}>
                  <View style={commonStyle.planlist}>
                    <CheckedOrange />
                    <Text style={[commonStyle.texttimeblack, { marginLeft: 10 }]}>Access to the advanced analytics</Text>
                  </View>
                  <View style={commonStyle.planlist}>
                    <CheckedOrange />
                    <Text style={[commonStyle.texttimeblack, { marginLeft: 10 }]}>No transaction fees</Text>
                  </View>
                  <View style={commonStyle.planlist}>
                    <CheckedOrange />
                    <Text style={[commonStyle.texttimeblack, { marginLeft: 10 }]}>Group sessions feature</Text>
                  </View>
                  <View style={commonStyle.planlist}>
                    <CheckedOrange />
                    <Text style={[commonStyle.texttimeblack, { marginLeft: 10 }]}>Waiting list feature</Text>
                  </View>
                </View>
                {/* <View style={commonStyle.bookingUserwrap}>
                  <View style={commonStyle.bookingUserAvaterwrap}>
                    <Image style={commonStyle.bookingUserAvaterImg} defaultSource={require('../assets/images/default.png')} source={require("../assets/images/users/user-1.png")} />
                  </View>
                  <Text style={commonStyle.grayText16} numberOfLines={1}>The Glam Room</Text>
                </View> */}
              </View>
              {/* <View style={commonStyle.confirmbookpaddwrap}>
                <List style={commonStyle.mb2}>
                  <ListItem style={[commonStyle.commListitem, commonStyle.mb05]}>
                    <Body>
                      <Text style={commonStyle.blackTextR}>Bridal Trial MakeUp</Text>
                    </Body>
                    <TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>$200</Text>
                    </TouchableHighlight>
                  </ListItem>
                  <View style={[commonStyle.searchBarText, commonStyle.mb05]}>
                    <Text style={[commonStyle.grayText16, { marginRight: 4 }]}>11am - 12pm</Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.grayText16, { marginLeft: 4 }]}>1 h</Text>
                  </View>
                </List>

                <List style={commonStyle.mb2}>
                  <ListItem style={[commonStyle.commListitem, commonStyle.mb05]}>
                    <Body>
                      <Text style={commonStyle.blackTextR}>Bridal Trial MakeUp</Text>
                    </Body>
                    <TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>$200</Text>
                    </TouchableHighlight>
                  </ListItem>
                  <View style={[commonStyle.searchBarText, commonStyle.mb05]}>
                    <Text style={[commonStyle.grayText16, { marginRight: 4 }]}>1pm - 3pm</Text>
                    <Text style={commonStyle.dotSmall}>.</Text>
                    <Text style={[commonStyle.grayText16, { marginLeft: 4 }]}>2 h</Text>
                  </View>
                </List>

              </View> */}

            </View>

            {/* <View style={[commonStyle.setupCardBox]}>
              <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>Cancellation policies</Text>
              <View style={commonStyle.termswrap}>
                <Text style={commonStyle.grayText16}>Cancel for free up to <Title style={commonStyle.blackTextR}>12 hours ahead</Title>, otherwise, you will lose your deposit. For <Title style={commonStyle.blackTextR}>not showing up</Title> you’ll lose the full deposit too.</Text>
              </View>
            </View> */}
            {/* <View style={[commonStyle.mb3, commonStyle.mt1]}>
              <View style={commonStyle.textalignwrap}>
                <CheckBox
                  style={{ paddingVertical: 0, marginRight: 10 }}
                  onClick={() => MobleServiceSelectHelper()}
                  isChecked={isMobleServiceChecked}
                  checkedCheckBoxColor={"#ff5f22"}
                  uncheckedCheckBoxColor={"#e6e7e8"}
                  rightText={''}
                  rightTextStyle={commonStyle.blackTextR}
                  checkedImage={<CheckedBox />}
                  unCheckedImage={<UncheckedBox />}
                />
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall, { lineHeight: 22 }]}>I agree with</Text>
                <TouchableOpacity onPress={() => console.log('Terms and Conditions')}>
                  <Text style={[commonStyle.textorange, commonStyle.mrsmall, { lineHeight: 22, marginRight: 20 }]}>Terms and Conditions</Text>
                </TouchableOpacity>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall, { lineHeight: 22, marginLeft: 35 }]}>and</Text>
                <TouchableOpacity onPress={() => console.log('Cancelation policies')}>
                  <Text style={[commonStyle.textorange, { lineHeight: 22 }]}>Cancelation policies</Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Subscribe"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              // onPress={() => navigation.navigate('BookingFlowSuccess')}
              onPress={onUpgradeClick}
            />
          </View>
        </View>
      </Container>


      {/* Booking Flow Payment Method modal start */}
      <Modal
        isVisible={visibleModal === 'BookingPaymentMethodDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
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
        style={commonStyle.bottomModal}
      >
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]} onPress={() => setVisibleModal({ visibleModal: null })}>
            <Text style={{ backgroundColor: '#ECEDEE', width: 75, height: 4, borderRadius: 2 }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}
          >
            <BookingFlowPaymentMethodModal />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Add Credit/Debit card"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({ visibleModal: null }) & navigation.navigate('BookingFlowAddCard')}
            />
          </View>
        </View>
      </Modal>
      {/*  Booking Flow Payment Method modal end */}
    </Fragment>
  );
};


export default TrialFinished;