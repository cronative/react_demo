import React, {useState} from 'react';
import {
  View,
  Text,
  Image as ImageU,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  FavoritesIcon,
  FavoritesRedSolid,
  VideoPlayIcon,
  LikeIcon,
  CommentIcon,
  LikeSolidIcon,
} from '../../components/icons';
import Image from 'react-native-scalable-image';
import commonStyle from '../../assets/css/mainStyle';
import {Put} from '../../api/apiAgent';
import * as Constant from '../../api/constant';
import global from '../../components/commonservices/toast';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {List, ListItem, Left, Body, Title} from 'native-base';
const {createAnimatableComponent} = Animatable;
const AnimatableView = createAnimatableComponent(View);
const {width, height} = Dimensions.get('window');
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import FastImage from 'react-native-fast-image';

const SingleInspireFollowing = (props) => {
  const navigation = useNavigation();

  const imageWidth = useResponsiveWidth(180) - width;
  const [isHorizontal, setIsHorizontal] = useState(false);

  const imageProp = isHorizontal ? {height: imageWidth} : {width: imageWidth};
  const [loader, setLoader] = useState(false);

  const {itemDetails, index} = props;

  const [likes, setLikes] = useState(itemDetails?.Likes);
  const [liked, setLiked] = useState(itemDetails?.Liked);

  const favoriteOrNotHandler = () => {
    setLoader(true);
    Put('user/favourite/inspiration-stories/' + itemDetails.id, {
      favourite: itemDetails.favourite && itemDetails.favourite.length ? 0 : 1,
    })
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          global.showToast(result.message, 'success');
          if (itemDetails.favourite && itemDetails.favourite.length) {
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

  const likeOrNotHandler = () => {
    // if()
    //setLoader(true);
    Put('user/like/inspiration-stories/' + itemDetails.id, {
      like: liked && liked.length ? 0 : 1,
    })
      .then((result) => {
        //setLoader(false);
        if (result.status === 200) {
          global.showToast(result.message, 'success');
          if (liked && liked.length) {
            setLikes((likes) => likes - 1);
            setLiked((liked) => []);
          } else {
            setLikes((likes) => likes + 1);
            setLiked((liked) => [result.data]);
          }
          //props.modificationInspireFavourite(itemDetails, index);
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        //setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };

  return (
    <>
      {loader ? <ActivityLoaderSolid /> : null}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{marginLeft: 20}}
        onPress={() =>
          navigation.navigate('InspireInner', {
            inspiritionId: itemDetails.id,
            doubleBack: false,
          })
        }>
        <AnimatableView
          animation={'fadeInUp'}
          delay={100 * index}
          style={[commonStyle.followingListViewCard]}>
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
              key={index}
              source={{uri: itemDetails?.InspirationResources[0]?.url}}
              tapAnywhereToPause={false}
              repeat={true}
              style={[
                commonStyle.masonryBannerimage,
                {minHeight: 170, resizeMode: 'contain'},
              ]}
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
          {itemDetails?.InspirationResources[0]?.resourceType === 'image' && (
            <Image
              defaultSource={require('../../assets/images/default.png')}
              source={
                itemDetails.InspirationResources &&
                itemDetails.InspirationResources[0] &&
                itemDetails.InspirationResources[0].url
                  ? {
                      uri: itemDetails.InspirationResources[0].url,
                    }
                  : require('../../assets/images/default.png')
              }
              {...imageProp}
              key={index}
              style={commonStyle.masonryBannerimage}
            />
            // <FastImage
            //   style={commonStyle.masonryBannerimage}
            //   source={
            //     itemDetails.InspirationResources &&
            //     itemDetails.InspirationResources[0] &&
            //     itemDetails.InspirationResources[0].url
            //       ? {
            //           uri: itemDetails.InspirationResources[0].url,
            //         }
            //       : require('../../assets/images/default-user.png')
            //   }
            //   resizeMode={FastImage.resizeMode.cover}
            // />
          )}

          {/* {itemDetails.InspirationResources &&
            itemDetails.InspirationResources[0].resourceType === 'video' ? (
            <TouchableOpacity style={[commonStyle.videoPlaybtn]}>
              <VideoPlayIcon />
            </TouchableOpacity>
          ) : null} */}

          <TouchableOpacity
            style={commonStyle.followingfavorite}
            onPress={() => favoriteOrNotHandler()}>
            {itemDetails.favourite &&
            (itemDetails.favourite.length || itemDetails.favourite.id) ? (
              <FavoritesRedSolid />
            ) : (
              <FavoritesIcon />
            )}
          </TouchableOpacity>

          <View style={commonStyle.followingcard}>
            <View style={[commonStyle.followingcardText]}>
              <Text style={[commonStyle.blackTextR]} numberOfLines={2}>
                {itemDetails.title}
              </Text>
            </View>
            <List>
              <ListItem thumbnail style={commonStyle.categoriseListItem}>
                <Left style={commonStyle.masonryUserAvaterwrap}>
                  {/* <ImageU
                    style={commonStyle.masonryUseravaterImg}
                    defaultSource={require('../../assets/images/default-user.png')}
                    source={
                      itemDetails?.pro
                        ? {
                          uri: itemDetails?.pro?.profileImage,
                        }
                        : require('../../assets/images/default-user.png')
                    }
                  /> */}
                  <FastImage
                    style={commonStyle.masonryUseravaterImg}
                    source={
                      itemDetails?.pro &&
                      itemDetails?.pro?.profileImage.length > 0 &&
                      itemDetails?.pro?.profileImage.includes('uploads')
                        ? {
                            uri: itemDetails?.pro?.profileImage,
                          }
                        : require('../../assets/images/default-user.png')
                    }
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </Left>
                <Body
                  style={[commonStyle.accountListBody, {alignSelf: 'center'}]}>
                  <Text
                    style={[commonStyle.grayText14, {maxWidth: '80%'}]}
                    numberOfLines={1}>
                    {itemDetails.ProMeta && itemDetails.ProMeta.businessName}
                  </Text>
                </Body>
                <View style={commonStyle.likecommentwrap}>
                  <TouchableOpacity
                    style={commonStyle.commentbtnwrap}
                    onPress={() => likeOrNotHandler()}>
                    {liked && liked.length ? <LikeSolidIcon /> : <LikeIcon />}
                    <Text style={[commonStyle.grayText16, commonStyle.ml1]}>
                      {likes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('InspireInner', {
                        inspiritionId: itemDetails.id,
                        doubleBack: false,
                      })
                    }
                    style={commonStyle.commentbtnwrap}>
                    <CommentIcon />
                    <Text style={[commonStyle.grayText16, commonStyle.ml1]}>
                      {itemDetails.Comments}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ListItem>
            </List>
          </View>
        </AnimatableView>
      </TouchableOpacity>
    </>
  );
};

export default SingleInspireFollowing;
