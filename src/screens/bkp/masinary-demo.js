import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Switch } from "react-native";
import * as Animatable from "react-native-animatable";
import RNMasonryScroll from "react-native-masonry-scrollview";
import Image from "react-native-scalable-image";
import { useResponsiveWidth } from "react-native-responsive-dimensions";
import {FavoritesData, MasonryData} from '../utility/staticData';
import {FavoritesIcon} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';

const { createAnimatableComponent } = Animatable;

const AnimatableView = createAnimatableComponent(View);

const ProfileFavorites = () => {
  const imageWidth = useResponsiveWidth(50) - 20;
  const [isHorizontal, setIsHorizontal] = useState(false);

  const imageProp = isHorizontal
    ? { height: imageWidth }
    : { width: imageWidth };

  return (
    <SafeAreaView>
      <RNMasonryScroll
        removeClippedSubviews={true}
        columns={2}
        evenColumnStyle={styles.evenColumnStyle}
        horizontal={false}
      >
          {MasonryData.map((items, imageIndex) => (
            <AnimatableView
              animation={"fadeInUp"}
              delay={100 * imageIndex}
              style={styles.imageContainer}
            >
              <Image source={items.masonrybanner} {...imageProp} key={imageIndex} style={styles.imageborder} />
              <View style={commonStyle.borderRadiusoverlay} />
              <View style={commonStyle.masonryfavoriteWrap}>
                <FavoritesIcon/>
              </View>
              <View style={commonStyle.masonrycontent}>
                  <Text style={commonStyle.masonrytitle} numberOfLines={2}>{items.masonryTitle}</Text>
                  <View style={commonStyle.masonryUserdata}>
                    <View style={commonStyle.masonryUserAvaterwrap}>
                      <Image style={commonStyle.masonryUseravaterImg} defaultSource={require('../assets/images/default.png')} source={items.masonryUserAvater}/>
                    </View>
                    <Text style={commonStyle.masonrytitle} numberOfLines={1}>{items.masonryusername}</Text>
                  </View>
              </View>
            </AnimatableView>
        ))}
      </RNMasonryScroll>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    minHeight: 170
  },
  evenColumnStyle: {},
  imageborder: {
    borderRadius: 16,
    minHeight: 170
  }
});

export default ProfileFavorites;