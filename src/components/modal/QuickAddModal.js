import React from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider} from 'react-native-elements';
import Modal from 'react-native-modal';
import commonStyle from '../../assets/css/mainStyle';

export default function QuickAddModal({onClose, isVisible, setModalVisible}) {
  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeThreshold={50}
      swipeDirection="down"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      propagateSwipe={true}
      style={[commonStyle.othersbottomModal, {marginBottom: 70}]}>
      <View>
        <View style={commonStyle.othersModal}>
          <TouchableOpacity
            onPress={() => {
              onClose();
              setModalVisible('walkinBooking');
            }}
            style={[
              commonStyle.searchBarText,
              {
                padding: 12,
              },
            ]}>
            <TouchableHighlight style={[commonStyle.haederback]}>
              <Image
                style={commonStyle.paymentmethodicon}
                source={require('../../assets/images/calendar-orange.png')}
              />
            </TouchableHighlight>
            <Text style={commonStyle.blackTextR}>New walk-in booking</Text>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            onPress={() => {
              onClose();
              setModalVisible('blockTime');
            }}
            style={[
              commonStyle.searchBarText,
              {
                padding: 12,
              },
            ]}>
            <TouchableHighlight style={[commonStyle.haederback]}>
              <Image
                style={commonStyle.paymentmethodicon}
                source={require('../../assets/images/block-time-img.png')}
              />
            </TouchableHighlight>
            <Text style={commonStyle.blackTextR}>Block Time</Text>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            onPress={() => onClose()}
            style={[
              commonStyle.searchBarText,
              {
                padding: 12,
              },
            ]}>
            <TouchableHighlight style={[commonStyle.haederback]}>
              <Image
                style={commonStyle.paymentmethodicon}
                source={require('../../assets/images/starFilled.png')}
              />
            </TouchableHighlight>
            <Text style={commonStyle.blackTextR}>Inspiration post</Text>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            onPress={onClose}
            style={[
              commonStyle.searchBarText,
              {
                padding: 12,
                justifyContent: 'center',
              },
            ]}>
            <Text style={[commonStyle.colorOrange, {justifyContent: 'center'}]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
