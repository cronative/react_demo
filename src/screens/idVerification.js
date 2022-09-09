import React, {Fragment} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import Pulse from 'react-native-pulse';
import {IdCardIcon} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';

const IdVerification = ({navigation}) => {
  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={commonStyle.mainContainer}>
        <View style={commonStyle.onboardingslide}>
          <View style={commonStyle.onboardingheight}>
            <TouchableOpacity
              style={commonStyle.verifyclose}
              onPress={() => navigation.goBack()}>
              <Image
                style={commonStyle.avatericon}
                source={require('../assets/images/close.png')}
              />
            </TouchableOpacity>
            <View style={commonStyle.notificationCenter}>
              <Pulse
                color="#ffffff"
                numPulses={4}
                diameter={200}
                speed={20}
                duration={2000}
              />
              <View style={commonStyle.notificationposition}>
                <IdCardIcon />
              </View>
            </View>
            <View style={commonStyle.onboardingcardwrap}>
              <View style={commonStyle.onboardingcard1}></View>
              <View style={commonStyle.onboardingcard2}></View>
              <View style={commonStyle.onboardingcard3}>
                <View>
                  <Image
                    style={commonStyle.idcardprocessimg}
                    source={require('../assets/images/id-card-process.png')}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={[commonStyle.onboardingtextwrap, {paddingHorizontal: 10}]}>
            <Text style={commonStyle.onboardingtextheading}>
              Verify your identity
            </Text>
            <Text style={commonStyle.onboardingsubtext}>
              To withdraw money, please upload a photo of your ID or driver
              license.
            </Text>
            <View style={commonStyle.mt1}>
              <Button
                title="Verify my identity"
                containerStyle={[commonStyle.buttoncontainerStyle]}
                buttonStyle={[commonStyle.commonbuttonStyle, {width: '100%'}]}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() =>
                  navigation.navigate('IdVerificationDocument', {
                    cancelVerificationStatus: false,
                  })
                }
              />
              <TouchableOpacity
                style={commonStyle.notnowbtn}
                activeOpacity={0.5}
                onPress={() => navigation.goBack()}>
                <Text style={commonStyle.grayTextBold}>Do it later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default IdVerification;
