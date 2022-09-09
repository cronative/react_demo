import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import {List, ListItem, Body, Left} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import {RightAngle} from '../icons';
import commonStyle from '../../assets/css/mainStyle';
import {FaqQuestionAddModal} from '../modal';
import {professionalFaqListingRequest} from '../../store/actions';
import {useFocusEffect} from '@react-navigation/native';

import {useSelector, useDispatch} from 'react-redux';

const BusinessFaq = ({isUpdate, redirectUrlHandler}) => {
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [singleFaqDetails, setSingleFaqDetails] = useState(null);
  const faqDetails = useSelector((state) => state.faqDetails);
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  useEffect(() => {
    dispatch(professionalFaqListingRequest());
  }, []);

  const gotoDetailsPage = (item) => {
    setSingleFaqDetails(item);
    setVisibleModal('FaqQuestionAddDialog');
  };

  const onHideModal = () => {
    setSingleFaqDetails(null);
    setVisibleModal({visibleModal: null});
  };

  const onSuccessFaqManupulation = () => {
    onHideModal();
    dispatch(professionalFaqListingRequest());
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
          <Text style={[commonStyle.subheading, commonStyle.mb1]}>
            {!isUpdate ? 'Create' : null} FAQ
          </Text>
        </View>
        <View style={commonStyle.categoriseListWrap}>
          <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
            <List style={commonStyle.payinCashinfowrap}>
              <ListItem thumbnail style={commonStyle.categoriseListItem}>
                <View style={commonStyle.serviceListtouch}>
                  <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                    <Image
                      source={require('../../assets/images/payincashicon.png')}
                      style={commonStyle.payincashimg}
                      resizeMode={'contain'}
                    />
                  </Left>
                  <Body style={commonStyle.categoriseListBody}>
                    <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                      Please do not forget to add a COVID-19 safety info
                    </Text>
                  </Body>
                </View>
              </ListItem>
            </List>
          </View>

          <View style={[commonStyle.setupCardBox, {marginBottom: 30}]}>
            <Text style={commonStyle.subtextbold}>General FAQ</Text>
            {faqDetails && faqDetails.proFaqData && faqDetails.proFaqData.length
              ? faqDetails.proFaqData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={commonStyle.generalFaqList}
                    onPress={() => {
                      gotoDetailsPage(item);
                    }}>
                    <Text style={[commonStyle.blackTextR, {width: '90%'}]}>
                      {/* {item.question.substring(0, 30)} */}
                      {item.question}
                    </Text>
                    <TouchableHighlight>
                      <RightAngle />
                    </TouchableHighlight>
                  </TouchableOpacity>
                ))
              : null}

            <View style={commonStyle.mt2}>
              <TouchableOpacity
                style={[commonStyle.searchBarText, {alignSelf: 'flex-start'}]}
                onPress={() => {
                  gotoDetailsPage(null);
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
                <Text style={commonStyle.blackTextR}>Add a question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {!isUpdate && (
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title={isUpdate ? 'Update' : 'Save and Continue'}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => redirectUrlHandler()}
            />
          </View>
        </View>
      )}

      {/* Setup Service modal start */}
      <Modal
        isVisible={visibleModal === 'FaqQuestionAddDialog'}
        onSwipeComplete={() => onHideModal()}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        // scrollOffset={scrollOffset}
        // scrollOffsetMax={500 - 100}
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
            onPress={() => onHideModal()}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <FaqQuestionAddModal
            setKeyboardStatus={setKeyboardStatus}
            singleFaqDetails={singleFaqDetails}
            onSuccessFaqManupulation={onSuccessFaqManupulation}
          />
        </View>
      </Modal>
      {/* Setup Service modal End */}
    </Fragment>
  );
};

export default BusinessFaq;
