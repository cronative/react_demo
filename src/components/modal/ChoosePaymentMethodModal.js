import {useNavigation} from '@react-navigation/core';
import {useFocusEffect} from '@react-navigation/native';
import {Body, Left, List, ListItem} from 'native-base';
import {default as React, useState, useEffect, useCallback} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import {useSelector} from 'react-redux';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {selectCardType} from '../../utility/booking';
import {CircleCheckedBoxActive, CircleCheckedBoxOutline} from '../icons';

const ChoosePaymentMethodModal = ({
  isVisible,
  setVisible,
  preDeposite,
  proMetaInfo,
  setPaymentMethod,
  paymentMethod,
  cardData,
  setCardData,
  cardsList,
  navigation,
  selectedServices,
}) => {
  const [selectedPayment, setSelectedPayment] = useState(undefined);
  const [isVirtual, setIsVirtual] = useState(false);

  useEffect(() => {
    if (selectedServices.findIndex((m) => m.isVirtualService == 1) != -1) {
      setIsVirtual(true);
    } else {
      setIsVirtual(false);
    }
    console.log('Services: ', selectedServices);
  }, [selectedServices]);

  const onSubmit = () => {
    if (selectedPayment > 3) {
      setPaymentMethod(2);
      if (!!cardsList && Array.isArray(cardsList)) {
        setCardData(cardsList.find((m) => m.id == +selectedPayment - 4));
      }
    } else {
      setPaymentMethod(selectedPayment);
      setCardData(undefined);
    }
    setVisible(false);
  };

  const onAddCreditCard = () => {
    setVisible(false);
    navigation.navigate('AddCreditCard', {
      preDeposite: preDeposite,
      isCash: selectedPayment == 1,
    });
  };

  const newCardRequiredForCashPayment = useCallback(() => {
    if (!!preDeposite && preDeposite != '') {
      if (!!cardsList && Array.isArray(cardsList) && cardsList.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }, [preDeposite, cardsList]);

  const radioButtonSelected = (index, value) => {
    setSelectedPayment(+value);
  };

  useEffect(() => {
    if (isVisible) {
      if (cardData) {
        setSelectedPayment(+cardData.id + 4);
      } else {
        setSelectedPayment(paymentMethod);
      }
    }
  }, [isVisible]);

  useEffect(() => {
    console.log('CardList: ', cardsList);
    console.log('Selected Payment: ', selectedPayment);
    console.log('proMeta: ', proMetaInfo);
    console.log('cardRequired: ', newCardRequiredForCashPayment());
  }, [selectedPayment]);

  return (
    <>
      <Modal
        isVisible={isVisible}
        onSwipeComplete={() => setVisible(false)}
        swipeThreshold={50}
        swipeDirection="down"
        animationType="slide"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={false}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.fff}>
          <View
            style={[
              commonStyle.modalContainer,
              {height: 'auto', maxHeight: 600, paddingTop: 10},
            ]}>
            {/* Modal Dismiss Button */}
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

            {/* Payment Options */}
            <View
              style={[
                commonStyle.dialogheadingbg,
                {borderBottomWidth: 0, paddingBottom: 10},
              ]}>
              <Text style={[commonStyle.modalforgotheading]}>
                Payment method
              </Text>
            </View>

            <View
            // style={[
            //   commonStyle.typeofServiceFilterWrap,
            //   commonStyle.mb05,
            //   {height: 360},
            // ]}
            >
              {/* Pay in Cash and Pay in App */}
              {!!proMetaInfo?.payInApp &&
                !!proMetaInfo?.payInCash &&
                !isVirtual && (
                  <RadioGroup
                    style={[commonStyle.setupradioGroup]}
                    color="#ffffff"
                    activeColor="#ffffff"
                    highlightColor={'#ffffff'}
                    selectedIndex={selectedPayment}
                    onSelect={radioButtonSelected}>
                    {!!cardsList &&
                      cardsList.map((card) => (
                        <RadioButton
                          key={card.id}
                          style={[commonStyle.setupradioButton]}
                          value={+card.id + 4}>
                          <View
                            style={
                              selectedPayment == +card.id + 4
                                ? commonStyle.radiocustomizeborderactive
                                : commonStyle.radiocustomizeborder
                            }>
                            <View style={commonStyle.searchBarText}>
                              <View style={commonStyle.haederback}>
                                <Image
                                  style={commonStyle.paymentmethodicon}
                                  source={selectCardType(card?.cardType)}
                                />
                              </View>
                              <Text style={commonStyle.blackTextR}>
                                ****{card?.cardNumber?.substr(15, 4)}
                              </Text>
                            </View>
                            <View>
                              {selectedPayment == +card.id + 4 ? (
                                <CircleCheckedBoxActive />
                              ) : (
                                <CircleCheckedBoxOutline />
                              )}
                            </View>
                          </View>
                        </RadioButton>
                      ))}
                    <RadioButton
                      style={[commonStyle.setupradioButton]}
                      value="1">
                      <View
                        style={
                          selectedPayment == 1
                            ? commonStyle.radiocustomizeborderactive
                            : commonStyle.radiocustomizeborder
                        }>
                        <View style={commonStyle.searchBarText}>
                          <View style={commonStyle.haederback}>
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../../assets/images/coin.png')}
                            />
                          </View>
                          <Text style={commonStyle.blackTextR}>
                            Pay in cash
                          </Text>
                        </View>
                        <View>
                          {selectedPayment == 1 ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </View>
                      {selectedPayment == 1 &&
                      !!preDeposite &&
                      preDeposite != '' ? (
                        <View style={commonStyle.paymentmethodinfoview}>
                          <List style={commonStyle.paymentmethodInfobg}>
                            <ListItem
                              thumbnail
                              style={commonStyle.categoriseListItem}>
                              <View style={commonStyle.serviceListtouch}>
                                <Left
                                  style={{
                                    marginRight: 8,
                                    alignSelf: 'flex-start',
                                  }}>
                                  <Image
                                    source={require('../../assets/images/payincashicon.png')}
                                    style={commonStyle.payincashimg}
                                    resizeMode={'contain'}
                                  />
                                </Left>
                                <Body style={commonStyle.categoriseListBody}>
                                  <Text
                                    style={[
                                      commonStyle.blackTextR,
                                      commonStyle.mb05,
                                    ]}>
                                    You need to add a credit or debit card to
                                    use the "Pay in cash" option. Pro charges a
                                    deposit of {preDeposite} ahead, the rest
                                    will be collected in-store after your
                                    booking.
                                  </Text>
                                </Body>
                              </View>
                            </ListItem>
                          </List>
                        </View>
                      ) : null}
                    </RadioButton>

                    <RadioButton style={commonStyle.setupradioButton} value="2">
                      <View
                        style={
                          selectedPayment == 2
                            ? commonStyle.radiocustomizeborderactive
                            : commonStyle.radiocustomizeborder
                        }>
                        <View style={commonStyle.searchBarText}>
                          <View style={commonStyle.haederback}>
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../../assets/images/credit-card.png')}
                            />
                          </View>
                          <Text style={commonStyle.blackTextR}>
                            Pay with Credit/Debit card
                          </Text>
                        </View>
                        <View>
                          {selectedPayment == 2 ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </View>
                    </RadioButton>

                    {/* <RadioButton style={commonStyle.setupradioButton} value="3">
                      <View
                        style={
                          selectedPayment == 3
                            ? commonStyle.radiocustomizeborderactive
                            : commonStyle.radiocustomizeborder
                        }>
                        <View style={commonStyle.searchBarText}>
                          <View style={commonStyle.haederback}>
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../../assets/images/paypal.png')}
                            />
                          </View>
                          <Text style={commonStyle.blackTextR}>PayPal</Text>
                        </View>
                        <View>
                          {selectedPayment == 3 ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </View>
                    </RadioButton> */}
                  </RadioGroup>
                )}

              {/* Pay in Cash Only */}
              {!proMetaInfo?.payInApp &&
                !!proMetaInfo?.payInCash &&
                !isVirtual && (
                  <RadioGroup
                    style={[commonStyle.setupradioGroup]}
                    color="#ffffff"
                    activeColor="#ffffff"
                    highlightColor={'#ffffff'}
                    selectedIndex={selectedPayment}
                    onSelect={radioButtonSelected}>
                    <RadioButton
                      style={[commonStyle.setupradioButton]}
                      value="1">
                      <View
                        style={
                          selectedPayment == 1
                            ? commonStyle.radiocustomizeborderactive
                            : commonStyle.radiocustomizeborder
                        }>
                        <View style={commonStyle.searchBarText}>
                          <View style={commonStyle.haederback}>
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../../assets/images/coin.png')}
                            />
                          </View>
                          <Text style={commonStyle.blackTextR}>
                            Pay in cash
                          </Text>
                        </View>
                        <View>
                          {selectedPayment == 1 ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </View>
                      {selectedPayment == 1 &&
                      !!preDeposite &&
                      preDeposite != '' ? (
                        <View style={commonStyle.paymentmethodinfoview}>
                          <List style={commonStyle.paymentmethodInfobg}>
                            <ListItem
                              thumbnail
                              style={commonStyle.categoriseListItem}>
                              <View style={commonStyle.serviceListtouch}>
                                <Left
                                  style={{
                                    marginRight: 8,
                                    alignSelf: 'flex-start',
                                  }}>
                                  <Image
                                    source={require('../../assets/images/payincashicon.png')}
                                    style={commonStyle.payincashimg}
                                    resizeMode={'contain'}
                                  />
                                </Left>
                                <Body style={commonStyle.categoriseListBody}>
                                  <Text
                                    style={[
                                      commonStyle.blackTextR,
                                      commonStyle.mb05,
                                    ]}>
                                    You need to add a credit or debit card to
                                    use the "Pay in cash" option. Pro charges a
                                    deposit of {preDeposite} ahead, the rest
                                    will be collected in-store after your
                                    booking.
                                  </Text>
                                </Body>
                              </View>
                            </ListItem>
                          </List>
                        </View>
                      ) : null}
                    </RadioButton>
                  </RadioGroup>
                )}

              {/* Pay in App Only */}
              {!!proMetaInfo?.payInApp &&
                (!proMetaInfo?.payInCash || isVirtual) && (
                  <RadioGroup
                    style={[commonStyle.setupradioGroup]}
                    color="#ffffff"
                    activeColor="#ffffff"
                    highlightColor={'#ffffff'}
                    selectedIndex={selectedPayment}
                    onSelect={radioButtonSelected}>
                    {!!cardsList &&
                      cardsList.map((card) => (
                        <RadioButton
                          key={card.id}
                          style={[commonStyle.setupradioButton]}
                          value={+card.id + 4}>
                          <View
                            style={
                              selectedPayment == +card.id + 4
                                ? commonStyle.radiocustomizeborderactive
                                : commonStyle.radiocustomizeborder
                            }>
                            <View style={commonStyle.searchBarText}>
                              <View style={commonStyle.haederback}>
                                <Image
                                  style={commonStyle.paymentmethodicon}
                                  source={selectCardType(card?.cardType)}
                                />
                              </View>
                              <Text style={commonStyle.blackTextR}>
                                ****{card?.cardNumber?.substr(15, 4)}
                              </Text>
                            </View>
                            <View>
                              {selectedPayment == +card.id + 4 ? (
                                <CircleCheckedBoxActive />
                              ) : (
                                <CircleCheckedBoxOutline />
                              )}
                            </View>
                          </View>
                        </RadioButton>
                      ))}

                    <RadioButton style={commonStyle.setupradioButton} value="2">
                      <View
                        style={
                          selectedPayment == 2
                            ? commonStyle.radiocustomizeborderactive
                            : commonStyle.radiocustomizeborder
                        }>
                        <View style={commonStyle.searchBarText}>
                          <View style={commonStyle.haederback}>
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../../assets/images/credit-card.png')}
                            />
                          </View>
                          <Text style={commonStyle.blackTextR}>
                            Pay with Credit/Debit card
                          </Text>
                        </View>
                        <View>
                          {selectedPayment == 2 ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </View>
                    </RadioButton>

                    {/* <RadioButton style={commonStyle.setupradioButton} value="3">
                      <View
                        style={
                          selectedPayment == 3
                            ? commonStyle.radiocustomizeborderactive
                            : commonStyle.radiocustomizeborder
                        }>
                        <View style={commonStyle.searchBarText}>
                          <View style={commonStyle.haederback}>
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../../assets/images/paypal.png')}
                            />
                          </View>
                          <Text style={commonStyle.blackTextR}>PayPal</Text>
                        </View>
                        <View>
                          {selectedPayment == 3 ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </View>
                    </RadioButton> */}
                  </RadioGroup>
                )}

              <View style={{height: 50}} />
            </View>
          </View>

          {/* Submit Buttons */}
          <View
            style={[
              commonStyle.footerwrap,
              commonStyle.staticModalContent,
              styles.modalFooter,
              {elevation: 50},
            ]}>
            <View style={[commonStyle.footerbtn]}>
              {((selectedPayment === 2 &&
                !!cardsList &&
                Array.isArray(cardsList) &&
                cardsList.length < 3) ||
                (selectedPayment === 1 && newCardRequiredForCashPayment())) && (
                <Button
                  title="Add Credit/Debit Card"
                  onPress={onAddCreditCard}
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.commonbuttonStyle}
                  titleStyle={commonStyle.buttontitleStyle}
                />
              )}
              {(selectedPayment >= 3 ||
                (selectedPayment === 1 &&
                  !newCardRequiredForCashPayment())) && (
                <Button
                  title="Apply"
                  onPress={onSubmit}
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.commonbuttonStyle}
                  titleStyle={commonStyle.buttontitleStyle}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  activeBadge: {
    backgroundColor: Colors.orange,
    padding: 4,
    height: 24,
    borderRadius: 24,
    marginHorizontal: 5,
  },
  modalFooter: {
    shadowColor: '#666',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
});

export default ChoosePaymentMethodModal;
