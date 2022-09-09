import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useRoute} from '@react-navigation/core';
import moment from 'moment';
import {Container, Content, List, ListItem, Body} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import {Button, Divider, Input, Text} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {Delete, Get} from '../../api/apiAgent';
import {Colors, default as commonStyle} from '../../assets/css/mainStyle';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import global from '../../components/commonservices/toast';
import {BookingFlowSignUpModal} from '../../components/modal';
import {professionalProfileDetailsRequest} from '../../store/actions';
import {
  addToCartRequest,
  getSlotsRequest,
  updateCartRequest,
} from '../../store/actions/bookingAction';
import CalendarModal from './CalendarModal';
import ServiceItem from './ServiceItem';
import ServiceListModal from './ServiceListModal';
import {LeftArrowAndroid, LeftArrowIos} from '../../components/icons';
import Ionicon from 'react-native-vector-icons/Ionicons';
const ServiceBookingList = ({navigation}) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const isFocused = useIsFocused();
  const navigationContainer = useSelector(
    (state) => state.navigationValueDetails.tempRoutes,
  );

  const [selectedServices, setServices] = useState([]);
  const loaderStatus = useSelector((state) => state.bookingReducer.loader);
  const cartError = useSelector((state) => state.bookingReducer.cartError);
  const addCartLoader = useSelector(
    (state) => state.bookingReducer.addCartLoader,
  );
  const bookingEdit = useSelector((state) => state.bookingReducer.bookingEdit);
  const [date, setDate] = useState('');
  const [isCommentFocus, setIsCommentFocus] = useState(false);
  const [comment, setComment] = useState('');
  const [currService, setCurrentService] = useState(null);
  const [modalVisible, setVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [sessionAvailibilities, setSessionAvailibilities] = useState([]);
  const [groupSessionId, setGroupSessionId] = useState(null);

  useEffect(() => {
    if (!professionalProfileDetailsData && dispatch)
      dispatch(professionalProfileDetailsRequest({proId: route.params?.proId}));
  }, [dispatch, professionalProfileDetailsData]);

  useEffect(() => {
    if (currService?.type == 2) {
      Get(`pro/group-sessions/${currService.id}`)
        .then(({data}) => {
          setSessionAvailibilities(data);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [currService]);

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      async () => {
        Delete('/user/cart')
          .then(async (response) => {
            console.log('Cart Deleted Successfully');
            await AsyncStorage.setItem(
              'navigationFromIndexToProPublicProfile',
              'true',
            );
          })
          .catch((error) => {
            console.log(error);
          });

        if (navigationContainer) {
          dispatch({type: 'CLEAR_NAVIGATION_ROUTE'});
        }
        navigation.goBack();
        if (route.params?.isRebook) {
          setTimeout(() => {
            navigation.goBack();
          }, 100);
        }
        return true;
      },
    );

    return () => {
      backHandlerdata.remove();
      setVisible(false);
      setCurrentService(null);
      dispatch({type: 'SET_BOOKING_EDIT', payload: false});
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (isFocused) {
        let cartData =
          navigationContainer || bookingEdit
            ? await AsyncStorage.getItem('cartData')
            : null;
        let prevSelectedServices;

        // console.log('cartData is', cartData);
        // setComment(cartData.comment);

        const selectedServices =
          professionalProfileDetailsData?.ProCategories?.reduce(
            (acc, category) => {
              const services = category?.Services;
              const service = services?.find(
                (service) => service.id === route.params?.serviceId,
              );

              if (service) setCurrentService(service);

              if (!navigationContainer && !bookingEdit) {
                setVisible(true);
              }

              return service ? [...acc, service] : acc;
            },
            [],
          );

        if (cartData && dispatch) {
          cartData = JSON.parse(cartData);

          prevSelectedServices = cartData?.selectedServices.map((s) => ({
            ...s,
            timeSlot: moment(s.timeSlot),
          }));
        }

        if (selectedServices.length == 0 && route.params?.isRebook) {
          global.showToast(
            'Professional does not offer the selected service anymore.',
            'info',
          );
        }

        if (professionalProfileDetailsData.id === cartData?.proInfo.id) {
          setServices(prevSelectedServices);
          setComment(cartData.comment);
          // global.showToast('Previous schedules loaded', 'success'); // Client told to remove
        } else {
          setServices(selectedServices);
          // setComment(cartData.comment);
        }
      }
    })();
  }, [
    professionalProfileDetailsData,
    route.params,
    bookingEdit,
    dispatch,
    isFocused,
  ]);

  useEffect(() => {
    if (confirming !== null) {
      if (!addCartLoader && cartError) {
        if (cartError.status === 401) {
          setSignupModal(true);
        }
        setConfirming(false);
      } else if (!addCartLoader && !cartError) {
        navigation.navigate('ConfirmBooking');
        dispatch({type: 'CLEAR_NAVIGATION_ROUTE'});
        setConfirming(false);
      }
    }
  }, [cartError, confirming, addCartLoader]);

  useEffect(() => {
    if (currService && currService.type != 2) {
      dispatch(getSlotsRequest({proId: route.params?.proId}));
    }
  }, [dispatch, route.params, currService]);

  const onAddMoreService = () => {
    let abort = false;
    selectedServices.forEach((m) => {
      if (!m.timeSlot) {
        global.showToast(
          'You must select timeslots for all services before adding new services to the cart',
          'error',
        );
        abort = true;
        return;
      }
    });
    if (!abort) setListVisible(true);
  };

  const isAdded = (service) => {
    return !!selectedServices.find((s) => service.id === s.id);
  };

  const goBackHandler = async () => {
    await AsyncStorage.removeItem('cartData');
    await AsyncStorage.setItem('navigationFromIndexToProPublicProfile', 'true');

    Delete('/user/cart')
      .then(async (response) => {
        console.log('Cart Deleted Successfully');
      })
      .catch((error) => {
        console.log(error);
      });

    if (navigationContainer) {
      dispatch({type: 'CLEAR_NAVIGATION_ROUTE'});
    }

    navigation.goBack();
    if (route.params?.isRebook) {
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    }
  };

  const onAddServiceFromModal = async (selectedService) => {
    if (!isAdded(selectedService)) {
      setServices([...selectedServices, selectedService]);
      setCurrentService(selectedService);
      setDate('');
      setVisible(true);
    } else {
      if (selectedServices.length === 1) {
        AsyncStorage.removeItem('cartData').then(async () => {
          Delete('/user/cart')
            .then(async (response) => {
              console.log('Cart Deleted Successfully');
              await AsyncStorage.setItem(
                'navigationFromIndexToProPublicProfile',
                'true',
              );
            })
            .catch((error) => {
              console.log(error);
            });

          if (navigationContainer) {
            dispatch({type: 'CLEAR_NAVIGATION_ROUTE'});
          }
          navigation.goBack();
          if (route.params?.isRebook) {
            setTimeout(() => {
              navigation.goBack();
            }, 100);
          }
        });
        return;
      }
      const newServices = selectedServices.filter((s, index) => {
        if (selectedService.id === s.id && index === 0) {
          setDate(selectedServices[index + 1].timeSlot);
        }
        return selectedService.id !== s.id;
      });
      setCurrentService(null);
      AsyncStorage.setItem(
        'cartData',
        JSON.stringify({
          selectedServices: newServices,
          proInfo: professionalProfileDetailsData,
          date,
          comment,
        }),
      );
      setServices(newServices);
    }
    setListVisible(false);
  };

  const onConfirm = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (
      !!currService &&
      currService.type == 2 &&
      (!groupSessionId || !selectedServices[0].timeSlot)
    ) {
      console.log(currService, groupSessionId);
      global.showToast('Please select session slot', 'error');
      return;
    }

    const str = JSON.stringify({
      selectedServices,
      proInfo: professionalProfileDetailsData,
      comment,
    });
    await AsyncStorage.setItem('cartData', str);

    if (
      !!currService &&
      currService.type == 2 &&
      groupSessionId &&
      !!accessToken
    ) {
      navigation.navigate('ConfirmBooking', {groupSessionId, comment});
      return;
    } else if (!accessToken) {
      setSignupModal(true);
    }

    let timeSlot;
    let error = false;
    const arr = selectedServices.map((s) => {
      if (timeSlot && !timeSlot.isSame(s.timeSlot, 'day')) error = true;

      timeSlot = s.timeSlot;
      return comment && comment !== ''
        ? {
            date: moment(s.timeSlot).utc().format('YYYY-MM-DD'),
            time: moment(s.timeSlot).utc().format('HH:mm:ss'),
            serviceId: s.id,
            comment: comment,
          }
        : {
            date: moment(s.timeSlot).utc().format('YYYY-MM-DD'),
            time: moment(s.timeSlot).utc().format('HH:mm:ss'),
            serviceId: s.id,
          };
    });
    if (!error) {
      if (!bookingEdit) {
        dispatch(
          addToCartRequest({
            bookedServices: arr,
            proUserId: professionalProfileDetailsData.id,
          }),
        );
      } else {
        dispatch(
          updateCartRequest({
            bookedServices: arr,
            proUserId: professionalProfileDetailsData.id,
          }),
        );
      }
      setConfirming(true);
    } else {
      global.showToast('The services must be on same day', 'error');
    }
  };

  const onServiceInputPress = (service) => {
    setCurrentService(service);
    setVisible(true);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loaderStatus ? <ActivityLoaderSolid /> : null}
      <Container style={[commonStyle.mainContainer, {paddingTop: 0}]}>
        <View
          style={[
            {
              paddingVertical: 10,
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',

              marginTop: Platform.OS === 'ios' ? 32 : 0,
            },
          ]}>
          <View style={{flex: 0.3}}>
            <Pressable
              hitSlop={20}
              onPress={() => {
                goBackHandler();
              }}>
              {Platform.OS === 'ios' ? (
                <Ionicon name="ios-chevron-back-sharp" size={32} />
              ) : (
                <LeftArrowAndroid />
              )}
            </Pressable>
          </View>
          <View style={{flex: 1, alignSelf: 'center'}}>
            <Text style={[commonStyle.blackText16, {textAlign: 'center'}]}>
              Booking
            </Text>
          </View>
          <View style={{flex: 0.3}}></View>
        </View>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.horizontalPadd, {marginTop: 15}]}>
            <Text style={[commonStyle.blackTextR]}>Choose a service</Text>
          </View>
          <View style={[commonStyle.horizontalPadd]}>
            <View
              style={[
                commonStyle.setupCardBox,
                {
                  marginTop: 15,
                  borderWidth: 1,
                  borderColor: '#ECEDEE',
                  borderBottomColor: '#fff',
                },
              ]}>
              <FlatList
                data={selectedServices}
                renderItem={({item}) => (
                  <ServiceItem
                    service={item}
                    active={currService?.id === item.id}
                    onPress={onServiceInputPress}
                    removeService={onAddServiceFromModal}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <Divider style={{marginVertical: 10}} />
                )}
              />
              {selectedServices?.[0]?.type != 2 && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={onAddMoreService}>
                  <Text
                    style={[
                      commonStyle.text14bold,
                      commonStyle.colorOrange,
                      styles.addBtnText,
                    ]}>
                    + Add service
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View
            style={[
              commonStyle.mb2,
              commonStyle.sectionContainer,
              {position: 'relative'},
            ]}>
            <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
              Leave a comment (it’s optional)
            </Text>
            {/* <Input
              value={currService?.comment}
              onChangeText={(val) => setComment(val)}
              maxLength={200}
              multiline={true}
              numberOfLines={5}
              style={{textAlignVertical: 'top'}}
              inputContainerStyle={[
                commonStyle.textInput,
                commonStyle.textareainput,
              ]}
            /> */}
            <TextInput
              style={[
                commonStyle.textInput,
                commonStyle.textareainput,
                isCommentFocus && commonStyle.focusinput,
              ]}
              value={comment}
              onChangeText={(val) => setComment(val)}
              onFocus={() => setIsCommentFocus(true)}
              returnKeyType="done"
              keyboardType="default"
              autoCapitalize={'none'}
              multiline={true}
              numberOfLines={6}
              maxLength={500}
              blurOnSubmit={true}
              onSubmitEditing={(e) => {
                console.log('On Submit Editing');
                e.target.blur();
              }}
            />
            {!!comment && (
              <Text style={[commonStyle.textlength, {right: 40, bottom: 15}]}>
                {comment.length ?? 0}/500
              </Text>
            )}
          </View>

          <View style={{height: 60}}></View>

          {modalVisible && currService && (
            <CalendarModal
              setVisible={setVisible}
              isVisible={modalVisible}
              date={date}
              setDate={setDate}
              service={currService}
              selectedServices={selectedServices}
              setServices={setServices}
              sessionAvailibilities={sessionAvailibilities}
              setGroupSessionId={setGroupSessionId}
            />
          )}
          {listVisible && (
            <ServiceListModal
              setVisible={setListVisible}
              isVisible={listVisible}
              selectedServices={selectedServices}
              setServices={setServices}
              onAdd={onAddServiceFromModal}
            />
          )}
          {signupModal && (
            <BookingFlowSignUpModal
              isVisible={signupModal}
              setVisible={setSignupModal}
              bookingProId={route?.params?.proId}
              bookingServiceId={route.params?.serviceId}
            />
          )}
        </KeyboardAwareScrollView>
      </Container>
      {!loaderStatus && selectedServices.length > 0 && (
        <View style={[commonStyle.footerwrap, commonStyle.modalContent]}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Proceed to Confirmation"
              onPress={onConfirm}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
            />
          </View>
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  crossBtn: {
    elevation: 6,
    padding: 3,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  card: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 20,
    padding: 15,
    marginTop: 15,
  },
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addBtnText: {
    fontWeight: '700',
    alignSelf: 'center',
  },
  addBtn: {
    marginTop: 15,
    paddingTop: 15,
    borderTopColor: Colors.lightgray,
    borderTopWidth: 1,
  },
  inputContainerStyle: {
    marginTop: 10,
    marginHorizontal: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 6,
    borderColor: Colors.lightgray,
    fontFamily: 'SofiaPro',
  },
  watingTime: {
    backgroundColor: '#E9F3FD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default ServiceBookingList;
