import React, {Fragment, useState} from 'react';
import {StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container} from 'native-base';
import commonStyle from '../../assets/css/mainStyle';

import BusinessDetails from '../../components/businessSetting/businessDetails';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import ActivityLoader from '../../components/ActivityLoader';

const BusinessSettingsYourBusiness = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [locationLoader, setLocationLoader] = useState(false);
  const redirectUrlHandler = (data) => {
    navigation.goBack();
  };
  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      {locationLoader ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
        <BusinessDetails
          isUpdate={true}
          setLoader={setLoader}
          setLocationLoader={setLocationLoader}
          redirectUrlHandler={redirectUrlHandler}
        />
      </Container>
    </Fragment>
  );
};

export default BusinessSettingsYourBusiness;
