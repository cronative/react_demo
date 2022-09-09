import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Keyboard,
} from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';

import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
  UncheckedBox,
  CheckedBox,
  DownArrow,
} from '../icons';
import {DurationTimeData} from '../../utility/staticData';

import commonStyle from '../../assets/css/mainStyle';
import {useFocusEffect} from '@react-navigation/native';

const ExtraChargesModal = ({
  navigation,
  extraChargeTitle,
  extraChargeAmount,
  extraChargeDescription,
  setExtraChargeTitle,
  setExtraChargeAmount,
  setExtraChargeDescription,
  extraChargeErrors,
  setExtraChargeErrors,
  setKeyboardStatus,
}) => {
  const [titleFocus, setTitleFocus] = useState(false);
  const [extraAmountFocus, setExtraAmountFocus] = useState(false);
  const [descriptionFocus, setDescriptionFocus] = useState(false);

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

  const [dataSelect, setDataSelect] = useState(null);
  const [areaCoverSelect, setAreaCoverSelectSelect] = useState(null);

  /**
   * This method will call on Business Name Select.
   */
  const businessNameSelectHelper = (index, value) => {
    setDataSelect(value);
    setAreaCoverSelectSelect(index);
  };
  /**
   * #######################.
   */

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        console.log('Keyboard is being visible');
        setKeyboardStatus(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        console.log('Keyboard is being hidden');
        setKeyboardStatus(0);
      });

      return () => {
        setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Add Extra Charges</Text>
        {/* {extraChargeTitle?.length > 0 ?
                    <TouchableOpacity>
                        <Text style={commonStyle.grayText16}>Delete</Text>
                    </TouchableOpacity> : null} */}
      </View>
      {/* <Text style={[commonStyle.grayText16, commonStyle.mt1]}>You’ll be able to add more details later</Text> */}
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View style={commonStyle.mb2}>
          <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
            Extra charge title
          </Text>
          <TextInput
            style={[
              commonStyle.textInput,
              titleFocus && commonStyle.focusinput,
            ]}
            onFocus={() => setTitleFocus(true)}
            onChangeText={(text) => {
              setExtraChargeTitle(text);
              setExtraChargeErrors((prevState) => ({
                ...prevState,
                title: {
                  ...prevState.title,
                  status: !text?.length,
                },
              }));
            }}
            returnKeyType="done"
            keyboardType="email-address"
            autoCapitalize={'none'}
          />
          {extraChargeErrors?.title?.status ? (
            <Text style={commonStyle.inputfielderror}>
              {extraChargeErrors.title.message}
            </Text>
          ) : null}
        </View>
        {/* <View style={commonStyle.mb2}>
                    <CheckBox
                        style={{ paddingVertical: 10 }}
                        onClick={() => MobleServiceSelectHelper()}
                        isChecked={isMobleServiceChecked}
                        checkedCheckBoxColor={"#ff5f22"}
                        uncheckedCheckBoxColor={"#e6e7e8"}
                        rightText={'Is it a mobile service?'}
                        rightTextStyle={commonStyle.blackTextR}
                        checkedImage={<CheckedBox />}
                        unCheckedImage={<UncheckedBox />}
                    />
                </View> */}
        <View style={commonStyle.mb2}>
          <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
            Extra charge amount
          </Text>
          <View>
            <TextInput
              style={[
                commonStyle.textInput,
                commonStyle.prefixInput,
                extraAmountFocus && commonStyle.focusinput,
              ]}
              value={extraChargeAmount}
              onFocus={() => setExtraAmountFocus(true)}
              onChangeText={(text) => {
                console.log(!(text?.split('.')[1]?.length > 2));
                if (!(text?.split('.')[1]?.length > 2)) {
                  // if (true) {
                  setExtraChargeAmount(text);
                }
                setExtraChargeErrors((prevState) => ({
                  ...prevState,
                  amount: {
                    ...prevState.amount,
                    status: !text?.length,
                  },
                }));
              }}
              keyboardType="number-pad"
              // step=".01"
              autoCapitalize={'none'}
              returnKeyType="done"
              // placeholder='000'
              placeholderTextColor={'#939DAA'}
            />
            <Text style={commonStyle.prefixText}>$</Text>
            {extraChargeErrors?.amount?.status ? (
              <Text style={commonStyle.inputfielderror}>
                {extraChargeErrors.amount.message}
              </Text>
            ) : null}
          </View>
        </View>
        {/* <View style={commonStyle.mb2}>
                    <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>Duration</Text>
                    <TouchableOpacity style={commonStyle.dropdownselectmodal} onPress={() => { setVisibleModal('DurationAddDialog'); }}>
                        <Text style={commonStyle.grayText16}>Add duration</Text>
                        <DownArrow />
                    </TouchableOpacity>
                </View> */}
        {/* <View style={commonStyle.mb2}>
                    <CheckBox
                        style={{ paddingVertical: 10 }}
                        onClick={() => ExtraTimeServiceSelectHelper()}
                        isChecked={isExtraTimeServiceChecked}
                        checkedCheckBoxColor={"#ff5f22"}
                        uncheckedCheckBoxColor={"#e6e7e8"}
                        rightText={'Enable extra time after the service'}
                        rightTextStyle={commonStyle.blackTextR}
                        checkedImage={<CheckedBox />}
                        unCheckedImage={<UncheckedBox />}
                    />
                </View> */}
        <View style={commonStyle.mb2}>
          <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
            Description (it’s optional)
          </Text>
          <TextInput
            style={[
              commonStyle.textInput,
              commonStyle.textareainput,
              descriptionFocus && commonStyle.focusinput,
            ]}
            onFocus={() => setDescriptionFocus(true)}
            onChangeText={(text) => {
              if (extraChargeDescription?.length <= 500)
                setExtraChargeDescription(text);
            }}
            returnKeyType="done"
            keyboardType="email-address"
            autoCapitalize={'none'}
            multiline={true}
            numberOfLines={10}
            maxLength={500}
            blurOnSubmit={true}
            onSubmitEditing={(e) => {
              console.log('On Submit Editing');
              e.target.blur();
            }}
          />
          <Text style={commonStyle.textlength}>
            {extraChargeDescription ? extraChargeDescription.length : 0}/500
          </Text>
          {/* {extraChargeErrors?.description?.status ?
                        <Text style={commonStyle.inputfielderror}>{extraChargeErrors.description.message}</Text> :
                        null
                    } */}
        </View>
      </View>

      {/* Setup Service modal start */}
      <Modal
        isVisible={visibleModal === 'DurationAddDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
                <Text style={[commonStyle.modalforgotheading]}>Duration</Text>
              </View>

              <View style={commonStyle.typeofServiceFilterWrap}>
                <View>
                  <RadioGroup
                    style={commonStyle.setupradioGroup}
                    color="#ffffff"
                    activeColor="#ffffff"
                    highlightColor={'#ffffff'}
                    selectedIndex={areaCoverSelect}
                    onSelect={(index, value) => {
                      businessNameSelectHelper(index, value);
                    }}>
                    {DurationTimeData.map((item, index) => (
                      <RadioButton
                        key={index}
                        style={commonStyle.setupradioButton}
                        value={item.value}>
                        <View style={commonStyle.radioCustomView}>
                          <Text style={commonStyle.blackTextR}>
                            {item.durationTime}
                          </Text>
                          {areaCoverSelect == item.value ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </RadioButton>
                    ))}
                  </RadioGroup>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View>
        </View>
      </Modal>
      {/* Setup Service modal End */}
    </View>
  );
};

export default ExtraChargesModal;
