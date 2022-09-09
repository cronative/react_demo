import React, {
  Fragment,
  useState,
  // useEffect, RefObject, useRef
} from 'react';
import {
  // ScrollView, Dimensions, TextInput, View, Text,
  StatusBar,
  Image,
  // TouchableOpacity, StyleSheet, TouchableHighlight, ImageBackground, Image
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  // Footer, List, ListItem, Body, Left, Right
} from 'native-base';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import Modal from 'react-native-modal';
// import { Button } from 'react-native-elements';
import {FAB} from 'react-native-paper';
// import {MenuBar, MoreVertical, EditIcon, DownArrow} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
// import {AddNewCategoryModal} from '../../components/modal';
// import {SetupServiceListData} from '../../utility/staticData';
// import circleWarningImg from '../../assets/images/warning.png';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import ServiceDetails from '../../components/businessSetting/serviceDeails';

const BusinessSettingsService = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  // const [visibleModal, setVisibleModal] = useState(false);
  // const [scrollOffset, setScrollOffset] = useState();
  // const scrollViewRef = useRef(0);

  /**
   * This method will call on Modal show hide.
   */
  // const handleOnScroll = event => {
  //   setScrollOffset(event.nativeEvent.contentOffset.y);
  // };
  // const handleScrollTo = p => {
  // 	if (scrollViewRef.current) {
  // 	  scrollViewRef.current.scrollTo(p);
  // 	}
  // };
  /**
   * =======================.
   */

  // const showMsgModal = () => {
  //   setVisibleModal(true);
  //   setTimeout(() => {
  //     setVisibleModal(false);
  //   }, 10000);
  // };

  // function FlotingAddIcon() {
  //   return (
  //     <Image
  //       style={{
  //         resizeMode: 'contain',
  //         width: 22,
  //         height: 22,
  //         alignItems: 'center',
  //         alignSelf: 'center',
  //       }}
  //       source={require('../../assets/images/add-orange.png')}
  //     />
  //   );
  // }

  const redirectUrlHandler = () => {
    navigation.goBack();
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
        <ServiceDetails
          isUpdate={true}
          setLoader={setLoader}
          redirectUrlHandler={redirectUrlHandler}
        />
        {/* <KeyboardAwareScrollView>
            <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>Your services</Text>
            <Text style={commonStyle.grayText16}>Drag services up or down to reorder or change category</Text>
            </View>
              <View style={[commonStyle.categoriseListWrap, commonStyle.mb7]}>
                <View>
                  <View style={commonStyle.servicecatItem}>
                    <View style={commonStyle.searchBarText}>
                      <TouchableHighlight> 	
                        <MenuBar/>
                      </TouchableHighlight>
                      <Text style={[commonStyle.dotLarge, {backgroundColor: '#FF9589'}]}>.</Text>
                      <Text style={commonStyle.subtextblack}>Make Up</Text>
                    </View>
                    <TouchableOpacity style={commonStyle.moreInfoCircle} onPress={() => { setVisibleModal('ServicesInfoDialog'); }}>
                        <MoreVertical/>
                    </TouchableOpacity>
                  </View>

                    <View style={[commonStyle.setupCardBox]}>
                    {SetupServiceListData.map((item, index) => (
                    <List key={index} style={commonStyle.setupserviceList}>
                        <ListItem thumbnail style={commonStyle.categoriseListItem}>
                          <View style={commonStyle.serviceListtouch}>
                            <Left style={{marginLeft:-4, marginRight: 20, alignSelf: 'flex-start'}}>
                              <MenuBar/>
                            </Left>
                            <Body style={commonStyle.categoriseListBody}>
                            <Text style={[commonStyle.blackTextR, commonStyle.mb1]} numberOfLines={1}>{item.SetupServiceName}</Text>
                            <View style={commonStyle.searchBarText}>
                              <Text style={[commonStyle.blackTextR,{marginRight:4}]}>{item.serviceTime}</Text>
                              <Text style={commonStyle.dotSmall}>.</Text>
                              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>${item.servicePrice}</Text>
                              {item.serviceplatfrom ?
                              <Text style={commonStyle.dotSmall}>.</Text> : null }
                              {item.serviceplatfrom ?
                              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>{item.serviceplatfrom}</Text> : null }
                            </View>
                            </Body>
                            <View style={{alignSelf: 'flex-start',}}>
                            <TouchableOpacity style={commonStyle.moreInfoCircle}>
                                <EditIcon/>
                            </TouchableOpacity>
                            </View>
                          </View>
                        </ListItem>
                          <View style={[commonStyle.paymentmethodInfobg, commonStyle.mt2]}>
                              <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>
                              Please update the dates for this group session to list it for online bookings
                              </Text>
                          </View>

                      </List>
                    ))}
                      <View>
                      <TouchableOpacity style={[commonStyle.searchBarText, {alignSelf: 'flex-start'}]}>
                      <TouchableHighlight>
                        <Text style={[commonStyle.plusText, {marginRight: 15}]}>+</Text>
                      </TouchableHighlight> 
                      <Text style={commonStyle.blackTextR}>Add a service</Text>
                      </TouchableOpacity>
                      </View>

                    </View>
                  </View>

                <View>
                  <View style={commonStyle.servicecatItem}>
                    <View style={commonStyle.searchBarText}>
                      <TouchableHighlight> 	
                        <MenuBar/>
                      </TouchableHighlight>
                      <Text style={[commonStyle.dotLarge, {backgroundColor: '#828FE6'}]}>.</Text>
                      <Text style={commonStyle.subtextblack}>Hair</Text>
                    </View>
                    <TouchableOpacity style={commonStyle.moreInfoCircle} onPress={() => { setVisibleModal('ServicesInfoDialog'); }}>
                        <MoreVertical/>
                    </TouchableOpacity>
                  </View>

                    <View style={[commonStyle.setupCardBox]}>
                    {SetupServiceListData.map((item, index) => (
                    <List key={index} style={commonStyle.setupserviceList}>
                        <ListItem thumbnail style={commonStyle.categoriseListItem}>
                          <View style={commonStyle.serviceListtouch}>
                            <Left style={{marginLeft:-4, marginRight: 20, alignSelf: 'flex-start'}}>
                              <MenuBar/>
                            </Left>
                            <Body style={commonStyle.categoriseListBody}>
                            <Text style={[commonStyle.blackTextR, commonStyle.mb1]} numberOfLines={1}>{item.SetupServiceName}</Text>
                            <View style={commonStyle.searchBarText}>
                              <Text style={[commonStyle.blackTextR,{marginRight:4}]}>{item.serviceTime}</Text>
                              <Text style={commonStyle.dotSmall}>.</Text>
                              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>${item.servicePrice}</Text>
                              {item.serviceplatfrom ?
                              <Text style={commonStyle.dotSmall}>.</Text> : null }
                              {item.serviceplatfrom ?
                              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>{item.serviceplatfrom}</Text> : null }
                            </View>
                            </Body>
                            <View style={{alignSelf: 'flex-start',}}>
                            <TouchableOpacity style={commonStyle.moreInfoCircle}>
                                <EditIcon/>
                            </TouchableOpacity>
                            </View>
                          </View>
                        </ListItem>
                      </List>
                    ))}
                      <View>
                      <TouchableOpacity style={[commonStyle.searchBarText, {alignSelf: 'flex-start'}]}>
                      <TouchableHighlight>
                        <Text style={{fontSize: 36, fontFamily: 'SofiaPro-ExtraLight', lineHeight: 36, marginRight: 15}}>+</Text>
                      </TouchableHighlight> 
                      <Text style={commonStyle.blackTextR}>Add a service</Text>
                      </TouchableOpacity>
                      </View>

                    </View>
                  </View>               
              </View>
          </KeyboardAwareScrollView> 
           
            <FAB
              style={commonStyle.floting}
              icon={props => <FlotingAddIcon {...props}/>}
              onPress={() => { setVisibleModal('AddNewCategoryDialog'); }}
            /> */}
        {/* <FAB
          style={commonStyle.floting}
          icon={(props) => <FlotingAddIcon {...props} />}
          onPress={() => {
            setVisibleModal('AddNewCategoryDialog');
          }}
        /> */}
      </Container>

      {/* Add category modal start */}
      {/* <Modal
							isVisible={visibleModal === 'AddNewCategoryDialog'}
							onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
							swipeDirection="down"
              scrollTo={handleScrollTo}
							scrollOffset={scrollOffset}
							scrollOffsetMax={500 - 100}
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              propagateSwipe={true}
							style={commonStyle.bottomModal}
						>
							<View style={commonStyle.scrollableModal}>
                <View style={[commonStyle.termswrap, commonStyle.mt2]}>
                  <Text style={{backgroundColor: '#ECEDEE', width: 75, height: 4, borderRadius: 2}}></Text>
                </View>
									<ScrollView
                  ref={scrollViewRef}
                  onScroll={handleOnScroll}
									scrollEventThrottle={10}
									>
                    <AddNewCategoryModal/>
									</ScrollView>
                  
                  <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
                      <Button 
                      title="Save"
                      containerStyle={commonStyle.buttoncontainerothersStyle}
                      buttonStyle={commonStyle.commonbuttonStyle}
                      titleStyle={commonStyle.buttontitleStyle}
                      onPress={() => setVisibleModal ({ visibleModal: null })}
                      />
                  </View>
								</View>
        			</Modal> */}
      {/* Choose Area modal end */}

      {/* Setup Service modal start */}
      {/* <Modal
							isVisible={visibleModal === 'ServicesInfoDialog'}
							onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
							swipeDirection="down"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              propagateSwipe={true}
							style={commonStyle.othersbottomModal}
						>
							<View>
                  <View style={commonStyle.othersModal}>
                  <TouchableOpacity onPress={() => { setVisibleModal('ServicesAddGroupDialog'); }} style={[commonStyle.searchBarText, {borderBottomWidth: 1, borderBottomColor: '#dcdcdc', padding: 12}]}>
                    <TouchableHighlight style={commonStyle.haederback}> 	
                      <Image style={commonStyle.paymentmethodicon} source={require('../../assets/images/add-orange.png')}/>
                    </TouchableHighlight>
                    <Text style={commonStyle.blackTextR}>Add a service</Text>  
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setVisibleModal('AddNewCategoryDialog'); }} style={[commonStyle.searchBarText, {borderBottomWidth: 1, borderBottomColor: '#dcdcdc', padding: 12}]}>
                    <TouchableHighlight style={commonStyle.haederback}> 	
                      <Image style={commonStyle.paymentmethodicon} source={require('../../assets/images/edit-orange.png')}/>
                    </TouchableHighlight>
                    <Text style={commonStyle.blackTextR}>Edit category</Text>  
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {showMsgModal();}} style={[commonStyle.searchBarText, {padding: 12}]}>
                    <TouchableHighlight style={commonStyle.haederback}> 	
                      <Image style={commonStyle.paymentmethodicon} source={require('../../assets/images/trash-orange.png')}/>
                    </TouchableHighlight>
                    <Text style={commonStyle.blackTextR}>Delete category</Text>  
                  </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={commonStyle.modalcancle} activeOpacity={0.9} onPress={() => setVisibleModal ({ visibleModal: null })}>
                    <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
                  </TouchableOpacity>
								</View>
        			</Modal> */}
      {/* Setup Service modal End */}

      {/* Setup Service modal start */}
      {/* <Modal
							isVisible={visibleModal === 'ServicesAddGroupDialog'}
							onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
							swipeDirection="down"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              propagateSwipe={true}
							style={commonStyle.othersbottomModal}
						>
							<View>
                  <View style={commonStyle.othersModal}>
                  <TouchableOpacity style={[commonStyle.searchBarText, {borderBottomWidth: 1, borderBottomColor: '#dcdcdc', padding: 12}]}>
                    <TouchableHighlight style={commonStyle.haederback}> 	
                      <Image style={commonStyle.paymentmethodicon} source={require('../../assets/images/calendar-orange.png')}/>
                    </TouchableHighlight>
                    <Text style={commonStyle.blackTextR}>Regular service</Text>  
                  </TouchableOpacity>
                  <TouchableOpacity style={[commonStyle.searchBarText, {padding: 12}]}>
                    <TouchableHighlight style={commonStyle.haederback}> 	
                      <Image style={commonStyle.paymentmethodicon} source={require('../../assets/images/users-orange.png')}/>
                    </TouchableHighlight>
                    <Text style={commonStyle.blackTextR}>Group session</Text>
                    <TouchableHighlight style={[commonStyle.paidbtn, {marginLeft: 10}]}>
                      <Text style={commonStyle.paidbtntext}>Pro feature</Text>
                    </TouchableHighlight>    
                  </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={commonStyle.modalcancle} activeOpacity={0.9} onPress={() => setVisibleModal ({ visibleModal: null })}>
                    <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
                  </TouchableOpacity>
								</View>
        		</Modal> */}
      {/* Setup Service modal End */}

      {/* Delete category Message modal start */}
      {/* <Modal
            visible={visibleModal}
            onRequestClose={() => {
              console.log('Modal has been closed.');
            }}
            transparent
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            style={commonStyle.centerModal}
          >
            <View style={commonStyle.centerModalBody}>
            <View style={commonStyle.modalContent}>
              <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
                <Image source={circleWarningImg} style={commonStyle.messageimg}/>
              </View>
              <Text style={[commonStyle.subtextblack, commonStyle.textCenter, commonStyle.mb2]}>You can’t remove this category</Text>
              <Text style={[commonStyle.grayText16, commonStyle.textCenter, commonStyle.mb2]}>You have 5 services listed on Make Up category. Drag services to other categories or delete them first to change these settings</Text>
            </View>
            </View>
          </Modal> */}
      {/* Delete category Message modal end */}
    </Fragment>
  );
};

export default BusinessSettingsService;
