import React, {Fragment, useState} from 'react';
import {StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container} from 'native-base';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
import BusinessContacts from '../../components/businessSetting/businessContact';

const BusinessSettingsContacts = () => {
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
        <BusinessContacts
          isUpdate={true}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
        />
        {/* <KeyboardAwareScrollView>
            <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>Contact details preferences</Text>
            </View>
                <View style={commonStyle.categoriseListWrap}>
                    <View style={[commonStyle.setupCardBox]}>
                      <View style={commonStyle.appchatWrap}>
                        <Text style={commonStyle.blackTextR}>In-App chat</Text>
                        <CheckedOrange/>
                      </View>
                        <View style={[commonStyle.contactDetailscheck]}>
                          <CheckBox
                              style={{paddingVertical: 10}}
                              onClick={ () => phoneNumberSelectHelper()}
                              isChecked={isPhoneNumberChecked}
                              checkedCheckBoxColor={"#ff5f22"}
                              uncheckedCheckBoxColor={"#e6e7e8"}
                              leftText={'Phone number'}
                              leftTextStyle={commonStyle.blackTextR}
                              checkedImage={<CheckedBox/>}
                              unCheckedImage={<UncheckedBox/>}
                          />
                          { isPhoneNumberChecked == 1 ?
                          <View style={[commonStyle.mt1, commonStyle.mb1]}>
                          <PhoneInput
                            ref={phoneInput}
                            defaultValue={value}
                            defaultCode="GB"
                            layout="first"
                            placeholder="XXXX XXX XXX"
                            onChangeText={(text) => {
                              setValue(text);
                            }}
                            onChangeFormattedText={(text) => {
                              setFormattedValue(text);
                            }}
                            withDarkTheme={false}
                            withShadow={false}
                            autoFocus= {false}
                            containerStyle={[commonStyle.phonecontainerBorder, formattedValue &&  commonStyle.phonecontainerBorderFocus]}
                            textContainerStyle={commonStyle.phonetextContainerStyle}
                            textInputStyle={commonStyle.phonetextInputStyle}
                            codeTextStyle={commonStyle.phonecodeTextStyle}
                            flagButtonStyle={commonStyle.phoneflagButtonStyle}
                            countryPickerButtonStyle={commonStyle.phonecountryPickerButtonStyle}
                          />
                          </View> : null }
                        </View>
                        <View style={[commonStyle.mb2, commonStyle.contactDetailscheck]}>
                          <CheckBox
                              style={{paddingVertical: 10}}
                              onClick={ () => emailSelectHelper()}
                              isChecked={isEmailChecked}
                              checkedCheckBoxColor={"#ff5f22"}
                              uncheckedCheckBoxColor={"#e6e7e8"}
                              leftText={'Email'}
                              leftTextStyle={commonStyle.blackTextR}
                              checkedImage={<CheckedBox/>}
                              unCheckedImage={<UncheckedBox/>}
                          />
                          { isEmailChecked == 1 ?
                          <View style={[commonStyle.mt1, commonStyle.mb1]}>
                          <TextInput
                              style={[
                                commonStyle.textInput,
                                isEmailFocus && commonStyle.focusinput,
                              ]}
                              onFocus={() => setIsEmailFocus(true)}
                              onChangeText={(text) => setEmail(text)}
                              // autoFocus={true}
                              returnKeyType="next"
                              keyboardType='email-address'
                              autoCapitalize={'none'}
                              value={'gloriadallas@gmail.com'}
                            />
                          </View> : null }
                        </View>  
                    </View>
                </View>
          </KeyboardAwareScrollView>  */}
      </Container>
    </Fragment>
  );
};

export default BusinessSettingsContacts;
