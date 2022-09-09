import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {ScrollView, Dimensions, TextInput, View, Text, StatusBar, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Container} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import commonStyle from '../assets/css/mainStyle';

const IdVerificationPendingDocument = () => {

  const navigation = useNavigation();


return (
      <Fragment>
        <StatusBar backgroundColor="#F36A46"/>
        <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb3]}>Pending verification</Text>
            <Text style={[commonStyle.grayText16, commonStyle.mb1]}>Photo of your drivers licence</Text>
            </View>
            <View style={commonStyle.categoriseListWrap}>
                <View style={[commonStyle.setupCardBox]}>
                  <View style={commonStyle.mb2}>
                    <Image style={commonStyle.uploadedidprof} source={require('../assets/images/id-document.png')} />
                  </View>
                  <View style={[commonStyle.dividerfull, {marginLeft: -20}]}/>  
                  <View style={{paddingTop: 20, paddingBottom: 5}}>
                  <TouchableOpacity 
                  activeOpacity={.5} 
                  style={commonStyle.footerbtn}
                  onPress={() => navigation.navigate('IdVerificationResubmitDocument')}
                  >
                    <Text style={commonStyle.unfollowbtnText}>Cancel verification</Text>
                  </TouchableOpacity>
                  </View>
                </View>
            </View>
          </KeyboardAwareScrollView>
          </Container>
      </Fragment>
  );
};


export default IdVerificationPendingDocument;