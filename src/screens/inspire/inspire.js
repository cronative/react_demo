import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Container, ScrollableTab, Tab, Tabs } from 'native-base';
import commonStyle from '../../assets/css/mainStyle';
import {
  InspireForYouTab,
  InspireFollowingTab,
  InspirationForGuest,
} from '../../components/tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventEmitter from 'react-native-eventemitter';
import { useFocusEffect } from '@react-navigation/core';
// 
const Inspire = ({ route }) => {
  const [logedInUserId, setLogedInUserId] = useState(null);
  const [activeTabValue, setActiveTabValue] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    getLogedInUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);

      return () => {
        setIsActive(false);
      };
    }, []),
  );

  const getLogedInUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setLogedInUserId(userId || 0);
    } catch (e) {
      setLogedInUserId(0);
    }
  };
  // Tabs index count
  const onChangeTabValue = (event) => {
    setActiveTabValue(event.i);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, { marginTop: 10 }]}>
        <View
          style={{
            paddingLeft: 15,
            marginTop: Platform.OS === 'ios' ? 35 : 2,
            paddingVertical: 5,
            position: logedInUserId ? 'absolute' : 'relative',
            zIndex: 9,
          }}>
          <Text style={commonStyle.textheading}>Get Inspired</Text>
        </View>
        {logedInUserId ? (
          <Tabs
            locked={true}
            renderTabBar={() => (
              <ScrollableTab style={[commonStyle.inboxScrollTab]} />
            )}
            onChangeTab={(event) => onChangeTabValue(event)}
            prerenderingSiblingsNumber={2}
            style={commonStyle.inboxtabsStyle}
            tabContainerStyle={commonStyle.inboxtabsconStyle}
            tabBarUnderlineStyle={[
              commonStyle.inboxtabBarUnderlineStyle,
              activeTabValue === 0
                ? { marginStart: Platform.OS === 'ios' ? 163 : 0 }
                : { marginStart: Platform.OS === 'ios' ? 51 : 0 },
            ]}>
            <Tab
              heading="For You"
              tabStyle={[
                commonStyle.inboxinactivetabStyle,
                commonStyle.inspiretabposions1,
              ]}
              activeTabStyle={[
                commonStyle.inboxactiveTabStyle,
                commonStyle.inspiretabposions1,
              ]}
              textStyle={commonStyle.textStyle}
              activeTextStyle={commonStyle.activeTextStyle}>
              {isActive && activeTabValue === 0 && <InspireForYouTab />}
            </Tab>
            <Tab
              heading="Following"
              tabStyle={[
                commonStyle.inboxinactivetabStyle,
                commonStyle.inspiretabposions2,
              ]}
              activeTabStyle={[
                commonStyle.inboxactiveTabStyle,
                commonStyle.inspiretabposions2,
              ]}
              textStyle={commonStyle.textStyle}
              activeTextStyle={commonStyle.activeTextStyle}>
              {isActive && activeTabValue === 1 && <InspireFollowingTab />}
            </Tab>
          </Tabs>
        ) : logedInUserId !== null ? (
          isActive ? (
            <InspirationForGuest />
          ) : (
            <></>
          )
        ) : null}
      </Container>
    </Fragment>
  );
};

export default Inspire;
