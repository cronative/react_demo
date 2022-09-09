import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import {Post} from '../api/apiAgent';
import {useNavigation} from '@react-navigation/native';
import {Container, Footer} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, SearchBar} from 'react-native-elements';
import {RightAngle, SearchIcon} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {useSelector, useDispatch} from 'react-redux';
import {faqListingRequest} from '../store/actions';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import useDebounce from '../components/use-debounce';
import Modal from 'react-native-modal';
import AskAQuestionModal from '../components/modal/AskAQuestionModal';
import Intercom from '@intercom/intercom-react-native';

const ProfileFaqHelp = () => {
  const navigation = useNavigation();
  const [searchFaq, setSearchFaq] = useState('');
  const dispatch = useDispatch();
  const faqDetails = useSelector((state) => state.faqDetails);
  const loginUserType = useSelector((state) => state.auth.userType);

  const [readyHubbFaq, setReadyHubbFaq] = useState([]);
  const [bookingFaq, setBookingFaq] = useState([]);
  const [isShowNoRecord, seIsShowNoRecord] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const scrollViewRef = useRef(0);
  const [scrollOffset, setScrollOffset] = useState();
  let debouncedSearchTerm = useDebounce(searchFaq, 5500);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onSearch = () => {
    dispatch(faqListingRequest(searchFaq));
  };

  useEffect(() => {
    if (!searchFaq) {
      dispatch(faqListingRequest(''));
    } else {
      // let debouncedSearchTerm = useDebounce(searchFaq, 5500);
      // dispatch(faqListingRequest(debouncedSearchTerm));
    }
  }, [searchFaq]);

  useEffect(() => {
    seIsShowNoRecord(false);
    if (faqDetails.status || faqDetails.error) {
      seIsShowNoRecord(true);
      if (faqDetails.status === 200 && faqDetails.data) {
        const tempFaqList = [...faqDetails.data];
        const tempAboutRadyHubb = tempFaqList.filter(
          (eachFaq) => eachFaq.type === 'About Readyhubb',
        );

        const tempBusinessFaq = tempFaqList.filter(
          (eachFaq) => eachFaq.type !== 'About Readyhubb',
        );

        setReadyHubbFaq(tempAboutRadyHubb);
        setBookingFaq(tempBusinessFaq);
      }
      if (faqDetails.error) {
        global.showToast(faqDetails.message || faqDetails.error, 'error');
        dispatch({type: 'FAQ_LISTING_CLEAR'});
      }
    }
  }, [faqDetails]);

  const gotoDetailsPage = (item) => {
    navigation.navigate('profileFaqHelpDetails', {itemDetails: item});
  };

  const askAQuestionHandler = (question) => {
    console.log('question received: ', question);
    Post('/common/ask-a-question', {
      question: question,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          global.showToast(response.message, 'success');
          setIsModalVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
        global.showToast(response.message, 'error');
        setIsModalVisible(false);
      });
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  let ll = `Dolore cupidatat dolor irure ullamco deserunt officia quis ut adipisicing est veniam duis pariatur. Aute cillum laborum deserunt anim cupidatat exercitation cillum pariatur ex qui voluptate adipisicing aliquip fugiat. Laboris laboris excepteur proident nulla nostrud elit velit qui anim. Culpa eu incididunt amet excepteur tempor reprehenderit Lorem amet occaecat est. Nulla ullamco dolore duis esse occaecat nostrud et fugiat ullamco laborum. Ad minim in consequat eu mollit amet. Consectetur commodo irure quis consequat aute.`

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {faqDetails && faqDetails.loader ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, commonStyle.mb1]}>
            <SearchBar
              searchIcon={{display: 'none'}}
              // onChangeText={updateSearch}
              onChangeText={(value) => setSearchFaq(value)}
              value={searchFaq}
              autoFocus={false}
              placeholder="Search"
              placeholderTextColor={'#939DAA'}
              clearIcon={<SearchIcon />}
              // onClear={() => console.log('hello')}
              containerStyle={{
                backgroundColor: '#fff',
                borderBottomWidth: 0,
                borderTopWidth: 0,
                width: '100%',
                paddingLeft: 0,
                paddingRight: 0,
              }}
              inputStyle={{
                backgroundColor: '#fff',
                color: '#110F17',
                fontFamily: 'SofiaPro',
                paddingLeft: 0,
                marginLeft: 0,
              }}
              inputContainerStyle={{
                paddingRight: 5,
                paddingLeft: 5,
                backgroundColor: '#fff',
                borderRadius: 12,
                borderBottomWidth: 1,
                borderWidth: 1,
                borderColor: '#ECEDEE',
              }}
              style={{
                fontSize: 14,
                fontFamily: 'SofiaPro',
                backgroundColor: '#fff',
              }}
            />
            {!!searchFaq && (
              <View style={{position: 'absolute', right: 28, top: 30}}>
                <TouchableOpacity
                  style={commonStyle.globalsearchIcon}
                  onPress={() => onSearch()}>
                  {/* <SearchIcon /> */}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {readyHubbFaq && readyHubbFaq.length ? (
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                  About Readyhubb
                </Text>
              </View>
              <View
                style={[
                  commonStyle.setupCardBox,
                  {marginBottom: 30, paddingTop: 0},
                ]}>
                {readyHubbFaq &&
                  readyHubbFaq.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={commonStyle.generalFaqList}
                      onPress={() => gotoDetailsPage(item)}>
                      <Text style={[commonStyle.blackTextR, {width: '90%'}]}>
                        {/* {item.question.substring(0, 30)} */}
                        {item.question}
                      </Text>
                      <TouchableHighlight>
                        <RightAngle />
                      </TouchableHighlight>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ) : null}

          {bookingFaq && bookingFaq.length ? (
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                  Booking Management
                </Text>
              </View>
              <View
                style={[
                  commonStyle.setupCardBox,
                  {marginBottom: 30, paddingTop: 0},
                ]}>
                {bookingFaq &&
                  bookingFaq.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={commonStyle.generalFaqList}
                      onPress={() => gotoDetailsPage(item)}>
                      <Text style={[commonStyle.blackTextR, {width: '90%'}]}>
                        {item.question.substring(0, 30)}
                      </Text>
                      <TouchableHighlight>
                        <RightAngle />
                      </TouchableHighlight>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ) : null}

          {isShowNoRecord &&
          readyHubbFaq.length == 0 &&
          bookingFaq.length == 0 ? (
            <View style={commonStyle.noMassegeWrap}>
              <Image
                style={[commonStyle.nobookingsimg]}
                source={require('../assets/images/no-massege-img.png')}
              />
              <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                No Faq yet
              </Text>
            </View>
          ) : null}
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              // title="Ask a question"
              title={loginUserType == 1 ? 'Live chat' : 'Ask a question'}
              onPress={() => {
                if (loginUserType == 1) {
                  Intercom?.displayMessenger()
                    .then((res) => {
                      console.log('imtercom open', res);
                    })
                    .catch((error) => {
                      console.log('error intercom');
                    });
                } else {
                  setIsModalVisible(true);
                }
              }}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
            />
          </View>
        </View>
      </Container>

      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setIsModalVisible(false)}
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
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View style={[commonStyle.scrollableModal, {maxHeight: '100%'}]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setIsModalVisible(false)}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <AskAQuestionModal
            askAQuestionHandler={(question) => askAQuestionHandler(question)}
            setIsModalVisible={setIsModalVisible}
            setKeyboardStatus={setKeyboardStatus}
            scrollViewRefModal={scrollViewRef}
            handleOnScrollHandler={handleOnScroll}
          />
        </View>
      </Modal>
    </Fragment>
  );
};

export default ProfileFaqHelp;
