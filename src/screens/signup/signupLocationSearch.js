import React, {Fragment, useState, useEffect} from 'react';
import {
  StatusBar,
  Text,
  StyleSheet,
  View,
  FlatList,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, Header} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {
  SearchIcon,
  CloseIcon,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import GooglePlacesInput from '../../components/GooglePlacesInput';
const {width, height} = Dimensions.get('window');

const SignupLocationSearch = (props) => {
  const navigation = useNavigation();

  // const [search, setSearch] = useState('');
  // const [filteredDataSource, setFilteredDataSource] = useState([]);
  // const [masterDataSource, setMasterDataSource] = useState([]);

  const fetchLocationDetailsHandler = (data, details) => {
    navigation.navigate('SignupGeolocation', {
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
      data: data,
    });
  };

  // useEffect(() => {
  //   fetch('https://jsonplaceholder.typicode.com/posts')
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       setFilteredDataSource(responseJson);
  //       setMasterDataSource(responseJson);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  // const searchFilterFunction = (text) => {
  //   // Check if searched text is not blank
  //   if (text) {
  //     const newData = masterDataSource.filter(function (item) {
  //       const itemData = item.title ? item.title : '';
  //       const textData = text;
  //       return itemData.indexOf(textData) > -1;
  //     });
  //     setFilteredDataSource(newData);
  //     setSearch(text);
  //   } else {
  //     setFilteredDataSource(masterDataSource);
  //     setSearch(text);
  //   }
  // };

  // const ItemView = ({item}) => {
  //   return (
  //     // Flat List Item
  //     <TouchableOpacity
  //       style={commonStyle.geolocationlist}
  //       onPress={() => getItem(item)}
  //       activeOpacity={0.3}>
  //       <Text style={[commonStyle.blackTextR, commonStyle.textCapitalize]}>
  //         {item.title}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  // const getItem = (item) => {
  //   // Function for click on an item
  //   alert('Id : ' + item.id + ' Title : ' + item.title);
  // };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        <View style={{height: height, marginTop: Platform.OS === 'ios' ? 20 : 30}}>
          <GooglePlacesInput
            fetchLocationDetailsHandler={fetchLocationDetailsHandler}
          />
          {/* <SearchBar
            searchIcon={{display: 'none'}}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            value={search}
            autoFocus={true}
            placeholder="Search by city"
            placeholderTextColor={'#939DAA'}
            clearIcon={<SearchIcon />}
            containerStyle={{
              backgroundColor: '#fff',
              borderBottomWidth: 0,
              borderTopWidth: 0,
              width: '100%',
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 10,
            }}
            inputStyle={{
              backgroundColor: '#fff',
              color: '#110F17',
              fontFamily: 'SofiaPro',
            }}
            inputContainerStyle={{
              paddingRight: 0,
              paddingLeft: 20,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderColor: '#110F17',
            }}
            style={{
              fontSize: 14,
              fontFamily: 'SofiaPro',
              backgroundColor: '#fff',
            }}
          /> */}
          <View style={[commonStyle.autocompletesearchback]}>
            <TouchableOpacity
              style={commonStyle.haederback}
              onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
        </View>
        {/* <KeyboardAwareScrollView>
          <View style={commonStyle.geolocationlistwrap}>
            <FlatList
              vertical
              data={filteredDataSource}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
            />
          </View>
        </KeyboardAwareScrollView> */}
      </Container>
    </Fragment>
  );
};

export default SignupLocationSearch;
