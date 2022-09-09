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
  ScrollView,
  ViewPagerAndroid,
  KeyboardAvoidingView,
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
import { ArrowUp, ArrowDown } from '../icons';
import { setupProgressionUpdate } from '../../store/actions';
import { addUpdateServiceApi } from './addUpdateServiceHelper';
import moment from 'moment';

const ServiceDetails = ({
  isUpdate,
  setLoader,
  redirectUrlHandler,
  progressionData,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const [editableValues, setEditableValues] = useState(null);
  const dispatch = useDispatch();

  const [mainCategoryServises, setMainCategoryServises] = useState([]);
  const [subCategoryServises, setSubCategoryServises] = useState([]);
  const [deletedServices, setDeletedServices] = useState([]);
  const [errorAlert, setErrorMsg] = useState(null);
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const scrollViewRef = useRef(0);
  const [parentIndex, setParentIndex] = useState();
  const [childIndex, setChildIndex] = useState();
  const [isParentCategory, setIsParentCategory] = useState('');
  const [isUpdatedData, setIsUpdatedData] = useState(false);
  // const [submittedServiceList, setSubmittedServiceList] = useState();
  const [allCategoryServices, setAllCategoryServices] = useState([]);

  const [visibleAddOrUpdateCategoryModal, setVisibleAddOrUpdateCategoryModal] =
    useState(false);
  const [visibleCategoryInfoModal, setVisibleCategoryInfoModal] =
    useState(false);
  const [visibleServicesTypeModal, setVisibleServicesTypeModal] =
    useState(false);
  const [serviceType, setServiceType] = useState();
  const [categoryInfoDetails, setCategoryInfoDetails] = useState();
  const [businessDetails, setBusinessDetails] = useState();

  const [isPrimaryCategory, setIsPrimaryCategory] = useState(false);
  const [isProSubscription, setIsProSubscription] = useState(false);

  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      // console.log(scrollViewRef.current);
      scrollViewRef.current.scrollTo(p);
    }
  };

  const setupServiceSubmitHandler = (serviceToDelete, isFinal = false) => {
    let tempArray = [];
    let isValid;
    const tempAllCategoryServices = [...allCategoryServices];
    tempAllCategoryServices.map((eachCategory, pindex) => {
      if (eachCategory.Services.length) {
        eachCategory.Services.map((item, cindex) => {
          let tempObject = {
            proCategoryId: eachCategory.id,
            // type: serviceType === 'regular' ? 1 : 2,
            // type: 1,
            type: item.type,
            name: item.name,
            duration: item.duration,
            currency: 'USD',
            // description: item.description,
            amount: item.amount,
            // orderArrange: 0,
            orderArrange: cindex,
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
    // const tempMainCategory = [...mainCategoryServises];
    // const tempSubCategory = [...subCategoryServises];
    // let isValid;
    // tempMainCategory.map((eachCategory, pindex) => {
    //   if (eachCategory.services.length) {
    //     eachCategory.services.map((item, cindex) => {
    //       let tempObject = {
    //         proCategoryId: eachCategory.id,
    //         // type: serviceType === 'regular' ? 1 : 2,
    //         // type: 1,
    //         type: item.type,
    //         name: item.name,
    //         duration: item.duration,
    //         currency: 'USD',
    //         // description: item.description,
    //         amount: item.amount,
    //         // orderArrange: 0,
    //         orderArrange: cindex,
    //         isMobileService: item.isMobileService ? 1 : 0,
    //         // isVirtualService: item.isMobileService?1:0
    //         extraTime: item.extraTime ? 1 : 0,
    //         // extraTimeDuration: item.extraTimeDuration || '',
    //       };
    //       if (isUpdatedData) {
    //         tempObject.id = item.id || 0;
    //       }
    //       if (item.description) {
    //         tempObject.description = item.description;
    //       }
    //       if (item.extraTimeDuration) {
    //         tempObject.extraTimeDuration =
    //           '00:' + item.extraTimeDuration.toString() + ':00';
    //       }
    //       tempArray.push(tempObject);
    //     });
    //   } else {
    //     isValid = false;
    //   }
    // });
    // tempSubCategory.map((eachCategory, pindex) => {
    //   if (eachCategory.services.length) {
    //     eachCategory.services.map((item, cindex) => {
    //       let tempObject = {
    //         proCategoryId: eachCategory.id,
    //         // type: serviceType === 'regular' ? 1 : 2,
    //         // type: 1,
    //         type: item.type,
    //         name: item.name,
    //         duration: item.duration,
    //         currency: 'USD',
    //         // description: item.description,
    //         amount: item.amount,
    //         // orderArrange: pindex + 1,
    //         orderArrange: cindex,
    //         isMobileService: item.isMobileService ? 1 : 0,
    //         // isVirtualService: item.isMobileService?1:0
    //         extraTime: item.extraTime ? 1 : 0,
    //         // extraTimeDuration: item.extraTimeDuration || '',
    //       };
    //       if (isUpdatedData) {
    //         tempObject.id = item.id || 0;
    //       }
    //       if (item.description) {
    //         tempObject.description = item.description;
    //       }
    //       if (item.extraTimeDuration) {
    //         tempObject.extraTimeDuration =
    //           '00:' + item.extraTimeDuration.toString() + ':00';
    //       }
    //       tempArray.push(tempObject);
    //     });
    //   } else {
    //     isValid = false;
    //   }
    // });
    if (serviceToDelete?.length || isFinal)
      submitServiesDetails(
        {
          services: tempArray,
          deleteServices: serviceToDelete,
        },
        isFinal,
      );
  };

  // *fetch services

  const fetchServiceData = () => {
    Get('pro/services')
      .then((result) => {
        if (result.status === 200 && result.data && result.data.count) {
          setIsUpdatedData(true);
          console.log(
            '\n\n*****************getServiceDetails\n\n\n',
            // JSON.stringify(result.data.rows),
          );
          // console.log(result.data.rows);
          setAllCategoryServices(result.data.rows);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  //  * add service handler
  const addServiceHandler = (value) => {
    value.id = (editableValues && editableValues.id) || 0;

    let tempObject = {
      proCategoryId: allCategoryServices[parentIndex]?.id,
      type: 1,
      name: value.name,
      duration: value.duration,
      currency: 'USD',
      // description: value.description,
      amount: value.amount,
      // orderArrange: 0,
      orderArrange: childIndex,
      isMobileService: value.isMobileService ? 1 : 0,
      // isVirtualService: value.isMobileService?1:0
      extraTime: value.extraTime ? 1 : 0,
      // extraTimeDuration: value.extraTimeDuration || '',
    };

    if (value.description) {
      tempObject.description = value.description;
    }
    if (value.extraTimeDuration) {
      tempObject.extraTimeDuration = value.extraTimeDuration;
    }
    if (value.image) {
      tempObject.image = value.image;
    }
    tempObject.id = value.id || 0;
    // if (isParentCategory === 'main') {
    const tempAllCategoryServices = [...allCategoryServices];
    if (childIndex != null) {
      tempAllCategoryServices[parentIndex].Services[childIndex] = value;
      setLoader(true);
      addUpdateServiceApi(
        tempObject,
        true,
        (val) => setLoader(val),
        (result) => {
          fetchServiceData();
        },
      );
    } else {
      tempAllCategoryServices[parentIndex].Services.push(value);
      setLoader(true);
      addUpdateServiceApi(
        tempObject,
        false,
        (val) => setLoader(val),
        (result) => {
          fetchServiceData();
        },
      );
    }
    setAllCategoryServices(tempAllCategoryServices);
    // setMainCategoryServises(tempMainCategoryServices);
    // } else {
    //   const tempSubCategoryServices = [...subCategoryServises];
    //   if (childIndex != null) {
    //     tempSubCategoryServices[parentIndex].services[childIndex] = value;
    //   } else {
    //     tempSubCategoryServices[parentIndex].services.push(value);
    //   }
    //   setSubCategoryServises(tempSubCategoryServices);
    // }
    closeServiceModal();
    if (!!isUpdate) {
      setTimeout(() => {
        setupServiceSubmitHandler(deletedServices);
      }, 300);
    }
  };

  const openServiceModal = (
    category,
    pIndex,
    cIndex = null,
    isOpenCategoryLabel = false,
    serviceType = 1,
    isPrimaryCategoryFlag = 0,
  ) => {
    setIsParentCategory(category);
    setParentIndex(pIndex);
    setChildIndex(cIndex);

    console.log('primary checking: ', isPrimaryCategoryFlag);

    if (isPrimaryCategoryFlag == 1) {
      setIsPrimaryCategory(true);
    } else {
      setIsPrimaryCategory(false);
    }
    console.log('openServiceModal', category, pIndex, cIndex);
    // if (category === 'main') {
    const tempAllCategoryServices = [...allCategoryServices];
    setCategoryInfoDetails(tempAllCategoryServices[pIndex]);
    if (cIndex != null) {
      setEditableValues(tempAllCategoryServices[pIndex].Services[cIndex]);
    } else {
      setEditableValues(null);
    }
    // } else {
    //   const tempSubCategoryServices = [...subCategoryServises];
    //   setCategoryInfoDetails(tempSubCategoryServices[pIndex]);
    //   if (cIndex != null) {
    //     setEditableValues(tempSubCategoryServices[pIndex].services[cIndex]);
    //   } else {
    //     setEditableValues(null);
    //   }
    // }

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
    console.log('is update: ', isUpdate);
    setTimeout(() => {
      setServiceType(type);
    }, 300);

    if (type === 'regular') {
      setVisibleServicesTypeModal({ visibleServicesTypeModal: null });
      setVisibleModal('ServiceAddEditDialog');
    } else if (type === 'group') {
      console.log('group session called');
      // setCategoryInfoDetails(mainCategoryServises[parentIndex]);
      if (!isProSubscription) {
        if (Platform.OS === 'ios') {
          Alert.alert(
            'You need Readyhubb PRO to Add Group Sessions. You can purchase it from the Readyhubb website.',
          );
        } else {
          setTimeout(() => {
            setVisibleModal(null);
          }, 350);
          setTimeout(() => {
            setVisibleModal('CantAddGSModal');
          }, 400);
        }

        setTimeout(() => setVisibleModal(null), 4000);
        return false;
      }
      setTimeout(() => {
        setVisibleServicesTypeModal({ visibleServicesTypeModal: null });
      }, 350);
      setTimeout(() => {
        setVisibleModal('AddGroupSessionDialog');
      }, 400);
    }
  };

  const onSelectServiceInformationHandler = (type) => {
    setTimeout(() => {
      setVisibleCategoryInfoModal({ visibleCategoryInfoModal: null });
    }, 300);

    if (type === 'add-service') {
      setTimeout(() => {
        setVisibleServicesTypeModal('ServicesTypeModal');
      }, 1000);
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
    // console.log('deleting id: ', categoryInfoDetails);
    if (categoryInfoDetails.Services.length) {
      console.log('ping');

      setErrorMsg(
        'This Category can not be deleted, as there are services listed under it. Please delete the services first.',
      );
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      Delete('pro/additional-categories/' + categoryInfoDetails.id, '')
        .then((result) => {
          setLoader(false);
          if (result.status === 201) {
            setCategoryInfoDetails(null);
            // const tempSubCategoryServices = [...subCategoryServises];
            // tempSubCategoryServices.splice(parentIndex, 1);
            // setSubCategoryServises(tempSubCategoryServices);
            const tempAllCategoryServices = [...allCategoryServices];
            tempAllCategoryServices.splice(parentIndex, 1);
            setAllCategoryServices(tempAllCategoryServices);
            closeServiceModal();

            global.showToast(result.message, 'success');
          } else {
            setErrorMsg(result.message || 'Something went wrong');
          }
        })
        .catch((error) => {
          console.log('erorr', error);
          setLoader(false);
          global.showToast('Something went wrong', 'error');
          setErrorMsg(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
          );
        });
    }
  };

  const closeServiceModal = () => {

    setParentIndex(null);
    setChildIndex(null);
    setServiceType(null);
    setVisibleModal({ visibleModal: null });
  };

  const dismissCategoryModal = () => {
    console.log("CLOSE MODE:")
    setVisibleAddOrUpdateCategoryModal(false);
  }

  const deleteServiceHandler = (id) => {
    // if (isParentCategory === 'main') {
    const tempAllCategoryServices = [...allCategoryServices];
    if (childIndex != null) {
      tempAllCategoryServices[parentIndex].Services.splice(childIndex, 1);
    }
    setAllCategoryServices([...tempAllCategoryServices]);
    // setMainCategoryServises(tempMainCategoryServices);
    // } else {
    //   const tempSubCategoryServices = [...subCategoryServises];
    //   if (childIndex != null) {
    //     tempSubCategoryServices[parentIndex].services.splice(childIndex, 1);
    //   }
    //   setSubCategoryServises(tempSubCategoryServices);
    // }
    let tempDeleteArray = [...deletedServices];
    if (id) {
      tempDeleteArray.push(id);
      setDeletedServices([...tempDeleteArray]);
    }
    closeServiceModal();
    setTimeout(() => {
      setupServiceSubmitHandler([...tempDeleteArray]);
    }, 300);
  };

  const initialServiceFetch = () => {
    getServiceDetails();
    getBusinessDetails();
  };

  useEffect(() => {
    initialServiceFetch();
    verifyAccess();
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
        console.log('main c error', JSON.stringify(error, null, 2));
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

  const submitServiesDetails = (postdata, isFinal) => {
    // console.log('postdata', postdata);
    setLoader(true);
    if (!!isUpdatedData) {
      Put('pro/services', postdata)
        .then((result) => {
          if (result.status === 200) {
            if (!isUpdate && isFinal) redirectUrlHandler();
          } else {
            global.showToast(result.message || 'Something went wrong', 'error');
          }
          setDeletedServices([]);
          getServiceDetails();
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
          if (result.status === 201) {
            if (!!progressionData && isFinal) {
              const updatedProgression = progressionData.map((step) => {
                if (step.stepNo === 5) {
                  return { ...step, isCompleted: 1 };
                }
                return step;
              });

              dispatch(setupProgressionUpdate(updatedProgression));
            }
            if (isFinal) redirectUrlHandler();
            setDeletedServices([]);
            getServiceDetails();
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
    Get('pro/services')
      .then((result) => {
        if (result.status === 200 && result.data && result.data.count) {
          setIsUpdatedData(true);
          console.log(
            '\n\n*****************getServiceDetails\n\n\n',
            // JSON.stringify(result.data.rows),
          );
          // console.log(result.data.rows);
          setAllCategoryServices(result.data.rows);
          // console.log('RECEIVED DATA: ', JSON.parse(JSON.stringify(result.data.rows)))
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

  // console.log('services', visibleAddOrUpdateCategoryModal);

  //categoryType = 'main' for main 'sub' for sub
  //move = 1 for up 0 for down
  const moveServiceOfCategory = (categoryIndex, serviceIndex, move) => {
    // console.log("\n\n\n\nmoveServiceOfCategory*********");
    // console.log("categoryIndex :", categoryIndex);
    // console.log("serviceIndex :", serviceIndex);
    // console.log("move :", move);
    // console.log("**********************\n\n\n\n");
    const tempAllCategoryServices = [...allCategoryServices];
    if (move === 1) {
      let swapVar =
        tempAllCategoryServices[categoryIndex].Services[serviceIndex - 1];
      tempAllCategoryServices[categoryIndex].Services[serviceIndex - 1] =
        tempAllCategoryServices[categoryIndex].Services[serviceIndex];
      tempAllCategoryServices[categoryIndex].Services[serviceIndex] = swapVar;
    } else {
      let swapVar =
        tempAllCategoryServices[categoryIndex].Services[serviceIndex + 1];
      tempAllCategoryServices[categoryIndex].Services[serviceIndex + 1] =
        tempAllCategoryServices[categoryIndex].Services[serviceIndex];
      tempAllCategoryServices[categoryIndex].Services[serviceIndex] = swapVar;
    }
    let rearrangedServiceList = [];
    tempAllCategoryServices.forEach((category) => {
      category.Services.forEach((service, index) => {
        rearrangedServiceList.push({ id: service.id, orderArrange: index });
      });
    });
    console.log('rearrangedServiceList', rearrangedServiceList);
    Put('pro/services', { services: rearrangedServiceList })
      .then((result) => {
        if (result.status === 200) {
          // setMainCategoryServises(tempMainCategoryServices);
          setAllCategoryServices(tempAllCategoryServices);
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
  };

  const moveCategory = (categoryIndex, move) => {
    console.log('\n\n\n\n moveCategory*********');
    console.log('categoryIndex :', categoryIndex);
    console.log('move :', move);
    console.log('**********************\n\n\n\n');

    const tempAllCategoryServices = [...allCategoryServices];
    if (move === 1) {
      let swapVar = tempAllCategoryServices[categoryIndex - 1];
      tempAllCategoryServices[categoryIndex - 1] =
        tempAllCategoryServices[categoryIndex];
      tempAllCategoryServices[categoryIndex] = swapVar;
    } else {
      let swapVar = tempAllCategoryServices[categoryIndex + 1];
      tempAllCategoryServices[categoryIndex + 1] =
        tempAllCategoryServices[categoryIndex];
      tempAllCategoryServices[categoryIndex] = swapVar;
    }

    let rearrangedCategoryList = [];
    tempAllCategoryServices.forEach((category, index) => {
      rearrangedCategoryList.push({ id: category.id, orderArrange: index });
    });
    Put('pro/order-categories', { categories: rearrangedCategoryList })
      .then((result) => {
        if (result.status === 200) {
          // setMainCategoryServises(tempMainCategoryServices);
          setAllCategoryServices(tempAllCategoryServices);
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
  };

  const verifyAccess = () => {
    setLoader(true);
    Get('/pro/subcription-plan')
      .then((response) => {
        setLoader(false);
        if (response.data.type === 1) {
          setIsProSubscription(false);
        } else {
          if (response.data.isExpire == 1 || response.data.isExpire == 2) {
            setIsProSubscription(false);
          } else if (response.data.isExpire === 0) {
            setIsProSubscription(true);
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
        setIsProSubscription(false);
      });
  };

  return (
    <Fragment>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[commonStyle.fromwrap, { paddingBottom: 0 }]}>
          <Text
            style={[commonStyle.subheading]}
          // onPress={() => setVisibleCategoryModal('ServicesAddGroupDialog')}
          >
            Your services
          </Text>
          <Text style={commonStyle.grayText16}>
            {isUpdate ? '' : 'You can change services and categories later'}
          </Text>
        </View>

        <View style={[commonStyle.categoriseListWrap, { paddingTop: 0 }]}>
          {allCategoryServices && allCategoryServices.length
            ? allCategoryServices.map((category, pIndex) => (
              <View key={pIndex}>
                <View style={commonStyle.servicecatItem}>
                  <View style={commonStyle.searchBarText}>
                    <TouchableHighlight>
                      {/* <MenuBar /> */}
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={[
                            commonStyle.moreInfoCircle,
                            { marginBottom: 3 },
                            { backgroundColor: pIndex === 0 ? '#e5e5e5' : '' },
                          ]}>
                          <TouchableOpacity
                            onPress={() => {
                              moveCategory(pIndex, 1);
                            }}
                            disabled={pIndex === 0 ? true : false}>
                            <ArrowUp />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={[
                            commonStyle.moreInfoCircle,
                            { marginTop: 3 },
                            {
                              backgroundColor:
                                pIndex === allCategoryServices.length - 1
                                  ? '#e5e5e5'
                                  : '',
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={() => {
                              moveCategory(pIndex, 0);
                            }}
                            disabled={
                              pIndex === allCategoryServices.length - 1
                                ? true
                                : false
                            }>
                            <ArrowDown />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableHighlight>
                    <Text
                      style={[
                        commonStyle.dotLarge,
                        {
                          backgroundColor:
                            category.categoryColor || '#FF9589',
                        },
                      ]}>
                      .
                    </Text>
                    <Text style={commonStyle.subtextblack}>
                      {category.categoryName}
                    </Text>
                  </View>

                  {isUpdate ? (
                    <TouchableOpacity
                      style={commonStyle.moreInfoCircle}
                      onPress={() => {
                        console.log(category.isPrimary);
                        isUpdate
                          ? openServiceModal(
                            'main',
                            pIndex,
                            null,
                            true,
                            1,
                            category.isPrimary,
                          )
                          : null;
                      }}>
                      <MoreVertical />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={[commonStyle.setupCardBox]}>
                  {category.Services && category.Services.length
                    ? category.Services.map((item, index) => (
                      <List
                        key={index}
                        style={commonStyle.setupserviceList}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          <View style={commonStyle.serviceListtouch}>
                            <Left
                              style={{
                                marginLeft: -4,
                                marginRight: 20,
                                alignSelf: 'flex-start',
                              }}>
                              {/* <MenuBar /> */}
                              <View
                                style={{
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={[
                                    commonStyle.moreInfoCircle,
                                    { marginBottom: 3 },
                                    {
                                      backgroundColor:
                                        index === 0 ? '#e5e5e5' : '',
                                    },
                                  ]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      moveServiceOfCategory(
                                        pIndex,
                                        index,
                                        1,
                                      );
                                    }}
                                    disabled={index === 0 ? true : false}>
                                    <ArrowUp />
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={[
                                    commonStyle.moreInfoCircle,
                                    { marginTop: 3 },
                                    {
                                      backgroundColor:
                                        index ===
                                          category.Services.length - 1
                                          ? '#e5e5e5'
                                          : '',
                                    },
                                  ]}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      moveServiceOfCategory(
                                        pIndex,
                                        index,
                                        0,
                                      );
                                    }}
                                    disabled={
                                      (index ===
                                        category.Services.length - 1) ===
                                        0
                                        ? true
                                        : false
                                    }>
                                    <ArrowDown />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </Left>
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
                                    { maxWidth: '60%' },
                                  ]}
                                  numberOfLines={10}>
                                  {item.name}
                                </Text>
                                <View style={{ marginTop: 3 }}>
                                  {item?.type === 2 && (
                                    <TouchableHighlight
                                      style={[
                                        commonStyle.paidbtn,
                                        { marginLeft: 10 },
                                      ]}>
                                      <Text
                                        style={[
                                          commonStyle.paidbtntext,
                                          { fontSize: 8 },
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
                                    { marginRight: 4 },
                                  ]}>
                                  {item.durationText}
                                </Text>
                                <Text style={commonStyle.dotSmall}>.</Text>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    { marginLeft: 4 },
                                  ]}>
                                  ${item.amount}
                                </Text>
                              </View>
                            </Body>
                            <View style={{ alignSelf: 'flex-start' }}>
                              <TouchableOpacity
                                style={commonStyle.moreInfoCircle}
                                onPress={() => {
                                  openServiceModal(
                                    'main',
                                    pIndex,
                                    index,
                                    false,
                                    item.type || 1,
                                  );
                                }}>
                                <EditIcon />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ListItem>
                      </List>
                    ))
                    : null}
                  <View>
                    <TouchableOpacity
                      style={[
                        commonStyle.searchBarText,
                        { alignSelf: 'flex-start' },
                      ]}
                      onPress={() => {
                        openServiceModal('main', pIndex);
                      }}>
                      <TouchableHighlight>
                        <Text
                          style={[commonStyle.plusText, { marginRight: 15 }]}>
                          +
                        </Text>
                      </TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>
                        Add a service
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
            : null}

          {
            // * sub services
          }
          {/* {subCategoryServises && subCategoryServises.length
            ? subCategoryServises.map((subCategory, pIndex) => (
              <View key={pIndex}>
                <View style={commonStyle.servicecatItem}>
                  <View style={commonStyle.searchBarText}>
                    <TouchableHighlight>
                      <MenuBar />
                    </TouchableHighlight>
                    <Text
                      style={[
                        commonStyle.dotLarge,
                        {
                          backgroundColor:
                            subCategory.categoryColor || '#FF9589',
                        },
                      ]}>
                      .
                    </Text>
                    <Text style={commonStyle.subtextblack}>
                      {subCategory.categoryName}
                    </Text>
                  </View>
                  {isUpdate ? (
                    <TouchableOpacity
                      style={commonStyle.moreInfoCircle}
                      onPress={() =>
                        isUpdate
                          ? openServiceModal('sub', pIndex, null, true)
                          : null
                      }>
                      <MoreVertical />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={[commonStyle.setupCardBox]}>
                  {subCategory.services && subCategory.services.length
                    ? subCategory.services?.map((item, cIndex) => (
                      <List
                        key={cIndex}
                        style={commonStyle.setupserviceList}>
                        <ListItem
                          thumbnail
                          style={commonStyle.categoriseListItem}>
                          <View style={commonStyle.serviceListtouch}>
                            <Left
                              style={{
                                marginLeft: -4,
                                marginRight: 20,
                                alignSelf: 'flex-start',
                              }}>
                              <View style={{ alignSelf: 'flex-start' }}>
                                <View style={commonStyle.moreInfoCircle}>
                                  {cIndex > 0 && <TouchableOpacity
                                    onPress={() => { moveServiceOfCategory('sub', pIndex, cIndex, 1) }}>
                                    <ArrowUp />
                                  </TouchableOpacity>}
                                  {cIndex !== (subCategory.services.length - 1) && <TouchableOpacity
                                    onPress={() => { moveServiceOfCategory('sub', pIndex, cIndex, 0) }}>
                                    <ArrowDown />
                                  </TouchableOpacity>}
                                </View>
                              </View>
                            </Left>
                            <Body style={commonStyle.categoriseListBody}>
                              <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    commonStyle.mb1,
                                  ]}
                                  numberOfLines={1}>
                                  {item.name}
                                </Text>
                                <View style={{ marginTop: 3 }}>
                                  {
                                    item?.type === 2 &&
                                    <TouchableHighlight
                                      style={[commonStyle.paidbtn, { marginLeft: 10 }]}>
                                      <Text style={[commonStyle.paidbtntext, { fontSize: 8 }]}>Group Session</Text>
                                    </TouchableHighlight>
                                  }
                                </View>
                              </View>
                              <View style={commonStyle.searchBarText}>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    { marginRight: 4 },
                                  ]}>
                                  {item.durationText}
                                </Text>
                                <Text style={commonStyle.dotSmall}>.</Text>
                                <Text
                                  style={[
                                    commonStyle.blackTextR,
                                    { marginLeft: 4 },
                                  ]}>
                                  ${item.amount}
                                </Text>
                              </View>
                            </Body>
                            <View style={{ alignSelf: 'flex-start' }}>
                              <TouchableOpacity
                                style={commonStyle.moreInfoCircle}
                                onPress={() => {
                                  openServiceModal(
                                    'sub',
                                    pIndex,
                                    cIndex,
                                    false,
                                    item.type,
                                  );
                                }}>
                                <EditIcon />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ListItem>
                      </List>
                    ))
                    : null}
                  <View>
                    <TouchableOpacity
                      style={[
                        commonStyle.searchBarText,
                        { alignSelf: 'flex-start' },
                      ]}
                      onPress={() => {
                        openServiceModal('sub', pIndex);
                      }}>
                      <TouchableHighlight>
                        <Text
                          style={{
                            fontSize: 36,
                            fontFamily: 'SofiaPro-ExtraLight',
                            lineHeight: 36,
                            marginRight: 15,
                          }}>
                          +
                        </Text>
                      </TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>
                        Add a service
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
            : null} */}
        </View>
      </ScrollView>

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
      {!isUpdate && (
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title={isUpdate ? 'Update' : 'Save and Continue'}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setupServiceSubmitHandler(deletedServices, true)}
            />
          </View>
        </View>
      )}

      {/* Setup Service modal start */}
      <RNModal
        isVisible={visibleModal === 'ServiceAddEditDialog'}
        onSwipeComplete={() => {
          closeServiceModal();
        }}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        avoidKeyboard
        propagateSwipe={true}
        style={[
          commonStyle.bottomModal,
          // {
          //   marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          // },
        ]}>
        <View
          style={[
            commonStyle.scrollableModal,
            // {maxHeight: keyboardStatus > 0 ? '100%' : '50%'},
            { flex: 1 },
          ]}>
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
            setKeyboardStatus={setKeyboardStatus}
            scrollViewRefModal={scrollViewRef}
            handleOnScrollHandler={handleOnScroll}
            addServiceHandle={addServiceHandler}
            editItems={editableValues}
            deleteServiceHandler={deleteServiceHandler}
            businessDetails={businessDetails}
            closeModel={() => {
              console.log("close")
              closeServiceModal()
            }}
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
        propagateSwipe={true}
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View
          style={[
            commonStyle.scrollableModal,
            { maxHeight: keyboardStatus > 0 ? '100%' : '50%' },
          ]}>
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
            setKeyboardStatus={setKeyboardStatus}
            categoryInfo={categoryInfoDetails}
            closeModal={closeSessionModal}
            editableSession={editableValues || {}}
            fetchServices={initialServiceFetch}
            businessDetails={businessDetails}
            scrollViewRefModal={scrollViewRef}
            handleOnScrollHandler={handleOnScroll}
          />
        </View>
      </RNModal>

      <RNModal
        isVisible={visibleAddOrUpdateCategoryModal}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        onSwipeComplete={() => setVisibleAddOrUpdateCategoryModal(false)}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View style={[commonStyle.scrollableModal, { maxHeight: '100%' }]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => dismissCategoryModal()}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <AddOrEditCategoryModal
            setKeyboardStatus={setKeyboardStatus}
            categoryInfoDetails={categoryInfoDetails}
            addOrUpdateCategoryHandler={addOrUpdateCategoryHandler}
            scrollViewRef={scrollViewRef}
            handleOnScroll={handleOnScroll}
            closeModel={dismissCategoryModal}
          />
        </View>
      </RNModal>

      {/* Setup Service modal start */}
      <RNModal
        isVisible={visibleCategoryInfoModal === 'CategoryInfoDialog'}
        onSwipeComplete={() => {
          // setIsPrimaryCategory(false);
          setVisibleCategoryInfoModal({ visibleCategoryInfoModal: null });
        }}
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
            {/* {isParentCategory === 'sub' ? ( */}
            {!isPrimaryCategory ? (
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
        onRequestClose={() => {
          setVisibleServicesTypeModal({ visibleServicesTypeModal: null });
        }}
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
                onPress={() => {
                  if (isUpdate === true) {
                    onSelectServiceTypeHandler('group');
                  }
                }}
                style={[commonStyle.searchBarText, { padding: 12 }]}>
                <View style={commonStyle.haederback}>
                  <Image
                    style={
                      // isUpdate
                      //   ? 
                      commonStyle.paymentmethodicon
                      // : [commonStyle.paymentmethodicon, { opacity: 0.4 }]
                    }
                    source={require('../../assets/images/users-orange.png')}
                  />
                </View>
                <Text
                  style={
                    // isUpdate
                    //   ?
                    commonStyle.blackTextR
                    // : [commonStyle.blackTextR, { opacity: 0.4 }]
                  }>
                  Group session
                </Text>
                {/* <View style={[commonStyle.paidbtn, {marginLeft: 10}]}>
                  <Text style={commonStyle.paidbtntext}>Pro feature</Text>
                </View> */}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={commonStyle.modalcancle}
              activeOpacity={0.9}
              onPress={() => {
                setVisibleServicesTypeModal({ visibleServicesTypeModal: null });
              }}>
              <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <RNModal
        visible={!!errorAlert}
        onRequestClose={() => {
          setErrorMsg(null);
        }}
        onBackdropPress={() => {
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
                { paddingHorizontal: 30 },
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

      {/* Can't Add Group Session Modal start */}
      <RNModal
        visible={visibleModal == 'CantAddGSModal'}
        onRequestClose={() => {
          // setErrorMsg(null);
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
              You can’t Add Group Session
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              You need Readyhubb PRO to Add Group Sessions. You can purchase it
              from the Readyhubb website.
            </Text>
            {/* <Button
              title="View Booking"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={[commonStyle.commonbuttonStyle, { width: 'auto' }]}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                // setVisibleModal(null)
                closeModal()
                navigation.navigate('bookingsProInner', {
                  rowId: 229,
                  // rowId: editableSession.id,
                });
              }}
            /> */}
          </View>
        </View>
      </RNModal>
      {/* Can't Add Group Session Modal */}
    </Fragment>
  );
};

export default ServiceDetails;
