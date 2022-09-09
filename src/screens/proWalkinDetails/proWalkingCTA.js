import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import {RightAngle} from '../../components/icons';

const ProWalkingCTA = ({onPress, imageUrl, buttonText, alternateView}) => {
  return (
    <View
      style={[commonStyle.socialShareRowCol, alternateView && {width: '100%'}]}>
      {alternateView ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            borderColor: '#dcdcdc',
            borderWidth: 1,
            borderRadius: 12,
            marginBottom: 10,
          }}
          onPress={onPress}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <View style={[commonStyle.mrl]}>
              <Image style={commonStyle.avatericon} source={imageUrl} />
            </View>
            <Text
              style={[commonStyle.blackTextR, {textAlign: 'center'}]}
              numberOfLines={1}>
              {buttonText}
            </Text>
          </View>
          <View style={[commonStyle.mrl]}>
            <RightAngle />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={commonStyle.mb1} onPress={onPress}>
          <View style={[commonStyle.socialShareCircle, commonStyle.mrl]}>
            <Image style={commonStyle.avatericon} source={imageUrl} />
          </View>
          <Text
            style={[commonStyle.blackTextR, commonStyle.textCenter]}
            numberOfLines={1}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProWalkingCTA;
