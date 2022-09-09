import { useNavigation } from '@react-navigation/native';
import { Body, Left, List, ListItem } from 'native-base';
import React from 'react';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import ReadMore from 'react-native-read-more-text';
import { useSelector } from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
import { timeConversion } from '../../utility/commonService';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';
import { TouchableHighlight } from 'react-native-gesture-handler';
import global from '../../components/commonservices/toast';

const ServicesTab = ({ isOwnProfile, subscriptionStatus }) => {
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const navigation = useNavigation();

  return (
    <View>
      {professionalProfileDetailsData &&
        professionalProfileDetailsData.ProCategories ? (
        <View>
          {professionalProfileDetailsData.ProCategories.length ? (
            professionalProfileDetailsData.ProCategories.map(
              (eachCategory, pIndex) => (
                <View
                  key={pIndex}
                  style={[commonStyle.setupCardBox, commonStyle.mt2]}>
                  <Text style={[commonStyle.subtextbold, commonStyle.mb2]}>
                    {eachCategory.categoryName || 'NA'} (
                    {(eachCategory.Services && eachCategory.Services.length) ||
                      0}
                    )
                  </Text>
                  {eachCategory.Services && eachCategory.Services.length ? (
                    eachCategory.Services.map((eachServices, cIndex) => (
                      <List style={[commonStyle.setupserviceList]} key={cIndex}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          {eachServices?.imageUrl?.length ? (
                            <Left>
                              <Image
                                source={{
                                  uri: eachServices?.imageUrl,
                                }}
                                resizeMode="cover"
                                style={commonStyle.serviceImage}
                                defaultSource={require('../../assets/images/default-new.png')}
                              />
                            </Left>
                          ) : null}
                          <View style={commonStyle.serviceListtouch}>
                            <Body style={commonStyle.categoriseListBody}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'stretch',
                                }}>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    commonStyle.mb1,
                                    { maxWidth: '100%' },
                                  ]}
                                  numberOfLines={3}>
                                  {eachServices.name}
                                </Text>
                                {/* <View style={{marginTop: 3}}>
                                  {eachServices?.type === 2 && (
                                    <TouchableHighlight
                                      style={[
                                        commonStyle.paidbtn,
                                        {marginLeft: 10},
                                      ]}>
                                      <Text
                                        style={[
                                          commonStyle.paidbtntext,
                                          {fontSize: 8},
                                        ]}>
                                        Group Session
                                      </Text>
                                    </TouchableHighlight>
                                  )}
                                </View> */}
                              </View>
                              <View style={commonStyle.searchBarText}>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    { marginRight: 4 },
                                  ]}>
                                  {eachServices.duration
                                    ? timeConversion(eachServices.duration)
                                    : 'NA'}
                                </Text>
                                <Text style={commonStyle.dotSmall}>.</Text>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    { marginLeft: 4 },
                                  ]}>
                                  {eachServices.amount
                                    ? `$${eachServices.amount}`
                                    : 'NA'}
                                </Text>
                                {eachServices?.type === 2 && (
                                  <>
                                    <Text style={commonStyle.dotSmall}>.</Text>
                                    <Text
                                      style={[
                                        commonStyle.blackTextR,
                                        { marginLeft: 4 },
                                      ]}>
                                      Group Session
                                    </Text>
                                  </>
                                )}
                              </View>
                            </Body>
                            {!isOwnProfile && (
                              <View style={{ alignSelf: 'flex-start' }}>
                                <TouchableOpacity
                                  style={[
                                    commonStyle.unfollowbtn,
                                    { marginLeft: 5, paddingHorizontal: 18 },
                                  ]}
                                  onPress={() => {
                                    if (subscriptionStatus === 0) {
                                      global.showToast(
                                        "You can't make bookings with this pro at this moment.",
                                        'error',
                                      );
                                      return false;
                                    }
                                    !isOwnProfile
                                      ? navigation.navigate('BookService', {
                                        proId:
                                          professionalProfileDetailsData.id,
                                        serviceId: eachServices.id,
                                      })
                                      : null;
                                  }}>
                                  <Text style={commonStyle.unfollowbtnText}>
                                    Book
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </ListItem>
                        {eachServices.description ? (
                          <View style={commonStyle.mt1}>
                            <ReadMore
                              numberOfLines={3}
                              renderTruncatedFooter={renderReadMore}
                              renderRevealedFooter={renderShowLess}
                              onReady={handleTextReady}>
                              <Text style={commonStyle.grayText14}>
                                {eachServices.description}
                              </Text>
                            </ReadMore>
                          </View>
                        ) : null}
                      </List>
                    ))
                  ) : (
                    <Text
                      style={[commonStyle.grayText16, commonStyle.textCenter]}>
                      No Services yet
                    </Text>
                  )}
                </View>
              ),
            )
          ) : (
            <View style={commonStyle.noMassegeWrap}>
              <View
                style={[commonStyle.nodatabg, { backgroundColor: '#FDF5ED' }]}>
                <Image
                  style={[commonStyle.nodataimg]}
                  source={require('../../assets/images/no-review.png')}
                />
              </View>
              <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                No categories yet
              </Text>
            </View>
          )}
        </View>
      ) : (
        <ActivityLoader />
      )}
    </View>
  );
};

export default ServicesTab;
