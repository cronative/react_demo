import moment from 'moment';
import React, {useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import {mainAPI} from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import global from '../../components/commonservices/toast';
import {BlockTimeModal} from '../../components/modal';
import NewWalkInBooking from '../../screens/newWalkInBooking';

export function BlockTimeContainer(props) {
  const scrollViewRef = useRef(0);
  const [scrollOffset, setScrollOffset] = useState();
  const [blockDate, setBlockDate] = useState(null);
  const [blockFromTime, setBlockFromTime] = useState(null);
  const [blockToTime, setBlockToTime] = useState(null);

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const onSave = () => {
    mainAPI({
      methodType: 'post',
      url: '/pro/block-time',
      data: {
        blockDate: blockDate || moment().format('YYYY-MM-DD'),
        blockFrom: blockFromTime,
        blockTo: blockToTime,
      },
    })
      .then(() => {
        global.showToast('Blocking time added successfully', 'success');
        props.setModalVisible(null);
      })
      .catch(() => {
        global.showToast('Blocking time has not been saved', 'error');
      });
  };

  return (
    <Modal
      isVisible={props.modalVisible === 'blockTime'}
      onSwipeComplete={() => props.setModalVisible(null)}
      swipeThreshold={50}
      swipeDirection="down"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      propagateSwipe={true}
      style={[commonStyle.bottomModal]}>
      <View style={commonStyle.scrollableModal}>
        <TouchableOpacity
          style={[commonStyle.termswrap, commonStyle.mt2]}
          onPress={() => props.setModalVisible(null)}>
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
            setBlockDate={setBlockDate}
            setBlockFromTime={setBlockFromTime}
            setBlockToTime={setBlockToTime}
          />
        </ScrollView>

        {blockDate && blockFromTime && blockToTime && (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title="Save"
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              // onPress={() => navigation.navigate('SetupBusiness')}
              onPress={onSave}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

export function NewWalkingBookingContainer({modalVisible, setModalVisible}) {
  const scrollViewRef = useRef(0);
  const [scrollOffset, setScrollOffset] = useState();
  const [blockDate, setBlockDate] = useState(null);
  const [blockFromTime, setBlockFromTime] = useState(null);
  const [blockToTime, setBlockToTime] = useState(null);

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const onSave = () => {};

  return (
    <Modal
      isVisible={modalVisible === 'walkinBooking'}
      onSwipeComplete={() => setModalVisible(null)}
      swipeThreshold={50}
      swipeDirection="down"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      propagateSwipe={true}
      style={[commonStyle.bottomModal]}>
      <View style={commonStyle.scrollableModal}>
        <TouchableOpacity
          style={[commonStyle.termswrap, commonStyle.mt2]}
          onPress={() => setModalVisible(null)}>
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
          <View style={{alignItems: 'center'}}>
            <Text style={commonStyle.modalforgotheading}>
              New walk-in booking
            </Text>
          </View>
          <NewWalkInBooking />
        </ScrollView>
        {/* <View style={[commonStyle.categoryselectbtn]}>
          <Button
            title="Save"
            containerStyle={commonStyle.buttoncontainerStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            // onPress={() => navigation.navigate('SetupBusiness')}
            onPress={onSave}
          />
        </View> */}
      </View>
    </Modal>
  );
}
