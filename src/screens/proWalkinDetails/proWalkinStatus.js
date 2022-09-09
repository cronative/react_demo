import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';

const ProWalkinStatus = ({bookingData}) => {
  return (
    <>
      {bookingData?.status == 0 && (
        <TouchableHighlight
          style={[commonStyle.bookingStatusbtn, commonStyle.noshowStatusbtn]}>
          <Text style={commonStyle.bookingStatusbtnText}>Pending</Text>
        </TouchableHighlight>
      )}
      {bookingData?.status == 1 && (
        <TouchableHighlight
          style={[commonStyle.bookingStatusbtn, commonStyle.confirmStatusbtn]}>
          <Text style={commonStyle.bookingStatusbtnText}>Confirmed</Text>
        </TouchableHighlight>
      )}
      {bookingData?.status == 2 && (
        <TouchableHighlight
          style={[commonStyle.bookingStatusbtn, commonStyle.ongoingStatusbtn]}>
          <Text style={commonStyle.bookingStatusbtnText}>Ongoing</Text>
        </TouchableHighlight>
      )}
      {bookingData?.status == 3 && (
        <TouchableHighlight
          style={[
            commonStyle.bookingStatusbtn,
            commonStyle.completedStatusbtn,
          ]}>
          <Text style={commonStyle.bookingStatusbtnText}>Completed</Text>
        </TouchableHighlight>
      )}
      {bookingData?.status == 4 && (
        <TouchableHighlight
          style={[
            commonStyle.bookingStatusbtn,
            commonStyle.cancelledStatusbtn,
          ]}>
          <Text style={commonStyle.bookingStatusbtnText}>Cancelled</Text>
        </TouchableHighlight>
      )}
    </>
  );
};

export default ProWalkinStatus;
