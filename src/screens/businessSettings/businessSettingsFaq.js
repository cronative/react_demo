import React, { Fragment } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from 'native-base';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
import { useSelector } from 'react-redux';
import BusinessFaq from '../../components/businessSetting/businessFaq';

const BusinessSettingsFaq = ({ route }) => {
  const navigation = useNavigation();
  const loader = useSelector((state) => state.faqDetails.loader);

  const redirectUrlHandler = () => {
    navigation.goBack();
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer, commonStyle.pb1, { paddingTop: 0 }]}>
        <BusinessFaq isUpdate={true} redirectUrlHandler={redirectUrlHandler} />
        {/* <KeyboardAwareScrollView>
            <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>FAQ</Text>
            </View>
                <View style={commonStyle.categoriseListWrap}>

                <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                  <List style={commonStyle.payinCashinfowrap}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <View style={commonStyle.serviceListtouch}>
                        <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                          <Image source={require('../../assets/images/payincashicon.png')} style={commonStyle.payincashimg} resizeMode={'contain'}/> 
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                        <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                        Please do not forget to add a COVID-19 safety info
                        </Text>
                        </Body>
                      </View>
                    </ListItem>
                  </List>
                </View>

                    <View style={[commonStyle.setupCardBox, {marginBottom: 30}]}>
                        <Text style={commonStyle.subtextbold}>General FAQ</Text>

                        <TouchableOpacity style={commonStyle.generalFaqList} onPress={() => { setVisibleModal('FaqQuestionAddDialog'); }}>
                            <Text style={[commonStyle.blackTextR, {width:'90%'}]}>How Can I Check The Payment Method Of A Booking?</Text>
                            <TouchableHighlight><RightAngle/></TouchableHighlight>
                        </TouchableOpacity>
                        <TouchableOpacity style={commonStyle.generalFaqList} onPress={() => { setVisibleModal('FaqQuestionAddDialog'); }}>
                            <Text style={[commonStyle.blackTextR, {width:'90%'}]}>Is it safe to visit a venue now? </Text>
                            <TouchableHighlight><RightAngle/></TouchableHighlight>
                        </TouchableOpacity>
                        <TouchableOpacity style={commonStyle.generalFaqList} onPress={() => { setVisibleModal('FaqQuestionAddDialog'); }}>
                            <Text style={[commonStyle.blackTextR, {width:'90%'}]}>Do I need to bring my own mask and gloves? </Text>
                            <TouchableHighlight><RightAngle/></TouchableHighlight>
                        </TouchableOpacity>
                        <TouchableOpacity style={commonStyle.generalFaqList} onPress={() => { setVisibleModal('FaqQuestionAddDialog'); }}>
                            <Text style={[commonStyle.blackTextR, {width:'90%'}]}>Will I be provided with sanitiser in venue? </Text>
                            <TouchableHighlight><RightAngle/></TouchableHighlight>
                        </TouchableOpacity>

                        <View style={commonStyle.mt2}>
                          <TouchableOpacity style={[commonStyle.searchBarText, {alignSelf: 'flex-start'}]} onPress={() => { setVisibleModal('FaqQuestionAddDialog'); }}>
                            <TouchableHighlight>
                              <Text style={{fontSize: 36, fontFamily: 'SofiaPro-ExtraLight', lineHeight: 36, marginRight: 15}}>+</Text>
                            </TouchableHighlight> 
                            <Text style={commonStyle.blackTextR}>Add a question</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
          </KeyboardAwareScrollView>  */}
      </Container>

      {/* Setup Service modal start */}
      {/* <Modal
							isVisible={visibleModal === 'FaqQuestionAddDialog'}
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
                <TouchableOpacity style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]} onPress={() => setVisibleModal ({ visibleModal: null })}>
                  <Text style={{backgroundColor: '#ECEDEE', width: 75, height: 4, borderRadius: 2}}></Text>
                </TouchableOpacity>
									<ScrollView
                  ref={scrollViewRef}
                  onScroll={handleOnScroll}
									scrollEventThrottle={10}
									>
                    <FaqQuestionAddModal/>
									</ScrollView>
                  
                  <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
                      <Button 
                      title="Apply"
                      containerStyle={commonStyle.buttoncontainerothersStyle}
                      buttonStyle={commonStyle.commonbuttonStyle}
                      titleStyle={commonStyle.buttontitleStyle}
                      onPress={() => setVisibleModal ({ visibleModal: null })}
                      />
                  </View>
								</View>
        			</Modal> */}
      {/* Setup Service modal End */}
    </Fragment>
  );
};

export default BusinessSettingsFaq;
