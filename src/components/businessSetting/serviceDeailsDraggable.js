import { Body, Left, List, ListItem } from 'native-base';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements';
import RNModal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FAB } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Delete, Get, Post, Put } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import circleWarningImg from '../../assets/images/warning.png';
import { addGroupSessionClear } from '../../store/actions/groupSessionAction';
import { DurationTimeData } from '../../utility/staticData';
import global from '../commonservices/toast';
import { EditIcon, MenuBar, MoreVertical } from '../icons';
import {
  AddOrEditCategoryModal,
  GroupSessionAddModal,
  SetupServiceAddModal,
} from '../modal';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { ScrollView } from 'react-native-gesture-handler';

const initialData = [
  {
    id: 1,
    category: 'Make Up',
    subcatitems: [
      {
        name: 'Pratick',
        durationText: 'Change services',
        amount: 152,
      },
      {
        name: 'Santuw',
        durationText: 'Change categories',
        amount: 150,
      },
    ],
  },
  {
    id: 2,
    category: 'Hair',
    subcatitems: [
      {
        name: 'Debashish',
        durationText: 'Test Content',
        amount: 150,
      },
      {
        name: 'Santu',
        durationText: 'Workout Test',
        amount: 150,
      },
      {
        name: 'Snehasish',
        durationText: 'Services and categories',
        amount: 150,
      },
    ],
  },
  {
    id: 3,
    category: 'Nails',
    subcatitems: [
      {
        name: 'Pratickaa',
        durationText: 'Change categories',
        amount: 150,
      },
      {
        name: 'Santudd',
        durationText: 'Workout Test',
        amount: 150,
      },
      {
        name: 'Snehasishrr',
        durationText: 'Services Tesy',
        amount: 150,
      },
    ],
  },
];

