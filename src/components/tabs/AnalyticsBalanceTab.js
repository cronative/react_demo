import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import moment from 'moment';
import { Body, Container, Left, List, ListItem, Title } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  RefreshControl,
  Linking,
  Dimensions,
} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryAxis,
  createContainer,
} from 'victory-native';
import { Button } from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
import { Get } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import circleMsgImg from '../../assets/images/circle-msg-icon.png';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import global from '../../components/commonservices/toast';
import {
  pendingVerificationRequest,
  pendingVerificationRequestClear,
} from '../../store/actions/verificationAction';
import { cashflowPeriodTypes, paymentMethods } from '../../utility/staticData';
import { DownArrow, DownloadIcon } from '../icons';
import { analyticsStatsPeriodTypes } from '../../utility/staticData';
import { AnalyticsPaymentModal } from '../modal';
import AnalyticsBalancePeriodModal from '../../components/modal/AnalyticsBalancePeriodModal';
import generateTickValuesForGraph from '../../utility/generateTickValuesForGraph';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { checkGracePeriodExpiry } from '../../utility/fetchGracePeriodData';
import { useFocusEffect } from '@react-navigation/native';
import { SUBSCRIPTION_MANAGEMENT_URL_WEB } from '../../api/constant';
import Svg from 'react-native-svg';
const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');
const { width, height } = Dimensions.get('window');

const getCardImage = (cardType) => {
  switch (cardType) {
    case 1:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/amex.png')}
        />
      );
    case 2:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/cartes_bancaires.png')}
        />
      );
    case 3:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/diners_club.png')}
        />
      );
    case 4:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/discover.png')}
        />
      );
    case 5:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/jcb.png')}
        />
      );
    case 6:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/mastercard.png')}
        />
      );
    case 7:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/visa.png')}
        />
      );
    case 8:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/unionpay.png')}
        />
      );
    default:
      return (
        <Image
          style={commonStyle.bookingUserAvaterImg}
          resizeMode={'contain'}
          source={require('../../assets/images/default.png')}
        />
      );
  }
};

const mappedTransactions = (transactionList) => {
  return transactionList?.reduce((acc, transaction) => {
    const transactionDate = moment.utc(transaction.date).format('D MMM YYYY');
    return acc[transactionDate]
      ? { ...acc, [transactionDate]: [...acc[transactionDate], transaction] }
      : {
        ...acc,
        [transactionDate]: [transaction],
      };
  }, {});
};

