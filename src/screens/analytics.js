import {Container, ScrollableTab, Tab, Tabs} from 'native-base';
import React, {Fragment, useState} from 'react';
import {StatusBar, Text, View, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import {
  AnalyticsBalanceTab,
  AnalyticsClientsTab,
  AnalyticsStatisticsTab,
} from '../components/tabs';

const Analytics = ({navigation, ...props}) => {
  const dispatch = useDispatch();
  // Tabs index count
  const [activeTabValue, setActiveTabValue] = useState(0);
  const onChangeTabValue = (event) => {
    //console.log(event);
    setActiveTabValue(event.i);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        <View style={{paddingHorizontal: 20, paddingVertical: 5}}>
          <Text style={commonStyle.textheading}>Analytics</Text>
        </View>
        <Tabs
          page={activeTabValue}
          locked={true}
          onChangeTab={(event) => onChangeTabValue(event)}
          renderTabBar={() => (
            <ScrollableTab style={commonStyle.customScrollTab} />
          )}
          prerenderingSiblingsNumber={2}
          style={commonStyle.tabsStyle}
          tabContainerStyle={commonStyle.tabsconStyle}
          tabBarUnderlineStyle={[
            commonStyle.tabBarUnderlineStyle,
            activeTabValue === 0 && {
              marginStart: Platform.OS === 'ios' ? -3 : 0,
            },
            activeTabValue === 1 && {
              marginStart: Platform.OS === 'ios' ? -53 : 0,
            },
            activeTabValue === 2 && {
              marginStart: Platform.OS === 'ios' ? -103 : 0,
            },
          ]}>
          <Tab
            heading="Balance"
            tabStyle={[commonStyle.inactivetabStyle, commonStyle.tabposions1]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabposions1,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <AnalyticsBalanceTab activeTabValue={activeTabValue} />
          </Tab>
          <Tab
            heading="Clients"
            tabStyle={[commonStyle.inactivetabStyle, commonStyle.tabposions2]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabposions2,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <AnalyticsClientsTab
              activeTabValue={activeTabValue}
              setActiveTabValue={setActiveTabValue}
            />
          </Tab>
          <Tab
            heading="Statistics"
            tabStyle={[commonStyle.inactivetabStyle, commonStyle.tabposions3]}
            activeTabStyle={[
              commonStyle.activeTabStyle,
              commonStyle.tabposions3,
            ]}
            textStyle={commonStyle.textStyle}
            activeTextStyle={commonStyle.activeTextStyle}>
            <AnalyticsStatisticsTab activeTabValue={activeTabValue} />
          </Tab>
        </Tabs>
      </Container>
    </Fragment>
  );
};
export default Analytics;