const ServiceDetails = ({ isUpdate, setLoader, redirectUrlHandler }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const [editableValues, setEditableValues] = useState(null);
  const dispatch = useDispatch();

  const [mainCategoryServises, setMainCategoryServises] = useState([]);
  const [subCategoryServises, setSubCategoryServises] = useState([]);
  const [deletedServices, setDeletedServices] = useState([]);
  const [errorAlert, setErrorMsg] = useState(null);

  const scrollViewRef = useRef(0);
  const [parentIndex, setParentIndex] = useState();
  const [childIndex, setChildIndex] = useState();
  const [isParentCategory, setIsParentCategory] = useState('');
  const [isUpdatedData, setIsUpdatedData] = useState(false);
  // const [submittedServiceList, setSubmittedServiceList] = useState();

  const [visibleAddOrUpdateCategoryModal, setVisibleAddOrUpdateCategoryModal] =
    useState(false);
  const [visibleCategoryInfoModal, setVisibleCategoryInfoModal] =
    useState(false);
  const [visibleServicesTypeModal, setVisibleServicesTypeModal] =
    useState(false);
  const [serviceType, setServiceType] = useState();
  const [categoryInfoDetails, setCategoryInfoDetails] = useState();
  const [businessDetails, setBusinessDetails] = useState();
  const initialFaltListRef = React.createRef();
  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const setupServiceSubmitHandler = () => {
    let tempArray = [];
    const tempMainCategory = [...mainCategoryServises];
    const tempSubCategory = [...subCategoryServises];
    tempMainCategory.map((eachCategory, pindex) => {
      if (eachCategory.services.length) {
        eachCategory.services.map((item, cindex) => {
          let tempObject = {
            proCategoryId: eachCategory.id,
            // type: serviceType === 'regular' ? 1 : 2,
            type: 1,
            name: item.name,
            duration: item.duration,
            currency: 'USD',
            // description: item.description,
            amount: item.amount,
            orderArrange: 0,
            isMobileService: item.isMobileService ? 1 : 0,
            // isVirtualService: item.isMobileService?1:0
            extraTime: item.extraTime ? 1 : 0,
            // extraTimeDuration: item.extraTimeDuration || '',
          };
          if (isUpdatedData) {
            tempObject.id = item.id || 0;
          }
          if (item.description) {
            tempObject.description = item.description;
          }
          if (item.extraTimeDuration) {
            tempObject.extraTimeDuration =
              '00:' + item.extraTimeDuration.toString() + ':00';
          }
          tempArray.push(tempObject);
        });
      } else {
        isValid = false;
      }
    });
    tempSubCategory.map((eachCategory, pindex) => {
      if (eachCategory.services.length) {
        eachCategory.services.map((item, cindex) => {
          let tempObject = {
            proCategoryId: eachCategory.id,
            // type: serviceType === 'regular' ? 1 : 2,
            type: 1,
            name: item.name,
            duration: item.duration,
            currency: 'USD',
            // description: item.description,
            amount: item.amount,
            orderArrange: pindex + 1,
            isMobileService: item.isMobileService ? 1 : 0,
            // isVirtualService: item.isMobileService?1:0
            extraTime: item.extraTime ? 1 : 0,
            // extraTimeDuration: item.extraTimeDuration || '',
          };
          if (isUpdatedData) {
            tempObject.id = item.id || 0;
          }
          if (item.description) {
            tempObject.description = item.description;
          }
          if (item.extraTimeDuration) {
            tempObject.extraTimeDuration =
              '00:' + item.extraTimeDuration.toString() + ':00';
          }
          tempArray.push(tempObject);
        });
      } else {
        isValid = false;
      }
    });
    submitServiesDetails({
      services: tempArray,
      deleteServices: deletedServices,
    });
  };

  //  * add service handler
  const addServiceHandler = (value) => {
    value.id = (editableValues && editableValues.id) || 0;

    if (isParentCategory === 'main') {
      const tempMainCategoryServices = [...mainCategoryServises];
      if (childIndex != null) {
        tempMainCategoryServices[parentIndex].services[childIndex] = value;
      } else {
        tempMainCategoryServices[parentIndex].services.push(value);
      }
      setMainCategoryServises(tempMainCategoryServices);
    } else {
      const tempSubCategoryServices = [...subCategoryServises];
      if (childIndex != null) {
        tempSubCategoryServices[parentIndex].services[childIndex] = value;
      } else {
        tempSubCategoryServices[parentIndex].services.push(value);
      }
      setSubCategoryServises(tempSubCategoryServices);
    }
    closeServiceModal();
  };

  const openServiceModal = (
    category,
    pIndex,
    cIndex = null,
    isOpenCategoryLabel = false,
    serviceType = 1,
  ) => {
    setIsParentCategory(category);
    setParentIndex(pIndex);
    setChildIndex(cIndex);
    console.log('openServiceModal', category, pIndex, cIndex);
    if (category === 'main') {
      const tempMainCategoryServices = [...mainCategoryServises];
      setCategoryInfoDetails(tempMainCategoryServices[pIndex]);
      if (cIndex != null) {
        setEditableValues(tempMainCategoryServices[pIndex].services[cIndex]);
      } else {
        setEditableValues(null);
      }
    } else {
      const tempSubCategoryServices = [...subCategoryServises];
      setCategoryInfoDetails(tempSubCategoryServices[pIndex]);
      if (cIndex != null) {
        setEditableValues(tempSubCategoryServices[pIndex].services[cIndex]);
      } else {
        setEditableValues(null);
      }
    }

    if (isOpenCategoryLabel) {
      setVisibleCategoryInfoModal('CategoryInfoDialog');
    } else {
      if (cIndex != null) {
        if (serviceType == 1) {
          setVisibleModal('ServiceAddEditDialog');
        } else if (serviceType == 2) {
          setVisibleModal('AddGroupSessionDialog');
        }
      } else {
        setVisibleServicesTypeModal('ServicesTypeModal');
      }
    }
  };

  const onSelectServiceTypeHandler = (type) => {
    setServiceType(type);

    if (type === 'regular') {
      setVisibleServicesTypeModal({ visibleServicesTypeModal: null });
      setVisibleModal('ServiceAddEditDialog');
    } else if (type === 'group') {
      console.log('group session called');
      // setCategoryInfoDetails(mainCategoryServises[parentIndex]);
      setVisibleServicesTypeModal({ visibleServicesTypeModal: null });
      setVisibleModal('AddGroupSessionDialog');
    }
  };

  const onSelectServiceInformationHandler = (type) => {
    setVisibleCategoryInfoModal({ visibleCategoryInfoModal: null });
    if (type === 'add-service') {
      setVisibleServicesTypeModal('ServicesTypeModal');
    } else if (type === 'edit-category') {
      setTimeout(() => {
        setVisibleAddOrUpdateCategoryModal(true);
      }, 1000);
    } else {
      confirmCategoryDeleteHandler();
    }
  };

  const confirmCategoryDeleteHandler = () => {
    let msg =
      'Are you sure, you want to delete this category, once deleted then the service will not appear?';
    Alert.alert(
      'Confirmation',
      msg,
      [
        {
          text: 'Cancel',
          onPress: () => closeServiceModal(),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteCategoryApi() },
      ],
      { cancelable: false },
    );
  };

  const deleteCategoryApi = () => {
    setLoader(true);
    Delete('pro/additional-categories/' + categoryInfoDetails.id, '')
      .then((result) => {
        setLoader(false);
        if (result.status === 201) {
          setCategoryInfoDetails(null);
          const tempSubCategoryServices = [...subCategoryServises];
          tempSubCategoryServices.splice(parentIndex, 1);
          setSubCategoryServises(tempSubCategoryServices);
          closeServiceModal();
          global.showToast(result.message, 'success');
        } else {
          setErrorMsg(result.message || 'Something went wrong');
        }
      })
      .catch((error) => {
        console.log('erorr', error);
        setLoader(false);
        setErrorMsg(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
        );
      });
  };

  const closeServiceModal = () => {
    setParentIndex(null);
    setChildIndex(null);
    setServiceType(null);
    setVisibleModal({ visibleModal: null });
  };

  const deleteServiceHandler = (id) => {
    if (isParentCategory === 'main') {
      const tempMainCategoryServices = [...mainCategoryServises];
      if (childIndex != null) {
        tempMainCategoryServices[parentIndex].services.splice(childIndex, 1);
      }
      setMainCategoryServises(tempMainCategoryServices);
    } else {
      const tempSubCategoryServices = [...subCategoryServises];
      if (childIndex != null) {
        tempSubCategoryServices[parentIndex].services.splice(childIndex, 1);
      }
      setSubCategoryServises(tempSubCategoryServices);
    }
    if (id) {
      const tempDeleteArray = [...deletedServices];
      tempDeleteArray.push(id);
      setDeletedServices([...tempDeleteArray]);
    }
    closeServiceModal();
  };

  const initialServiceFetch = () => {
    getServiceDetails();
    getBusinessDetails();
  };

  useEffect(() => {
    initialServiceFetch();
  }, []);

  const checkPreviousDataAvailableOrNot = (id, submitedRecord) => {
    if (submitedRecord) {
      const categorySelection = submitedRecord.filter(
        (eachCategory) => eachCategory.id === id,
      );
      if (categorySelection[0] && categorySelection[0].Services) {
        categorySelection[0].Services.map((eachItem) => {
          eachItem.durationText = DurationTimeData.find(
            (x) => x.value === eachItem.duration,
          )?.durationTime;

          if (eachItem.extraTimeDuration) {
            let tempExtratimeDurationArray =
              eachItem.extraTimeDuration.split(':');
            eachItem.extraTimeDuration = tempExtratimeDurationArray[1];
          }
        });
      }
      return (categorySelection[0] && categorySelection[0].Services) || [];
    } else {
      return [];
    }
  };

  const getMainCategory = (previousHoldData = null) => {
    setLoader(true);
    Get('pro/main-category', '')
      .then((result) => {
        getAdditionalCategory(previousHoldData);
        if (result.status === 200) {
          let mainCategoryData = result.data;
          mainCategoryData.services = checkPreviousDataAvailableOrNot(
            result.data.id,
            previousHoldData,
          );
          let tempData = [];
          tempData.push(mainCategoryData);
          setMainCategoryServises(tempData);
        }
      })
      .catch((error) => {
        getAdditionalCategory();
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const getAdditionalCategory = (previousHoldData) => {
    setLoader(true);
    Get('pro/additional-categories', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          let subCategoryData = result.data.map((item, index) => {
            item.services = checkPreviousDataAvailableOrNot(
              item.id,
              previousHoldData,
            );
            return item;
          });
          setSubCategoryServises(subCategoryData);
        }
      })
      .catch((error) => {
        setLoader(false);

        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const submitServiesDetails = (postdata) => {
    setLoader(true);
    if (isUpdatedData) {
      Put('pro/services', postdata)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            setDeletedServices([]);
            redirectUrlHandler();
          } else {
            global.showToast(result.message || 'Something went wrong', 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log('eror 409', error);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    } else {
      Post('pro/add-services', postdata)
        .then((result) => {
          setLoader(false);
          if (result.status === 201) {
            setDeletedServices([]);
            redirectUrlHandler();
          } else {
            global.showToast(result.message || 'Something went wrong', 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log('error 429', error);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    }
  };

  const getServiceDetails = () => {
    setLoader(true);
    Get('pro/services', '')
      .then((result) => {
        if (result.status === 200 && result.data && result.data.count) {
          setIsUpdatedData(true);
          setTimeout(() => {
            getMainCategory(result.data.rows);
          }, 200);
        } else {
          getMainCategory();
        }
      })
      .catch((error) => {
        getMainCategory();
      });
  };

  function FlotingAddIcon() {
    return (
      <Image
        style={{
          resizeMode: 'contain',
          width: 22,
          height: 22,
          alignItems: 'center',
          alignSelf: 'center',
        }}
        source={require('../../assets/images/add-orange.png')}
      />
    );
  }

  const addOrUpdateCategoryHandler = () => {
    setVisibleAddOrUpdateCategoryModal(false);
    setCategoryInfoDetails(null);
    getServiceDetails();
  };

  const getBusinessDetails = () => {
    Get('pro/business-details', '')
      .then((result) => {
        if (result.status === 200 && result.data) {
          setBusinessDetails(result.data);
        }
      })
      .catch((error) => { });
  };

  const closeSessionModal = () => {
    setVisibleModal(null);
    dispatch(addGroupSessionClear());
  };

  // ############################

  const [data, setData] = useState(initialData);
  // const [data, setData] = useState(initialData);

  const setSubcatData = (updatedData, id) => {
    let localData = JSON.parse(JSON.stringify(data));
    let selectedCategoryIndex = localData.findIndex((m) => m.id == id);
    if (selectedCategoryIndex != -1) {
      localData[selectedCategoryIndex].subcatitems = updatedData;
    }
    setData(localData);
  };

  const renderItem = useCallback(({ item, index, drag, isActive }) => {
    return (
      <>
        <View style={commonStyle.categoriseListWrap}>
          <View style={commonStyle.servicecatItem}>
            <View style={commonStyle.searchBarText}>
              <TouchableOpacity
                style={{ padding: 5, paddingRight: 0, marginLeft: -5 }}
                onLongPress={drag}>
                <MenuBar />
              </TouchableOpacity>
              <Text
                style={[commonStyle.dotLarge, { backgroundColor: '#FF9589' }]}>
                .
              </Text>
              <Text style={commonStyle.subtextblack}>{item.category}</Text>
            </View>
            <TouchableOpacity style={commonStyle.moreInfoCircle}>
              <MoreVertical />
            </TouchableOpacity>
          </View>
          <View style={[commonStyle.setupCardBox]}>
            <DraggableFlatList
              data={item.subcatitems}
              renderItem={renderSubCategories}
              keyExtractor={(item, index) => item.name}
              onDragEnd={({ data }) => {
                setSubcatData(data, item.id);
              }}
              activationDistance={5}
              autoscrollThreshold={5}
              dragItemOverflow={true}
              ListFooterComponent={
                <View>
                  <TouchableOpacity
                    style={[
                      commonStyle.searchBarText,
                      { alignSelf: 'flex-start' },
                    ]}
                    onPress={() => {
                      setVisibleModal('ServiceAddDialog');
                    }}>
                    <View>
                      <Text style={[commonStyle.plusText, { marginRight: 15 }]}>
                        +
                      </Text>
                    </View>
                    <Text style={commonStyle.blackTextR}>Add a service</Text>
                  </TouchableOpacity>
                </View>
              }
              simultaneousHandlers={initialFaltListRef}
            />
          </View>
        </View>
      </>
    );
  });

  const renderSubCategories = ({ item, index, drag }) => {
    return (
      <List style={commonStyle.setupserviceList}>
        <ListItem thumbnail style={commonStyle.categoriseListItem}>
          <TouchableOpacity
            style={commonStyle.serviceListtouch}
            onLongPress={drag}>
            <Left
              style={{
                marginLeft: -4,
                marginRight: 20,
                alignSelf: 'flex-start',
              }}>
              <View style={{ padding: 5, paddingRight: 0, marginLeft: -5 }}>
                <MenuBar />
              </View>
            </Left>
            <Body style={commonStyle.categoriseListBody}>
              <Text
                style={[commonStyle.blackTextR, commonStyle.mb1]}
                numberOfLines={1}>
                {item.name}
              </Text>
              <View style={commonStyle.searchBarText}>
                <Text style={[commonStyle.blackTextR, { marginRight: 4 }]}>
                  {item.durationText}
                </Text>
                <Text style={commonStyle.dotSmall}>.</Text>
                <Text style={[commonStyle.blackTextR, { marginLeft: 4 }]}>
                  ${item.amount}
                </Text>
              </View>
            </Body>
            <View style={{ alignSelf: 'flex-start' }}>
              <TouchableOpacity style={commonStyle.moreInfoCircle}>
                <EditIcon />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ListItem>
      </List>
    );
  };

  return (
    <Fragment>
      <View style={[commonStyle.fromwrap, { paddingBottom: 0, paddingTop: 0 }]}>
        <Text
          style={[commonStyle.subheading, commonStyle.mb0]}
          onPress={() => setVisibleCategoryModal('ServicesAddGroupDialog')}>
          Your services
        </Text>
        <Text style={commonStyle.grayText16}>
          {isUpdate ? '' : 'You can change services and categories later'}
        </Text>
      </View>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onDragEnd={({ data }) => {
          setData(data);
        }}
        activationDistance={10}
        autoscrollThreshold={10}
        ref={initialFaltListRef}
      />

      {/* <DraggableFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onDragBegin={() => setOuterScrollEnabled(false)}
          onDragEnd={({ data }) => {
            setData(data)
            setOuterScrollEnabled(true)
          }}
          simultaneousHandlers={scrollView}
          activationDistance={5}
          autoscrollThreshold= {5}
        /> */}

      {isUpdate ? (
        <FAB
          style={commonStyle.flotingFav}
          icon={(props) => <FlotingAddIcon {...props} />}
          onPress={() => {
            setCategoryInfoDetails(null);
            setVisibleAddOrUpdateCategoryModal(true);
          }}
        />
      ) : null}

      <View style={commonStyle.footerwrap}>
        <View style={[commonStyle.footerbtn]}>
          <Button
            title={isUpdate ? 'Update' : 'Save and Continue'}
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={() => setupServiceSubmitHandler()}
          />
        </View>
      </View>

      {/* Setup Service modal start */}
      <RNModal
        isVisible={visibleModal === 'ServiceAddEditDialog'}
        // onSwipeComplete={() => {
        //   closeServiceModal();
        // }}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={false}
        isModalInPresentation={true}
        style={commonStyle.bottomModal}>
        <View style={[commonStyle.scrollableModal, { maxHeight: '90%', minHeight: 650 }]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => closeServiceModal()}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          {/* <ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}> */}
          <SetupServiceAddModal
            scrollViewRefModal={scrollViewRef}
            handleOnScrollHandler={handleOnScroll}
            addServiceHandle={addServiceHandler}
            editItems={editableValues}
            deleteServiceHandler={deleteServiceHandler}
            businessDetails={businessDetails}
          />
          {/* </ScrollView> */}
        </View>
      </RNModal>

      <RNModal
        isVisible={visibleModal === 'AddGroupSessionDialog'}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        onSwipeComplete={() => closeServiceModal()}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={false}
        isModalInPresentation={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => closeServiceModal()}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <GroupSessionAddModal
            categoryInfo={categoryInfoDetails}
            closeModal={closeSessionModal}
            editableSession={editableValues || {}}
            fetchServices={initialServiceFetch}
          />
        </View>
      </RNModal>

      {visibleAddOrUpdateCategoryModal && (
        <Modal
          // visible={visibleAddOrUpdateCategoryModal === 'AddOrEditCategoryDialog'}
          visible={visibleAddOrUpdateCategoryModal}
          onRequestClose={() => setVisibleAddOrUpdateCategoryModal(false)}
          animationType="slide"
          transparent={true}
          style={{ position: 'relative' }}>
          <View style={commonStyle.overlay}>
            <View
              style={{
                ...commonStyle.modalContainer,
                paddingHorizontal: 0,
                height: Platform.OS === 'ios' ? 550 : 400,
              }}>
              <View style={commonStyle.othersModal}>
                <TouchableOpacity
                  style={[commonStyle.termswrap, { height: 15 }]}
                  onPress={() => setVisibleAddOrUpdateCategoryModal(false)}>
                  <Text
                    style={{
                      backgroundColor: '#ECEDEE',
                      width: 75,
                      height: 4,
                      borderRadius: 2,
                    }}></Text>
                </TouchableOpacity>
                <AddOrEditCategoryModal
                  categoryInfoDetails={categoryInfoDetails}
                  addOrUpdateCategoryHandler={addOrUpdateCategoryHandler}
                  setScrollOffset={setScrollOffset}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Setup Service modal start */}
      <RNModal
        isVisible={visibleCategoryInfoModal === 'CategoryInfoDialog'}
        onSwipeComplete={() =>
          setVisibleCategoryInfoModal({ visibleCategoryInfoModal: null })
        }
        swipeDirection="down"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.othersbottomModal}>
        <View>
          <View style={commonStyle.othersModal}>
            <TouchableOpacity
              onPress={() => {
                onSelectServiceInformationHandler('add-service');
              }}
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/add-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Add a service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onSelectServiceInformationHandler('edit-category');
              }}
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: isParentCategory === 'sub' ? 1 : 0,
                  borderBottomColor:
                    isParentCategory === 'sub' ? '#dcdcdc' : null,
                  padding: 12,
                },
              ]}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../../assets/images/edit-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Edit category</Text>
            </TouchableOpacity>
            {isParentCategory === 'sub' ? (
              <TouchableOpacity
                onPress={() => {
                  onSelectServiceInformationHandler('delete-category');
                }}
                style={[commonStyle.searchBarText, { padding: 12 }]}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/trash-orange.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Delete category</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={commonStyle.modalcancle}
            activeOpacity={0.9}
            onPress={() =>
              setVisibleCategoryInfoModal({ visibleCategoryInfoModal: null })
            }>
            <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
      {/* Setup Service modal End */}

      {/* Setup Service modal start */}
      <Modal
        visible={visibleServicesTypeModal === 'ServicesTypeModal'}
        onRequestClose={() =>
          setVisibleServicesTypeModal({ visibleServicesTypeModal: null })
        }
        animationType="slide"
        transparent={true}
        style={{ position: 'relative' }}>
        <View style={commonStyle.overlay}>
          <View
            style={{
              ...commonStyle.modalContainer,
              height: 'auto',
              maxHeight: 300,
            }}>
            <View style={commonStyle.othersModal}>
              <TouchableOpacity
                onPress={() => onSelectServiceTypeHandler('regular')}
                style={[
                  commonStyle.searchBarText,
                  {
                    padding: 12,
                  },
                ]}>
                <TouchableHighlight style={[commonStyle.haederback]}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/calendar-orange.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Regular service</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSelectServiceTypeHandler('group')}
                style={[commonStyle.searchBarText, { padding: 12 }]}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../../assets/images/users-orange.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Group session</Text>
                {/* <TouchableHighlight
                  style={[commonStyle.paidbtn, {marginLeft: 10}]}>
                  <Text style={commonStyle.paidbtntext}>Pro feature</Text>
                </TouchableHighlight> */}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={commonStyle.modalcancle}
              activeOpacity={0.9}
              onPress={() =>
                setVisibleServicesTypeModal({ visibleServicesTypeModal: null })
              }>
              <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <RNModal
        visible={errorAlert}
        onRequestClose={() => {
          setErrorMsg(null);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You can’t remove this category
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              {errorAlert}
            </Text>
          </View>
        </View>
      </RNModal>
      {/* Setup Service modal End */}
    </Fragment>
  );
};

export default ServiceDetails;
