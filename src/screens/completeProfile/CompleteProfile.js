import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {CompleteProfileModal} from '../../components/modal';
import {CloseIcon} from '../../components/icons';
import {useFocusEffect} from '@react-navigation/native';
import {Get} from '../../api/apiAgent';

const CompleteProfile = ({navigation, route}) => {
  //   let businessCompletionDetails = route?.params?.businessCompletionDetails;
  const [businessCompletionDetails, setBusinessCompletionDetails] =
    useState(null);
  useFocusEffect(
    React.useCallback(() => {
      getBusinessCompleteInfo();
    }, []),
  );

  const getBusinessCompleteInfo = () => {
    // setLoader(true);
    Get('pro/completion-status', '')
      .then((result) => {
        console.log('sheela', JSON.stringify(result?.data, null, 2));
        // setProfileCompleteData(result?.data);
        setBusinessCompletionDetails(result?.data);
        // setLoader(false);
        // console.log('sheela', JSON.stringify(result, null, 2));
        // console.log(result.data);
        if (result.status === 200) {
          // setBusinessInfoDetails(result.data);
          if (result.data.percentage === 100) {
            // Start Change: Snehasish Das, Issue #1698
            // setProfileFinished(true);
            // End Change: Snehasish Das, Issue #1698
            // formatDate();
          }
        }
      })
      .catch((error) => {
        // setLoader(false);
        // formatDate();
      });
  };
  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingBottom: 80,
      }}>
      <TouchableOpacity
        style={{
          marginRight: 15,
          marginTop: 50,
          marginBottom: 2,
          width: 30,
          height: 30,
          alignSelf: 'flex-end',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red'
        }}
        onPress={() => navigation?.goBack()}>
        <CloseIcon />
      </TouchableOpacity>
      <ScrollView
        style={{
          backgroundColor: '#fff',
        }}>
        <CompleteProfileModal
          businessCompletionDetails={
            businessCompletionDetails?.completionDetails
          }
          businessInfoModalClose={() =>
            //   setIsCompleteProfileModalVisible(false)
            {}
          }
        />
      </ScrollView>
    </View>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({});
