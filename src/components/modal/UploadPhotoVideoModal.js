import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import commonStyle from '../../assets/css/mainStyle';
import {Button} from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import ImagePickerCrop from 'react-native-image-crop-picker';

const UploadPhotoVideoModal = (props) => {
  const NUM_COLUMNS = 3;
  const [galleryItems, setGalleryItems] = useState([
    {
      type: 'Camera',
      key: 'camera',
    },
  ]);
  const [lastIndex, setLastIndex] = useState('0');
  const [finished, setFinished] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  let lastIndexCall = 0;

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `blank-${numberOfElementsLastRow}`, type: 'Blank'});
      numberOfElementsLastRow++;
    }

    return data;
  };

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const fetchFiles = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.getPhotos({
      groupTypes: 'All',
      assetType: props.assetType,
      first: 100,
      after: lastIndex === '0' ? undefined : lastIndex,
      include: !!props.fileSizeRequired
        ? ['filename', 'fileSize', 'imageSize']
        : ['filename', 'imageSize'],
    }).then((response) => {
      if (!response?.page_info?.has_next_page) {
        setFinished(true);
      }
      setLastIndex(response?.page_info?.end_cursor);
      setGalleryItems((galleryItems) => {
        // console.log(galleryItems.slice(-3));
        let updatedItems = galleryItems.filter((item) => item.type !== 'Blank');
        // console.log(updatedItems.slice(-3));
        return [...updatedItems, ...response.edges];
      });
    });
  };

  const onSelection = (item) => {
    if (
      selectedItems.findIndex(
        (m) => m.node.image.uri === item.node.image.uri,
      ) !== -1
    ) {
      setSelectedItems((selectedItems) =>
        selectedItems.filter((m) => m.node.image.uri !== item.node.image.uri),
      );
    } else {
      if (props.multiSelect) {
        setSelectedItems([...selectedItems, item]);
      } else {
        setSelectedItems([item]);
      }
    }
  };

  const getMediaType = () => {
    if (props.assetType === 'All') {
      return 'mixed';
    } else if (props.assetType === 'Videos') {
      return 'video';
    } else {
      return 'photo';
    }
  };

  const cameraEvent = async () => {
    try {
      const response = await ImagePickerCrop.openCamera({
        compressImageQuality: 0.8,
        includeExif: false,
        mediaType: getMediaType(),
      });

      console.log('first', response);

      // if (response.didCancel) {
      //   console.log('User cancelled image picker');
      // } else if (response.error) {
      //   console.log('ImagePicker Error: ', response.error);
      // } else if (response.customButton) {
      //   console.log('User tapped custom button: ', response.customButton);
      // } else {
      let image = {
        ...response,
        uri: response?.path,
        fileSize: response.size,
        fileName: response?.filename,
        type: response?.mime,
      };
      props.cameraSubmitEvent(image);
      // }
    } catch (e) {
      console.log('camera error', e);
    }
  };

  const renderItem = ({item, index}) => {
    if (item.type === 'Blank') {
      return <View style={commonStyle.gallerycol} />;
    } else if (item.type === 'Camera') {
      return (
        <View style={commonStyle.gallerycol}>
          <TouchableOpacity
            style={commonStyle.camerabox}
            activeOpacity={0.5}
            onPress={cameraEvent}>
            <Image
              source={require('../../assets/images/camera-img.png')}
              style={commonStyle.cameraicon}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      if (
        !!item?.node?.type &&
        String(item.node.type).toLowerCase().startsWith('image')
      ) {
        return (
          <View style={commonStyle.gallerycol}>
            <TouchableOpacity
              onPress={() => onSelection(item)}
              style={[
                commonStyle.gallerybox,
                selectedItems.findIndex(
                  (m) => m.node.image.uri === item.node.image.uri,
                ) !== -1 && commonStyle.galleryactive,
              ]}
              activeOpacity={0.4}>
              <Image
                source={{uri: item.node.image.uri}}
                style={commonStyle.gallerypic}
              />
            </TouchableOpacity>
          </View>
        );
      } else if (
        !!item?.node?.type &&
        String(item.node.type).toLowerCase().startsWith('video')
      ) {
        return (
          <View style={commonStyle.gallerycol}>
            <TouchableOpacity
              onPress={() => onSelection(item)}
              style={[
                commonStyle.gallerybox,
                selectedItems.findIndex(
                  (m) => m.node.image.uri === item.node.image.uri,
                ) !== -1 && commonStyle.galleryactive,
              ]}
              activeOpacity={0.4}>
              <Image
                source={{uri: item.node.image.uri}}
                style={commonStyle.gallerypic}
              />
              <View style={commonStyle.isvideo}>
                <Image
                  source={require('../../assets/images/videoimg.png')}
                  style={commonStyle.cameraicon}
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      } else {
        return <View style={commonStyle.gallerycol} />;
      }
    }
  };

  const onSubmit = (item) => {};

  useEffect(() => {
    if (props.visible) {
      fetchFiles();
    } else {
      setGalleryItems([
        {
          type: 'Camera',
        },
      ]);
      setLastIndex(0);
      setFinished(false);
    }
  }, [props.visible]);

  return (
    <>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={formatData(galleryItems, NUM_COLUMNS)}
        style={commonStyle.gallerywrapper}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (
            galleryItems.length > 3 &&
            !finished &&
            lastIndexCall < lastIndex
          ) {
            lastIndexCall = lastIndex;
            fetchFiles();
          }
        }}
        ListFooterComponent={
          props.multiSelect && (
            <View
              style={{
                height: 75,
                width: '100%',
                backgroundColor: 'transparent',
              }}></View>
          )
        }
      />
      <View
        style={{
          height: 75,
          width: '100%',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
        }}>
        <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
          <Button
            title="Select"
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={() => props.submitEvent(selectedItems)}
            disabled={selectedItems.length <= 0}
          />
        </View>
      </View>
    </>
  );
};

export default UploadPhotoVideoModal;
