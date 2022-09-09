import { useNavigation } from '@react-navigation/native';
import { Body, Container } from 'native-base';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import InstagramLogin from 'react-native-instagram-login';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { fileUpload, Get } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import ActivityLoader from '../../components/ActivityLoader';
import global from '../../components/commonservices/toast';
import { Put } from '../../api/apiAgent';
import {
  CloseIcon,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../../components/icons';
const { width, height } = Dimensions.get('window');

const SetupAdditionalInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const aditionalInfoDetails = useSelector(
    (state) => state.professionalProfileSetupReducer.aditionalInfoDetails,
  );
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);
  const [serviceDescription, setServiceDescription] = useState('');
  const [isAdditionalLinkFocus, setIsAdditionalLinkFocus] = useState(false);
  const [additionalLink, setAdditionalLink] = useState('');
  const [filePath, setFilePath] = useState({});
  const [images, setImages] = useState([]);
  const [isError, setIsError] = useState(false);
  const [instaToken, setInstaToken] = useState(false);
  const [loader, setLoader] = useState(false);
  const instagramLogin = useRef(null);
  //    set field dynamic
  const [additionalInfoData, setAdditionalInfoData] = useState('');
  const [fields, setFields] = useState([{ value: null }]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [bioData, setbioData] = useState('');
  const [additionalInfoUrl, setAdditionalInfoUrl] = useState([]);

  // GET /business-details , GET /services, GET /contact-pref, GET /payment-info, GET /additional-info @Sourav.
  //handle change for dynamic field
  function handleChange(i, event) {
    const values = [...fields];
    console.log(event);
    values[i].value = event;
    setFields(values);
    console.log(values);
  }
  //fetch Data
  const fetchData = () => {
    setLoader(true);
    Get('/pro/additional-info', '')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          if (result.data && result.data.additionalLinks) {
            setIsUpdated(true);
            setAdditionalInfoData(result.data);
            setServiceDescription(result.data.bioData);
            setAdditionalInfoUrl(result.data.additionalLinks);
            setImages(result.data.portfolioImages);
          } else {
            setIsUpdated(false);
          }
        } else {
          global.showToast('Something went wrong', 'error');
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
  // handle add for dynamic field
  function handleAdd() {
    const values = [...fields];
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
  function handleRemoveLink(i) {
    /*  const newAdditionalInfoUrl = additionalInfoUrl;

    newAdditionalInfoUrl.splice(index,1);
    setAdditionalInfoUrl(newAdditionalInfoUrl);  */
    const newAdditionalInfoUrl = [...additionalInfoUrl];
    newAdditionalInfoUrl.splice(i, 1);
    setAdditionalInfoUrl(newAdditionalInfoUrl);
    console.log(additionalInfoUrl);
  }

  // render image function
  const renderImage = (image) => {
    return (
      <Image
        style={commonStyle.scrollPortfolioPhotosImg}
        source={!image.id ? image : { uri: `${image.url}` }}
      />
    );
  };

  const renderAsset = (image) => {
    return image ? (
      <Image
        style={commonStyle.scrollPortfolioPhotosImg}
        source={!image.id ? image : { uri: `${image.url}` }}
      />
    ) : null;
  };
  const pickMultiple = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      includeExif: true,
      mediaType: 'photo',
      //forceJpg: true,
    })
      .then((pickedImages) => {
        console.log(pickedImages.length);
        if (pickedImages.length > 10) {
          global.showToast('Only up to 10 image upload', 'error');
          return false;
        }

        let imgs = pickedImages.map((i) => {
          console.log('received image', i);
          let name = i.path.split('/')[9];
          console.log('received image name', name);
          return {
            name: i.path.split('/')[9],
            uri: i.path,
            width: i.width,
            height: i.height,
            mime: i.mime,
            size: i.size,
          };
        });
        console.log(imgs);
        setImages([...images, ...imgs]);
        /* this.setState({
          image: null,
          images: images.map((i) => {
            console.log('received image', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        }); */
      })
      .catch((e) => alert(e));
  };
  useEffect(() => {
    fetchData();
  }, []);
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
    //this.setState({ token: data.access_token })
    setInstaToken(data.access_token);
  };

  // additional info  api  callinh
  const AdditionalInfo = (url, data) => {
    setLoader(true);

    fileUpload(url, data, 'POST')
      .then((result) => {
        setLoader(false);
        console.log('result', result);
        if (result.status === 201) {
          navigation.navigate('SetupFaq');
        } else {
          global.showToast(result.message, 'error');
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
  const handleAddintionalInfo = () => {
    let flag = true;
    const req = [];

    if (serviceDescription == null || serviceDescription == '') {
      setIsError(true);
      flag = false;
      global.showToast('Bio is required', 'error');
      return false;
    } else {
      flag = true;
    }

    const links = [];
    fields?.forEach((link, index) => {
      if (link.value) {
        const isValidLink = isUrlValid(link.value);
        //console.log('isValidLink',isValidLink)

        if (isValidLink) {
          flag = true;
          req.push({ name: `links[${index}]`, data: link.value });

          links.push(link.value);
        } else {
          global.showToast('Invalid url', 'error');

          flag = false;
          return false;
        }
      }
    });

    if (flag) {
      req.push({ name: 'bioData', data: serviceDescription });
      console.log(images);
      images?.forEach((element) => {
        if (!element.id) {
          const newFileObj = {
            name: 'portFolioImages',
            filename: element.name,
            type: element.mime,
            data: RNFetchBlob.wrap(
              Platform.OS === 'android'
                ? element.uri
                : element.uri.replace('file://', ''),
            ),
          };
          req.push(newFileObj);
        }
      });

      console.log('formData', req);
      AdditionalInfo('/pro/additional-info', req);
    }
  };
  console.log('images', images);
  return (
    <Fragment>
      {console.log(additionalInfoUrl)}
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
                <View
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isServiceDescriptionFocus && commonStyle.focusinput,
                  ]}>
                  <TextInput
                    style={[
                      commonStyle.newtextareaInput,
                      { height: 110, textAlignVertical: 'top' },
                    ]}
                    onFocus={() => setIsServiceDescriptionFocus(true)}
                    value={serviceDescription}
                    onChangeText={(text) => setServiceDescription(text)}
                    returnKeyType="done"
                    keyboardType="email-address"
                    autoCapitalize={'none'}
                    multiline={true}
                    numberOfLines={6}
                    maxLength={500}
                    blurOnSubmit={true}
                    onSubmitEditing={(e) => {
                      console.log('On Submit Editing');
                      e.target.blur();
                    }}
                  />
                  <Text style={commonStyle.textlength}>
                    {(serviceDescription && serviceDescription.length) || 0}/500
                  </Text>
                </View>
              </View>
            </View>

            <View style={[commonStyle.horizontalPadd, commonStyle.mb15]}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Upload portfolio photos (up to 10)
              </Text>
              <View style={commonStyle.portfolioPhotosWrap}>
                <TouchableOpacity
                  style={commonStyle.addPortfolioPhoto}
                  //onPress={chooseFile}>
                  onPress={pickMultiple}>
                  <Text style={[commonStyle.plusText, { opacity: 0.4 }]}>+</Text>
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {/* <View style={commonStyle.scrollPortfolioPhotos}>
                    <Image
                      source={{uri: filePath.uri}}
                      style={commonStyle.scrollPortfolioPhotosImg}
                    />
                  </View> */}
                  {images
                    ? images.map((i) => (
                      <View
                        style={commonStyle.scrollPortfolioPhotos}
                        key={i.uri || i.id}>
                        {renderAsset(i)}
                      </View>
                    ))
                    : null}
                </ScrollView>
              </View>
            </View>

            <View style={[commonStyle.exploreCommListWrap, commonStyle.mb2]}>
              <View style={commonStyle.horizontalPadd}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Instagram feed
                </Text>
              </View>
              <View style={commonStyle.mb15}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={commonStyle.btnsocial}
                  onPress={() => instagramLogin.current.show()}>
                  {/*  onPress={()=> this.refs.instagramLogin.show()} */}
                  <Image
                    style={commonStyle.socialIcon}
                    source={require('../../assets/images/instagramm.png')}
                  />
                  <Text
                    style={[commonStyle.blackText16, commonStyle.socialtext]}>
                    Connect to Instagram
                  </Text>
                </TouchableOpacity>
                <InstagramLogin
                  ref={(ref) => {
                    instagramLogin.current = ref;
                  }}
                  appId="3926325880815873"
                  appSecret="18e4a9dd7db565afb2c2e784d5ee4aff"
                  redirectUrl="https://socialsizzle.heroku.com/auth/"
                  scopes={['user_profile', 'user_media']}
                  // scopes={['email']}
                  onLoginSuccess={setIgToken}
                  onLoginFailure={(data) => console.log(JSON.stringify(data))}
                />
              </View>
              {/*  Instagram Feed FlatList Start  */}
              {/* flap list for image  */}
              {/*   <FlatList
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
            </View>

            <View style={commonStyle.horizontalPadd}>
              <View style={commonStyle.mb1}>
                <Text style={[commonStyle.blackTextR]}>
                  Additional link (it’s optional)
                </Text>
                {additionalInfoUrl &&
                  additionalInfoUrl.map((additionalInfoUrl, index) => {
                    return (
                      <View key={index} style={{ paddingHorizontal: 0 }}>
                        {additionalInfoUrl.url ? (
                          <View style={commonStyle.addLinkList}>
                            <TextInput
                              style={[
                                commonStyle.newtextInput,
                                { width: '100%', paddingRight: 30 },
                              ]}
                              // onFocus={() => setIsAdditionalLinkFocus(true)}
                              //onChangeText={(e) => handleChange(idx, e)}
                              returnKeyType="done"
                              value={
                                additionalInfoUrl.url
                                  ? additionalInfoUrl.url
                                  : ''
                              }
                              autoCapitalize={'none'}
                              placeholder="e.g. website address"
                              placeholderTextColor={'#939DAA'}
                              maxLength={200}
                              editable={false}
                            />
                            <View
                              style={{
                                right: 12,
                                top: 12,
                                position: 'absolute',
                                backgroundColor: '#f4f5f7',
                                width: 25,
                                height: 25,
                                flexDirection: 'row',
                                borderRadius: 25,
                                zIndex: 1000,
                              }}>
                              <TouchableOpacity
                                onPress={() => handleRemoveLink(index)}
                                style={{
                                  backgroundColor: '#f4f5f7',
                                  width: 25,
                                  height: 25,
                                  alignSelf: 'center',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'row',
                                  borderRadius: 25,
                                }}>
                                <CloseIcon />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
              </View>

              {/* dynamic field */}
              <View>
                {fields.map((field, idx) => {
                  return (
                    <View
                      key={`${field}-${idx}`}
                      style={{ paddingHorizontal: 0 }}>
                      <View style={commonStyle.addLinkList}>
                        <TextInput
                          style={[
                            commonStyle.newtextInput,
                            { paddingRight: 30, width: '90%' },
                          ]}
                          onFocus={() => setIsAdditionalLinkFocus(true)}
                          onChangeText={(e) => handleChange(idx, e)}
                          returnKeyType="done"
                          autoCapitalize={'none'}
                          placeholder="e.g. website address"
                          placeholderTextColor={'#939DAA'}
                          maxLength={200}
                        />
                      </View>
                      { }
                      <View
                        style={{
                          right: 12,
                          top: 23,
                          position: 'absolute',
                          backgroundColor: '#f4f5f7',
                          width: 25,
                          height: 25,
                          flexDirection: 'row',
                          borderRadius: 25,
                          zIndex: 1000,
                        }}>
                        <TouchableOpacity
                          onPress={() => handleRemove(idx)}
                          style={{
                            backgroundColor: '#f4f5f7',
                            width: 25,
                            height: 25,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderRadius: 25,
                          }}>
                          <CloseIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={(commonStyle.mb2, commonStyle.mt1)}>
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
              onPress={handleAddintionalInfo}
            //onPress={() => navigation.navigate('SetupFaq')}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default SetupAdditionalInfo;