const AnalyticsBalanceTab = ({ activeTabValue }) => {
  // Declare the constant
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const verificationData = useSelector(
    (state) => state.VerificationReducer.pendingVerification,
  );
  const loderStatus = useSelector((state) => state.VerificationReducer.loader);
  const [visibleModal, setVisibleModal] = useState(false);
  const [documentsVisibleModal, setdocumentsVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const [withdrwalAmount, setWithdrwalAmount] = useState(0);
  const [isValidDocument, setIsValidDocument] = useState(0);
  const scrollViewRef = useRef(0);
  const [receivedGraphData, setReceivedGraphData] = useState([]);
  const [preparedGraphData, setPreparedGraphData] = useState([]);
  const [periodType, setPeriodType] = useState(1);
  const [paymentType, setPaymentType] = useState(3);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [recentTransaction, setTransaction] = useState([]);
  const [remarks, setRemakes] = useState('');
  const [docName, setDocName] = useState('');
  const [docImage, setDocImage] = useState('');
  const [imageId, setImageId] = useState(null);
  const [withdrawlStatus, setWithdrawlStatus] = useState(false);
  const [periodModalRadioIndex, setPeriodModalRadioIndex] = useState(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);

  const [earnedMoney, setEarnedMoney] = useState(0);
  const [earnedTaxMoney, setEarnedTaxMoney] = useState(0);
  //check if Pro Subscription
  const [isProSubscription, setIsProSubscription] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  // const SUBSCRIPTION_MANAGEMENT_URL_WEB =
  //   'https://staging.uiplonline.com/readyhubb-frontend-angular/dist/pro-account-subscription?redirectToSub=1';

  const getBusinessCompleteInfo = () => {
    Get('pro/completion-status', '')
      .then((result) => {
        if (result.status === 200) {
          if (result.data.percentage === 100) {
            setWithdrawlStatus(true);
          } else {
            setWithdrawlStatus(false);
          }
        }
      })
      .catch((error) => {
        console.log('Error : ', error);
      });
  };

  const permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Given');
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.log('error : ', err);
    }
  };

  const fetchTransaction = (exportVal = 0) => {
    Get(`/pro/recent-transactions?export=${exportVal}`)
      .then(({ data }) => {
        if (exportVal === 0) {
          console.log('transation data is', data);
          setTransaction(mappedTransactions(data));
        } else {
          Toast.show({
            type: 'info',
            position: 'bottom',
            zIndex: 999999,
            text1: 'Download',
            text2: 'Downloading PDF, please wait.',
            autoHide: false,
            onShow: () => { },
            onHide: () => { },
            onPress: () => { },
          });
          console.log(data);
          let pdfURL = data;
          console.log('PDF Link: ', pdfURL);

          if (Platform.OS == 'android') {
            // Initialize directry
            const dirs =
              Platform.OS == 'ios'
                ? RNFetchBlob.fs.dirs.DocumentDir
                : RNFetchBlob.fs.dirs.DownloadDir;

            console.log('recent-transactions data', dirs);

            // Configuration
            let configObj = {
              fileCache: true,
              path:
                Platform.OS == 'ios' ? dirs + `/transactions.pdf` : `${dirs}`,
            };

            if (Platform.OS != 'ios') {
              configObj['addAndroidDownloads'] = {
                useDownloadManager: true,
                notification: true,
                title: 'ReadyHubb',
                description: 'PDF Downloaded',
                mediaScannable: true,
                path: `${dirs}/transactionsData-${format(
                  Date.now(),
                  'yyyy-MM-dd-hh-mm-ss',
                )}.pdf`,
              };
            }
            RNFetchBlob.config(configObj)
              .fetch('GET', pdfURL, {})
              .then((res) => {
                Toast.hide();
                console.log('The file saved to ', res.path());
                if (res.path()) {
                  global.showToast('PDF downloaded successfully', 'success');
                }
                if (Platform.OS === 'ios') {
                  RNFetchBlob.ios.openDocument(res.data);
                }
              })
              .catch((e) => {
                console.log('error', e);
                global.showToast(
                  'Something went wrong, please try after some times',
                  'error',
                );
              });
          } else {
            let task = RNBackgroundDownloader.download({
              id: 'file123',
              url: pdfURL,
              destination: `${RNBackgroundDownloader.directories.documents}/invoice.pdf`,
            })
              .begin((expectedBytes) => {
                console.log(`Going to download ${expectedBytes} bytes!`);
              })
              .progress((percent) => {
                console.log(`Downloaded: ${percent * 100}%`);
              })
              .done(() => {
                RNFetchBlob.ios.openDocument(
                  `${RNBackgroundDownloader.directories.documents}/invoice.pdf`,
                );
                console.log('Download is done!');
                global.showToast('PDF downloaded successfully', 'success');
                // setExportingText('Export PDF invoice');
              })
              .error((error) => {
                global.showToast(
                  'Something went wrong, please try after some times',
                  'error',
                );
                console.log('Download canceled due to error: ', error);
                setExportingText('Export PDF invoice');
              });
          }
        }
      })
      .catch((error) => {
        console.log('recent-transactions error', error, error?.response);
      });
  };

  // This method will call on Modal show hide
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // This function is to get the withdrawl amount
  const waithdrawalBalance = () => {
    Get('/pro/wallet-balance')
      .then((result) => {
        if (result.status === 200 || result.status === '200') {
          if (
            result?.data?.availableBalance !== 'null' ||
            result?.data?.availableBalance !== null
          ) {
            console.log(result?.data);
            setWithdrwalAmount(result.data.availableBalance);
          }
        }
      })
      .catch((error) => {
        console.log('Error : ', error.response.data.message);
      });
  };

  // This method is for refresh tyhe page
  const refreshPage = () => {
    dispatch(pendingVerificationRequest());
    waithdrawalBalance();
  };

  // This function is for withdrawn the money
  const withdrawnMoney = () => {
    if (withdrawlStatus === true) {
      if (isValidDocument === 0) {
        navigation.navigate('IdVerification');
      } else if (isValidDocument === 1) {
        if (withdrwalAmount > 0) {
          navigation.navigate('AnalyticsBalanceWithdrowalMethod', {
            amount: withdrwalAmount,
          });
        } else {
          global.showToast('Insufficient wallet balance', 'error');
        }
      }
    } else {
      global.showToast(
        'Please complete your profile setting to proceed the next step',
        'error',
      );
    }
  };

  const checkAndWithdraw = async () => {
    checkGracePeriodExpiry()
      .then((isGracePeriodExpired) => {
        if (isGracePeriodExpired) {
          navigation.navigate('TrialFinished');
        } else {
          withdrawnMoney();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // This function is for check approval status
  const apoprovalStatus = () => {
    if (isValidDocument === 2 || isValidDocument === 3) {
      navigation.navigate('IdVerificationResubmitDocument', {
        docImageId: imageId,
        documentsType: isValidDocument,
        adminRemarks: isValidDocument === 2 ? remarks : null,
        proffesionalDoc: docName,
        proffesionalDocImage: docImage,
        headerMessage:
          isValidDocument === 2
            ? 'Resubmit verification'
            : 'Pending verification',
        btnMessage: isValidDocument === 2 ? true : false,
      });
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  const prepareGraphData = (data, diffType) => {
    const dataArray = [];

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (diffType === 1) {
      data.map((item, index) => {
        dataArray.push({
          x: moment(item.date).format('D MMM'),
          y: item.amount ? item.amount : 0,
          label: item.amount ? item.amount : 0,
        });
      });
      // response in months
    } else if (diffType === 2) {
      data.map((item, index) => {
        dataArray.push({
          x: months[item.month - 1],
          y: item.amount ? item.amount : 0,
          label: item.amount ? item.amount : 0,
        });
      });
      // response in years
    } else if (diffType === 3) {
      data.map((item, index) => {
        dataArray.push({
          x: `${item.year}`,
          y: item.amount ? item.amount : 0,
          label: item.amount ? item.amount : 0,
        });
      });
    } else {
      data.map((yearItem, index) => {
        yearItem.months.map((item) => {
          dataArray.push({
            x: `${months[item.month - 1]} ${yearItem.year}`,
            y: item.count,
            label: item.count,
          });
        });
      });
    }
    return dataArray;
  };

  const getFormattedGraphTicks = (t) => {
    if (t === 0) {
      return '0';
    } else if (t % 1000 === 0) {
      return `${t / 1000}k`;
    } else {
      return `${t}`;
    }
  };

  // useEffect(() => {
  //   console.log('periodType Effect');
  //   setPeriodModalRadioIndex(
  //     analyticsStatsPeriodTypes.findIndex(
  //       (pt) => pt.value === Number(periodType),
  //     ),
  //   );
  // }, [periodType]);

  useEffect(() => {
    if (activeTabValue == 0) {
      const url =
        `/pro/cashflow?paymentType=${paymentType}&periodType=${periodType}` +
        (fromTime && toTime
          ? `&startDate=${moment(fromTime).format(
            'YYYY-MM-DD',
          )}&endDate=${moment(toTime).format('YYYY-MM-DD')}`
          : '');
      setIsLoadingGraph(true);
      Get(url)
        .then((response) => {
          if (response.status === 200) {
            const { data } = response;
            setReceivedGraphData(data.graph);
            console.log('balance graph data: ', data);
            setEarnedMoney(data?.earnedMoney);
            setEarnedTaxMoney(data?.earnedTaxMoney);
            let output = prepareGraphData(data.graph, data.diffType);
            if (!!output) {
              setPreparedGraphData(output);
            }
            setIsLoadingGraph(false);
          } else {
            setReceivedGraphData([]);
            setPreparedGraphData([]);
            setIsLoadingGraph(false);
          }
        })
        .catch((error) => {
          console.log('Error : ', error.response.data.message);
        });
    } else {
      setReceivedGraphData([]);
      setPreparedGraphData([]);
    }
  }, [paymentType, periodType, fromTime, toTime, activeTabValue]);

  useEffect(() => {
    if (activeTabValue == 0) {
      fetchTransaction();
      getBusinessCompleteInfo();
      if (Platform.OS !== 'ios') {
        permission();
      }
    } else {
      setTransaction([]);
      dispatch(pendingVerificationRequestClear());
      // receivedGraphData([])  already being done elsewhere
    }
  }, [activeTabValue]);

  // Load only once
  useEffect(() => {
    console.log('Initial Effect');
    dispatch(pendingVerificationRequest());
    waithdrawalBalance();

    verifyAccess();

    // Refreshing the page
    EventEmitter.on('refreshAnalysitPage', () => {
      refreshPage();
    });
  }, []);

  // This method is for handle the response
  useEffect(() => {
    console.log('Verification Data Effect');
    if (verificationData && verificationData.status == 200) {
      let verificationStatus = verificationData?.data?.isVerified;
      let proIdentityData = verificationData?.data?.proIdentity;
      console.log(
        'Current verification status : ',
        verificationStatus,
        proIdentityData[0]?.remarks,
      );

      if (proIdentityData.length > 0) {
        setRemakes(
          !!proIdentityData[0]?.remarks ? proIdentityData[0]?.remarks : null,
        );
        setDocName(
          proIdentityData[0]?.name == 'drivingLicence'
            ? 'driver license'
            : 'id card',
        );
        setDocImage(proIdentityData[0]?.url);
        setImageId(proIdentityData[0]?.id);
      } else {
        setRemakes(null);
        setDocName(null);
        setDocImage(null);
        setImageId(null);
      }
      if (verificationStatus === 0 || verificationStatus === '0') {
        setIsValidDocument(0);
      } else if (verificationStatus === 1 || verificationStatus === '1') {
        setIsValidDocument(1);
      } else if (verificationStatus === 2 || verificationStatus === '2') {
        setIsValidDocument(2);
      } else if (verificationStatus === 3 || verificationStatus === '3') {
        setIsValidDocument(3);
      }
    } else {
      dispatch(pendingVerificationRequestClear());
    }
  }, [verificationData]);

  useFocusEffect(useCallback(() => verifyAccess, []));

  const verifyAccess = () => {
    // setIsLoadingVerify(true);
    setRefreshing(true);
    Get('/pro/subcription-plan')
      .then((response) => {
        // isExpire = 2 => Grace period ,  == 1 => total expired , == 0 => not expired
        //type == 1 => trial plan , == 2 => normal plan
        console.log('subs response **^^*', JSON.stringify(response));
        setRefreshing(false);
        if (response.data.type === 1) {
          // hide graph
          console.log('check 1');
          setIsProSubscription(false);
        } else if (response.data.type === 2) {
          setIsProSubscription(true);
        }
        // else {
        //   if (response.data.isExpire == 1 || response.data.isExpire == 2) {
        //     //  hide graph
        //     console.log('check 2');
        //     setIsProSubscription(false);
        //   } else if (response.data.isExpire === 0) {
        //     // show graph
        //     console.log('check 3');
        //     setIsProSubscription(true);
        //   }
        // }

        if (response.data.isExpire != 0) setIsExpired(true);
        else setIsExpired(false);
      })
      .catch((err) => {
        setRefreshing(false);
        console.log(err);
        // setIsProSubscription(false);
      });
  };

  const onUpgradeClick = () => {
    Linking.canOpenURL(SUBSCRIPTION_MANAGEMENT_URL_WEB)
      .then((supported) => {
        if (!supported) {
          this.showToast('Something went wrong.');
        } else {
          Linking.openURL(SUBSCRIPTION_MANAGEMENT_URL_WEB);
        }
      })
      .catch((err) => this.showToast('Something went wrong.'));
  };

  const AnalyticsStatisticsNotProSubscription = (
    <View style={[commonStyle.nosubscribtionstaticswrap, commonStyle.pt2]}>
      <View style={commonStyle.nosubscribtionstaticstext}>
        <Text
          style={[
            commonStyle.blackText16,
            commonStyle.textCenter,
            { lineHeight: 25 },
          ]}>
          <Title
            onPress={onUpgradeClick}
            style={[
              commonStyle.clearfilterText,
              { fontFamily: 'SofiaPro-SemiBold' },
            ]}>
            Upgrade
          </Title>{' '}
          your subscription to Pro to see all statistics
        </Text>
      </View>
    </View>
  );

  return (
    <Container>
      {isLoadingGraph || loderStatus ? <ActivityLoaderSolid /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
        }>
        <View style={[commonStyle.setupCardBox, commonStyle.mt1]}>
          <List style={commonStyle.switchAccountWrap}>
            <ListItem thumbnail style={commonStyle.switchAccountView}>
              <Left style={commonStyle.switchAccountavater}>
                <Image
                  style={commonStyle.avatericon}
                  defaultSource={require('../../assets/images/default.png')}
                  source={require('../../assets/images/balance-icon.png')}
                />
              </Left>
              <Body style={commonStyle.switchAccountbody}>
                <Text style={[commonStyle.grayText14, commonStyle.mb1]}>
                  Wallet balance
                </Text>
                <Text style={commonStyle.subheading}>
                  ${Number(withdrwalAmount).toFixed(2)}
                </Text>
              </Body>
            </ListItem>
          </List>

          {isValidDocument == 0 || isValidDocument == 1 ? (
            !!isExpired ? (
              <View style={commonStyle.nosubscribtionstaticstext}>
                <Text
                  style={[
                    commonStyle.blackText16,
                    commonStyle.textCenter,
                    { lineHeight: 25 },
                  ]}>
                  <Title
                    onPress={onUpgradeClick}
                    style={[
                      commonStyle.clearfilterText,
                      { fontFamily: 'SofiaPro-SemiBold' },
                    ]}>
                    Upgrade
                  </Title>{' '}
                  your subscription to Pro to see all statistics
                </Text>
              </View>
            )
              : (null
                // !isProSubscription && (
                //   <List style={[commonStyle.payinCashinfowrap, commonStyle.mt1]}>
                //     <ListItem thumbnail style={commonStyle.categoriseListItem}>
                //       <View style={commonStyle.serviceListtouch}>
                //         <Left style={{ marginRight: 8, alignSelf: 'flex-start' }}>
                //           <Image
                //             source={require('../../assets/images/payincashicon.png')}
                //             style={commonStyle.payincashimg}
                //             resizeMode={'contain'}
                //           />
                //         </Left>

                //         <Body style={commonStyle.categoriseListBody}>r
                //           <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                //             Currently, you are using Readyhubb trial version.
                //             Online payments are not avaliable
                //           </Text>
                //         </Body>
                //       </View>
                //     </ListItem>
                //   </List>
                // )
              )
          ) :
            (
              <List style={[commonStyle.payinCashinfowrap, commonStyle.mt1]}>
                <ListItem thumbnail style={commonStyle.categoriseListItem}>
                  <View style={commonStyle.serviceListtouch}>
                    <Left style={{ marginRight: 8, alignSelf: 'flex-start' }}>
                      <Image
                        source={require('../../assets/images/payincashicon.png')}
                        style={commonStyle.payincashimg}
                        resizeMode={'contain'}
                      />
                    </Left>

                    <Body style={commonStyle.categoriseListBody}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                        Your ID is pending verification. It will be verified in
                        2-3 business days and then you’ll be able to withdraw your
                        balance.
                      </Text>
                    </Body>
                  </View>
                </ListItem>
              </List>
            )}
          {/* {!isProSubscription ? (
            <List style={[commonStyle.payinCashinfowrap, commonStyle.mt1]}>
              <ListItem thumbnail style={commonStyle.categoriseListItem}>
                <View style={commonStyle.serviceListtouch}>
                  <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                    <Image
                      source={require('../../assets/images/payincashicon.png')}
                      style={commonStyle.payincashimg}
                      resizeMode={'contain'}
                    />
                  </Left>

                  <Body style={commonStyle.categoriseListBody}>
                    <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                      Currently, you are using Readyhubb trial version. Online
                      payments are not avaliable
                    </Text>
                  </Body>
                </View>
              </ListItem>
            </List>
          ) : (
            isProSubscription == '1' && (
              <View style={commonStyle.nosubscribtionstaticstext}>
                <Text
                  style={[
                    commonStyle.blackText16,
                    commonStyle.textCenter,
                    {lineHeight: 25},
                  ]}>
                  <Title
                    onPress={onUpgradeClick}
                    style={[
                      commonStyle.clearfilterText,
                      {fontFamily: 'SofiaPro-SemiBold'},
                    ]}>
                    Upgrade
                  </Title>{' '}
                  your subscription to Pro to see all statistics
                </Text>
              </View>
            )
          )} */}

          {isValidDocument == 0 || isValidDocument == 1 ? (
            <Button
              title="Withdraw"
              containerStyle={[commonStyle.buttoncontainerothersStyle]}
              buttonStyle={[
                commonStyle.changePassModalbutton,
                { backgroundColor: '#FFE8E2' },
              ]}
              titleStyle={[commonStyle.buttontitleStyle, { color: '#F36A46' }]}
              // onPress={withdrawnMoney}
              onPress={checkAndWithdraw}
            />
          ) : (
            <Button
              title="Check Approval Status"
              containerStyle={[commonStyle.buttoncontainerothersStyle]}
              buttonStyle={[
                commonStyle.changePassModalbutton,
                { backgroundColor: '#FFE8E2' },
              ]}
              titleStyle={[commonStyle.buttontitleStyle, { color: '#F36A46' }]}
              onPress={apoprovalStatus}
            />
          )}
        </View>
        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Cashflow analytics
          </Text>
          <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
            <TouchableOpacity
              style={commonStyle.analyticsdropdown}
              onPress={() => {
                setVisibleModal('AnalyticsPeriodDialog');
              }}
              activeOpacity={0.5}>
              <Text style={commonStyle.categorytagsText}>Period:</Text>
              <Text
                style={[
                  commonStyle.filterBlackText,
                  { marginRight: 8, marginLeft: 5 },
                ]}>
                {
                  cashflowPeriodTypes?.find((pt) => pt.value === periodType)
                    ?.name
                }
              </Text>
              <DownArrow />
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.analyticsdropdown}
              onPress={() => {
                setVisibleModal('AnalyticsPaymentDialog');
              }}
              activeOpacity={0.5}>
              <Text style={commonStyle.categorytagsText}>Payment type:</Text>
              <Text
                style={[
                  commonStyle.filterBlackText,
                  { marginRight: 8, marginLeft: 5 },
                ]}>
                {paymentMethods?.find((pm) => pm.value === paymentType)?.name}
              </Text>
              <DownArrow />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10, marginBottom: 4 }}>
            <Text style={commonStyle.grayText16}>
              Earned:{' '}
              <Title style={commonStyle.blackTextR}>${earnedMoney}</Title>
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={commonStyle.grayText16}>
              Tax Earned:{' '}
              <Title style={commonStyle.blackTextR}>${earnedTaxMoney}</Title>
            </Text>
          </View>
          {!isLoadingGraph && preparedGraphData ? (
            <ScrollView
              horizontal={true}
              style={{ marginLeft: -5 }}
              showsHorizontalScrollIndicator={false}>
              <VictoryChart
                domainPadding={{ x: 20, y: 40 }}
                padding={{
                  left: 32,
                  bottom: 32,
                  top: 0,
                  right: 0,
                }}
                theme={VictoryTheme.material}
                width={preparedGraphData.length * 72}
                events={[
                  {
                    target: 'data',
                    childName: 'bar-1',
                    eventHandlers: {
                      onPress: () => {
                        return [
                          {
                            target: 'data',
                            mutation: (props) => ({
                              style: {
                                fill:
                                  props.style.fill === '#F36A46'
                                    ? '#FFEBCE'
                                    : '#F36A46',
                              },
                            }),
                          },
                          {
                            target: 'labels',
                            mutation: (props) => {
                              return {
                                active: !props.active,
                              };
                            },
                          },
                        ];
                      },
                    },
                  },
                ]}
                containerComponent={<Svg />}>
                <VictoryAxis
                  dependentAxis={true}
                  tickValues={generateTickValuesForGraph(preparedGraphData)}
                  tickFormat={(t) => getFormattedGraphTicks(t)}
                />
                <VictoryAxis dependentAxis={false} />
                <VictoryBar
                  name="bar-1"
                  labelComponent={
                    <VictoryTooltip
                      flyoutPadding={{ top: 5, bottom: 5, left: 1, right: 1 }}
                      constrainToVisibleArea={true}
                      renderInPortal={false}
                      text={(datum) => {
                        return `$${Math.round(datum.datum.y)}`;
                      }}
                      flyoutStyle={{
                        backgroundColor: 'transparent',
                        fill: 'transparent',
                        stroke: 'transparent',
                      }}
                      style={{
                        fill: '#F36A46',
                      }}
                    />
                  }
                  alignment="middle"
                  barRatio={0.8}
                  cornerRadius={6}
                  data={preparedGraphData}
                  x="x"
                  y="y"
                  style={{
                    data: { fill: '#FFEBCE', width: 40 },
                    labels: { fontSize: 12 },
                    parent: { border: '1px solid #fff' },
                  }}
                />
              </VictoryChart>
            </ScrollView>
          ) : null}
          {/* {!isProSubscription ? AnalyticsStatisticsNotProSubscription : null} */}
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <View style={[commonStyle.paymentMethodheading, { paddingBottom: 10 }]}>
            <Text style={[commonStyle.subtextbold]}>Recent transactions</Text>
            <TouchableOpacity
              style={commonStyle.moreInfoCircle}
              onPress={() => fetchTransaction(1)}>
              <DownloadIcon />
            </TouchableOpacity>
          </View>

          {Object.keys(recentTransaction).map((transactionDate, index) => (
            <View key={index} style={commonStyle.recentTransactionswrap}>
              <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                {transactionDate}
              </Text>
              {recentTransaction[transactionDate].map(
                (transactionData, index) => (
                  <List
                    key={transactionData.reservationId + index}
                    style={{ paddingVertical: 10 }}>
                    <ListItem thumbnail style={commonStyle.switchAccountView}>
                      <Left style={commonStyle.transactionsavater}>
                        {transactionData.type === 'booking' ||
                          transactionData.type == 'tip' ? (
                          <Image
                            // style={commonStyle.transactionsavaterImg} this style  was causing problems
                            style={[
                              commonStyle.bookingUserAvaterImg,
                              {
                                height: '100%',
                                width: '100%',
                              },
                            ]}
                            resizeMode={'contain'}
                            source={
                              transactionData.profileImage
                                ? { uri: transactionData.profileImage }
                                : require('../../assets/images/default-user.png')
                            }
                          />
                        ) : null}
                        {(transactionData.type === 'withdraw' ||
                          transactionData.type === 'refund') &&
                          transactionData.withdrawalType === 'bank_account' ? (
                          <Image
                            style={commonStyle.bookingUserAvaterImg}
                            resizeMode={'contain'}
                            source={require('../../assets/images/bank.png')}
                          />
                        ) : null}
                        {(transactionData.type === 'withdraw' ||
                          transactionData.type === 'refund') &&
                          transactionData.withdrawalType === 'card' &&
                          transactionData.cardType
                          ? getCardImage(transactionData.cardType)
                          : null}
                        {transactionData.type === 'referral' ? (
                          <Image
                            style={commonStyle.bookingUserAvaterImg}
                            resizeMode={'contain'}
                            source={require('../../assets/images/gift-box.png')}
                          />
                        ) : null}
                      </Left>
                      <Body style={commonStyle.switchAccountbody}>
                        <Text
                          style={[commonStyle.blackTextR, commonStyle.mb05]}>
                          {transactionData?.title}{' '}
                          {transactionData?.type == 'tip' && '- tip'}
                        </Text>
                        <Text style={commonStyle.grayText14}>
                          {moment(transactionData.date).format(
                            'D MMM YYYY, h:mm a',
                          )}
                        </Text>
                      </Body>
                      <TouchableHighlight style={{ alignSelf: 'flex-start' }}>
                        <Text
                          style={
                            transactionData.type === 'withdraw' ||
                              transactionData.type === 'referral' ||
                              transactionData.type === 'refund'
                              ? commonStyle.blackTextR
                              : commonStyle.greenTextR
                          }>
                          {transactionData.type === 'withdraw' ||
                            transactionData.type === 'referral' ||
                            transactionData.type === 'refund'
                            ? '-'
                            : '+'}
                          ${transactionData?.amount}
                        </Text>
                      </TouchableHighlight>
                    </ListItem>
                  </List>
                ),
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Analytics Period modal start */}
      <Modal
        isVisible={visibleModal === 'AnalyticsPeriodDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={[commonStyle.scrollableModal, { maxHeight: height - 20 }]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <AnalyticsBalancePeriodModal
              periodType={periodType}
              setPeriodType={setPeriodType}
              fromTime={fromTime}
              setFromTime={setFromTime}
              toTime={toTime}
              setToTime={setToTime}
              radioIndex={periodModalRadioIndex}
              setRadioIndex={setPeriodModalRadioIndex}
              setVisibleModal={setVisibleModal}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Analytics Period modal End */}

      {/* Analytics Payment Type modal start */}
      <Modal
        isVisible={visibleModal === 'AnalyticsPaymentDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
        swipeThreshold={50}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollableModal}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 15 }]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <AnalyticsPaymentModal
              paymentMethod={paymentType}
              setPaymentMethod={setPaymentType}
              setVisibleModal={setVisibleModal}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Analytics Payment Type modal End */}

      {/* Document verification warning message modal start */}
      <Modal
        visible={documentsVisibleModal}
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
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={commonStyle.messageIcon}>
              <Image source={circleMsgImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              Your document verification is on pending stage
            </Text>
          </View>
        </View>
      </Modal>
      {/* Document verification warning message modal end */}
    </Container>
  );
};

export default AnalyticsBalanceTab;
