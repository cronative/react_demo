import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container, List, ListItem, Body, Left, Right} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-elements';
import commonStyle from '../assets/css/mainStyle';
import {Post} from '../api/apiAgent';
import global from '../components/commonservices/toast';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';

const IdVerificationResubmitDocument = (props) => {
  // Declare the constant
  const [loderStatus, setLoderStatus] = useState(false);
  const navigation = useNavigation();
  const {
    adminRemarks,
    proffesionalDoc,
    proffesionalDocImage,
    headerMessage,
    btnMessage,
    documentsType,
    docImageId,
  } = props.route.params;

  // This method is to cancel the verification
  const cancelVerification = () => {
    let obj = {
      imageId: docImageId,
    };
    setLoderStatus(true);
    Post('pro/cancel-verification', obj)
      .then((result) => {
        setLoderStatus(false);
        if (result.status === 200) {
          global.showToast(result.message, 'success');
          setTimeout(() => {
            navigation.navigate('IdVerificationDocument', {
              cancelVerificationStatus: true,
            });
          }, 1000);
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoderStatus(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb3]}>
              {headerMessage}
            </Text>
            {!!btnMessage ? (
              <List style={[commonStyle.payinCashinfowrap, commonStyle.mb2]}>
                <ListItem thumbnail style={commonStyle.categoriseListItem}>
                  <View style={commonStyle.serviceListtouch}>
                    <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                      <Image
                        source={require('../assets/images/payincashicon.png')}
                        style={commonStyle.payincashimg}
                        resizeMode={'contain'}
                      />
                    </Left>
                    <Body style={commonStyle.categoriseListBody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                        Your ID verification was rejected by Readyhubb, because
                        you {proffesionalDoc} was expired. Please resubmit your
                        documents to withdraw the balance.
                      </Text>
                    </Body>
                  </View>
                </ListItem>
              </List>
            ) : null}
            <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
              Photo of your {proffesionalDoc}
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox]}>
              <View style={commonStyle.mb2}>
                <Image
                  style={commonStyle.uploadedidprof}
                  source={{uri: proffesionalDocImage}}
                />
              </View>
              <View style={[commonStyle.dividerfull, {marginLeft: -20}]} />
              <View style={{paddingTop: 20, paddingBottom: 5}}>
                {documentsType == 3 ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={commonStyle.footerbtn}
                    onPress={cancelVerification}>
                    <Text style={commonStyle.unfollowbtnText}>
                      Cancel verification
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {btnMessage === true ? (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title="Resubmit"
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => navigation.navigate('IdVerificationDocument')}
            />
          </View>
        ) : null}
      </Container>
    </Fragment>
  );
};

export default IdVerificationResubmitDocument;
