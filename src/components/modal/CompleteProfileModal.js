import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import { List, ListItem, Body, Left, Right } from 'native-base';
import { CheckedOrange } from '../icons';
import commonStyle from '../../assets/css/mainStyle';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Get } from '../../api/apiAgent';

const CompleteProfileModal = ({
  businessCompletionDetails,
  businessInfoModalClose,
}) => {
  const navigation = useNavigation();

  // console.log(businessCompletionDetails);
  console.log('munni', JSON.stringify(businessCompletionDetails, null, 2));
  return (
    <View
      style={[
        commonStyle.modalContent,
        {
          paddingTop: 0,
          marginTop: -10,
        },
      ]}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          { borderBottomWidth: 0, paddingBottom: 0 },
        ]}>
        <Text style={[commonStyle.subheading, commonStyle.mb15]}>
          Complete your business info
        </Text>
      </View>
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View style={commonStyle.mb03}>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Date of Birth
                  </Text>
                </Body>
                <TouchableHighlight style={{ alignSelf: 'center' }}>
                  <CheckedOrange />
                </TouchableHighlight>
                {/* {businessCompletionDetails &&
                businessCompletionDetails.dateOfBirth ? (
                  <TouchableHighlight style={{alignSelf: 'center'}}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        {backgroundColor: '#F36A46'},
                      ]}
                      onPress={() => {
                        businessInfoModalClose();
                        navigation.navigate('Profile');
                        setTimeout(() => {
                          navigation.navigate('SetupDOB');
                        }, 300);
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )} */}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Main category
                  </Text>
                </Body>
                <TouchableHighlight style={{ alignSelf: 'center' }}>
                  <CheckedOrange />
                </TouchableHighlight>
                {/* {businessCompletionDetails &&
                businessCompletionDetails.primaryCategory ? (
                  <TouchableHighlight style={{alignSelf: 'center'}}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        {backgroundColor: '#F36A46'},
                      ]}
                      onPress={() => {
                        businessInfoModalClose();
                        navigation.navigate('Profile');
                        setTimeout(() => {
                          navigation.navigate('SetupMainCategories');
                        }, 300);
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )} */}
              </TouchableOpacity>
            </ListItem>
          </List>
          {/* <List
            style={[
              commonStyle.mb15,
              {paddingVertical: 0, paddingHorizontal: 0},
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                {marginLeft: 0, marginBottom: 0, paddingLeft: 20},
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Additional categories
                  </Text>
                </Body>
                {businessCompletionDetails &&
                businessCompletionDetails.additionalCategories ? (
                  <TouchableHighlight style={{alignSelf: 'center'}}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{alignSelf: 'center'}}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        {backgroundColor: '#F36A46'},
                      ]}
                      onPress={() => {
                        businessInfoModalClose();
                        navigation.navigate('Profile');
                        setTimeout(() => {
                          navigation.navigate('SetupMainCategories');
                        }, 300);
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List> */}
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Setup your venue
                  </Text>
                  <Text style={commonStyle.grayText14}>
                    Setup your location of venue
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.businessDetails ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        navigation?.navigate('BusinessSettingsYourBusiness');
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        //   navigation.navigate('SetupBusiness');
                        // }, 300);
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Your services
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.services ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        // navigation.navigate('SetupService');
                        // }, 300);
                        navigation.navigate('BusinessSettingsService');
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Availability
                  </Text>
                  <Text style={commonStyle.grayText14}>
                    Setup your schedule
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.availability ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        //   navigation.navigate('SetupAvailability');
                        // }, 300);
                        navigation.navigate('BusinessSettingsAvailability');
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Contact details preferences
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.contact ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        //   navigation.navigate('SetupContacts');
                        // }, 300);
                        navigation.navigate('BusinessSettingsContacts');
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Terms of payment
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.paymentTerms ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        //   navigation.navigate('SetupTermsOfPayment');
                        // }, 300);

                        navigation.navigate('BusinessSettingsTermsOfPayment');
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Additional info
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.additionalInfo ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        //   navigation.navigate('SetupAdditionalInfo');
                        // }, 300);
                        navigation.navigate('BusinessSettingsAdditionalInfo');
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
          <List
            style={[
              commonStyle.mb15,
              { paddingVertical: 0, paddingHorizontal: 0 },
            ]}>
            <ListItem
              thumbnail
              style={[
                commonStyle.profileRoutingList,
                { marginLeft: 0, marginBottom: 0, paddingLeft: 20 },
              ]}>
              <TouchableOpacity
                style={commonStyle.accountListFlex}
                activeOpacity={1}>
                <Body style={commonStyle.accountListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                    Create FAQ
                  </Text>
                </Body>
                {businessCompletionDetails &&
                  businessCompletionDetails.proFaqs ? (
                  <TouchableHighlight style={{ alignSelf: 'center' }}>
                    <CheckedOrange />
                  </TouchableHighlight>
                ) : (
                  <View style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={[
                        commonStyle.unfollowbtn,
                        { backgroundColor: '#F36A46' },
                      ]}
                      onPress={() => {
                        // businessInfoModalClose();
                        // navigation.navigate('Profile');
                        // setTimeout(() => {
                        //   navigation.navigate('SetupFaq');
                        // }, 300);
                        navigation.navigate('BusinessSettingsFaq');
                      }}>
                      <Text
                        style={[
                          commonStyle.unfollowbtnText,
                          commonStyle.textWhite,
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </ListItem>
          </List>
        </View>
      </View>
    </View>
  );
};

export default CompleteProfileModal;
