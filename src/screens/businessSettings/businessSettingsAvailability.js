import React, {Fragment, useState} from 'react';
import {Dimensions, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container} from 'native-base';

import commonStyle from '../../assets/css/mainStyle';

const {width, height} = Dimensions.get('window');

import ActivityLoader from '../../components/ActivityLoader';
import AvailabilityDetails from '../../components/businessSetting/availablityDetails';

const BusinessSettingsAvailability = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const redirectUrlHandler = () => {
    navigation.goBack();
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
        <AvailabilityDetails
          isUpdate={true}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
        />
      </Container>
    </Fragment>
  );
};

export default BusinessSettingsAvailability;
