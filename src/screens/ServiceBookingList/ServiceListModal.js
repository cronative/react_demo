import {Body, Left, List, ListItem} from 'native-base';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import ReadMore from 'react-native-read-more-text';
import {useSelector} from 'react-redux';
import {Colors, default as commonStyle} from '../../assets/css/mainStyle';
import {timeConversion} from '../../utility/commonService';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';
import {TouchableHighlight} from 'react-native-gesture-handler';
import RNModal from 'react-native-modal';

export default function ServiceListModal({
  isVisible,
  setVisible,
  selectedServices,
  setServices,
  onAdd,
}) {
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const disableGroupServices = !!selectedServices.find((s) => s.type === 1);

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );

  const isAdded = (service) => {
    return !!selectedServices.find((s) => service.id === s.id);
  };

  return (
    <RNModal
      // animationType="slide"
      transparent={true}
      isVisible={isVisible}
      onSwipeComplete={() => setVisible(false)}
      swipeThreshold={50}
      swipeDirection="down"
      hasBackdrop={true}
      avoidKeyboard={true}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={500 - 100}
      propagateSwipe={true}
      backdropColor="rgba(0,0,0,0.5)"
      style={commonStyle.bottomModal}>
      <View>
        <View style={[styles.container, {paddingTop: 10}]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mb1, {height: 15}]}
            onPress={() => setVisible(!isVisible)}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <View>
            <Text style={[commonStyle.subtextblack, styles.headerContainer]}>
              Add Service
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            {professionalProfileDetailsData.ProCategories?.length ? (
              professionalProfileDetailsData.ProCategories.map(
                (eachCategory, pIndex) => (
                  <View
                    key={pIndex}
                    style={[commonStyle.mt2, commonStyle.ml1, commonStyle.mrl]}>
                    <Text style={[commonStyle.subtextbold, commonStyle.mb2]}>
                      {eachCategory.categoryName || 'NA'} (
                      {(eachCategory.Services &&
                        eachCategory.Services.length) ||
                        0}
                      )
                    </Text>
                    {eachCategory.Services?.length ? (
                      eachCategory.Services.map((eachServices, cIndex) => (
                        <List
                          style={[commonStyle.setupserviceList]}
                          key={cIndex}>
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
                                      {maxWidth: '60%'},
                                    ]}
                                    numberOfLines={1}>
                                    {eachServices.name}
                                  </Text>
                                  <View style={{marginTop: 3}}>
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
                                  </View>
                                </View>

                                <View style={commonStyle.searchBarText}>
                                  <Text
                                    style={[
                                      commonStyle.blackTextR,
                                      {marginRight: 4},
                                    ]}>
                                    {eachServices.duration
                                      ? timeConversion(eachServices.duration)
                                      : 'NA'}
                                  </Text>
                                  {/* <Text style={commonStyle.dotSmall}>.</Text> */}
                                  <Text>·</Text>
                                  <Text
                                    style={[
                                      commonStyle.blackTextR,
                                      {marginLeft: 4},
                                    ]}>
                                    {eachServices.amount
                                      ? `$${eachServices.amount}`
                                      : 'NA'}
                                  </Text>
                                </View>
                              </Body>
                              <View style={{alignSelf: 'flex-start'}}>
                                <TouchableOpacity
                                  style={[
                                    isAdded(eachServices)
                                      ? styles.addButtonContainer
                                      : commonStyle.unfollowbtn,
                                    {
                                      marginLeft: 5,
                                      paddingHorizontal: 18,
                                    },
                                    eachServices.type === 2 &&
                                      disableGroupServices && {
                                        backgroundColor: Colors.textgray,
                                      },
                                  ]}
                                  //Start Change: Snehasish Das Issue #1606
                                  onPress={() => {
                                    if (!isAdded(eachServices)) {
                                      onAdd(eachServices);
                                    }
                                  }}
                                  disabled={
                                    (eachServices.type === 2 &&
                                      disableGroupServices) ||
                                    isAdded(eachServices)
                                  }
                                  //End Change: Snehasish Das Issue #1606
                                >
                                  <Text
                                    style={[
                                      commonStyle.unfollowbtnText,
                                      isAdded(eachServices) && {
                                        color: Colors.white,
                                      },
                                      eachServices.type === 2 &&
                                        disableGroupServices && {
                                          color: Colors.white,
                                        },
                                    ]}>
                                    {isAdded(eachServices) ? 'Added' : 'Add'}
                                  </Text>
                                </TouchableOpacity>
                              </View>
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
                        style={[
                          commonStyle.grayText16,
                          commonStyle.textCenter,
                        ]}>
                        No Services yet{' '}
                      </Text>
                    )}
                  </View>
                ),
              )
            ) : (
              <View style={commonStyle.noMassegeWrap}>
                <View
                  style={[commonStyle.nodatabg, {backgroundColor: '#FDF5ED'}]}>
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
          </ScrollView>
          {/* <View style={{height: 60}}></View> */}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 20,
    paddingBottom: 10,
    height: Dimensions.get('window').height - 120,
    width: '100%',
    elevation: 10,
  },
  headerContainer: {
    alignSelf: 'center',
  },
  listContainer: {
    marginHorizontal: 10,
  },
  addButtonContainer: {
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
});
