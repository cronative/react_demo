import React, { Fragment, useState, useEffect, RefObject, useRef } from 'react';
import {
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Footer, List, ListItem, Body, Left } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-picker';
import { AdditionalInstraFeedData } from '../../utility/staticData';
import InstagramLogin from 'react-native-instagram-login';
import ActivityLoader from '../../components/ActivityLoader';
import { Post } from '../../api/apiAgent';
import {
  LeftArrowIos,
  LeftArrowAndroid,
  CloseIcon,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import { addintionalInfo } from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux';
import global from '../../components/commonservices/toast';
const { width, height } = Dimensions.get('window');

const SetupAdditionalInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  let blankImageData = [];
  const [portFolioImage, setPortFolioImage] = useState([]);
  const aditionalInfoDetails = useSelector(
    (state) => state.professionalProfileSetupReducer.aditionalInfoDetails,
  );
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);
  const [serviceDescription, setServiceDescription] = useState('');
  const [isAdditionalLinkFocus, setIsAdditionalLinkFocus] = useState(false);
  const [additionalLink, setAdditionalLink] = useState('');
  const [filePath, setFilePath] = useState({});
  const [isError, setIsError] = useState(false);
  const [instaToken, setInstaToken] = useState(false);
  const [loader, setLoader] = useState(false);
  const instagramLogin = useRef(null);
  //    set field dynamic
  const [fields, setFields] = useState([{ value: null }]);

  // GET /business-details , GET /services, GET /contact-pref, GET /payment-info, GET /additional-info @Sourav.
  //handle change for dynamic field
  function handleChange(i, event) {
    const values = [...fields];
    console.log(event);
    values[i].value = event;
    setFields(values);
    console.log(values);
  }
  // handle add for dynamic field
  function handleAdd() {
    const values = [...fields];
    console.log(values.length);
    values.push({ value: null });
    setFields(values);
  }
  // handle remove dynamic field
  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
    console.log(values);
  }

  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let imageFile = {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        };
        blankImageData.push(imageFile);
        setPortFolioImage([...portFolioImage, ...blankImageData]);

        console.log('Our Array : ', blankImageData);
      }
    });
  };
  /*  useEffect(() => {
    console.log('aditionalInfoDetails', aditionalInfoDetails);
    if (aditionalInfoDetails) {
      if (aditionalInfoDetails.status === 201) {
        navigation.navigate('SetupFaq', {
          someParam: '',
        });
      } else if (
        aditionalInfoDetails.message &&
        aditionalInfoDetails.status !== 201
      ) {
        // console.log(termOfPayment.message)
         global.showToast(aditionalInfoDetails.message, 'error');
       }


     }
  }, [aditionalInfoDetails]); */
  // url validation code
  const isUrlValid = (userInput) => {
    console.log(userInput);
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(userInput);
  };
  const setIgToken = (data) => {
    console.log('data', data);
    //this.setState({ token: data.access_token })
    setInstaToken(data.access_token);
  };

  // additional info  api  callinh
  const AdditionalInfo = () => {
    const formData = new FormData();
    portFolioImage.map((imageData) => {
      formData.append('portFolioImages', imageData);
    });
    setLoader(true);
    let contentType = 'multipart/form-data';
    Post('/pro/additional-info', formData, '', contentType)
      .then((result) => {
        setLoader(false);
        if (result.status === 201) {
          console.log(result);

          navigation.navigate('SetupFaq', {
            someParam: '',
          });
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
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
  const handleAddintionalInfo = () => {
    // console.log(fields);
    //setIsError(false)
    let flag = true;
    const formData = new FormData();
    const LINKS = [];
    if (serviceDescription == null || serviceDescription == '') {
      setIsError(true);
      flag = false;
      global.showToast('Bio is required', 'error');
      return false;
    } else {
      flag = true;
    }
    if (fields.length > 0) {
      formData.append('links', []);
      fields.map((link) => {
        // console.log(link.value)
        if (link.value) {
          LINKS.push(link.value);

          const isValidLink = isUrlValid(link.value);
          console.log('isValidLink', isValidLink);
          formData.append('links', link.value);
          if (isValidLink) {
            // alert('url valid')
            //setIsError(false)
            flag = true;
            //return false
          } else {
            // alert('url inavalid')
            global.showToast('Invalid url', 'error');

            flag = false;
            return false;
          }
        }
      });
      // formData.append('links', JSON.stringify(LINKS))
      // console.log(LINKS);
    }
    console.log(flag);
    if (flag) {
      formData.append('bioData', serviceDescription);
      formData.append('portFolioImages', filePath);

      console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
      /* dispatch(addintionalInfo(formData)); */

      AdditionalInfo('/pro/additional-info', formData);
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loader ? <ActivityLoader /> : null}
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => navigation.goBack()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={commonStyle.headerbacktitle}>
            <Text style={commonStyle.blackText16}>Profile setup. Step 9</Text>
          </Body>
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('SetupFaq')}>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Progress.Bar
            progress={0.9}
            width={width}
            color="#F36A46"
            unfilledColor="#FFEBCE"
            borderColor="transparent"
            borderWidth={0}
            borderRadius={0}
            height={3}
          />
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Additional info
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={commonStyle.horizontalPadd}>
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Bio (highly recommended)
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isServiceDescriptionFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsServiceDescriptionFocus(true)}
                  onChangeText={(text) => setServiceDescription(text)}
                  returnKeyType="done"
                  keyboardType="email-address"
                  autoCapitalize={'none'}
                  multiline={true}
                  numberOfLines={7}
                  maxLength={500}
                  blurOnSubmit={true}
                  onSubmitEditing={(e) => {
                    console.log('On Submit Editing');
                    e.target.blur();
                  }}
                />
                <Text style={commonStyle.textlength}>
                  {serviceDescription.length}/500
                </Text>
              </View>
            </View>

            <View style={[commonStyle.horizontalPadd, commonStyle.mb15]}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Upload portfolio photos (up to 10)
              </Text>
              <View style={commonStyle.portfolioPhotosWrap}>
                <TouchableOpacity
                  style={commonStyle.addPortfolioPhoto}
                  onPress={chooseFile}>
                  <Text style={[commonStyle.plusText, { opacity: 0.4 }]}>+</Text>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {portFolioImage &&
                    portFolioImage.map((items, index) => (
                      <View
                        style={commonStyle.scrollPortfolioPhotos}
                        key={index}>
                        <Image
                          source={{ uri: items.uri }}
                          style={commonStyle.scrollPortfolioPhotosImg}
                        />
                      </View>
                    ))}
                </ScrollView>
              </View>
            </View>

            {/* <View style={[commonStyle.exploreCommListWrap, commonStyle.mb2]}>
              <View style={commonStyle.horizontalPadd}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Instagram feed
                </Text>
              </View> */}
            {/* <View style={commonStyle.mb15}>
                 <TouchableOpacity
                  activeOpacity={0.5}
                  style={commonStyle.btnsocial}
                  onPress={ ()=>instagramLogin.show()}> */}
            {/*  onPress={()=> this.refs.instagramLogin.show()} */}
            {/* <Image
                    style={commonStyle.socialIcon}
                    source={require('../../assets/images/instagramm.png')}
                  />
                  <Text
                    style={[commonStyle.blackText16, commonStyle.socialtext]}>
                    Connect to Instagram
                  </Text>
                </TouchableOpacity> 
                 <InstagramLogin
                  
                   ref={ref => { instagramLogin = ref; }}
                  appId='266303378499723'
                 appSecret='c756f2325f0fb77f9f4cb41897d259ec'
                redirectUrl='https://www.unifiedinfotech.net/'
               scopes={['user_profile']}
               onLoginSuccess={setIgToken}
              onLoginFailure={(data) => console.log(data)}
             /> 
              </View> */}
            {/*  Instagram Feed FlatList Start  */}
            {/* <FlatList
                horizontal
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={AdditionalInstraFeedData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity activeOpacity={0.8}>
                    <View style={commonStyle.additionalInstraFeedCard}>
                      <Image
                        defaultSource={require('../../assets/images/default.png')}
                        source={item.InstraFeedAvater}
                        style={commonStyle.additionalInstraFeedCardImg}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              /> */}
            {/* Instagram Feed FlatList End  */}
            {/* </View> */}

            <View style={commonStyle.horizontalPadd}>
              {/* <View style={commonStyle.mb15}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Additional link (it’s optional)
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    isAdditionalLinkFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsAdditionalLinkFocus(true)}
                  onChangeText={(text) => setAdditionalLink(text)}
                  returnKeyType="done"
                  autoCapitalize={'none'}
                  placeholder="e.g. website address"
                  placeholderTextColor={'#939DAA'}
                />
                <View style={commonStyle.addLinkList}>
                  <Text style={commonStyle.blackTextR} numberOfLines={1}>
                    htts://www.facebook.com/profile
                  </Text>
                  <TouchableOpacity>
                    <CloseIcon />
                  </TouchableOpacity>
                </View>
                <View style={commonStyle.addLinkList}>
                  <Text style={commonStyle.blackTextR} numberOfLines={1}>
                    htts://www.pinterest.com/profile
                  </Text>
                  <TouchableOpacity>
                    <CloseIcon />
                  </TouchableOpacity>
                </View>
              </View>
 */}
              <View style={commonStyle.mb2}>
                <TouchableOpacity
                  onPress={() => handleAdd()}
                  style={[
                    commonStyle.searchBarText,
                    { alignSelf: 'flex-start' },
                  ]}>
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
                  <Text style={commonStyle.blackTextR}>Add a link</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* dynamic field addd */}
            {/* <button type="button" onClick={() => handleAdd()}>
                   <Text> +</Text>
                 </button> */}

            {fields.map((field, idx) => {
              return (
                <View key={`${field}-${idx}`} style={{ paddingHorizontal: 20 }}>
                  <View style={commonStyle.addLinkList}>
                    <TextInput
                      style={[
                        commonStyle.blackTextR,
                        { width: '100%', paddingRight: 25 },
                      ]}
                      onFocus={() => setIsAdditionalLinkFocus(true)}
                      onChangeText={(e) => handleChange(idx, e)}
                      returnKeyType="done"
                      autoCapitalize={'none'}
                      placeholder="e.g. website address"
                      placeholderTextColor={'#939DAA'}
                    />
                    <TouchableOpacity
                      onPress={() => handleRemove(idx)}
                      style={{ right: 12 }}>
                      <CloseIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            {/* dynamic field end */}
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save and Continue"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={AdditionalInfo}
            //onPress={() => navigation.navigate('SetupFaq')}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default SetupAdditionalInfo;
