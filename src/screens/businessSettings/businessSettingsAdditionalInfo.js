import React, {Fragment, useState} from 'react';
import {StatusBar, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container} from 'native-base';
import commonStyle from '../../assets/css/mainStyle';
import AdditionalInfo from '../../components/businessSetting/additionalInfo';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';

const BusinessSettingsAdditionalInfo = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const redirectUrlHandler = () => {
    navigation.goBack();
  };
  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      <Container
        style={[
          commonStyle.mainContainer,
          commonStyle.pb1,
          {
            paddingTop: 0,
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <AdditionalInfo
          isUpdate={true}
          setKeyboardStatus={setKeyboardStatus}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
        />
      </Container>
    </Fragment>
  );
};

export default BusinessSettingsAdditionalInfo;
