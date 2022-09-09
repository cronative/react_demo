import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Container, Title } from 'native-base';
import { Button } from 'react-native-elements';
import {
  VictoryBar,
  Bar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryAxis,
  createContainer,
} from 'victory-native';
import Modal from 'react-native-modal';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { BarChart } from 'react-native-chart-kit';
import Pie from 'react-native-pie';
import { Get } from '../../api/apiAgent';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { DownArrow, DownArrowWhite } from '../icons';
import { StatisticsServicesModal } from '../modal';
import commonStyle from '../../assets/css/mainStyle';
import AnalyticsPeriodSelectionModal from '../../components/modal/AnalyticsPeriodSelectionModal';
import moment from 'moment';
import { analyticsStatsPeriodTypes } from '../../utility/staticData';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import { buildFailureTestResult } from '@jest/test-result';
import global from '../commonservices/toast';
import generateTickValuesForGraph from '../../utility/generateTickValuesForGraph';
import { SUBSCRIPTION_MANAGEMENT_URL_WEB } from '../../api/constant';
const { width, height } = Dimensions.get('window');

const AnalyticsStatisticsTab = ({ activeTabValue }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // converting at state data
  const [upcommingbarChartdata, setUpcommingbarChartdata] = useState([]);
  const [profileViewbarChartdata, setpProfileViewbarChartdata] = useState([]);
  const [inspirationalbarChartdata, SetInspirationalbarChartdata] = useState(
    [],
  );
  const [savesInspirationalbarChartdata, SetSavesInspirationalbarChartdata] =
    useState([]);
  const [pieData, setPieData] = useState([]);

  // const SUBSCRIPTION_MANAGEMENT_URL_WEB =
  //   'https://staging.uiplonline.com/readyhubb-frontend-angular/dist/pro-account-subscription?redirectToSub=1';

  const [pieListData, setPieListData] = useState([]);
  const [pieType, setPieType] = useState(1); //type of pie chart (catyegory/servies). can be 1 or 2. 1=category pie,2=services pie

  const [upcomingBookingSelect, setUpcomingBookingSelect] = useState(0);
  const [profileViewsSelect, setProfileViewsSelect] = useState(0);
  const [viewsInspirationalPostSelect, setViewsInspirationalPostSelect] =
    useState(0);
  const [savesInspirationalPostSelect, setSavesInspirationalPostSelect] =
    useState(0);

  //Determines the section (graph) for which the custom date is being set
  const [focussedSection, setFocussedSection] = useState(null);

  //CUSTOM DATE STATES FOR VARIOUS SECTIONS
  // Start Change: Snehasish Das Issue #1488
  const [upcomingCustomDates, setUpcomingCustomDates] = useState([]);
  const [profileViewsCustomDates, setProfileViewsCustomDates] = useState([]);
  const [inspirePostCustomDates, setInspirePostCustomDates] = useState([]);
  const [inspireSavesCustomDates, setInspireSavesCustomDates] = useState([]);
  const [popServiceCustomDates, setPopServiceCustomDates] = useState([]);
  // End Change: Snehasish Das Issue #1488

  // RANGES FOR VARIOUS SECTIONS (1 = this month, 2 = all time, 3 = custom)
  const [upcomingRange, setUpcomingRange] = useState(1);
  const [profileViewsRange, setProfileViewsRange] = useState(1);
  const [inspirePostPeriodType, setInspirePostPeriodType] = useState(1);
  const [inspireSavesPeriodType, setInspireSavesPeriodType] = useState(1);
  const [popServiceRange, setPopServiceRange] = useState(1);

  //USED to temporarily hold Time Meriod modal state before it is applied
  const [periodType, setPeriodType] = useState(null);

  //==================================================================

  const [fromTimeUpcoming, setFromTimeUpcoming] = useState(null);
  const [fromTimeProfileViews, setFromTimeProfileViews] = useState(null);
  const [fromTimeInspirationPosts, setFromTimeInspirationPosts] =
    useState(null);
  const [fromTimeInspirationSaves, setFromTimeInspirationSaves] =
    useState(null);
  const [fromTimePopService, setFromTimePopService] = useState(null);

  const [toTimeUpcoming, setToTimeUpcoming] = useState(null);
  const [toTimeProfileViews, setToTimeProfileViews] = useState(null);
  const [toTimeInspirationPosts, setToTimeInspirationPosts] = useState(null);
  const [toTimeInspirationSaves, setToTimeInspirationSaves] = useState(null);
  const [toTimePopService, setToTimePopService] = useState(null);

  //==================================================================

  const [proServiceCount, setProServiceCount] = useState(null);

  //check if Pro Subscription
  const [isProSubscription, setIsProSubscription] = useState(false);
  //check if Plan Expired
  const [isPlanExpired, setIsPlanExpired] = useState(false);

  const [upcomingCount, setUpcomingCount] = useState(null);
  const [profileViewCount, setProfileViewCount] = useState(null);
  const [inspirePostCount, setInspirePostCount] = useState(null);
  const [inspireSaveCount, setInspireSaveCount] = useState(null);

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingInspirationPost, setIsLoadingInspirationPost] =
    useState(false);
  const [isLoadingInspirationSaves, setIsLoadingInspirationSaves] =
    useState(false);
  const [isLoadingPie, setIsLoadingPie] = useState(false);
  const [customDateErrorFlag, setCustomDateErrorFlag] = useState(false);
  const pageFocussed = useIsFocused();

  const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

  useEffect(() => {
    verifyAccess();
  }, [pageFocussed]);

  useEffect(() => {
    // console.log('upcoming range: ', upcomingRange)
    // console.log('upcoming custom: ', upcomingCustomDates)
    // console.log('upcoming sub: ', isProSubscription)

    if (isProSubscription && activeTabValue == 2) {
      if (
        upcomingRange == 3 &&
        upcomingCustomDates?.length &&
        !upcomingCustomDates.includes('Invalid date')
      ) {
        fetchUpcomingGraphData(
          upcomingRange,
          upcomingCustomDates[0],
          upcomingCustomDates[1],
        );
      } else if (upcomingRange == 1 || upcomingRange == 2) {
        fetchUpcomingGraphData(upcomingRange, '', '');
      }
    } else {
      // optimization
      setUpcommingbarChartdata([]);
    }
  }, [upcomingRange, upcomingCustomDates, isProSubscription, activeTabValue]);

  useEffect(() => {
    if (isProSubscription && activeTabValue == 2) {
      if (
        profileViewsRange == 3 &&
        profileViewsCustomDates?.length &&
        !profileViewsCustomDates.includes('Invalid date')
      ) {
        fetchProfileGraphData(
          profileViewsRange,
          profileViewsCustomDates[0],
          profileViewsCustomDates[1],
        );
      } else if (profileViewsRange == 1 || profileViewsRange == 2) {
        fetchProfileGraphData(profileViewsRange, '', '');
      }
    } else {
      setpProfileViewbarChartdata([]);
    }
  }, [
    profileViewsRange,
    profileViewsCustomDates,
    isProSubscription,
    activeTabValue,
  ]);

  useEffect(() => {
    if (isProSubscription && activeTabValue == 2) {
      if (
        inspirePostPeriodType == 3 &&
        inspirePostCustomDates?.length &&
        !inspirePostCustomDates.includes('Invalid date')
      ) {
        fetchInspirationGraphData(
          inspirePostPeriodType,
          1,
          inspirePostCustomDates[0],
          inspirePostCustomDates[1],
        );
      } else if (inspirePostPeriodType == 1 || inspirePostPeriodType == 2) {
        fetchInspirationGraphData(inspirePostPeriodType, 1, '', '');
      }
    } else {
      SetInspirationalbarChartdata([]);
    }
  }, [
    inspirePostPeriodType,
    inspirePostCustomDates,
    isProSubscription,
    activeTabValue,
  ]);
  useEffect(() => {
    if (isProSubscription && activeTabValue == 2) {
      if (
        inspireSavesPeriodType == 3 &&
        inspireSavesCustomDates?.length &&
        !inspireSavesCustomDates.includes('Invalid date')
      ) {
        fetchSaveGraphData(
          inspireSavesPeriodType,
          3,
          inspireSavesCustomDates[0],
          inspireSavesCustomDates[1],
        );
      } else if (inspireSavesPeriodType == 1 || inspireSavesPeriodType == 2) {
        fetchSaveGraphData(inspireSavesPeriodType, 3, '', '');
      }
    } else {
      SetSavesInspirationalbarChartdata([]);
    }
  }, [
    inspireSavesPeriodType,
    inspireSavesCustomDates,
    isProSubscription,
    activeTabValue,
  ]);

  useEffect(() => {
    if (isProSubscription && activeTabValue == 2) {
      if (popServiceRange == 3) {
        if (
          popServiceCustomDates?.length &&
          !popServiceCustomDates.includes('Invalid date')
        ) {
          fetchPieData(
            pieType,
            popServiceRange,
            popServiceCustomDates[0],
            popServiceCustomDates[1],
          );
        }
      } else if (popServiceRange == 1 || popServiceRange == 2) {
        fetchPieData(pieType, popServiceRange, '', '');
      }
    } else {
      setPieData([]);
    }
  }, [
    popServiceCustomDates,
    pieType,
    popServiceRange,
    isProSubscription,
    activeTabValue,
  ]);

  const refreshPage = () => {
    if (isProSubscription) {
      setRefreshing(true);

      if (
        upcomingRange == 3 &&
        upcomingCustomDates &&
        !upcomingCustomDates.includes('Invalid date')
      ) {
        fetchUpcomingGraphData(
          upcomingRange,
          upcomingCustomDates[0],
          upcomingCustomDates[1],
        );
      } else if (upcomingRange === 1 || upcomingRange === 2) {
        fetchUpcomingGraphData(upcomingRange, '', '');
      }

      if (
        profileViewsRange == 3 &&
        profileViewsCustomDates &&
        !profileViewsCustomDates.includes('Invalid date')
      ) {
        fetchProfileGraphData(
          profileViewsRange,
          profileViewsCustomDates[0],
          profileViewsCustomDates[1],
        );
      } else if (profileViewsRange === 1 || profileViewsRange === 2) {
        fetchProfileGraphData(profileViewsRange, '', '');
      }

      if (
        inspirePostPeriodType == 3 &&
        inspirePostCustomDates &&
        !inspirePostCustomDates.includes('Invalid date')
      ) {
        fetchInspirationGraphData(
          inspirePostPeriodType,
          1,
          inspirePostCustomDates[0],
          inspirePostCustomDates[1],
        );
      } else if (inspirePostPeriodType === 1 || inspirePostPeriodType === 2) {
        fetchInspirationGraphData(inspirePostPeriodType, 1, '', '');
      }

      if (
        inspireSavesPeriodType == 3 &&
        inspireSavesCustomDates &&
        !inspireSavesCustomDates.includes('Invalid date')
      ) {
        fetchSaveGraphData(
          inspireSavesPeriodType,
          3,
          inspireSavesCustomDates[0],
          inspireSavesCustomDates[1],
        );
      } else if (inspireSavesPeriodType === 1 || inspireSavesPeriodType === 2) {
        fetchSaveGraphData(inspireSavesPeriodType, 3, '', '');
      }

      if (
        popServiceCustomDates &&
        !popServiceCustomDates.includes('Invalid date')
      ) {
        fetchPieData(
          pieType,
          popServiceRange,
          popServiceCustomDates[0],
          popServiceCustomDates[1],
        );
      }
    } else if (popServiceRange === 1 || popServiceRange === 2) {
      fetchPieData(pieType, popServiceRange, '', '');
    }
    setRefreshing(false);
    // fetchUpcomingGraphData(
    //   upcomingRange,
    //   upcomingCustomDates[0],
    //   upcomingCustomDates[1],
    // );
    // fetchProfileGraphData(
    //   profileViewsRange,
    //   profileViewsCustomDates[0],
    //   profileViewsCustomDates[1],
    // );
    // fetchInspirationGraphData(
    //   inspirePostPeriodType,
    //   1,
    //   inspirePostCustomDates[0],
    //   inspirePostCustomDates[1],
    // );
    // fetchSaveGraphData(
    //   inspireSavesPeriodType,
    //   3,
    //   inspireSavesCustomDates[0],
    //   inspireSavesCustomDates[1],
    // );
    // fetchPieData(
    //   pieType,
    //   popServiceRange,
    //   popServiceCustomDates[0],
    //   popServiceCustomDates[1],
    // );
  };

  /**
   * This method will Select on upcoming Booking Fillter.
   */
  const upcomingBookingSelectHelper = (index, value) => {
    setUpcomingBookingSelect(index);
    setUpcomingRange(value);

    //setting custom dates to null
    if (upcomingCustomDates) setUpcomingCustomDates(null);
  };

  /**
   * This method will Select on Profile View Fillter.
   */
  const profileViewsSelectHelper = (index, value) => {
    setProfileViewsSelect(index);
    setProfileViewsRange(value);

    if (profileViewsCustomDates) setProfileViewsCustomDates(null);
  };

  /**
   * This method will Select on views Inspirational Post Fillter.
   */
  const viewsInspirationalPostSelectHelper = (index, value) => {
    setViewsInspirationalPostSelect(index);
    setInspirePostPeriodType(value);
    // fetchInspirationGraphData(periodType);

    if (inspirePostCustomDates) setInspirePostCustomDates(null);
  };

  /**
   * This method will Select on Saves Inspirational Post Fillter.
   */
  const savesInspirationalPostSelectHelper = (index, value) => {
    setSavesInspirationalPostSelect(index);
    setInspireSavesPeriodType(value);
    // fetchSaveGraphData(periodType);

    if (inspireSavesCustomDates) setInspireSavesCustomDates(null);
  };

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
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

  const verifyAccess = () => {
    setIsLoadingVerify(true);
    setRefreshing(true);
    // Get('/pro/verify-access?slug=AnalyticsStatisticsTab')
    //   .then((response) => {
    //     if (response.status == 200 && response.code == 10) {
    //       //ACCESS GRANTED
    //       setIsLoadingVerify(false);
    //       setRefreshing(false);
    //       setIsProSubscription(true);
    //       // refreshPage();
    //     }
    //   })
    //   .catch((err) => {
    //     setIsLoadingVerify(false);
    //     setRefreshing(false);
    //     let status = err.response.status;
    //     let code = err.response.data.code;

    //     if (status == 403 && code == 1) {
    //       //Not a Pro Account
    //       setIsProSubscription(false);
    //     } else if (status == 403 && code == 7) {
    //       //plan expired, has access
    //       // navigation.navigate('SubscriptionInfo');
    //       // navigation.navigate('TrialFinished');
    //     } else if (status == 403 && code == 6) {
    //       //plan expired, has NO access
    //       setIsProSubscription(false);
    //       // navigation.navigate('SubscriptionInfo');
    //     } else if (status == 403 && code == 8) {
    //       //plan exists (essential), has NO access (not PRO)
    //       setIsProSubscription(false);
    //       // navigation.navigate('SubscriptionInfo');
    //     }
    //   });
    Get('/pro/subcription-plan')
      .then((response) => {
        console.log('subs response', response);
        setRefreshing(false);
        setIsLoadingVerify(false);
        if (response.data.type === 1) {
          // hide graph
          setIsProSubscription(false);
        } else {
          if (response.data.isExpire == 1 || response.data.isExpire == 2) {
            //  hide graph
            setIsProSubscription(false);
          } else if (response.data.isExpire === 0) {
            // show graph
            setIsProSubscription(true);
          }
        }
      })
      .catch((err) => {
        setRefreshing(false);
        setIsLoadingVerify(false);
        console.log(err);
        setIsProSubscription(false);
      });
  };
  /**
   * =======================.
   */
  let fetchUpcomingGraphData = (range = 1, startDate = '', endDate = '') => {
    setIsLoadingUpcoming(true);
    setUpcomingCount(null);
    Get(
      '/pro/analytics/upcoming-graph-c?range=' +
      range +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate,
    )
      .then((result) => {
        if (result.status === 200) {
          if (result.data.length > 0 && result.datesDiffType) {
            console.log('UPCOMING DATA RESPONSE: ', result.data);
            let output = prepareUpcomingBarChartData(
              result.data,
              result.datesDiffType,
            );
            setUpcommingbarChartdata(output);
            setUpcomingCount(result.count);
          } else {
            setUpcommingbarChartdata(null);
          }
          setIsLoadingUpcoming(false);
        } else {
          setUpcommingbarChartdata(null);
          setIsLoadingUpcoming(false);
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        setIsLoadingUpcoming(false);
        console.log('Upcoming Data Error : ', error);
        setUpcommingbarChartdata(null);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  let fetchProfileGraphData = (range = 1, startDate = '', endDate = '') => {
    setIsLoadingProfile(true);
    setProfileViewCount(null);
    Get(
      '/pro/analytics/prof-views-c?range=' +
      range +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate,
    )
      .then((result) => {
        setIsLoadingProfile(buildFailureTestResult);
        if (
          result.status === 200 &&
          result.data.length &&
          result.datesDiffType
        ) {
          console.log('PROFILE VIEWS DATA RESPONSE: ', result.data);
          let output = prepareProfileViewsBarChartData(
            result.data,
            result.datesDiffType,
          );
          setpProfileViewbarChartdata(output);
          setProfileViewCount(result.count);
        } else {
          setpProfileViewbarChartdata(null);
          global.showToast('Something went wrong', 'error');
        }
        setIsLoadingProfile(false);
      })
      .catch((error) => {
        setIsLoadingProfile(false);
        console.log('Profile Views Error : ', error);
        setpProfileViewbarChartdata(null);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  // inspitation story graph
  let fetchInspirationGraphData = (
    periodType = 1,
    type = 1,
    startDate = '',
    endDate = '',
  ) => {
    setIsLoadingInspirationPost(true);
    setInspirePostCount(null);
    //+'&startDate='+startDate+'&endDate='+endDate
    Get(
      '/pro/inspiration-story-stats?periodType=' +
      periodType +
      '&type=' +
      type +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate,
    )
      .then((result) => {
        if (result.status === 200 && result.data.graphArray.length) {
          console.log('INSPIRATION POST DATA RESPONSE: ', result.data);
          let output = prepareInspireBarChartData(
            result.data.graphArray,
            result.data.diffType,
          );
          SetInspirationalbarChartdata(output);
          setInspirePostCount(result.data.totalCount);
        } else {
          SetInspirationalbarChartdata(null);
          global.showToast('Something went wrong', 'error');
        }
        setIsLoadingInspirationPost(false);
      })
      .catch((error) => {
        setIsLoadingInspirationPost(false);

        console.log('Inspiration Post Error : ', error);
        SetInspirationalbarChartdata(null);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  //showing save post
  let fetchSaveGraphData = (
    periodType = 1,
    type = 3,
    startDate = '',
    endDate = '',
  ) => {
    setIsLoadingInspirationSaves(true);
    setInspireSaveCount(null);
    //+'&startDate='+startDate+'&endDate='+endDate
    Get(
      '/pro/inspiration-story-stats?periodType=' +
      periodType +
      '&type=' +
      type +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate,
    )
      .then((result) => {
        if (result.status === 200 && result.data.graphArray.length) {
          console.log('INSPIRATION SAVES DATA RESPONSE', result.data);
          let output = prepareInspireBarChartData(
            result.data.graphArray,
            result.data.diffType,
          );
          SetSavesInspirationalbarChartdata(output);
          setInspireSaveCount(result.data.totalCount);
        } else {
          SetSavesInspirationalbarChartdata(null);
          global.showToast('Something went wrong', 'error');
        }
        setIsLoadingInspirationSaves(false);
      })
      .catch((error) => {
        setIsLoadingInspirationSaves(false);
        console.log('Inspiration Saves Error : ', error);
        SetSavesInspirationalbarChartdata(null);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  // let setDateForFilter = (selectedDates) => {
  //   if (
  //     selectedDates &&
  //     [
  //       'upcoming',
  //       'profileViews',
  //       'inspire_posts',
  //       'inspire_saves',
  //       'pop_service',
  //     ].includes(focussedSection)
  //   ) {
  //     const formatted_dates = selectedDates.map((date) =>
  //       moment(date).format('YYYY-MM-D'),
  //     );
  //     console.log(formatted_dates);
  //     // setDate(formatted_dates);
  //     switch (focussedSection) {
  //       case 'upcoming':
  //         setUpcomingCustomDates(formatted_dates);
  //         setUpcomingRange(3);
  //         setUpcomingBookingSelect(null); //unselect period radio buttons for Upcoming (All Time/This Month)
  //         break;
  //       case 'profileViews':
  //         setProfileViewsCustomDates(formatted_dates);
  //         setProfileViewsRange(3);
  //         setProfileViewsSelect(null); //unselect period radio buttons for Profile Views (All Time/This Month)
  //         break;
  //       case 'inspire_posts':
  //         setInspirePostCustomDates(formatted_dates);
  //         setInspirePostPeriodType(3);
  //         setViewsInspirationalPostSelect(null);
  //         break;
  //       case 'inspire_saves':
  //         setInspireSavesCustomDates(formatted_dates);
  //         setInspireSavesPeriodType(3);
  //         setSavesInspirationalPostSelect(null);
  //         break;
  //       case 'pop_service':
  //         setPopServiceCustomDates(formatted_dates);
  //         setPopServiceRange(3);
  //         break;
  //     }
  //   } else {
  //     // setDate(null)
  //     switch (focussedSection) {
  //       case 'upcoming':
  //         setUpcomingCustomDates(null);
  //         break;
  //       case 'profileViews':
  //         setProfileViewsCustomDates(null);
  //         break;
  //       case 'inspire_posts':
  //         setInspirePostCustomDates(null);
  //         break;
  //       case 'inspire_saves':
  //         setInspireSavesCustomDates(null);
  //         break;
  //       case 'pop_service':
  //         setPopServiceCustomDates(null);
  //         break;
  //     }
  //     console.log(
  //       'ERROR. CURRENTLY SELECTED SECTION FOR CUSTOM DATES: ',
  //       focussedSection,
  //     );
  //   }
  // };

  // range 1 = this month, 2 = all time, 3=custom
  // type 1 = category pie, 2 = services pie
  const fetchPieData = (type = 1, range = 1, startDate = '', endDate = '') => {
    let mainURL;
    //if pie type is "category"
    if (type == 1) {
      mainURL = '/pro/analytics/services-category-pie';
    } else {
      mainURL = '/pro/analytics/services-pie';
    }
    setIsLoadingPie(true);
    Get(`${mainURL}?range=${range}&startDate=${startDate}&endDate=${endDate}`)
      .then((result) => {
        if (result.status === 200) {
          console.log('PIE DATA RESPONSE', result.data);
          calculateServiceCount(result.data);
          pieChartDataModification(result.data);
        } else {
          global.showToast('Something went wrong', 'error');
        }
        setIsLoadingPie(false);
      })
      .catch((error) => {
        setIsLoadingPie(false);
        console.log('Pie Data Error : ', error);
        setPieData(null);
        setPieListData(null);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const pieChartDataModification = (result) => {
    let pieListData = [];
    let pieData = [];

    if (result && result.length) {
      // console.log('PIE CCHART DATA RESPONSE: ', result);

      result
        .filter((item) => item.avg)
        .map((eachItem, index) => {
          // if pie type is "category", fill color from backend. Otherwise (if its "services") create random color FOR NOW (until further instructions)
          if (pieType == 1) {
            pieListData.push({
              percentage: eachItem.avg,
              color: eachItem.categoryColor,
              name: eachItem.categoryName,
            });
            pieData.push({
              percentage: eachItem.avg,
              color: eachItem.categoryColor,
            });
          } else {
            const generatedColor =
              '#' +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0');
            pieListData.push({
              percentage: eachItem.avg,
              color: generatedColor,
              name: eachItem.name,
            });
            pieData.push({ percentage: eachItem.avg, color: generatedColor });
          }
        });

      // console.log('PIE CCHART DATA: ', pieListData);
      setPieData(pieData);
      setPieListData(pieListData);
    }
  };

  const calculateServiceCount = (data) => {
    const totalServiceCount = data.reduce(
      (total, currentItem) => total + currentItem.Bookings,
      0,
    );
    setProServiceCount(totalServiceCount);
  };

  const onApplyTimeSelectionModal = (periodType, fromTimeTemp, toTimeTemp) => {
    if (periodType == 1 || periodType == 2) {
      switch (focussedSection) {
        case 'upcoming':
          setUpcomingRange(periodType);
          setUpcomingBookingSelect(Number(periodType) - 1); //unselect period radio buttons for Upcoming (All Time/This Month)
          if (upcomingCustomDates) setUpcomingCustomDates(null); // set previous custom dates to null
          break;
        case 'profileViews':
          setProfileViewsRange(periodType);
          setProfileViewsSelect(Number(periodType) - 1); //unselect period radio buttons for Profile Views (All Time/This Month)
          if (profileViewsCustomDates) setProfileViewsCustomDates(null);
          break;
        case 'inspire_posts':
          setInspirePostPeriodType(periodType);
          setViewsInspirationalPostSelect(Number(periodType) - 1);
          if (inspirePostCustomDates) setInspirePostCustomDates(null);
          break;
        case 'inspire_saves':
          setInspireSavesPeriodType(periodType);
          setSavesInspirationalPostSelect(Number(periodType) - 1);
          if (inspireSavesCustomDates) setInspireSavesCustomDates(null);
          break;
        case 'pop_service':
          setPopServiceRange(periodType);
          if (popServiceCustomDates) setPopServiceCustomDates(null);
          break;
      }
      setVisibleModal({ visibleModal: null });
    } else if (periodType == 3) {
      // let fromTime = fromTimeTemp || getFromTimeForPeriodModal(0);
      // let toTime = toTimeTemp || getToTimeForPeriodModal(0);
      let fromTime, toTime;

      if (fromTimeTemp && toTimeTemp) {
        fromTime = fromTimeTemp;
        toTime = toTimeTemp;
      } else if (fromTimeTemp && !toTimeTemp) {
        // global.showToast('Please Select Ending Date', 'error')
        setCustomDateErrorFlag(true);
        return;
      } else {
        // both fromTimeTemp and toTimeTemp are falsy
        fromTime = getFromTimeForPeriodModal(0);
        toTime = getToTimeForPeriodModal(0);
      }

      if (fromTime && toTime) {
        const formatted_dates = [fromTime, toTime].map((date) =>
          moment(date).format('YYYY-MM-DD'),
        );
        switch (focussedSection) {
          case 'upcoming':
            setFromTimeUpcoming(fromTime);
            setToTimeUpcoming(toTime);
            setUpcomingCustomDates(formatted_dates);
            setUpcomingRange(3);
            setUpcomingBookingSelect(null); //unselect period radio buttons for Upcoming (All Time/This Month)
            break;
          case 'profileViews':
            setFromTimeProfileViews(fromTime);
            setToTimeProfileViews(toTime);
            setProfileViewsCustomDates(formatted_dates);
            setProfileViewsRange(3);
            setProfileViewsSelect(null); //unselect period radio buttons for Profile Views (All Time/This Month)
            break;
          case 'inspire_posts':
            setFromTimeInspirationPosts(fromTime);
            setToTimeInspirationPosts(toTime);
            setInspirePostCustomDates(formatted_dates);
            setInspirePostPeriodType(3);
            setViewsInspirationalPostSelect(null);
            break;
          case 'inspire_saves':
            setFromTimeInspirationSaves(fromTime);
            setToTimeInspirationSaves(toTime);
            setInspireSavesCustomDates(formatted_dates);
            setInspireSavesPeriodType(3);
            setSavesInspirationalPostSelect(null);
            break;
          case 'pop_service':
            setPopServiceCustomDates(formatted_dates);
            setPopServiceRange(3);
            break;
        }
        // setFromTimeTemp(null);
        // setToTimeTemp(null);
        setVisibleModal({ visibleModal: null });
      } else {
        // global.showToast('Please Select both starting and ending dates.', 'error', 'top')
        setCustomDateErrorFlag(true);
      }
    }
  };

  const getRangePropForPeriodModal = () => {
    switch (focussedSection) {
      case 'upcoming':
        if (upcomingRange) return upcomingRange;
      case 'profileViews':
        if (profileViewsRange) return profileViewsRange;
      case 'inspire_posts':
        if (inspirePostPeriodType) return inspirePostPeriodType;
      case 'inspire_saves':
        if (inspireSavesPeriodType) return inspireSavesPeriodType;
      case 'pop_service':
        if (popServiceRange) return popServiceRange;
      default:
        return null;
    }
  };

  const getRadioIndexpForPeriodModal = () => {
    switch (focussedSection) {
      case 'upcoming':
        if (upcomingRange)
          return analyticsStatsPeriodTypes.findIndex(
            (pt) => pt.value === Number(upcomingRange),
          );
      case 'profileViews':
        if (profileViewsRange)
          return analyticsStatsPeriodTypes.findIndex(
            (pt) => pt.value === Number(profileViewsRange),
          );
      case 'inspire_posts':
        if (inspirePostPeriodType)
          return analyticsStatsPeriodTypes.findIndex(
            (pt) => pt.value === Number(inspirePostPeriodType),
          );
      case 'inspire_saves':
        if (inspireSavesPeriodType)
          return analyticsStatsPeriodTypes.findIndex(
            (pt) => pt.value === Number(inspireSavesPeriodType),
          );
      case 'pop_service':
        if (popServiceRange)
          return analyticsStatsPeriodTypes.findIndex(
            (pt) => pt.value === Number(popServiceRange),
          );
      default:
        return null;
    }
  };

  const getFromTimeForPeriodModal = (index) => {
    switch (focussedSection) {
      case 'upcoming':
        if (index == 0) return fromTimeUpcoming;
        if (index == 1) return setFromTimeUpcoming;
      case 'profileViews':
        if (index == 0) return fromTimeProfileViews;
        if (index == 1) return setFromTimeProfileViews;
      case 'inspire_posts':
        if (index == 0) return fromTimeInspirationPosts;
        if (index == 1) return setFromTimeInspirationPosts;
      case 'inspire_saves':
        if (index == 0) return fromTimeInspirationSaves;
        if (index == 1) return setFromTimeInspirationSaves;
      case 'pop_service':
        if (index == 0) return fromTimePopService;
        if (index == 1) return setFromTimePopService;
      default:
        return null;
    }
  };

  const getToTimeForPeriodModal = (index) => {
    switch (focussedSection) {
      case 'upcoming':
        if (index == 0) return toTimeUpcoming;
        if (index == 1) return setToTimeUpcoming;
      case 'profileViews':
        if (index == 0) return toTimeProfileViews;
        if (index == 1) return setToTimeProfileViews;
      case 'inspire_posts':
        if (index == 0) return toTimeInspirationPosts;
        if (index == 1) return setToTimeInspirationPosts;
      case 'inspire_saves':
        if (index == 0) return toTimeInspirationSaves;
        if (index == 1) return setToTimeInspirationSaves;
      case 'pop_service':
        if (index == 0) return toTimePopService;
        if (index == 1) return setToTimePopService;
      default:
        return null;
    }
  };
  // const getRangePropForPeriodModal = () => {
  //   switch(focussedSection) {
  //     case 'upcoming':
  //       return upcomingRange;
  //     case 'profileViews':
  //       return profileViewsRange;
  //     case 'inspire_posts':
  //       return inspirePostPeriodType;
  //     case 'inspire_saves':
  //       return inspireSavesPeriodType;
  //     case 'pop_service':
  //       return popServiceRange;
  //     }
  // }

  // const getCustomeDatesPropForPeriodModal = () => {
  //   let datesForModal = [null, null];
  //   switch (focussedSection) {
  //     case 'upcoming':
  //       if (upcomingCustomDates) {
  //         datesForModal = upcomingCustomDates;
  //       }
  //       break;
  //     case 'profileViews':
  //       if (profileViewsCustomDates) {
  //         datesForModal = profileViewsCustomDates;
  //       }
  //       break;
  //     case 'inspire_posts':
  //       if (inspirePostCustomDates) {
  //         datesForModal = inspirePostCustomDates;
  //       }
  //       break;
  //     case 'inspire_saves':
  //       if (inspireSavesCustomDates) {
  //         datesForModal = inspireSavesCustomDates;
  //       }
  //       break;
  //     case 'pop_service':
  //       if (popServiceCustomDates) {
  //         datesForModal = setPopServiceCustomDates;
  //       }
  //       break;
  //     default:
  //       datesForModal = [null, null];
  //   }
  //   return datesForModal;
  // };

  const prepareUpcomingBarChartData = (data, diffType) => {
    const dataArray = [];
    // data.map((upcoming, index) => {
    //   // dataArray.push({ x: moment(upcoming.date).format('D MMM'), y: Math.floor((Math.random() * 10) + 1) })
    //   dataArray.push({
    //     x: moment(upcoming.date).format('D MMM'),
    //     y: upcoming.bookings,
    //   });
    // });
    if (diffType === 1) {
      data.map((item, index) => {
        dataArray.push({
          x: moment(item.date).format('D MMM'),
          y: item.bookings,
          label: item.bookings,
        });
      });
      // response in months
    } else if (diffType === 2) {
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
      data.map((item, index) => {
        dataArray.push({
          x: months[item.month - 1],
          y: item.bookings,
          label: item.bookings,
        });
      });
      // response in years
    } else if (diffType === 3) {
      data.map((item, index) => {
        dataArray.push({
          x: `${item.year}`,
          y: item.bookings,
          label: item.bookings,
        });
      });
    } else {
      //diffType 4
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
      data.map((item, index) => {
        dataArray.push({
          x: `${months[item.month - 1]} ${item.year}`,
          y: item.bookings,
          label: item.bookings,
        });
      });
      // data.map((yearItem, index) => {
      //   yearItem.months.map((item) => {
      //     dataArray.push({
      //       x: `${months[item.month - 1]} ${yearItem.year}`,
      //       y: item.count,
      //     });
      //   });
      // });
    }
    // return [
    //   {
    //     seriesName: 'series1',
    //     data: dataArray,
    //     color: '#FFEBCE',
    //   },
    // ];
    return dataArray;
  };
  const prepareProfileViewsBarChartData = (data, diffType) => {
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
    // data.map((item, index) => {
    //   // dataArray.push({ x: moment(item.date).format('D MMM'), y: Math.floor((Math.random() * 10) + 1) })
    //   dataArray.push({ x: moment(item.date).format('D MMM'), y: item.VIEWS });
    // });
    if (diffType === 1) {
      data.map((item, index) => {
        dataArray.push({
          x: moment(item.date).format('D MMM'),
          y: item.VIEWS,
          label: item.VIEWS,
        });
      });
      // response in months
    } else if (diffType === 2) {
      data.map((item, index) => {
        dataArray.push({
          x: months[item.month - 1],
          y: item.VIEWS,
          label: item.VIEWS,
        });
      });
      // response in years
    } else if (diffType === 3) {
      data.map((item, index) => {
        dataArray.push({ x: `${item.year}`, y: item.VIEWS, label: item.VIEWS });
      });
    } else {
      //diffType 4
      data.map((item, index) => {
        dataArray.push({
          x: `${months[item.month - 1]} ${item.year}`,
          y: item.VIEWS,
          label: item.VIEWS,
        });
      });
    }
    // return [
    //   {
    //     seriesName: 'series1',
    //     data: dataArray,
    //     color: '#FFEBCE',
    //   },
    // ];
    return dataArray;
  };
  const prepareInspireBarChartData = (data, diffType) => {
    const dataArray = [];
    // response in dates
    if (diffType === 1) {
      data.map((item, index) => {
        dataArray.push({
          x: moment(item.date).format('D MMM'),
          y: item.count,
          label: item.count,
        });
      });
      // response in months
    } else if (diffType === 2) {
      data.map((item, index) => {
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
        dataArray.push({
          x: months[item.month - 1],
          y: item.count,
          label: item.count,
        });
      });
      // response in years
    } else if (diffType === 3) {
      data.map((item, index) => {
        dataArray.push({ x: `${item.year}`, y: item.count, label: item.count });
      });
    } else {
      //diffType 4
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
    // return [
    //   {
    //     seriesName: 'series1',
    //     data: dataArray,
    //     color: '#FFEBCE',
    //   },
    // ];
    return dataArray;
  };
  // const prepareUpcomingBarChartDataForSavedInspirations= (data) => {
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  //   const dataArray = [];
  //   data.map((item,index)=>{
  //     dataArray.push({ x: months[item.month - 1], y: Math.floor((Math.random() * 10) + 1) })
  //     // dataArray.push({ x: moment(item.date).format('D MMM'), y: item.date })
  //   })
  //   return [{
  //     seriesName: 'series1',
  //     data: dataArray,
  //     color: '#FFEBCE'
  //   }];
  // }

  //type 1 for service 2 for category

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

  const getFormattedGraphTicks = (t) => {
    if (t === 0) {
      return '0';
    } else if (t % 1000 === 0) {
      return `${t / 1000}k`;
    } else {
      return `${t}`;
    }
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
      {/* {isLoading && <ActivityLoaderSolid />} */}
      {isLoadingVerify ||
        isLoadingUpcoming ||
        isLoadingProfile ||
        isLoadingInspirationPost ||
        isLoadingInspirationSaves ||
        isLoadingPie ? (
        <ActivityLoaderSolid />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            // onRefresh={verifyAccess}
            onRefresh={refreshPage}
          />
        }>
        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Upcoming bookings
          </Text>
          <View style={{ minHeight: 200 }}>
            <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
              <RadioGroup
                style={commonStyle.filtergroup}
                color="#ffffff"
                activeColor="#F36A46"
                highlightColor={'#F36A46'}
                selectedIndex={upcomingBookingSelect}
                onSelect={(index, value) => {
                  upcomingBookingSelectHelper(index, value);
                }}>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
                  {/* <Text style={upcomingRange == 1 ? commonStyle.radiofiltertextactive : commonStyle.radiofiltertext}>This month</Text> */}
                  <Text
                    style={
                      upcomingBookingSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="2">
                  {/* <Text style={upcomingRange == 2 ? commonStyle.radiofiltertextactive : commonStyle.radiofiltertext}>All time</Text> */}
                  <Text
                    style={
                      upcomingBookingSelect == 1
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    All time
                  </Text>
                </RadioButton>
              </RadioGroup>
              <TouchableOpacity
                // style={commonStyle.analyticsdropdown}
                style={
                  upcomingRange == 3
                    ? [
                      commonStyle.analyticsdropdown,
                      { backgroundColor: '#F36A46', color: '#ffffff' },
                    ]
                    : commonStyle.analyticsdropdown
                }
                onPress={() => {
                  setFocussedSection('upcoming');
                  setVisibleModal('AnalyticsPeriodDialog');
                }}
                activeOpacity={0.5}>
                <Text
                  style={[
                    upcomingRange == 3
                      ? commonStyle.categorytagswhiteText
                      : commonStyle.categorytagsText,
                    { marginRight: 8 },
                  ]}>
                  Custom period
                </Text>
                {upcomingRange == 3 ? <DownArrowWhite /> : <DownArrow />}
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={commonStyle.grayText16}>
                Number of upcoming bookings:{' '}
                <Title style={commonStyle.blackTextR}>
                  {upcomingCount ?? 'N/A'}
                </Title>
              </Text>
            </View>
            {!isLoadingUpcoming && upcommingbarChartdata?.length ? (
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
                  width={upcommingbarChartdata.length * 72}
                  containerComponent={
                    <VictoryVoronoiContainer voronoiDimension="x" />
                  }>
                  <VictoryAxis
                    dependentAxis={true}
                    tickValues={generateTickValuesForGraph(
                      upcommingbarChartdata,
                    )}
                    tickFormat={(t) => getFormattedGraphTicks(t)}
                  />
                  <VictoryAxis dependentAxis={false} />
                  <VictoryBar
                    alignment="middle"
                    barRatio={0.8}
                    cornerRadius={6}
                    data={upcommingbarChartdata}
                    x="x"
                    y="y"
                    style={{
                      data: { fill: '#FFEBCE', width: 40 },
                      labels: {
                        fontSize: 10,
                        fill: 'black',
                        fontFamily: 'SofiaPro',
                      },
                      parent: { border: '1px solid #fff' },
                    }}
                    labelComponent={
                      <VictoryTooltip
                        flyoutPadding={{ top: 5, bottom: 5, left: 1, right: 1 }}
                        constrainToVisibleArea={true}
                        renderInPortal={false}
                        text={(datum) => {
                          return `${datum.datum.x}: ${Math.round(
                            datum.datum.y,
                          )}`;
                        }}
                      />
                    }
                  />
                </VictoryChart>
              </ScrollView>
            ) : (
              <Text
                style={{
                  paddingHorizontal: 0,
                  position: 'absolute',
                  fontFamily: 'SofiaPro',
                  bottom: 0,
                  left: 0,
                  color: '#939DAA',
                }}>
                No Chart Data Available
              </Text>
            )}
            {/* {!isProSubscription ? AnalyticsStatisticsNotProSubscription : null} */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Profile views
          </Text>
          <View style={{ minHeight: 200 }}>
            <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
              <RadioGroup
                style={commonStyle.filtergroup}
                color="#ffffff"
                activeColor="#F36A46"
                highlightColor={'#F36A46'}
                selectedIndex={profileViewsSelect}
                onSelect={(index, value) => {
                  profileViewsSelectHelper(index, value);
                }}>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
                  <Text
                    style={
                      profileViewsSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="2">
                  <Text
                    style={
                      profileViewsSelect == 1
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    All time
                  </Text>
                </RadioButton>
              </RadioGroup>
              <TouchableOpacity
                // style={commonStyle.analyticsdropdown}
                style={
                  profileViewsRange == 3
                    ? [
                      commonStyle.analyticsdropdown,
                      { backgroundColor: '#F36A46', color: '#ffffff' },
                    ]
                    : commonStyle.analyticsdropdown
                }
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setFocussedSection('profileViews');
                }}
                activeOpacity={0.5}>
                <Text
                  style={[
                    profileViewsRange == 3
                      ? commonStyle.categorytagswhiteText
                      : commonStyle.categorytagsText,
                    { marginRight: 8 },
                  ]}>
                  Custom period
                </Text>
                {profileViewsRange == 3 ? <DownArrowWhite /> : <DownArrow />}
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={commonStyle.grayText16}>
                Number of views:{' '}
                <Title style={commonStyle.blackTextR}>
                  {profileViewCount ?? 'N/A'}
                </Title>
              </Text>
            </View>
            {!isLoadingProfile && profileViewbarChartdata?.length ? (
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
                  width={profileViewbarChartdata.length * 72}
                  containerComponent={
                    <VictoryVoronoiContainer voronoiDimension="x" />
                  }>
                  <VictoryAxis
                    dependentAxis={true}
                    tickValues={generateTickValuesForGraph(
                      profileViewbarChartdata,
                    )}
                    tickFormat={(t) => getFormattedGraphTicks(t)}
                  />
                  <VictoryAxis dependentAxis={false} />
                  <VictoryBar
                    alignment="middle"
                    barRatio={0.8}
                    cornerRadius={6}
                    data={profileViewbarChartdata}
                    x="x"
                    y="y"
                    style={{
                      data: { fill: '#FFEBCE', width: 40 },
                      labels: {
                        fontSize: 10,
                        fill: 'black',
                      },
                      parent: { border: '1px solid #fff' },
                    }}
                    labelComponent={
                      <VictoryTooltip
                        flyoutPadding={{ top: 5, bottom: 5, left: 1, right: 1 }}
                        constrainToVisibleArea={true}
                        renderInPortal={false}
                        text={(datum) => {
                          return `${datum.datum.x}: ${Math.round(
                            datum.datum.y,
                          )}`;
                        }}
                      />
                    }
                  />
                </VictoryChart>
              </ScrollView>
            ) : (
              <Text
                style={{
                  paddingHorizontal: 0,
                  position: 'absolute',
                  fontFamily: 'SofiaPro',
                  bottom: 0,
                  left: 0,
                  color: '#939DAA',
                }}>
                No Chart Data Available
              </Text>
            )}
            {/* {!isProSubscription ? AnalyticsStatisticsNotProSubscription : null} */}
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                    <View style={commonStyle.nosubscribtionstaticstext}>
                    <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}>
                    <Title style={commonStyle.clearfilterText}>Upgrade </Title> your subscribtion to Pro to see all statistics</Text>
                    </View>
                  </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Views of inspirational posts
          </Text>
          <View style={{ minHeight: 200 }}>
            <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
              <RadioGroup
                style={commonStyle.filtergroup}
                color="#ffffff"
                activeColor="#F36A46"
                highlightColor={'#F36A46'}
                selectedIndex={viewsInspirationalPostSelect}
                onSelect={(index, value) => {
                  viewsInspirationalPostSelectHelper(index, value);
                }}>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
                  <Text
                    style={
                      viewsInspirationalPostSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="2">
                  <Text
                    style={
                      viewsInspirationalPostSelect == 1
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    All time
                  </Text>
                </RadioButton>
              </RadioGroup>
              <TouchableOpacity
                // style={commonStyle.analyticsdropdown}
                style={
                  inspirePostPeriodType == 3
                    ? [
                      commonStyle.analyticsdropdown,
                      { backgroundColor: '#F36A46', color: '#ffffff' },
                    ]
                    : commonStyle.analyticsdropdown
                }
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setFocussedSection('inspire_posts');
                }}
                activeOpacity={0.5}>
                <Text
                  style={[
                    inspirePostPeriodType == 3
                      ? commonStyle.categorytagswhiteText
                      : commonStyle.categorytagsText,
                    { marginRight: 8 },
                  ]}>
                  Custom period
                </Text>
                {inspirePostPeriodType == 3 ? (
                  <DownArrowWhite />
                ) : (
                  <DownArrow />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={commonStyle.grayText16}>
                Number of views:{' '}
                <Title style={commonStyle.blackTextR}>
                  {inspirePostCount ?? 'N/A'}
                </Title>
              </Text>
            </View>
            {!isLoadingInspirationPost && inspirationalbarChartdata?.length ? (
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
                  width={inspirationalbarChartdata.length * 72}
                  containerComponent={
                    <VictoryVoronoiContainer voronoiDimension="x" />
                  }>
                  <VictoryAxis
                    dependentAxis={true}
                    tickValues={generateTickValuesForGraph(
                      inspirationalbarChartdata,
                    )}
                    tickFormat={(t) => getFormattedGraphTicks(t)}
                  />
                  <VictoryAxis dependentAxis={false} />
                  <VictoryBar
                    alignment="middle"
                    barRatio={0.8}
                    cornerRadius={6}
                    data={inspirationalbarChartdata}
                    x="x"
                    y="y"
                    style={{
                      data: { fill: '#FFEBCE', width: 40 },
                      labels: {
                        fontSize: 10,
                        fill: 'black',
                      },
                      parent: { border: '1px solid #fff' },
                    }}
                    labelComponent={
                      <VictoryTooltip
                        flyoutPadding={{ top: 5, bottom: 5, left: 1, right: 1 }}
                        constrainToVisibleArea={true}
                        renderInPortal={false}
                        text={(datum) => {
                          return `${datum.datum.x}: ${Math.round(
                            datum.datum.y,
                          )}`;
                        }}
                      />
                    }
                  />
                </VictoryChart>
              </ScrollView>
            ) : (
              <Text
                style={{
                  paddingHorizontal: 0,
                  position: 'absolute',
                  fontFamily: 'SofiaPro',
                  bottom: 0,
                  left: 0,
                  color: '#939DAA',
                }}>
                No Chart Data Available
              </Text>
            )}
            {/* {!isProSubscription ? AnalyticsStatisticsNotProSubscription : null} */}
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                      <View style={commonStyle.nosubscribtionstaticstext}>
                      <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}><Title onClick=() style={commonStyle.clearfilterText}>Upgrade</Title> your subscribtion to Pro to see all statistics</Text>
                      </View>
                    </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Saves of inspirational posts
          </Text>
          <View style={{ minHeight: 200 }}>
            <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
              <RadioGroup
                style={commonStyle.filtergroup}
                color="#ffffff"
                activeColor="#F36A46"
                highlightColor={'#F36A46'}
                selectedIndex={savesInspirationalPostSelect}
                onSelect={(index, value) => {
                  savesInspirationalPostSelectHelper(index, value);
                }}>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
                  <Text
                    style={
                      savesInspirationalPostSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="2">
                  <Text
                    style={
                      savesInspirationalPostSelect == 1
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    All time
                  </Text>
                </RadioButton>
              </RadioGroup>
              <TouchableOpacity
                // style={commonStyle.analyticsdropdown}
                style={
                  inspireSavesPeriodType == 3
                    ? [
                      commonStyle.analyticsdropdown,
                      { backgroundColor: '#F36A46', color: '#ffffff' },
                    ]
                    : commonStyle.analyticsdropdown
                }
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setFocussedSection('inspire_saves');
                }}
                activeOpacity={0.5}>
                <Text
                  style={[
                    inspireSavesPeriodType == 3
                      ? commonStyle.categorytagswhiteText
                      : commonStyle.categorytagsText,
                    { marginRight: 8 },
                  ]}>
                  Custom period
                </Text>
                {inspireSavesPeriodType == 3 ? (
                  <DownArrowWhite />
                ) : (
                  <DownArrow />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={commonStyle.grayText16}>
                Number of saves:{' '}
                <Title style={commonStyle.blackTextR}>
                  {inspireSaveCount ?? 'N/A'}
                </Title>
              </Text>
            </View>
            {!isLoadingInspirationSaves &&
              savesInspirationalbarChartdata?.length ? (
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
                  width={savesInspirationalbarChartdata.length * 72}
                  containerComponent={
                    <VictoryVoronoiContainer voronoiDimension="x" />
                  }>
                  <VictoryAxis
                    dependentAxis={true}
                    tickValues={generateTickValuesForGraph(
                      savesInspirationalbarChartdata,
                    )}
                    tickFormat={(t) => getFormattedGraphTicks(t)}
                  />
                  <VictoryAxis dependentAxis={false} />
                  <VictoryBar
                    alignment="middle"
                    barRatio={0.8}
                    cornerRadius={6}
                    data={savesInspirationalbarChartdata}
                    x="x"
                    y="y"
                    style={{
                      data: { fill: '#FFEBCE', width: 40 },
                      labels: {
                        fontSize: 10,
                        fill: 'black',
                        fontFamily: 'SofiaPro',
                      },
                      parent: { border: '1px solid #fff' },
                    }}
                    labelComponent={
                      <VictoryTooltip
                        flyoutPadding={{ top: 5, bottom: 5, left: 1, right: 1 }}
                        constrainToVisibleArea={true}
                        renderInPortal={false}
                        text={(datum) => {
                          return `${datum.datum.x}: ${Math.round(
                            datum.datum.y,
                          )}`;
                        }}
                      />
                    }
                  />
                </VictoryChart>
              </ScrollView>
            ) : (
              <Text
                style={{
                  paddingHorizontal: 0,
                  position: 'absolute',
                  fontFamily: 'SofiaPro',
                  bottom: 0,
                  left: 0,
                  color: '#939DAA',
                }}>
                No Chart Data Available
              </Text>
            )}
            {/* {!isProSubscription ? AnalyticsStatisticsNotProSubscription : null} */}
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                      <View style={commonStyle.nosubscribtionstaticstext}>
                      <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}><Title onClick=() style={commonStyle.clearfilterText}>Upgrade</Title> your subscribtion to Pro to see all statistics</Text>
                      </View>
                    </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox, { minHeight: 280 }]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Services popularity{' '}
          </Text>
          <View style={{ minHeight: 170 }}>
            <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
              <TouchableOpacity
                style={commonStyle.analyticsdropdown}
                onPress={() => {
                  setVisibleModal('StatisticsServicesDialog');
                }}
                activeOpacity={0.5}>
                <Text style={[commonStyle.categorytagsText, { marginRight: 8 }]}>
                  {pieType == 1 ? 'Category' : 'Services'}
                </Text>
                <DownArrow />
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.analyticsdropdown}
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setFocussedSection('pop_service');
                }}
                activeOpacity={0.5}>
                <Text style={commonStyle.categorytagsText}>Period:</Text>
                <Text
                  style={[
                    commonStyle.filterBlackText,
                    { marginRight: 8, marginLeft: 5 },
                  ]}>
                  {popServiceRange == 1
                    ? 'This month'
                    : popServiceRange == 2
                      ? 'All Time'
                      : 'Custom'}
                </Text>
                <DownArrow />
              </TouchableOpacity>
            </View>
            {!isLoadingPie && pieData && pieData.length ? (
              <View>
                <View style={[commonStyle.piechartwrap]}>
                  <Pie
                    radius={90}
                    innerRadius={65}
                    // sections={pieData?pieData:''}
                    sections={pieData}
                    dividerSize={2}
                    strokeCap={'round'}
                  />
                  <View style={commonStyle.totalservicewrap}>
                    <Text
                      style={[commonStyle.subheading, commonStyle.textCenter]}>
                      {proServiceCount ? proServiceCount : 'NA'}
                    </Text>
                    <Text
                      style={[commonStyle.grayText14, commonStyle.textCenter]}>
                      services in total
                    </Text>
                  </View>
                </View>
                <View style={[commonStyle.piechartlebalWrap]}>
                  {pieListData &&
                    pieListData.map((data, index) => {
                      return (
                        <View key={index} style={commonStyle.piechartlebal}>
                          <View style={commonStyle.searchBarText}>
                            <Text
                              style={[
                                commonStyle.piechartdot,
                                { backgroundColor: data.color },
                              ]}>
                              .
                            </Text>
                            <Text style={commonStyle.texttimeblack}>
                              {data.name}
                            </Text>
                            <Text
                              style={[
                                commonStyle.dotSmall,
                                { marginHorizontal: 10 },
                              ]}>
                              .
                            </Text>
                            <Text style={commonStyle.texttimeblack}>
                              {Number(data.percentage).toFixed(2)}%
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </View>
            ) : (
              <Text
                style={{
                  paddingHorizontal: 0,
                  position: 'absolute',
                  fontFamily: 'SofiaPro',
                  bottom: 0,
                  left: 0,
                  color: '#939DAA',
                }}>
                No Pie Data to Show
              </Text>
            )}
            {/* {!isProSubscription ? AnalyticsStatisticsNotProSubscription : null} */}
          </View>
        </View>
      </ScrollView>
      {/* Analytics Custom Period modal start */}
      <Modal
        isVisible={visibleModal === 'AnalyticsPeriodDialog'}
        onSwipeComplete={() => {
          setVisibleModal({ visibleModal: null });
          // setFromTimeTemp(null);
          // setToTimeTemp(null);
        }}
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
            onPress={() => {
              setVisibleModal({ visibleModal: null });
              // setFromTimeTemp(null);
              // setToTimeTemp(null);
            }}>
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
            <AnalyticsPeriodSelectionModal
              focussedSection={focussedSection}
              periodType={periodType}
              fromTime={getFromTimeForPeriodModal(0)}
              toTime={getToTimeForPeriodModal(0)}
              range={getRangePropForPeriodModal()}
              radioIndex={getRadioIndexpForPeriodModal()}
              customDateErrorFlag={customDateErrorFlag}
              setCustomDateErrorFlag={setCustomDateErrorFlag}
              onApplyTimeSelectionModal={(
                periodTypeTemp,
                fromTimeTemp,
                toTimeTemp,
              ) =>
                onApplyTimeSelectionModal(
                  periodTypeTemp,
                  fromTimeTemp,
                  toTimeTemp,
                )
              }
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Analytics Custom Period modal End */}

      {/* Analytics Statistics Services modal start */}
      <Modal
        isVisible={visibleModal === 'StatisticsServicesDialog'}
        onSwipeComplete={() => setVisibleModal(null)}
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
            <StatisticsServicesModal
              pieType={pieType}
              // setTempPieType={setTempPieType}
              setPieType={setPieType}
              setVisibleModal={setVisibleModal}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Analytics Statistics Services modal End */}
    </Container>
  );
};

export default AnalyticsStatisticsTab;
