import React, {Fragment} from 'react';
import {View, Text, StatusBar} from 'react-native';
import {Container} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import commonStyle from '../assets/css/mainStyle';
import HTMLView from 'react-native-htmlview';

const profileFaqHelpDetails = ({route}) => {
  const singleFaqDetails = route.params.itemDetails || '';
  console.log(singleFaqDetails);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, commonStyle.mb1]}>
            <Text style={[commonStyle.modalforgotheading, commonStyle.pr2]}>
              {singleFaqDetails && singleFaqDetails.question}
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
              <HTMLView value={singleFaqDetails && singleFaqDetails.answer} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    </Fragment>
  );
};

export default profileFaqHelpDetails;
