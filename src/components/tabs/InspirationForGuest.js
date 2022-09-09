import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image as ImageU,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import commonStyle from '../../assets/css/mainStyle';
import { Get } from '../../api/apiAgent';
import { SingleInspire } from '../../components/inspire';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';

const InspirationForGuest = (props) => {
  const [inspireDetailsList, setInspireDetailsList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState(null);

  const [defaultCategoryDetails, setDefaultCategoryDetails] = useState(
    [],
  );
  const [filterCategoryId, setFilterCategoryId] = useState(null);

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    console.log('props.isDeletedId', props.isDeletedId);
    fetchInspireDetails();
    fetchDefaultCategories();
  }, []);

  const fetchInspireDetails = (categoryId = null) => {
    setLoader(true);
    let url = categoryId
      ? 'user/inspirations?categoryId=' + categoryId
      : 'user/inspirations';
    // Get('user/inspirations', '')
    Get(url, '')
      .then((result) => {
        setLoader(false);
        // setMessage(result.message);
        if (result.status === 200) {
          if (result?.data?.length) {
            setInspireDetailsList(result.data);
          } else {
            setMessage("No inspiration posts yet");
          }
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        setMessage('No inspiration posts yet');
        setLoader(false);
      });
  };

  const modificationInspireFavourite = (data, index) => {
    const tempInspireDetails = [...inspireDetailsList];
    tempInspireDetails[index] = data;
    setInspireDetailsList([...tempInspireDetails]);
  };

  const fetchDefaultCategories = () => {
    setLoader(true);
    Get('user/list-categories')
      // Get('user/list-categories?isPopular=1&page=1&records=7')
      // Get('user/inspirations-all-category')
      .then(result => {
        setLoader(false);
        setDefaultCategoryDetails(result.data.rows)
      })
      .catch(err => {
        setLoader(false);
        console.log('Error while trying to fetch categories');
      })
  };

  const filterBasedOnCategoryHandler = (categoryId, index) => {
    if (filterCategoryId === categoryId) {
      setFilterCategoryId(null);
      fetchInspireDetails();
    } else {
      setFilterCategoryId(categoryId);
      fetchInspireDetails(categoryId);
    }
  };

  return (
    <SafeAreaView>
      {loader ? <ActivityLoaderSolid /> : null}
      <ScrollView
        horizontal
        // showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={commonStyle.scrollCss}
      >
        <View
          style={[
            commonStyle.sortAreaWrap,
            { paddingStart: 20, paddingTop: 10, paddingBottom: 10 },
          ]}>
          {defaultCategoryDetails?.length
            ? defaultCategoryDetails.map((eachCategory, index) => (
              <TouchableOpacity
                key={index}
                style={[commonStyle.tagsOutline, eachCategory.id === filterCategoryId ? { borderWidth: 1, borderColor: '#F36A46' } : null]}
                onPress={() =>
                  filterBasedOnCategoryHandler(eachCategory.id, index)
                }>
                <Text style={[commonStyle.categorytagsText, eachCategory.id === filterCategoryId ? { color: '#F36A46' } : null]}>
                  {eachCategory?.name}
                </Text>
              </TouchableOpacity>
            ))
            : null}
        </View>
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {inspireDetailsList && inspireDetailsList.length === 0 ? (
          <View style={commonStyle.noMassegeWrap}>
            <ImageU
              style={[commonStyle.nobookingsimg, { marginBottom: 0 }]}
              source={require('../../assets/images/no-massege-img.png')}
            />
            <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
              {message || 'No inspiration posts yet'}
            </Text>
          </View>
        ) : (
          <View style={{ paddingLeft: 8, marginBottom: 120, paddingTop: 5 }}>
            <RNMasonryScroll
              // removeClippedSubviews={true}
              columns={2}
              horizontal={false}
              style={{ paddingTop: 5 }}>
              {inspireDetailsList && inspireDetailsList.length
                ? inspireDetailsList.map((item, index) => (
                  <View style={{ width: 0.48 * width }}>
                    <SingleInspire
                      key={index}
                      itemDetails={item}
                      index={index}
                      modificationInspireFavourite={
                        modificationInspireFavourite
                      }
                      professionalDetails={null}
                      isPublicInspirition={true}
                    />
                  </View>
                ))
                : null}
            </RNMasonryScroll>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
    //   {inspireDetailsList && inspireDetailsList.length === 0 ? (
    //       <View style={commonStyle.noMassegeWrap}>
    //         <ImageU
    //           style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
    //           source={require('../../assets/images/no-massege-img.png')}
    //         />
    //         <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
    //           {message || 'No inspiration posts yet'}
    //         </Text>
    //       </View>
    // <View style={{marginTop: 12, paddingLeft: 11}}>
    //   {loader ? <ActivityLoaderSolid /> : null}
    //   <RNMasonryScroll
    //     removeClippedSubviews={true}
    //     columns={2}
    //     horizontal={false}>
    //     {inspireDetailsList && inspireDetailsList.length
    //       ? inspireDetailsList.map((item, index) => (
    //           <SingleInspire
    //             key={index}
    //             itemDetails={item}
    //             index={index}
    //             modificationInspireFavourite={modificationInspireFavourite}
    //             professionalDetails={null}
    //           />
    //         ))
    //       : null}
    //     {/* {MasonryData.map((items, imageIndex) => (
    //       <TouchableOpacity key={items.id} activeOpacity={0.5}>
    //         <AnimatableView
    //           animation={'fadeInUp'}
    //           delay={100 * imageIndex}
    //           style={commonStyle.masonryContainer}>
    //           <Image
    //             source={items.masonrybanner}
    //             {...imageProp}
    //             key={imageIndex}
    //             style={commonStyle.masonryBannerimage}
    //           />
    //           <LinearGradient
    //             colors={[
    //               'rgba(0, 0, 0, 0.1)',
    //               'rgba(0, 0, 0, 0.3)',
    //               'rgba(0, 0, 0, 0.5)',
    //             ]}
    //             style={commonStyle.borderRadiusoverlay}>
    //             <View style={commonStyle.masonryfavoriteWrap}>
    //               <FavoritesRedSolid />
    //             </View>
    //             <View style={commonStyle.masonrycontent}>
    //               <Text style={commonStyle.masonrytitle} numberOfLines={2}>
    //                 {items.masonryTitle}
    //               </Text>
    //               <View style={commonStyle.masonryUserdata}>
    //                 <View style={commonStyle.masonryUserAvaterwrap}>
    //                   <Image
    //                     style={commonStyle.masonryUseravaterImg}
    //                     defaultSource={require('../../assets/images/default.png')}
    //                     source={items.masonryUserAvater}
    //                   />
    //                 </View>
    //                 <Text style={commonStyle.masonrytitle} numberOfLines={1}>
    //                   {items.masonryusername}
    //                 </Text>
    //               </View>
    //             </View>
    //           </LinearGradient>
    //         </AnimatableView>
    //       </TouchableOpacity>
    //     ))} */}
    //   </RNMasonryScroll>
    // </View>
  );
};

export default InspirationForGuest;
