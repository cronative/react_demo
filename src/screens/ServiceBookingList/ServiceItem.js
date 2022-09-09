import moment from 'moment';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import ReadMore from 'react-native-read-more-text';
import {CloseIcon, DownArrow, ClockIcon} from '../../components/icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, default as commonStyle} from '../../assets/css/mainStyle';
import {timeConversion} from '../../utility/commonService';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';

export default function Serviceitem({service, active, removeService, onPress}) {
  return (
    <>
      <View style={commonStyle.g}>
        <View style={styles.cardHeading}>
          <Text
            style={{
              ...commonStyle.blackTextR18,
              width: '85%',
              color: active ? Colors.orange : Colors.theamblack,
            }}>
            {service.name}
            <View style={{marginTop: 3}}>
              {service?.type === 2 && (
                <TouchableHighlight
                  style={[commonStyle.paidbtn, {marginLeft: 10}]}>
                  <Text style={[commonStyle.paidbtntext, {fontSize: 8}]}>
                    Group Session
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          </Text>
          <TouchableOpacity
            onPress={() => removeService(service)}
            style={styles.crossBtn}>
            <MaterialIcons name="close" size={18} />
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* {formattedDuration(service) && <>
          <Text style={commonStyle.textdategray}>{formattedDuration(service)}</Text>
          <Text style={{ marginHorizontal: 4, paddingBottom: 6 }}>.</Text>
        </>} */}
          <Text style={[commonStyle.grayText16, {marginRight: 4}]}>
            {timeConversion(service.duration)}
          </Text>
          <Text
            style={[
              commonStyle.grayText16,
              {marginHorizontal: 4, color: Colors.theamblack},
            ]}>
            ·
          </Text>
          <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
            ${service.amount}
          </Text>
        </View>

        <View style={{marginVertical: 10}}>
          {service.description === '' ? (
            <></>
          ) : (
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={renderReadMore}
              renderRevealedFooter={renderShowLess}
              onReady={handleTextReady}>
              <Text style={commonStyle.grayText14}>{service.description}</Text>
            </ReadMore>
          )}
        </View>
      </View>
      {/* <TouchableOpacity style={[commonStyle.watingtimewrap, commonStyle.lightBlue]} activeOpacity={1}>
          <View style={commonStyle.searchBarText}>
            <TouchableHighlight style={commonStyle.haederback}> 	
              <ClockIcon/>
            </TouchableHighlight>
            <Text style={commonStyle.blackTextR}>Waiting time</Text>
          </View>
          <TouchableHighlight>
              <Text style={commonStyle.blackTextR}>1 h</Text>
          </TouchableHighlight>
        </TouchableOpacity> */}

      {/* Date and time picker */}
      <View>
        <View style={commonStyle.mb15}>
          <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
            Select date and time
          </Text>
          <Input
            value={
              service?.timeSlot
                ? moment(service.timeSlot).format('D MMM YYYY - h:mm a')
                : ''
            }
            placeholder="Date and Time"
            editable={false}
            onTouchStart={() => onPress(service)}
            rightIcon={
              <Icon
                type="ionicon"
                name="chevron-down-outline"
                onPress={() => onPress(service)}
              />
            }
            inputContainerStyle={styles.inputContainerStyle}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  crossBtn: {
    padding: 0,
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: -20,
    marginHorizontal: -10,
    paddingHorizontal: 15,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    borderColor: Colors.lightgray,
    fontFamily: 'SofiaPro',
  },
});
