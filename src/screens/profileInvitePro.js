import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import {Container} from 'native-base';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-community/clipboard';
import {
  InviteIcon,
  CopyIcon,
  GiftIcon,
  MailBoxBlack,
  InfoIcon,
} from '../components/icons';
import {HowDoseworkModal} from '../components/modal';
import commonStyle from '../assets/css/mainStyle';
import global from '../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {FRONTEND_BASE_PATH} from '../api/constant';
import Share from 'react-native-share';
import {Get} from '../api/apiAgent';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';

const ProfileInvitePro = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const referralCodeData = useSelector(
    (state) => state?.profileReducer?.referralCode?.referralId,
  );
  const refferURL = `${FRONTEND_BASE_PATH}?ref=${referralCodeData}&isPro=1`;
  const [copiedText, setCopiedText] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [loading, setLoading] = useState(false);

  // This function is to get dashboard details
  const getDashboardDetails = () => {
    setLoading(true);
    Get('/pro/referralBenefitDetails')
      .then((result) => {
        setLoading(false);
        if (result.status === 200) {
          setDashboardData(result.data);
        }
      })
      .catch((error) => {
        setLoading(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  useEffect(() => {
    getDashboardDetails();
  }, []);

  const copyToClipboard = () => {
    if (referralCodeData !== null && referralCodeData !== '') {
      Clipboard.setString(refferURL);
      global.showToast('Copied to clipboard', 'success');
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
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

  // This function will call once click on share button
  const onShare = async () => {
    if (referralCodeData !== null && referralCodeData !== '') {
      let options = {
        title: 'Share with',
        message:
          'Join me and the community of professionals using Readyhubb to manage and grow their businesses! List your business on Readyhubb and get discovered by new clients. Sign up with my link below: ',
        subject: 'ReadyHubb Share & Earn',
        url: refferURL,
      };
      await Share.open(options)
        .then((res) => {
          console.log('Success : ', res);
        })
        .catch((err) => {
          err && console.log('Error : ', err);
        });
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, {paddingTop: 0}]}>
        {loading ? <ActivityLoaderSolid /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ecedff'}}>
          <View style={[commonStyle.profileInviteWrap, commonStyle.pt3]}>
            <View style={commonStyle.profileProHeader}>
              <View style={commonStyle.profileProcenter}>
                <View
                  style={[
                    commonStyle.accountlistavaterbg,
                    {backgroundColor: '#FFEAF3', elevation: 0.5},
                  ]}>
                  <Image
                    style={commonStyle.avatericon}
                    source={require('../assets/images/gift-box.png')}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={[
                    commonStyle.modalforgotheading,
                    commonStyle.textCenter,
                    commonStyle.mb6,
                  ]}>
                  Get $15 when you invite other professionals to Readyhubb
                </Text>
                <Text style={[commonStyle.text14bold, commonStyle.textCenter]}>
                  Your referral code
                </Text>
                <View
                  style={[
                    commonStyle.copytextwrap,
                    {
                      borderColor: '#fff',
                      backgroundColor: '#fff',
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text style={[commonStyle.blackText16]} numberOfLines={1}>
                    {referralCodeData ? referralCodeData : null}
                  </Text>
                  <TouchableOpacity
                    style={{position: 'absolute', right: 15, width: 25}}
                    onPress={copyToClipboard}>
                    <Text>
                      <CopyIcon />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={commonStyle.geolocationCardWrap}>
              <View style={[commonStyle.geolocationCard, {paddingTop: 10}]}>
                <TouchableOpacity style={[commonStyle.generalFaqList]}>
                  <View style={commonStyle.searchBarText}>
                    <View style={[commonStyle.paymentCardSelect]}>
                      <GiftIcon />
                      <Text style={[commonStyle.blackTextR, {marginLeft: 10}]}>
                        Earned
                      </Text>
                    </View>
                  </View>
                  {dashboardData !== null &&
                  dashboardData?.eraned.length > 0 ? (
                    <Text style={commonStyle.grayText16}>
                      ${dashboardData.eraned[0].total}
                    </Text>
                  ) : (
                    <Text style={commonStyle.grayText16}>$0.00</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={[commonStyle.generalFaqList]}>
                  <View style={commonStyle.searchBarText}>
                    <View style={[commonStyle.paymentCardSelect]}>
                      <MailBoxBlack />
                      <Text style={[commonStyle.blackTextR, {marginLeft: 10}]}>
                        Accepted referrals
                      </Text>
                    </View>
                  </View>
                  {dashboardData !== null &&
                  dashboardData?.acceptedReferrals !== null ? (
                    <Text style={commonStyle.grayText16}>
                      {dashboardData?.acceptedReferrals}
                    </Text>
                  ) : (
                    <Text style={commonStyle.grayText16}>0</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[commonStyle.generalFaqList, {borderBottomWidth: 0}]}>
                  <View style={commonStyle.searchBarText}>
                    <View style={[commonStyle.paymentCardSelect]}>
                      <InviteIcon />
                      <Text style={[commonStyle.blackTextR, {marginLeft: 10}]}>
                        Pending Rewards
                      </Text>
                    </View>
                  </View>
                  {dashboardData !== null &&
                  dashboardData?.pendingRewards.length > 0 ? (
                    <Text style={commonStyle.grayText16}>
                      ${dashboardData.pendingRewards[0].total}
                    </Text>
                  ) : (
                    <Text style={commonStyle.grayText16}>$0.00</Text>
                  )}
                </TouchableOpacity>

                <View style={commonStyle.mt1}>
                  <Button
                    title="Share my link"
                    containerStyle={[commonStyle.buttoncontainerothersStyle]}
                    buttonStyle={commonStyle.changePassModalbutton}
                    titleStyle={commonStyle.buttontitleStyle}
                    onPress={onShare}
                  />
                </View>
                <TouchableOpacity
                  style={commonStyle.howdoseinfo}
                  onPress={() => {
                    setVisibleModal('ChooseAreaDialog');
                  }}>
                  <Text style={[commonStyle.blackTextR, {marginRight: 12}]}>
                    How does it work?
                  </Text>
                  <InfoIcon />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
      {/* Forgot Password modal start */}
      <Modal
        isVisible={visibleModal === 'ChooseAreaDialog'}
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
          <View style={[commonStyle.termswrap, commonStyle.mt2]}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <HowDoseworkModal />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Got it"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View>
        </View>
      </Modal>
      {/* Forgot Password modal end */}
    </Fragment>
  );
};

export default ProfileInvitePro;
