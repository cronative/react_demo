import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Body,
  Left,
  Title,
} from 'native-base';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import {BarChart} from 'react-native-chart-kit';
import Pie from 'react-native-pie';
import {Get} from '../../api/apiAgent';
import {useNavigation} from '@react-navigation/native';
import {
  DownArrow,
  DownloadIcon,
  RightAngle,
  PolygonGreen,
  PolygonGreenDown,
  PolygonRed,
} from '../icons';
import {AnalyticsPeriodModal, StatisticsServicesModal} from '../modal';
import commonStyle from '../../assets/css/mainStyle';
import AnalyticsCustomPeriodModal from '../../components/modal/AnalyticsCustomPeriodModal';
import moment from 'moment';

const AnalyticsStatisticsTab = () => {
  const navigation = useNavigation();

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0,
    color: () => '#333', // THIS
    strokeWidth: 0,
    barPercentage: 0.5,
    propsForLabels: {
      fontSize: '12',
      fontFamily: 'SofiaPro',
    },
    fillShadowGradient: '#FFEBCE', // THIS
    fillShadowGradientOpacity: 1, // THIS
  };

  // converting at state data
  const [upcommingbarChartdata, setUpcommingbarChartdata] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const [profileViewbarChartdata, setpProfileViewbarChartdata] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  /*  const inspirationalbarChartdata = {
    labels: ["1 Dec", "2 Dec", "3 Dec", "4 Dec", "5 Dec"],
    datasets: [
      {
        data: [200, 150, 300, 350,]
      }
    ]
  }; */

  const [inspirationalbarChartdata, SetInspirationalbarChartdata] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const [savesInspirationalbarChartdata, SetSavesInspirationalbarChartdata] =
    useState({
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    });
  const [barchatData, setBarchatData] = useState([
    {
      percentage: 35,
      color: '#f14c87',
      name: 'zfsfdf',
    },
    {
      percentage: 10,
      color: '#ef9b1e',
      name: 'zfsfdf',
    },
    {
      percentage: 20,
      color: '#a4a7f7',
      name: 'zfsfdf',
    },
    {
      percentage: 10,
      color: '#23ba5f',
      name: 'zfsfdf',
    },
    {
      percentage: 25,
      color: '#48a0f9',
      name: 'zfsfdf',
    },
  ]);

  const [barchatDataToShow, setBarchatDataToShow] = useState([]);

  const [dataSelect, setDataSelect] = useState(null);
  const [upcomingBookingSelect, setUpcomingBookingSelect] = useState(null);
  const [profileViewsSelect, setProfileViewsSelect] = useState(null);
  const [viewsInspirationalPostSelect, setViewsInspirationalPostSelect] =
    useState(null);
  const [savesInspirationalPostSelect, setSavesInspirationalPostSelect] =
    useState(null);

  //Determines the section (graph) for which the custom date is being set
  const [customDateSection, setCustomDateSection] = useState(null);

  //CUSTOM DATE STATES FOR VARIOUS SECTIONS
  const [upcomingCustomDates, setUpcomingCustomDates] = useState(null);
  const [profileViewsCustomDates, setProfileViewsCustomDates] = useState(null);
  const [inspirePostCustomDates, setInspirePostCustomDates] = useState(null);
  const [inspireSavesCustomDates, setInspireSavesCustomDates] = useState(null);
  const [popServiceCustomDates, setPopServiceCustomDates] = useState(null);

  useEffect(() => {
    console.log('Upcoming: ', upcomingCustomDates);
    console.log('Profile Views ', profileViewsCustomDates);
    console.log('Inspire Post: ', inspirePostCustomDates);
    console.log('Inspire Saves: ', inspireSavesCustomDates);
    console.log('Popular Service: ', popServiceCustomDates);
  }, [
    upcomingCustomDates,
    profileViewsCustomDates,
    inspirePostCustomDates,
    inspireSavesCustomDates,
    popServiceCustomDates,
  ]);

  useEffect(() => {
    if (upcomingCustomDates && !upcomingCustomDates.includes('Invalid date')) {
      fetchUpcomingGraphData(3, upcomingCustomDates[0], upcomingCustomDates[1]);
    }
  }, [upcomingCustomDates]);
  useEffect(() => {
    if (
      profileViewsCustomDates &&
      !profileViewsCustomDates.includes('Invalid date')
    ) {
      fetchProfileGraphData(
        3,
        profileViewsCustomDates[0],
        profileViewsCustomDates[1],
      );
    }
  }, [profileViewsCustomDates]);
  useEffect(() => {
    if (
      inspirePostCustomDates &&
      !inspirePostCustomDates.includes('Invalid date')
    ) {
      fetchInspirationGraphData(
        3,
        1,
        inspirePostCustomDates[0],
        inspirePostCustomDates[1],
      );
    }
  }, [inspirePostCustomDates]);
  useEffect(() => {
    if (
      inspireSavesCustomDates &&
      !inspireSavesCustomDates.includes('Invalid date')
    ) {
      fetchSaveGraphData(
        3,
        3,
        inspireSavesCustomDates[0],
        inspireSavesCustomDates[1],
      );
    }
  }, [inspireSavesCustomDates]);
  useEffect(() => {
    if (
      popServiceCustomDates &&
      !popServiceCustomDates.includes('Invalid date')
    ) {
      serviceCatBarchat(
        1,
        3,
        popServiceCustomDates[0],
        popServiceCustomDates[1],
      );
    }
  }, [popServiceCustomDates]);

  /**
   * This method will Select on upcoming Booking Fillter.
   */
  const upcomingBookingSelectHelper = (index, value) => {
    setDataSelect(value);
    setUpcomingBookingSelect(index);
  };

  /**
   * This method will Select on Profile View Fillter.
   */
  const profileViewsSelectHelper = (index, value) => {
    setDataSelect(value);
    setProfileViewsSelect(index);
  };

  /**
   * This method will Select on views Inspirational Post Fillter.
   */
  const viewsInspirationalPostSelectHelper = (index, value) => {
    setDataSelect(value);
    setViewsInspirationalPostSelect(index);
    var periodType = 1;
    if (value === '0') {
      periodType = 1;
    } else if (value === '1') {
      periodType = 2;
    }

    fetchInspirationGraphData(periodType);
  };

  /**
   * This method will Select on Saves Inspirational Post Fillter.
   */
  const savesInspirationalPostSelectHelper = (index, value) => {
    setDataSelect(value);
    setSavesInspirationalPostSelect(index);
    var periodType = 1;
    if (value === '0') {
      periodType = 1;
    } else if (value === '1') {
      periodType = 2;
    }

    fetchSaveGraphData(periodType);
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
  /**
   * =======================.
   */
  let fetchUpcomingGraphData = (range = 1, startDate = '', endDate = '') => {
    Get(
      '/pro/analytics/upcoming-graph?range=' +
        range +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate,
    )
      .then((result) => {
        const upCominingLabel = [];
        const upCominingData = [];
        if (result.status === 200) {
          if (result.data.length > 0) {
            result.data.map((upcoming, index) => {
              upCominingLabel.push(upcoming.date);
              upCominingData.push(upcoming.bookings);

              //console.log('label',label)
            });

            setUpcommingbarChartdata((prevStyle) => ({
              ...prevStyle,
              labels: upCominingLabel,
              datasets: [
                {
                  data: upCominingData,
                },
              ],
            }));
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        console.log('Image Error : ', error);
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
    Get(
      '/pro/analytics/prof-views?range=' +
        range +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate,
    )
      .then((result) => {
        const upCominingLabel1 = [];
        const upCominingData2 = [];
        if (result.status === 200) {
          if (result.data.length > 0) {
            result.data.map((upcoming, index) => {
              upCominingLabel1.push(upcoming.date);
              upCominingData2.push(upcoming.VIEWS);

              //console.log('label',label)
            });

            setpProfileViewbarChartdata((prevStyle) => ({
              ...prevStyle,
              labels: upCominingLabel1,
              datasets: [
                {
                  data: upCominingData2,
                },
              ],
            }));
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        console.log('Image Error : ', error);
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
        const upCominingLabelIns = [];
        const upCominingDataIns = [];
        if (result.status === 200) {
          console.log('inspiration data', result.data);
          console.log('inspiration data graph', result.data.graphArray);
          if (result.data.graphArray.length > 0) {
            result.data.graphArray.map((upcoming, index) => {
              upCominingLabelIns.push(upcoming.date);
              upCominingDataIns.push(upcoming.count);
              console.log('count', upcoming.count);
              console.log('date', upcoming.date);
            });
            console.log(upCominingLabelIns);
            console.log(upCominingDataIns);
            SetInspirationalbarChartdata((prevStyle) => ({
              ...prevStyle,
              labels: upCominingLabelIns,
              datasets: [
                {
                  data: upCominingDataIns,
                },
              ],
            }));
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        console.log('Image Error : ', error);
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
        const upCominingLabelSave = [];
        const upCominingDataSave = [];
        if (result.status === 200) {
          //console.log('inspiration data',result.data);
          //console.log('inspiration data graph',result.data.graphArray);
          if (result.data.graphArray.length > 0) {
            result.data.graphArray.map((upcoming, index) => {
              upCominingLabelSave.push(upcoming.date);
              upCominingDataSave.push(upcoming.count);
              /* console.log('count',upcoming.count)
           console.log('date',upcoming.date) */
            });

            SetSavesInspirationalbarChartdata((prevStyle) => ({
              ...prevStyle,
              labels: upCominingLabelSave,
              datasets: [
                {
                  data: upCominingDataSave,
                },
              ],
            }));
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        console.log('Image Error : ', error);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };
  let setDateForFilter = (selectedDates) => {
    if (
      selectedDates &&
      [
        'upcoming',
        'profileViews',
        'inspire_posts',
        'inspire_saves',
        'pop_service',
      ].includes(customDateSection)
    ) {
      const formatted_dates = selectedDates.map((date) =>
        moment(date).format('YYYY-MM-D'),
      );
      console.log(formatted_dates);
      // setDate(formatted_dates);
      switch (customDateSection) {
        case 'upcoming':
          setUpcomingCustomDates(formatted_dates);
          break;
        case 'profileViews':
          setProfileViewsCustomDates(formatted_dates);
          break;
        case 'inspire_posts':
          setInspirePostCustomDates(formatted_dates);
          break;
        case 'inspire_saves':
          setInspireSavesCustomDates(formatted_dates);
          break;
        case 'pop_service':
          setPopServiceCustomDates(formatted_dates);
          break;
      }
    } else {
      // setDate(null)
      switch (customDateSection) {
        case 'upcoming':
          setUpcomingCustomDates(null);
          break;
        case 'profileViews':
          setProfileViewsCustomDates(null);
          break;
        case 'inspire_posts':
          setInspirePostCustomDates(null);
          break;
        case 'inspire_saves':
          setInspireSavesCustomDates(null);
          break;
        case 'pop_service':
          setPopServiceCustomDates(null);
          break;
      }
      console.log(
        'ERROR. CURRENTLY SELECTED SECTION FOR CUSTOM DATES: ',
        customDateSection,
      );
    }
  };

  const serviceCatBarchat = (
    type = 1,
    range = 1,
    startDate = '',
    endDate = '',
  ) => {
    Get(
      '/pro/analytics/services-category-pie?range=' +
        '&startDate=' +
        startDate +
        '&endDate=' +
        endDate,
    )
      .then((result) => {
        let barchat = [];
        let barchatToShow = [];

        if (result.status === 200) {
          //console.log('inspiration data',result.data);
          //console.log('inspiration data graph',result.data.graphArray);
          if (result.data.length > 0) {
            result.data.map((data, index) => {
              barchat.push({
                percentage: data.avg == null ? 0 : data.avg,
                color:
                  '#' +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0'),
                name: data.categoryName,
              });
            });

            setBarchatDataToShow(barchat);
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        console.log('Image Error : ', error);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };
  //type 1 for service 2 for category
  useEffect(() => {
    fetchUpcomingGraphData();
    fetchProfileGraphData();
    fetchInspirationGraphData();
    fetchSaveGraphData();
    serviceCatBarchat();
  }, []);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {console.log('barStatic', barchatData)}
        {console.log('bardyn', barchatDataToShow)}
        {/* <View style={[commonStyle.setupCardBox, commonStyle.mt1]}>
                <Text style={[commonStyle.subtextbold, commonStyle.mb15]}>Waiting list</Text>
                <TouchableOpacity style={[commonStyle.analyticswaitingList]} activeOpacity={0.5} onPress={() => navigation.navigate('AnalyticsStatisticsWaitingList')}>
                  <View style={commonStyle.searchBarText}>
                    <Text style={[commonStyle.blackTextR,{marginRight:4}]}>7 clients</Text>
                  </View>
                  <TouchableHighlight>
                      <RightAngle/>
                  </TouchableHighlight>
                </TouchableOpacity>
              </View> */}

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Upcoming bookings
          </Text>
          <View>
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
                <RadioButton style={commonStyle.radiofiltercol} value="0">
                  <Text
                    style={
                      upcomingBookingSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
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
                style={commonStyle.analyticsdropdown}
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setCustomDateSection('upcoming');
                }}
                activeOpacity={0.5}>
                <Text style={[commonStyle.categorytagsText, {marginRight: 8}]}>
                  Custom period
                </Text>
                <DownArrow />
              </TouchableOpacity>
            </View>
            {/* <View style={{marginVertical: 10}}>
                     <Text style={commonStyle.grayText16}>Number of upcoming bookings: <Title style={commonStyle.blackTextR}>24</Title></Text>
                    </View> */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={upcommingbarChartdata}
                  // width={Dimensions.get('window').width - 16}
                  width={700}
                  height={250}
                  //yAxisLabel={'$'}
                  verticalLabelRotation={0}
                  chartConfig={chartConfig}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </ScrollView>
            </View>
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                      <View style={commonStyle.nosubscribtionstaticstext}>
                      <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}><Title style={commonStyle.clearfilterText}>Upgrade</Title> your subscribtion to Pro to see all statistics</Text>
                      </View>
                    </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Profile views
          </Text>
          <View>
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
                <RadioButton style={commonStyle.radiofiltercol} value="0">
                  <Text
                    style={
                      profileViewsSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
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
                style={commonStyle.analyticsdropdown}
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setCustomDateSection('profileViews');
                }}
                activeOpacity={0.5}>
                <Text style={[commonStyle.categorytagsText, {marginRight: 8}]}>
                  Custom period
                </Text>
                <DownArrow />
              </TouchableOpacity>
            </View>
            {/* <View style={{marginVertical: 10}}>
                  <Text style={commonStyle.grayText16}>Number of views: <Title style={commonStyle.blackTextR}>2420</Title></Text>
                </View> */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={profileViewbarChartdata}
                  // width={Dimensions.get('window').width - 16}
                  width={900}
                  height={250}
                  //yAxisLabel={'$'}
                  verticalLabelRotation={0}
                  chartConfig={chartConfig}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </ScrollView>
            </View>
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                    <View style={commonStyle.nosubscribtionstaticstext}>
                    <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}><Title style={commonStyle.clearfilterText}>Upgrade</Title> your subscribtion to Pro to see all statistics</Text>
                    </View>
                  </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Views of inspirational posts
          </Text>
          <View>
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
                <RadioButton style={commonStyle.radiofiltercol} value="0">
                  <Text
                    style={
                      viewsInspirationalPostSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
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
                style={commonStyle.analyticsdropdown}
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setCustomDateSection('inspire_posts');
                }}
                activeOpacity={0.5}>
                <Text style={[commonStyle.categorytagsText, {marginRight: 8}]}>
                  Custom period
                </Text>
                <DownArrow />
              </TouchableOpacity>
            </View>
            {/* <View style={{marginVertical: 10}}>
                      <Text style={commonStyle.grayText16}>Number of views: <Title style={commonStyle.blackTextR}>0</Title></Text>
                    </View> */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={
                    inspirationalbarChartdata ? inspirationalbarChartdata : ''
                  }
                  // width={Dimensions.get('window').width - 16}
                  width={1800}
                  height={250}
                  //yAxisLabel={'$'}
                  verticalLabelRotation={0}
                  chartConfig={chartConfig}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </ScrollView>
            </View>
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                      <View style={commonStyle.nosubscribtionstaticstext}>
                      <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}><Title style={commonStyle.clearfilterText}>Upgrade</Title> your subscribtion to Pro to see all statistics</Text>
                      </View>
                    </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Saves of inspirational posts
          </Text>
          <View>
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
                <RadioButton style={commonStyle.radiofiltercol} value="0">
                  <Text
                    style={
                      savesInspirationalPostSelect == 0
                        ? commonStyle.radiofiltertextactive
                        : commonStyle.radiofiltertext
                    }>
                    This month
                  </Text>
                </RadioButton>
                <RadioButton style={commonStyle.radiofiltercol} value="1">
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
                style={commonStyle.analyticsdropdown}
                onPress={() => {
                  setVisibleModal('AnalyticsPeriodDialog');
                  setCustomDateSection('inspire_saves');
                }}
                activeOpacity={0.5}>
                <Text style={[commonStyle.categorytagsText, {marginRight: 8}]}>
                  Custom period
                </Text>
                <DownArrow />
              </TouchableOpacity>
            </View>
            {/* <View style={{marginVertical: 10}}>
                     <Text style={commonStyle.grayText16}>Number of saves: <Title style={commonStyle.blackTextR}>835</Title></Text>
                    </View> */}
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={savesInspirationalbarChartdata}
                  // width={Dimensions.get('window').width - 16}
                  width={1800}
                  height={250}
                  //yAxisLabel={'$'}
                  verticalLabelRotation={0}
                  chartConfig={chartConfig}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </ScrollView>
            </View>
            {/* <View style={commonStyle.nosubscribtionstaticswrap}>
                      <View style={commonStyle.nosubscribtionstaticstext}>
                      <Text style={[commonStyle.blackText16, commonStyle.textCenter, {lineHeight: 25}]}><Title style={commonStyle.clearfilterText}>Upgrade</Title> your subscribtion to Pro to see all statistics</Text>
                      </View>
                    </View> */}
          </View>
        </View>

        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
            Services popularity{' '}
          </Text>
          <View style={[commonStyle.analyticsSelectWrap, commonStyle.mb1]}>
            <TouchableOpacity
              style={commonStyle.analyticsdropdown}
              onPress={() => {
                setVisibleModal('StatisticsServicesDialog');
              }}
              activeOpacity={0.5}>
              <Text style={[commonStyle.categorytagsText, {marginRight: 8}]}>
                Services
              </Text>
              <DownArrow />
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.analyticsdropdown}
              onPress={() => {
                setVisibleModal('AnalyticsPeriodDialog');
                setCustomDateSection('pop_service');
              }}
              activeOpacity={0.5}>
              <Text style={commonStyle.categorytagsText}>Period:</Text>
              <Text
                style={[
                  commonStyle.filterBlackText,
                  {marginRight: 8, marginLeft: 5},
                ]}>
                This month
              </Text>
              <DownArrow />
            </TouchableOpacity>
          </View>
          <View style={commonStyle.piechartwrap}>
            {/*  <Pie
                        radius={60}
                        innerRadius={25}
                        series={recipeData.recipes1}
                        colors={recipeData.rc1}
                      /> */}
            <Pie
              radius={90}
              innerRadius={65}
              sections={barchatDataToShow ? barchatDataToShow : ''}
              dividerSize={2}
              strokeCap={'round'}
            />
            <View style={commonStyle.totalservicewrap}>
              <Text style={[commonStyle.subheading, commonStyle.textCenter]}>
                28
              </Text>
              <Text style={[commonStyle.grayText14, commonStyle.textCenter]}>
                services in total
              </Text>
            </View>
          </View>
          <View style={commonStyle.piechartlebalWrap}>
            {barchatDataToShow &&
              barchatDataToShow.map((index, data) => {
                return (
                  <View key={index} style={commonStyle.piechartlebal}>
                    <View style={commonStyle.searchBarText}>
                      <Text
                        style={[
                          commonStyle.piechartdot,
                          {backgroundColor: data.color},
                        ]}>
                        .
                      </Text>
                      <Text style={commonStyle.texttimeblack}>{data.name}</Text>
                      <Text
                        style={[commonStyle.dotSmall, {marginHorizontal: 10}]}>
                        .
                      </Text>
                      <Text style={commonStyle.texttimeblack}>
                        {data.percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}

            {/* <View style={commonStyle.piechartlebal}>
                      <View style={commonStyle.searchBarText}>
                        <Text style={[commonStyle.piechartdot, {backgroundColor: '#48a0f9'}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>Evening Make Up</Text>
                        <Text style={[commonStyle.dotSmall, {marginHorizontal: 10}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>25%</Text>
                      </View>
                    </View>
                    <View style={commonStyle.piechartlebal}>
                      <View style={commonStyle.searchBarText}>
                        <Text style={[commonStyle.piechartdot, {backgroundColor: '#a4a7f7'}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>Wash and Style</Text>
                        <Text style={[commonStyle.dotSmall, {marginHorizontal: 10}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>20%</Text>
                      </View>
                    </View>
                    <View style={commonStyle.piechartlebal}>
                      <View style={commonStyle.searchBarText}>
                        <Text style={[commonStyle.piechartdot, {backgroundColor: '#23ba5f'}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>Group lesson. Professional Make Up</Text>
                        <Text style={[commonStyle.dotSmall, {marginHorizontal: 10}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>10%</Text>
                      </View>
                    </View>
                    <View style={commonStyle.piechartlebal}>
                      <View style={commonStyle.searchBarText}>
                        <Text style={[commonStyle.piechartdot, {backgroundColor: '#ef9b1e'}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>Hair cut</Text>
                        <Text style={[commonStyle.dotSmall, {marginHorizontal: 10}]}>.</Text>
                        <Text style={commonStyle.texttimeblack}>10%</Text>
                      </View>
                    </View> */}
          </View>

          <View></View>
        </View>
      </ScrollView>
      {/* Analytics Period modal start */}
      <Modal
        isVisible={visibleModal === 'AnalyticsPeriodDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
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
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
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
            {/* <AnalyticsPeriodModal setDateForFilter={setDateForFilter}/> */}
            <AnalyticsCustomPeriodModal setDateForFilter={setDateForFilter} />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View>
        </View>
      </Modal>
      {/* Analytics Period modal End */}

      {/* Analytics Statistics Services modal start */}
      <Modal
        isVisible={visibleModal === 'StatisticsServicesDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
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
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
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
            <StatisticsServicesModal />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Apply"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => setVisibleModal({visibleModal: null})}
            />
          </View>
        </View>
      </Modal>
      {/* Analytics Statistics Services modal End */}
    </Container>
  );
};

export default AnalyticsStatisticsTab;
