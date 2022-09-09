import React, {useState} from 'react';
import {View, Text, Image as ImageU, TouchableOpacity} from 'react-native';
import {
  FavoritesIcon,
  FavoritesRedSolid,
  VideoPlayIcon,
} from '../../components/icons';
import Image from 'react-native-scalable-image';
import LinearGradient from 'react-native-linear-gradient';
import commonStyle from '../../assets/css/mainStyle';
import {Put} from '../../api/apiAgent';
import * as Constant from '../../api/constant';
import global from '../../components/commonservices/toast';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import FastImage from 'react-native-fast-image';

const {createAnimatableComponent} = Animatable;
const AnimatableView = createAnimatableComponent(View);

const SingleInspire = (props) => {
  const navigation = useNavigation();

  const imageWidth = useResponsiveWidth(48);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const imageProp = {width: imageWidth};

  const {
    itemDetails,
    index,
    professionalDetails,
    isProfessionalCreated,
    isPublicInspirition,
  } = props;

  const favoriteOrNotHandler = () => {
    if (!isPublicInspirition) {
      //   setLoader(true);
      Put('user/favourite/inspiration-stories/' + itemDetails.id, {
        favourite:
          itemDetails.favourite &&
          (itemDetails.favourite.length || itemDetails.favourite.id)
            ? 0
            : 1,
      })
        .then((result) => {
          // setLoader(false);
          if (result.status === 200) {
            global.showToast(result.message, 'success');
            if (itemDetails.favourite && itemDetails.favourite.length > 0) {
              itemDetails.favourite = [];
            } else {
              itemDetails.favourite.push(result.data);
            }
            props.modificationInspireFavourite(itemDetails, index);
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          // setLoader(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              'Something went wrong',
            'error',
          );
        });
    } else {
      global.showToast('Please login and wish inspire', 'error');
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        navigation.navigate('InspireInner', {
          inspiritionId: itemDetails.id,
          doubleBack: false,
        });
      }}>
      <AnimatableView
        animation={'fadeInUp'}
        delay={100 * index}
        style={commonStyle.masonryContainer}>
        {itemDetails?.InspirationResources[0]?.resourceType === 'video' && (
          // <Video
          //   key={index}
          //   style={commonStyle.masonryBannerimage}
          //   source={{
          //     uri: itemDetails?.InspirationResources[0]?.url,
          //   }}
          //   controls={false}
          //   paused={false}
          //   muted={true}
          // />
          <VideoPlayer
            source={{uri: itemDetails?.InspirationResources[0]?.url}}
            tapAnywhereToPause={false}
            repeat={true}
            navigator={null}
            disableBack={true}
            toggleResizeModeOnFullscreen={false}
            paused={false}
            muted={true}
            controls={false}
            disableFullscreen={true}
            disablePlayPause={true}
            disableSeekbar={true}
            disableVolume={true}
            disableTimer={true}
          />
        )}
        {
          itemDetails?.InspirationResources[0]?.resourceType === 'image' && (
            <Image
              defaultSource={require('../../assets/images/default.png')}
              // source={require('../../assets/images/default.png')}
              source={
                itemDetails.InspirationResources &&
                itemDetails.InspirationResources.length &&
                itemDetails.InspirationResources[0].resourceType === 'image'
                  ? {
                      uri:
                        itemDetails.InspirationResources &&
                        itemDetails.InspirationResources.length &&
                        itemDetails.InspirationResources[0].url,
                    }
                  : require('../../assets/images/default.png')
              }
              {...imageProp}
              key={index}
              style={commonStyle.masonryBannerimage}
            />
          )
          // <FastImage
          //   style={commonStyle.masonryBannerimage}
          //   source={
          //     itemDetails.InspirationResources &&
          //       itemDetails.InspirationResources.length &&
          //       itemDetails.InspirationResources[0].resourceType === 'image'
          //       ? {
          //         uri:
          //           itemDetails.InspirationResources &&
          //           itemDetails.InspirationResources.length &&
          //           itemDetails.InspirationResources[0].url,
          //       }
          //       : require('../../assets/images/default-user.png')
          //   }
          //   resizeMode={FastImage.resizeMode.cover}
          // />
        }
        {/* {itemDetails.InspirationResources &&
          itemDetails.InspirationResources.length &&
          itemDetails.InspirationResources[0].resourceType === 'video' ? (
          <TouchableOpacity style={[commonStyle.videoPlaybtn]}>
            <VideoPlayIcon />
          </TouchableOpacity>
        ) : null} */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.1)',
            'rgba(0, 0, 0, 0.3)',
            'rgba(0, 0, 0, 0.5)',
          ]}
          style={commonStyle.borderRadiusoverlay}>
          {!isProfessionalCreated && !isPublicInspirition ? (
            <TouchableOpacity
              style={commonStyle.masonryfavoriteWrap}
              onPress={() => favoriteOrNotHandler()}>
              {itemDetails.favourite && itemDetails.favourite.length ? (
                <FavoritesRedSolid />
              ) : (
                <FavoritesIcon />
              )}
            </TouchableOpacity>
          ) : null}
          <View style={commonStyle.masonrycontent}>
            <Text style={commonStyle.masonrytitle} numberOfLines={2}>
              {itemDetails.title}
            </Text>
            {!isProfessionalCreated ? (
              <View style={commonStyle.masonryUserdata}>
                <View style={commonStyle.masonryUserAvaterwrap}>
                  {/* <ImageU
                    style={commonStyle.masonryUseravaterImg}
                    defaultSource={require('../../assets/images/default-user.png')}
                    source={
                      itemDetails?.pro?.profileImage
                        ? { uri: itemDetails?.pro?.profileImage }
                        : require('../../assets/images/default-user.png')
                    }
                  /> */}
                  <FastImage
                    style={commonStyle.masonryUseravaterImg}
                    source={
                      itemDetails?.pro?.profileImage &&
                      itemDetails?.pro?.profileImage.length > 0 &&
                      itemDetails?.pro?.profileImage.includes('uploads')
                        ? {uri: itemDetails?.pro?.profileImage}
                        : require('../../assets/images/default-user.png')
                    }
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <Text style={commonStyle.masonrytitle} numberOfLines={1}>
                  {(professionalDetails && professionalDetails.businessName) ||
                    (itemDetails.ProMeta && itemDetails.ProMeta.businessName)}
                  {/* {itemDetails.ProMeta && itemDetails.ProMeta.businessName} */}
                </Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </AnimatableView>
    </TouchableOpacity>
  );
};
export default SingleInspire;
