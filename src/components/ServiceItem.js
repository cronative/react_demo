import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReadMore from 'react-native-read-more-text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {default as commonStyle} from '../assets/css/mainStyle';
import {timeConversion} from '../utility/commonService';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../utility/readMoreHelperFunctions';

export default function Serviceitem({service, removeService}) {
  const formattedDuration = ({timeSlot, duration}) => {
    const modifiedDuration = Math.ceil(duration / 30) * 30;
    return timeSlot
      ? `${timeSlot.format('h:mm a')} - ${timeSlot
          .clone()
          .add(modifiedDuration, 'minutes')
          .format('h:mm a')}`
      : null;
  };

  return (
    <>
      <View style={styles.cardHeading}>
        <Text style={commonStyle.blackTextR18}>{service.name}</Text>
        {removeService ? (
          <TouchableOpacity
            onPress={() => removeService(service)}
            style={styles.crossBtn}>
            <MaterialIcons name="close" size={20} />
          </TouchableOpacity>
        ) : (
          <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
            ${service.amount}
          </Text>
        )}
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {formattedDuration(service) && (
          <>
            <Text style={[commonStyle.textdategray, {marginRight: 4}]}>
              {formattedDuration(service)}
            </Text>
            <Text style={[commonStyle.textdategray, {marginHorizontal: 4}]}>
              ·
            </Text>
          </>
        )}
        <Text style={[commonStyle.grayText16, {marginRight: 2}]}>
          {timeConversion(service.duration)}
        </Text>
        {service.type == 2 && (
          <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>
            Group session
          </Text>
        )}

        {removeService && (
          <>
            <Text style={[commonStyle.grayText16, {marginHorizontal: 4}]}>
              ·
            </Text>
            <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
              ${service.amount}
            </Text>
          </>
        )}
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
    </>
  );
}

const styles = StyleSheet.create({
  crossBtn: {
    elevation: 6,
    padding: 3,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
