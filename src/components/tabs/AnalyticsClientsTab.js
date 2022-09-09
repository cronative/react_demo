import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import {Container} from 'native-base';
import EventEmitter from 'react-native-eventemitter';
import {Area, Chart, Line} from 'react-native-responsive-linechart';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {
  professionalAnalyticsClear,
  professionalAnalyticsRequest,
  professionalGraphsClear,
  professionalGraphsRequest,
  topClientsClear,
  topClientsRequest,
} from '../../store/actions/clientsListAction';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import {
  PolygonGreen,
  PolygonGreenDown,
  PolygonRed,
  PolygonRedUp,
  RightAngle,
} from '../icons';
import {checkGracePeriodExpiry} from '../../utility/fetchGracePeriodData';
import {useFocusEffect} from '@react-navigation/native';

const AnalyticsClientsTab = ({activeTabValue, setActiveTabValue}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Get the current state
  const topCLientsData = useSelector(
    (state) => state.clientsListReducer.top_clients,
  );
  const analyticsData = useSelector(
    (state) => state.clientsListReducer.analytics_data,
  );
  const graphData = useSelector((state) => state.clientsListReducer.graph_data);
  const loderStatus = useSelector((state) => state.clientsListReducer.loader);

  useFocusEffect(
    useCallback(() => {
      if (activeTabValue == 1) {
        checkGracePeriodExpiry()
          .then((isGracePeriodExpired) => {
            if (isGracePeriodExpired) {
              setActiveTabValue(0);
              navigation.navigate('TrialFinished');
            } else {
              refreshPage();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // optimization
        clearData();
      }

      EventEmitter.on('refreshPage', () => {
        refreshPage();
        return clearData;
      });

      return clearData;
    }, [activeTabValue]),
  );

  const refreshPage = () => {
    dispatch(topClientsRequest());
    dispatch(professionalAnalyticsRequest());
    dispatch(professionalGraphsRequest());
  };

  const clearData = () => {
    dispatch(topClientsClear());
    dispatch(professionalAnalyticsClear());
    dispatch(professionalGraphsClear());
  };

  const prepareGraphData = (dataSource) => {
    if (dataSource && dataSource.length) {
      const preparedData = dataSource.map((item, index) => ({
        x: index,
        y: item.count,
      }));
      return preparedData;
    }
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
        }>
        <View style={[commonStyle.horizontalPadd, commonStyle.mt1]}>
          <TouchableOpacity
            style={[
              commonStyle.profileRoutingList,
              commonStyle.analyticsclientpl,
            ]}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('ClientsAllContacts', {
                pageTitle: 'All clients',
                listType: 'all',
              })
            }>
            <View style={commonStyle.searchBarText}>
              <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                All clients
              </Text>
              <Text style={commonStyle.dotSmall}>.</Text>
              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                {analyticsData &&
                analyticsData.allClients &&
                analyticsData.allClients.count
                  ? analyticsData.allClients.count
                  : 0}
              </Text>
            </View>
            <TouchableHighlight>
              <RightAngle />
            </TouchableHighlight>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyle.profileRoutingList,
              commonStyle.analyticsclientpl,
            ]}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('ClientsAllContacts', {
                pageTitle: 'New clients',
                listType: 'new',
              })
            }>
            <View style={commonStyle.searchBarText}>
              <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                New clients
              </Text>
              <Text style={commonStyle.dotSmall}>.</Text>
              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                {analyticsData &&
                analyticsData.newClients &&
                analyticsData.newClients.count
                  ? analyticsData.newClients.count
                  : 0}
              </Text>
            </View>
            <TouchableHighlight>
              <RightAngle />
            </TouchableHighlight>
          </TouchableOpacity>

          {/* <TouchableOpacity style={[commonStyle.profileRoutingList, commonStyle.analyticsclientpl]} activeOpacity={0.5}>
              <View style={commonStyle.searchBarText}>
                <Text style={[commonStyle.blackTextR, { marginRight: 4 }]}>Recurring clients</Text>
                <Text style={commonStyle.dotSmall}>.</Text>
                <Text style={[commonStyle.blackTextR, { marginLeft: 4 }]}>{analyticsData && analyticsData.recurringClients && analyticsData.recurringClients.count ? analyticsData.recurringClients.count : 0}</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity> */}

          <TouchableOpacity
            style={[
              commonStyle.profileRoutingList,
              commonStyle.analyticsclientpl,
            ]}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('ClientsWalkInClient', {listType: 'walkin'})
            }>
            <View style={commonStyle.searchBarText}>
              <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                Walk-in
              </Text>
              <Text style={commonStyle.dotSmall}>.</Text>
              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                {analyticsData &&
                analyticsData.walkin &&
                analyticsData.walkin.count
                  ? analyticsData.walkin.count
                  : 0}
              </Text>
            </View>
            <TouchableHighlight>
              <RightAngle />
            </TouchableHighlight>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              commonStyle.profileRoutingList,
              commonStyle.analyticsclientpl,
            ]}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('ClientsAllContacts', {
                pageTitle: 'Low-engagement clients',
                listType: 'low',
              })
            }>
            <View style={commonStyle.searchBarText}>
              <Text style={[commonStyle.blackTextR, {marginRight: 4}]}>
                Low engagement clients
              </Text>
              <Text style={commonStyle.dotSmall}>.</Text>
              <Text style={[commonStyle.blackTextR, {marginLeft: 4}]}>
                {analyticsData &&
                analyticsData.lowEngagementClients &&
                analyticsData.lowEngagementClients.count
                  ? analyticsData.lowEngagementClients.count
                  : 0}
              </Text>
            </View>
            <TouchableHighlight>
              <RightAngle />
            </TouchableHighlight>
          </TouchableOpacity>
        </View>
        {/* Top Clients FlatList Start  */}
        {!loderStatus ? (
          <View style={commonStyle.mt05}>
            <View style={commonStyle.viewAllheadingWrap}>
              <Text style={[commonStyle.subheading, commonStyle.mb1]}>
                Top 5 clients
              </Text>
            </View>
            {topCLientsData &&
            topCLientsData.rows &&
            topCLientsData.rows.length ? (
              <FlatList
                horizontal
                style={commonStyle.groupflatlist}
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={topCLientsData && topCLientsData.rows}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <View key={index} style={commonStyle.analyticsclientCard}>
                    <View style={commonStyle.analyticsclientCardContent}>
                      <View style={commonStyle.analyticsclientImgWrap}>
                        <Image
                          style={commonStyle.analyticsclientImg}
                          source={
                            item?.User && item?.User?.profileImage
                              ? {uri: item?.User?.profileImage}
                              : require('../../assets/images/default-user.png')
                          }
                        />
                      </View>
                      <View style={commonStyle.featuredCardText}>
                        <Text
                          style={[
                            commonStyle.blackTextR,
                            commonStyle.mb05,
                            commonStyle.textCenter,
                          ]}>
                          {item?.User?.userName}
                        </Text>
                        <Text
                          style={[
                            commonStyle.categorytagsText,
                            commonStyle.mb15,
                            commonStyle.textCenter,
                          ]}>
                          {item?.User?.countryCode
                            ? item?.User?.countryCode
                            : ''}{' '}
                          {item?.User?.phone ? item?.User?.phone : ''}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('ClientsProfile', {
                              clientId: item?.User?.id,
                            })
                          }>
                          <Text
                            style={[
                              commonStyle.textorange12,
                              commonStyle.textCenter,
                            ]}>
                            View profile
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={[commonStyle.noMassegeWrap, {height: 'auto'}]}>
                <View style={[commonStyle.mb1]}>
                  <Image
                    style={{height: 120}}
                    source={require('../../assets/images/no-client.png')}
                    resizeMode={'contain'}
                  />
                </View>
                <Text
                  style={[
                    commonStyle.grayText16,
                    commonStyle.textCenter,
                    commonStyle.colorOrange,
                  ]}>
                  No clients yet
                </Text>
              </View>
            )}
          </View>
        ) : (
          <ActivityLoaderSolid />
        )}
        {/* Top Clients  FlatList End  */}

        {/* Analytics Section FlatList Start  */}
        <View>
          <View style={commonStyle.viewAllheadingWrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Client analytics
            </Text>
          </View>
          <View style={[commonStyle.horizontalPadd]}>
            {analyticsData &&
            analyticsData.newClients &&
            (analyticsData.newClients.percentage ||
              analyticsData.newClients.percentage === 0) &&
            analyticsData.newClients.count >= 0 &&
            graphData &&
            graphData.newClients ? (
              <View style={commonStyle.clientanalyticslist}>
                <View style={commonStyle.commRow}>
                  <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                    <Text style={[commonStyle.grayText14, commonStyle.mb03]}>
                      New clients
                    </Text>
                    <Text
                      style={[commonStyle.modalforgotheading, commonStyle.mb1]}>
                      {analyticsData.newClients.count}
                    </Text>
                    <View style={[commonStyle.searchBarText, commonStyle.mb03]}>
                      <TouchableOpacity style={commonStyle.clientgraphCircle}>
                        {analyticsData.newClients.percentage <= 0 ? (
                          <PolygonRed />
                        ) : (
                          <PolygonGreen />
                        )}
                      </TouchableOpacity>
                      {analyticsData.newClients.percentage <= 0 ? (
                        <Text style={[commonStyle.textred, {marginLeft: 5}]}>
                          {Number(analyticsData.newClients.percentage).toFixed(
                            2,
                          )}
                          %
                        </Text>
                      ) : (
                        <Text style={[commonStyle.textgreen, {marginLeft: 5}]}>
                          {Number(analyticsData.newClients.percentage).toFixed(
                            2,
                          )}
                          %
                        </Text>
                      )}
                      <Text style={[commonStyle.grayText14, {marginLeft: 5}]}>
                        this month
                      </Text>
                    </View>
                  </View>
                  <View style={[commonStyle.CommCol6, {paddingHorizontal: 10}]}>
                    <View>
                      <Chart
                        style={{height: 60, width: '100%'}}
                        // data={[
                        //   { x: 0, y: 12 },
                        //   { x: 1, y: 7 },
                        //   { x: 2, y: 6 },
                        //   { x: 3, y: 3 },
                        //   { x: 4, y: 5 },
                        //   { x: 5, y: 8 },
                        //   { x: 6, y: 12 },
                        //   { x: 7, y: 14 },
                        //   { x: 8, y: 12 },
                        //   { x: 9, y: 13.5 },
                        //   { x: 10, y: 18 },
                        // ]}
                        data={prepareGraphData(graphData.newClients)}
                        padding={{left: 0, bottom: 0, right: 0, top: 0}}
                        xDomain={{min: -2, max: 10}}
                        yDomain={{min: -4, max: 5}}>
                        <Area
                          theme={{
                            gradient: {
                              from: {
                                color:
                                  analyticsData.newClients.percentage <= 0
                                    ? '#DF3734'
                                    : '#26C967',
                              },
                              to: {color: '#fff', opacity: 0.1},
                            },
                          }}
                        />
                        <Line
                          theme={{
                            stroke: {
                              color:
                                analyticsData.newClients.percentage <= 0
                                  ? '#DF3734'
                                  : '#26C967',
                              width: 2,
                            },
                          }}
                        />
                      </Chart>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {analyticsData &&
            analyticsData.recurringClients &&
            (analyticsData.recurringClients.percentage ||
              analyticsData.recurringClients.percentage === 0) &&
            analyticsData.recurringClients.count >= 0 &&
            graphData &&
            graphData.recurring ? (
              <View style={commonStyle.clientanalyticslist}>
                <View style={commonStyle.commRow}>
                  <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                    <Text style={[commonStyle.grayText14, commonStyle.mb03]}>
                      Reccuring
                    </Text>
                    <Text
                      style={[commonStyle.modalforgotheading, commonStyle.mb1]}>
                      {analyticsData.recurringClients.count}
                    </Text>
                    <View style={[commonStyle.searchBarText, commonStyle.mb03]}>
                      <TouchableOpacity style={commonStyle.clientgraphCircle}>
                        {analyticsData.recurringClients.percentage <= 0 ? (
                          <PolygonRed />
                        ) : (
                          <PolygonGreen />
                        )}
                      </TouchableOpacity>
                      {analyticsData.recurringClients.percentage <= 0 ? (
                        <Text style={[commonStyle.textred, {marginLeft: 5}]}>
                          {analyticsData.recurringClients.percentage}%
                        </Text>
                      ) : (
                        <Text style={[commonStyle.textgreen, {marginLeft: 5}]}>
                          {analyticsData.recurringClients.percentage}%
                        </Text>
                      )}
                      <Text style={[commonStyle.grayText14, {marginLeft: 5}]}>
                        this month
                      </Text>
                    </View>
                  </View>
                  <View style={[commonStyle.CommCol6, {paddingHorizontal: 10}]}>
                    <View>
                      <Chart
                        style={{height: 60, width: '100%'}}
                        data={prepareGraphData(graphData.recurring)}
                        padding={{left: 0, bottom: 0, right: 0, top: 0}}
                        xDomain={{min: -2, max: 10}}
                        yDomain={{min: -4, max: 5}}>
                        <Area
                          theme={{
                            gradient: {
                              from: {
                                color:
                                  analyticsData.recurringClients.percentage <= 0
                                    ? '#DF3734'
                                    : '#26C967',
                              },
                              to: {color: '#fff', opacity: 0.1},
                            },
                          }}
                        />
                        <Line
                          theme={{
                            stroke: {
                              color:
                                analyticsData.recurringClients.percentage <= 0
                                  ? '#DF3734'
                                  : '#26C967',
                              width: 2,
                            },
                          }}
                        />
                      </Chart>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {analyticsData &&
            analyticsData.bookingsCompleted &&
            (analyticsData.bookingsCompleted.percentage ||
              analyticsData.bookingsCompleted.percentage === 0) &&
            analyticsData.bookingsCompleted.count >= 0 &&
            graphData &&
            graphData.bookingsCompleted ? (
              <View style={commonStyle.clientanalyticslist}>
                <View style={commonStyle.commRow}>
                  <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                    <Text style={[commonStyle.grayText14, commonStyle.mb03]}>
                      Bookings completed
                    </Text>
                    <Text
                      style={[commonStyle.modalforgotheading, commonStyle.mb1]}>
                      {analyticsData.bookingsCompleted.count}
                    </Text>
                    <View style={[commonStyle.searchBarText, commonStyle.mb03]}>
                      <TouchableOpacity style={commonStyle.clientgraphCircle}>
                        {analyticsData.bookingsCompleted.percentage > 0 ? (
                          <PolygonGreen />
                        ) : (
                          <PolygonRed />
                        )}
                      </TouchableOpacity>
                      {analyticsData.bookingsCompleted.percentage > 0 ? (
                        <Text style={[commonStyle.textgreen, {marginLeft: 5}]}>
                          {Number(
                            analyticsData.bookingsCompleted.percentage,
                          ).toFixed(2)}
                          %
                        </Text>
                      ) : (
                        <Text style={[commonStyle.textred, {marginLeft: 5}]}>
                          {Number(
                            analyticsData.bookingsCompleted.percentage,
                          ).toFixed(2)}
                          %
                        </Text>
                      )}
                      <Text style={[commonStyle.grayText14, {marginLeft: 5}]}>
                        this month
                      </Text>
                    </View>
                  </View>
                  <View style={[commonStyle.CommCol6, {paddingHorizontal: 10}]}>
                    <View>
                      <Chart
                        style={{height: 60, width: '100%'}}
                        data={prepareGraphData(graphData.bookingsCompleted)}
                        padding={{left: 0, bottom: 0, right: 0, top: 0}}
                        xDomain={{min: -2, max: 10}}
                        yDomain={{min: -4, max: 5}}>
                        <Area
                          theme={{
                            gradient: {
                              from: {
                                color:
                                  analyticsData.bookingsCompleted.percentage > 0
                                    ? '#26C967'
                                    : '#DF3734',
                              },
                              to: {color: '#fff', opacity: 0.1},
                            },
                          }}
                        />
                        <Line
                          theme={{
                            stroke: {
                              color:
                                analyticsData.bookingsCompleted.percentage > 0
                                  ? '#26C967'
                                  : '#DF3734',
                              width: 2,
                            },
                          }}
                        />
                      </Chart>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {analyticsData &&
            analyticsData.noShow &&
            (analyticsData.noShow.percentage ||
              analyticsData.noShow.percentage === 0) &&
            analyticsData.noShow.count >= 0 &&
            graphData &&
            graphData.noShow ? (
              <View style={commonStyle.clientanalyticslist}>
                <View style={commonStyle.commRow}>
                  <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                    <Text style={[commonStyle.grayText14, commonStyle.mb03]}>
                      No-show
                    </Text>
                    <Text
                      style={[commonStyle.modalforgotheading, commonStyle.mb1]}>
                      {analyticsData.noShow.count}
                    </Text>
                    <View style={[commonStyle.searchBarText, commonStyle.mb03]}>
                      <TouchableOpacity style={commonStyle.clientgraphCircle}>
                        {analyticsData.noShow.percentage <= 0 ? (
                          <PolygonGreenDown />
                        ) : (
                          <PolygonRedUp />
                        )}
                      </TouchableOpacity>
                      {analyticsData.noShow.percentage <= 0 ? (
                        <Text style={[commonStyle.textgreen, {marginLeft: 5}]}>
                          {Number(analyticsData.noShow.percentage).toFixed(2)}%
                        </Text>
                      ) : (
                        <Text style={[commonStyle.textred, {marginLeft: 5}]}>
                          {Number(analyticsData.noShow.percentage).toFixed(2)}%
                        </Text>
                      )}
                      <Text style={[commonStyle.grayText14, {marginLeft: 5}]}>
                        this month
                      </Text>
                    </View>
                  </View>
                  <View style={[commonStyle.CommCol6, {paddingHorizontal: 10}]}>
                    <View>
                      <Chart
                        style={{height: 60, width: '100%'}}
                        data={prepareGraphData(graphData.noShow)}
                        padding={{left: 0, bottom: 0, right: 0, top: 0}}
                        xDomain={{min: -2, max: 10}}
                        yDomain={{min: -4, max: 5}}>
                        <Area
                          theme={{
                            gradient: {
                              from: {
                                color:
                                  analyticsData.noShow.percentage <= 0
                                    ? '#26C967'
                                    : '#DF3734',
                              },
                              to: {color: '#fff', opacity: 0.1},
                            },
                          }}
                        />
                        <Line
                          theme={{
                            stroke: {
                              color:
                                analyticsData.noShow.percentage <= 0
                                  ? '#26C967'
                                  : '#DF3734',
                              width: 2,
                            },
                          }}
                        />
                      </Chart>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}

            {analyticsData &&
            analyticsData.bookingsCancelled &&
            (analyticsData.bookingsCancelled.percentage ||
              analyticsData.bookingsCancelled.percentage === 0) &&
            analyticsData.bookingsCancelled.count >= 0 &&
            graphData &&
            graphData.bookingsCancelled ? (
              <View style={commonStyle.clientanalyticslist}>
                <View style={commonStyle.commRow}>
                  <View style={[commonStyle.CommCol6, {paddingRight: 5}]}>
                    <Text style={[commonStyle.grayText14, commonStyle.mb03]}>
                      Bookings cancelled
                    </Text>
                    <Text
                      style={[commonStyle.modalforgotheading, commonStyle.mb1]}>
                      {analyticsData.bookingsCancelled.count}
                    </Text>
                    <View style={[commonStyle.searchBarText, commonStyle.mb03]}>
                      <TouchableOpacity style={commonStyle.clientgraphCircle}>
                        {analyticsData.bookingsCancelled.percentage <= 0 ? (
                          <PolygonGreenDown />
                        ) : (
                          <PolygonRedUp />
                        )}
                      </TouchableOpacity>
                      {analyticsData.bookingsCancelled.percentage <= 0 ? (
                        <Text style={[commonStyle.textgreen, {marginLeft: 5}]}>
                          {Number(
                            analyticsData.bookingsCancelled.percentage,
                          ).toFixed(2)}
                          %
                        </Text>
                      ) : (
                        <Text style={[commonStyle.textred, {marginLeft: 5}]}>
                          {Number(
                            analyticsData.bookingsCancelled.percentage,
                          ).toFixed(2)}
                          %
                        </Text>
                      )}
                      <Text style={[commonStyle.grayText14, {marginLeft: 5}]}>
                        this month
                      </Text>
                    </View>
                  </View>
                  <View style={[commonStyle.CommCol6, {paddingHorizontal: 10}]}>
                    <View>
                      <Chart
                        style={{height: 60, width: '100%'}}
                        data={prepareGraphData(graphData.bookingsCancelled)}
                        padding={{left: 0, bottom: 0, right: 0, top: 0}}
                        xDomain={{min: -2, max: 10}}
                        yDomain={{min: -4, max: 5}}>
                        <Area
                          theme={{
                            gradient: {
                              from: {
                                color:
                                  analyticsData.bookingsCancelled.percentage <=
                                  0
                                    ? '#26C967'
                                    : '#DF3734',
                              },
                              to: {color: '#fff', opacity: 0.1},
                            },
                          }}
                        />
                        <Line
                          theme={{
                            stroke: {
                              color:
                                analyticsData.bookingsCancelled.percentage <= 0
                                  ? '#26C967'
                                  : '#DF3734',
                              width: 2,
                            },
                          }}
                        />
                      </Chart>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        {/* Analytics Section End */}
      </ScrollView>
    </Container>
  );
};

export default AnalyticsClientsTab;
