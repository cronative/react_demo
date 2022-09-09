import React, { Fragment, useState, useEffect, RefObject, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  PermissionsAndroid,
  Dimensions,
  Modal,
} from 'react-native';
import { Container, Content, List, ListItem, Body } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Tags from 'react-native-tags';
import {
  CircleCheckedBoxOutline,
  CircleCheckedBoxActive,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../../components/icons';
import commonStyle, { Colors } from '../../assets/css/mainStyle';
import { fileUpload, Get, Post, Put } from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
import * as Constant from '../../api/constant';
import Video from 'react-native-video';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';
import { Alert } from 'react-native';
import { UploadPhotoVideoModal } from '../../components/modal';
const { width, height } = Dimensions.get('window');

const InspirationAddOrEdit = ({ route }) => {
  const navigation = useNavigation();
  const inspiritionId = (route.params && route.params.inspiritionId) || null;
  const [loader, setLoader] = useState(false);
  const [inspireDetails, setInspireDetails] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const [filePath, setFilePath] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isTitleFocus, setIsTitleFocus] = useState(null);
  const [title, setTitle] = useState(null);
  const [isDescriptionFocus, setIsDescriptionFocus] = useState(false);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [selectedTagIdList, setSelectedTagIdList] = useState([]);
  const [selectedTagNameList, setSelectedTagNameList] = useState(undefined);
  const [resourceType, setResourceType] = useState('image');

  const [titleError, setTitleError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  const [tagInputText, setTagInputText] = useState('');
  const [tagCountFlag, setTagCountFlag] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  let allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mov',
    'video/wmv',
    'video/webm',
    'video/mp4',
    'video/avi',
    'image/jpg',
    'image/png',
    'image/bmp',
    'image/x-ms-bmp',
    'video/mpeg',
    'video/mpeg4',
    'video/mpeg-4',
    'video/MPEG-4',
    'video/quicktime',
  ];

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const handleFileResponse = (response) => {
    console.log('Response = ', response);
    setModalVisible(false);
    let source = response;
    let allowedFileTypes = [
      'image/jpeg',
      'image/gif',
      'video/mov',
      'video/wmv',
      'video/webm',
      'video/mp4',
      'video/avi',
      'image/jpg',
      'image/png',
      'image/bmp',
      'image/x-ms-bmp',
      'video/mpeg',
      'video/mpeg4',
      'video/mpeg-4',
      'video/MPEG-4',
      'video/quicktime',
    ];
    // console.log("source  ", source);
    console.log(
      '\n\n\n****************FILE UPLOAD INSPIRATION*****************\n\n\n\n',
    );
    console.log('response.fileSize', response.fileSize);
    console.log('response.type', response.type);
    console.log('\n\n\n******************');
    if (response.type && response.fileSize) {
      if (allowedFileTypes.includes(response.type)) {
        if (response.fileSize <= 10485760) {
          setFilePath(source);
        } else {
          global.showToast('File size can be upto 10 MB', 'error');
          setFilePath({});
        }
      } else {
        global.showToast(
          // `Only .svg, .png, .jpg,.bmp,.gif files are allowed for image and .mp4,.webm,.wmv,.avi,.mov for video. `,
          `Only .svg, .png, .jpg,.bmp,.gif files are allowed. `,
          'error',
        );
        setFilePath({});
      }
    } else {
      setFilePath(source);
    }
  };

  const chooseFile = async (type = resourceType) => {
    let cameraOptions = {
      mediaType: 'photo',
      noData: true,
    };

    let libraryOptions = {
      mediaType: 'mixed',
      noData: true,
    };

    Alert.alert(
      'Select a photo',
      '',
      [
        {
          text: 'Take photo',
          onPress: () => {
            ImagePicker.launchCamera(cameraOptions, (response) =>
              handleFileResponse(response),
            );
          },
        },
        {
          text: 'Choose from Library',
          onPress: () => {
            ImagePicker.launchImageLibrary(libraryOptions, (response) =>
              handleFileResponse(response),
            );
          },
        },
      ],
      { cancelable: true },
    );

    // let isCameraPermitted = await requestCameraPermission();
    // let isStoragePermitted = await requestExternalWritePermission();
    // console.log(isCameraPermitted);
    // console.log(isStoragePermitted);
    // if (isCameraPermitted && isStoragePermitted) {
    // }
  };

  const fileSelectedEvent = (items) => {
    if (items?.length > 0) {
      let source = {
        fileName: items[0]?.node?.image?.filename,
        uri: items[0]?.node?.image?.uri,
        type:
          items[0]?.node?.type === 'image' ? 'image/jpg' : items[0].node.type,
        fileSize: items[0]?.node?.image?.fileSize,
      };
      if (source.fileName && source.fileSize && source.type && source.uri) {
        let sizeValidationPass = validateFileSizes(source);
        if (!sizeValidationPass) {
          Alert.alert('File size can be upto 50 MB');
          setFilePath({});
          // global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
          return false;
        }

        if (allowedFileTypes.includes(source.type)) {
          setModalVisible(false);
          setFilePath(source);
        } else {
          setFilePath({});
          Alert.alert(
            `Uploaded video type ${source.type} Only .svg, .png, .jpg,.bmp,.gif files are allowed for image and .mp4,.webm,.wmv,.avi,.mov for video. `,
          );
        }
      } else {
        setFilePath({});
      }
    }
  };

  const cameraSubmitEvent = (response) => {
    handleFileResponse(response);
  };

  const validateFileSizes = (data) => {
    return data.fileSize <= 10485760;
    // return data.fileSize <= IMAGE_MAX_SIZE;
  };

  const categorySelectHelper = (index, value) => {
    setCategoryId(value);
  };

  const fetchInspireDetailsByInspiritionId = () => {
    if (inspiritionId) {
      Get('pro/inspiration-stories/' + inspiritionId, '')
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            setIsUpdate(true);
            setResourceType(
              result.data &&
                result.data.InspirationResources &&
                result.data.InspirationResources.length
                ? result.data.InspirationResources[0].resourceType
                : resourceType,
            );
            setInspireDetails(result.data);
            setTitle(result.data.title);
            setDescription(result.data.description);
            setCategoryId(result.data.proCategoryId);

            const tempTagIds = [];
            const tempTagNames = [];

            result.data.tags?.forEach((eachTag) => {
              tempTagIds.push(eachTag.tags.id);
              tempTagNames.push(eachTag.tags.name);
            });
            setSelectedTagIdList(tempTagIds);
            setSelectedTagNameList(tempTagNames);
            console.log('\n\n**************Temp Check********', tempTagIds);
            console.log('\n\n**************Temp Check********', tempTagNames);
          }
        })
        .catch((error) => {
          setLoader(false);
        });
    } else {
      setSelectedTagNameList([]);
      setLoader(false);
    }
  };

  useEffect(() => {
    console.log('selectedTagNameList cahnge', selectedTagNameList);
    if (selectedTagNameList !== undefined) {
      selectedTagNameList.length === 10
        ? setTagCountFlag(true)
        : setTagCountFlag(false);
    }
    //  if (selectedTagNameList && selectedTagNameList.length === 10) { setTagCountFlag(true) }
    // console.log(selectedTagNameList.length);
  }, [selectedTagNameList]);

  const fetchCategoryList = () => {
    setLoader(true);
    Get('pro/procategories', '')
      .then((result) => {
        fetchTagList();
        //  setLoader(false);
        if (result.status === 200) {
          setCategoryList(result.data);
        }
      })
      .catch((error) => {
        fetchTagList();
        //  setLoader(false);
      });
  };

  //Fetching all tags for suggested tags
  const fetchTagList = () => {
    Get('pro/tags', '')
      .then((result) => {
        fetchInspireDetailsByInspiritionId();
        if (result.status === 200) {
          setTagList(result.data);
        }
      })
      .catch((error) => {
        fetchInspireDetailsByInspiritionId();
      });
  };

  const submitInspirationDetails = async () => {
    const postData = [];
    if ((filePath?.uri && !isUpdate) || isUpdate) {
      if (title) {
        if (description) {
          if (categoryId !== null || inspireDetails?.id) {
            console.log('selectedTagIdList', selectedTagIdList);
            const formData = new FormData();

            if (isUpdate) {
              postData.push({
                name: 'id',
                data: inspireDetails.id,
              });
              formData.append('id', inspireDetails.id);
            } else {
              postData.push({ name: 'proCategoryId', data: categoryId });
              formData.append('proCategoryId', categoryId);
            }
            postData.push({ name: 'title', data: title });
            postData.push({ name: 'description', data: description });
            postData.push({ name: 'isActive', data: 1 });
            formData.append('title', title);
            formData.append('description', description);
            formData.append('isActive', 1);

            if (selectedTagIdList && selectedTagIdList.length > 0) {
              selectedTagIdList.forEach((tagId, index) =>
                formData.append('tags[' + index + ']', tagId),
              );
            }

            if (filePath && filePath.uri) {
              if (Platform.OS === 'ios') {
                let path = filePath.uri;
                path = '~' + path.substring(path.indexOf('/Documents'));
                filePath.fileName = path.split('/').pop();
              }
              if (filePath.type) {
                formData.append('resource[type]', filePath.type.split('/')[0]);
                formData.append(
                  'resource[resourceType]',
                  filePath.type.split('/')[0],
                );
              } else {
                formData.append('resource[type]', 'video');
                formData.append('resource[resourceType]', 'video');
              }
              formData.append('postFile', {
                name: filePath.fileName,
                type: filePath.type ? filePath.type : 'video/quicktime',
                uri: filePath.uri,
              });
              //console.log("URI: ", Platform.OS === 'android' ? filePath.uri : filePath.uri.replace('file://', ''))
            }
            addOrEditInspiritionDetails(formData);
            console.log('submitted data=  ', formData);
          } else {
            setCategoryError(true);
            global.showToast('Category required', 'error');
          }
        } else {
          setDescriptionError(true);
          global.showToast('Description required', 'error');
        }
      } else {
        setTitleError(true);
        global.showToast('Title required', 'error');
      }
    } else {
      global.showToast('Image Or Video required', 'error');
    }
  };

  const addOrEditInspiritionDetails = (details) => {
    setLoader(true);
    console.log('isUpdate is', isUpdate);
    if (isUpdate) {
      // fileUpload('/pro/inspiration-stories', details, 'PUT')
      Put('pro/inspiration-stories', details)
        .then((result) => {
          setLoader(false);
          console.log('result= ', result);
          global.showToast(
            result.message,
            result.status === 200 ? 'success' : 'error',
          );
          if (result.status === 200) {
            navigation.goBack();
            // navigation.navigate('ProfessionalInspirationPostList')
          }
        })
        .catch((error) => {
          console.error(error);
          global.showToast(
            (error &&
              error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
          setLoader(false);
        });
    } else {
      Post('pro/inspiration-stories', details, '', 'multipart/form-data')
        .then((result) => {
          console.log('isUpdate false result is', result);
          setLoader(false);
          console.log('result=***** ', result);
          global.showToast(
            result.message,
            result.status === 200 ? 'success' : 'error',
          );
          if (result.status === 200) {
            setTimeout(() => {
              navigation.navigate('InspireInner', {
                inspiritionId: result.data.id,
                doubleBack: false,
              });
            }, 200);
            // navigation.navigate('ProfessionalInspirationPostList', {
            //   postId: result.data.id,
            // });
            // navigation.goBack();
          }
        })
        .catch((error) => {
          console.error(error);
          global.showToast(
            (error &&
              error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
          setLoader(false);
        });
    }
  };

  const onClickTagHandler = (tagDetails) => {
    console.log('details', tagDetails);

    if (tagCountFlag) {
      setTagInputText('');
    } else {
      if (
        selectedTagNameList.findIndex((tag) => tag === tagDetails) > 0 &&
        tagList.findIndex((tag) => tag.name === tagDetails) > 0
      ) {
        //This is for when the tag is present in the database and listed for the particular story in that case wont do anything
        console.log('Duplicate tag found in both db and for story');
      } else if (
        selectedTagNameList.findIndex((tag) => tag === tagDetails) < 0 &&
        tagList.findIndex((tag) => tag.name === tagDetails) > 0
      ) {
        //This is for when the tag is present in the database but not listed for the particular story in that case wont create new tag but will add to the taglist of the story
        let index = tagList.findIndex((tag) => tag.name === tagDetails);
        console.log('Before', selectedTagNameList);
        console.log('Found tag details : ', tagList[index]);
        setSelectedTagNameList([...selectedTagNameList, tagList[index].name]);
        setSelectedTagIdList([...selectedTagIdList, tagList[index].id]);
        console.log('Duplicate tag found in db and not story');
        console.log('After', selectedTagNameList);
      } else {
        createNewTag(tagDetails);
      }
    }
  };

  const createNewTag = (tagName) => {
    Post('pro/tags', { tagName })
      .then((result) => {
        console.log(' createNewTag result= ', result);
        if (result.status === 200) {
          setSelectedTagNameList([...selectedTagNameList, tagName]);
          setSelectedTagIdList([...selectedTagIdList, result.data.id]);
        }
      })
      .catch((error) => { });
  };

  const deleteTagHandler = (index, tag) => {
    const deleteIndex = selectedTagNameList.findIndex(
      (tagName) => tag === tagName,
    );
    const tempTagIdList = selectedTagIdList.filter((tagId, index) => {
      return index !== deleteIndex;
    });
    const tempTagNameList = selectedTagNameList.filter((tagName, index) => {
      return tag !== tagName;
    });
    // setSelectedTagIdList([]);
    // setSelectedTagNameList([]);
    setSelectedTagIdList(tempTagIdList);
    setSelectedTagNameList(tempTagNameList);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? (
        <ActivityLoaderSolid />
      ) : (
        <Container style={[commonStyle.mainContainer]}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}>
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.setupCardBox, commonStyle.mt1]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                  Upload photo
                </Text>

                {filePath.uri ||
                  (inspireDetails &&
                    inspireDetails.InspirationResources &&
                    inspireDetails.InspirationResources.length) ? (
                  <View activeOpacity={0.5}>
                    {!filePath.type ||
                      filePath?.type?.split('/')[0] === 'video' ||
                      inspireDetails?.InspirationResources[0]?.type ===
                      'video' ? (
                      <Video
                        style={[
                          commonStyle.uploadedservicepic,
                          { width: width - 40 },
                        ]}
                        source={{
                          uri: filePath.uri
                            ? filePath.uri
                            : inspireDetails.InspirationResources[0].url,
                        }}
                        tapAnywhereToPause={false}
                        repeat={true}
                        navigator={null}
                        disableBack={true}
                        toggleResizeModeOnFullscreen={false}
                        paused={false}
                        muted={false}
                        controls={true}
                        disableFullscreen={true}
                        disablePlayPause={true}
                        disableSeekbar={true}
                        disableVolume={true}
                        disableTimer={true}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        style={commonStyle.uploadedservicepic}
                        source={{
                          uri: filePath.uri
                            ? filePath.uri
                            : inspireDetails.InspirationResources[0].url,
                        }}
                      />
                    )}
                    <TouchableOpacity
                      style={[commonStyle.likecommentwrap, commonStyle.mt15]}
                      onPress={() => setModalVisible(true)}>
                      {/* // onPress={() => chooseFile()}> */}
                      <Text style={[commonStyle.outlinetitleStyle]}>
                        Tap to change photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={commonStyle.uploadservicepic}
                    // onPress={() => chooseFile()}>
                    onPress={() => setModalVisible(true)}>
                    <Image
                      style={commonStyle.defaultpic}
                      source={require('../../assets/images/add-img.png')}
                    />
                    <Text
                      style={[commonStyle.outlinetitleStyle, commonStyle.mt2]}>
                      Upload photo
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                  {isUpdate ? 'Edit' : 'Add'} title, description and tags
                </Text>
                <View style={commonStyle.mb2}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    Title
                  </Text>
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isTitleFocus && commonStyle.focusinput,
                      titleError && { borderColor: Colors.theamRed },
                    ]}
                    defaultValue={title}
                    onBlur={() => {
                      if (title?.length <= 0) {
                        setTitleError(true);
                      }
                    }}
                    onFocus={() => {
                      setIsTitleFocus(true);
                      setTitleError(false);
                    }}
                    onChangeText={(text) => {
                      if (text.trim().length > 0) {
                        setTitle(text);
                        setTitleError(false);
                      } else {
                        setTitle(null);
                        setTitleError(true);
                      }
                    }}
                    returnKeyType="next"
                    keyboardType="default"
                    autoCapitalize={'none'}
                    maxLength={100}
                  />
                  {titleError && (
                    <Text style={commonStyle.inputfielderror}>
                      Title is a required field and cannot be blank.
                    </Text>
                  )}
                </View>
                <View style={commonStyle.mb2}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    Description
                  </Text>
                  {/* <TextInput
                    style={[
                      commonStyle.textInput,
                      commonStyle.textareainput,
                      isDescriptionFocus && commonStyle.focusinput,
                    ]}
                    defaultValue={description}
                    onFocus={() => setIsDescriptionFocus(true)}
                    onChangeText={(text) => setDescription(text)}
                    returnKeyType="done"
                    keyboardType="default"
                    autoCapitalize={'none'}
                    multiline={true}
                    numberOfLines={10}
                    maxLength={500}
                  />
                  <Text style={commonStyle.textlength}>
                    {(description && description.length) || 0}/500
                  </Text> */}

                  <View
                    style={[
                      commonStyle.textInput,
                      commonStyle.textareainput,
                      isDescriptionFocus && commonStyle.focusinput,
                      descriptionError && { borderColor: Colors.theamRed },
                    ]}>
                    <TextInput
                      style={[
                        commonStyle.newtextareaInput,
                        { height: 110, textAlignVertical: 'top' },
                      ]}
                      onBlur={() => {
                        if (description?.length <= 0) {
                          setDescriptionError(true);
                        }
                      }}
                      onFocus={() => {
                        setIsDescriptionFocus(true);
                        setDescriptionError(false);
                      }}
                      defaultValue={description}
                      onChangeText={(text) => {
                        if (text.trim().length > 0) {
                          setDescription(text);
                          setDescriptionError(false);
                        } else {
                          setDescription(null);
                          setDescriptionError(true);
                        }
                      }}
                      returnKeyType="done"
                      keyboardType="default"
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
                      {(description && description.length) || 0}
                      /500
                    </Text>
                  </View>
                  {descriptionError && (
                    <Text style={commonStyle.inputfielderror}>
                      Description is a required field and cannot be blank.
                    </Text>
                  )}
                </View>
                {!!selectedTagNameList && (
                  <View style={commonStyle.mb2}>
                    <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                      Tags
                    </Text>
                    <View
                      style={[
                        { flexDirection: 'row', flexWrap: 'wrap' },
                        commonStyle.textInputTag,
                      ]}>
                      {selectedTagNameList.map((tag, index) => (
                        <TouchableOpacity
                          style={commonStyle.tagsChipset}
                          onPress={() => deleteTagHandler(index, tag)}>
                          <Text style={[commonStyle.tagstext]}>{tag}</Text>
                        </TouchableOpacity>
                      ))}
                      <TextInput
                        // onChangeText={(text) => {
                        //   // console.log("onChangeText",text);
                        //   if (text.length >= 16) {
                        //     console.log(
                        //       'Maximum Length can be 15',
                        //       text.slice(15, 16) === ' ',
                        //     );
                        //     if (text.slice(15, 16) === ' ') {
                        //       console.log('tag sent');
                        //       if (
                        //         selectedTagNameList.findIndex(
                        //           (tag) => tag === text.trim(),
                        //         ) < 0
                        //       ) {
                        //         onClickTagHandler(text.trim());
                        //       }
                        //       setTagInputText('');
                        //     }
                        //   } else {
                        //     setTagInputText(text);
                        //     if (
                        //       text.slice(text.length - 1, text.length) === ' '
                        //     ) {
                        //       console.log('tag sent');
                        //       if (
                        //         selectedTagNameList.findIndex(
                        //           (tag) => tag === text.trim(),
                        //         ) < 0
                        //       ) {
                        //         onClickTagHandler(text.trim());
                        //       }
                        //       setTagInputText('');
                        //     }
                        //   }
                        // }}
                        onChangeText={(text) => {
                          setTagInputText(text);
                          if (
                            text.slice(text.length - 1, text.length) === ' '
                          ) {
                            console.log('tag sent');
                            if (
                              selectedTagNameList.findIndex(
                                (tag) => tag === text.trim(),
                              ) < 0
                            ) {
                              onClickTagHandler(text.trim());
                            }
                            setTagInputText('');
                          }
                        }}
                        onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                          console.log('onKeyPress', keyValue);
                          tagCountFlag ? setTagInputText('') : '';
                          if (keyValue == 'Backspace') {
                            if (
                              tagInputText.length === 0 &&
                              selectedTagNameList.length > 0
                            ) {
                              deleteTagHandler(
                                selectedTagNameList.length - 1,
                                selectedTagNameList[
                                selectedTagNameList.length - 1
                                ],
                              );
                            }
                          }
                        }}
                        returnKeyType="done"
                        keyboardType="default"
                        autoCapitalize={'none'}
                        multiline={false}
                        numberOfLines={1}
                        value={tagInputText}
                        placeholder={
                          tagCountFlag
                            ? 'You can add MAX 10 tags'
                            : 'Enter your tags'
                        }
                      />
                    </View>
                    {/* <Tags
                    initialText=""
                    textInputProps={{
                      placeholder: 'Enter your tags'
                    }}
                    initialTags={selectedTagNameList}
                    // readonly={true}
                    onChangeTags={(tags) => { console.log("Tags ", tags); onClickTagHandler(tags[tags.length - 1]) }}
                    onTagPress={(index, tagLabel, event, deleted) => {
                      console.log(
                        index,
                        tagLabel,
                        deleted ? 'deleted' : 'not deleted',
                      );
                      deleteTagHandler(index, tagLabel);
                    }
                    }
                    containerStyle={[commonStyle.tagsInputcontainer]}
                    inputStyle={commonStyle.tagsInputstyle}
                    tagContainerStyle={commonStyle.tagsstyle}
                    tagTextStyle={commonStyle.categorytagsText}
                  /> */}
                  </View>
                )}
                {/* <View>
                  <Text style={commonStyle.textStyle}>Suggested tags</Text>
                  <View style={[commonStyle.innertags, commonStyle.mt2]}>
                    {tagList && tagList.length
                      ? tagList.map((eachTag, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[commonStyle.outlintextbtn, commonStyle.mb1]}
                            onPress={() => onClickTagHandler(eachTag)}>
                            <Text style={commonStyle.texttimeblack}>{eachTag.name}</Text>
                          </TouchableOpacity>
                        ))
                      : null}
                  </View>
                </View> */}
              </View>

              <View style={{ paddingLeft: 2, paddingRight: 2 }}>
                <View
                  style={[
                    commonStyle.setupCardBox,
                    categoryError && {
                      borderWidth: 2,
                      borderColor: Colors.theamRed,
                    },
                  ]}>
                  <Text style={commonStyle.subtextblack}>Choose category</Text>
                  <View style={{ margin: 0 }}>
                    <RadioGroup
                      style={[commonStyle.setupradioGroup]}
                      color="#ffffff"
                      activeColor="#ffffff"
                      highlightColor={'#ffffff'}
                      selectedIndex={categoryId}
                      onSelect={(index, value) => {
                        setCategoryError(false);
                        categorySelectHelper(index, value);
                      }}>
                      {categoryList &&
                        categoryList.rows &&
                        categoryList.rows.length
                        ? categoryList.rows.map((eachCategory, index) => (
                          <RadioButton
                            key={index}
                            disabled={isUpdate ? true : false}
                            style={[
                              commonStyle.setupradioButton,
                              { marginTop: 5 },
                            ]}
                            value={eachCategory.id}>
                            <View
                              style={[
                                commonStyle.radioCustomView,
                                { paddingRight: 2, marginLeft: -22 },
                              ]}>
                              <Text style={commonStyle.blackTextR}>
                                {eachCategory.categoryName}
                              </Text>
                              {categoryId == eachCategory.id ? (
                                <CircleCheckedBoxActive />
                              ) : (
                                <CircleCheckedBoxOutline />
                              )}
                            </View>
                          </RadioButton>
                        ))
                        : null}
                      {/* <RadioButton style={commonStyle.setupradioButton} value="1">
                    <View style={commonStyle.radioCustomView}>
                      <Text style={commonStyle.blackTextR}>Hair</Text>
                      {businessNameSelect == 1 ? (
                        <CircleCheckedBoxActive />
                      ) : (
                        <CircleCheckedBoxOutline />
                      )}
                    </View>
                  </RadioButton> */}
                    </RadioGroup>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title={'Share your post'}
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => submitInspirationDetails()}
              />
            </View>
          </View>
        </Container>
      )}

      {/* Custom Gallery Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}
        style={commonStyle.centeredView}>
        <View style={commonStyle.fullmodalView}>
          <View
            style={[
              commonStyle.skipHeaderWrap,
              { marginTop: Platform.OS === 'ios' ? 32 : 0 },
            ]}>
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => setModalVisible(false)}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
            <Body style={[commonStyle.headerbacktitle, { marginLeft: -40 }]}>
              <Text style={commonStyle.blackText16}>Upload your photo</Text>
            </Body>
          </View>
          <UploadPhotoVideoModal
            visible={modalVisible}
            multiSelect={false}
            //* Available Types: All, Videos, Photos
            assetType={'Photos'}
            submitEvent={fileSelectedEvent}
            cameraSubmitEvent={cameraSubmitEvent}
            fileSizeRequired={true}
          />
        </View>
      </Modal>
    </Fragment>
  );
};

export default InspirationAddOrEdit;
